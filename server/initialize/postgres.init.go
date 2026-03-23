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
		return
	}

	if err := sqlDB.Ping(); err != nil {
		fmt.Println("Failed to ping PostgreSQL:", err)
		return
	}

	global.PostgresDB = db
	fmt.Println("Connected to PostgreSQL successfully")

	if err := db.AutoMigrate(&model.User{}, &model.Brand{}, &model.Category{}, &model.Product{}); err != nil {
		fmt.Println("Failed to migrate models:", err)
		return
	}

	seedAdminUser()

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
