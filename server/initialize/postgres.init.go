package initialize

import (
	"fmt"
	"server-gin/global"

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
		return
	}

	if err := sqlDB.Ping(); err != nil {
		fmt.Println("Failed to ping PostgreSQL:", err)
		return
	}

	global.PostgresDB = db
	fmt.Println("Connected to PostgreSQL successfully")

}