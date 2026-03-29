package initialize

import (
	"fmt"
	"server-gin/global"
	"server-gin/internal/model"
	"server-gin/internal/utils"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgres() {
	conf := global.Config.POSTGRES
	dsn := "host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC"
	dsnMappingStr := fmt.Sprintf(dsn, conf.HOST, conf.USER, conf.PASSWORD, conf.DB_NAME, conf.PORT)

	db, err := gorm.Open(postgres.Open(dsnMappingStr), &gorm.Config{})
	if err != nil {
		fmt.Println("Failed to connect to PostgreSQL:", err)
		return
	}

	sqlDB, err := db.DB()
	if err != nil {
		fmt.Println("Failed to get SQL DB instance:", err)
		panic("Crashing because database cannot connected")
	}

	if err := sqlDB.Ping(); err != nil {
		fmt.Println("Failed to ping PostgreSQL:", err)
		panic("Crashing because database cannot ping")
	}

	global.PostgresDB = db
	fmt.Println("Connected to PostgreSQL successfully")

	if err := db.AutoMigrate(&model.User{}, &model.Brand{}, &model.Product{}); err != nil {
		fmt.Println("Failed to migrate models:", err)
		return
	}

	if err := ensureProductSlugColumn(db); err != nil {
		fmt.Println("Failed to ensure products.slug column:", err)
		return
	}

	if err := ensureProductSizeColumn(db); err != nil {
		fmt.Println("Failed to ensure products.size column:", err)
		return
	}

	seedAdminUser()

}

func ensureProductSlugColumn(db *gorm.DB) error {
	if !db.Migrator().HasColumn(&model.Product{}, "slug") {
		if err := db.Migrator().AddColumn(&model.Product{}, "Slug"); err != nil {
			return err
		}
	}

	if err := db.Exec(`
		UPDATE products
		SET slug = CONCAT(
			COALESCE(
				NULLIF(LOWER(TRIM(BOTH '-' FROM REGEXP_REPLACE(COALESCE(name, ''), '[^a-zA-Z0-9]+', '-', 'g'))), ''),
				'product'
			),
			'-',
			id
		)
		WHERE slug IS NULL OR slug = ''
	`).Error; err != nil {
		return err
	}

	if err := db.Exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (slug)`).Error; err != nil {
		return err
	}

	return nil
}

func ensureProductSizeColumn(db *gorm.DB) error {
	if !db.Migrator().HasColumn(&model.Product{}, "size") {
		if err := db.Migrator().AddColumn(&model.Product{}, "Size"); err != nil {
			return err
		}
	}

	if err := db.Exec(`
		UPDATE products
		SET size = 20
		WHERE size IS NULL OR size < 20 OR size > 40
	`).Error; err != nil {
		return err
	}

	return nil
}

func seedAdminUser() {
	var count int64
	if err := global.PostgresDB.Model(&model.User{}).Where("username = ?", "admin").Count(&count).Error; err != nil {
		fmt.Println("Failed to count admin user:", err)
		return
	}

	if count > 0 {
		return
	}

	salt, err := utils.GenerateSalt()
	if err != nil {
		fmt.Println("Failed to generate salt:", err)
		return
	}

	admin := model.User{
		Username:     "admin",
		PasswordSalt: salt,
		PasswordHash: utils.HashPassword("admin123", salt),
		Role:         "admin",
	}

	if err := global.PostgresDB.Create(&admin).Error; err != nil {
		fmt.Println("Failed to create admin user:", err)
		return
	}

	fmt.Println("Seeded default admin account: admin / admin123")
}
