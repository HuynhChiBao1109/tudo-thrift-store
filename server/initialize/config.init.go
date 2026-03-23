package initialize

import (
	"fmt"
	"os"
	"server-gin/global"
	"strconv"

	"github.com/spf13/viper"
)

func InitConfig() {
	viper := viper.New()
	viper.AddConfigPath("./config")
	viper.SetConfigName("development")
	viper.SetConfigType("yaml")

	err := viper.ReadInConfig()

	if err != nil {
		panic(fmt.Errorf("Fatal error config file: %w \n", err))
	}

	fmt.Printf("Server Port: %d\n", viper.GetInt("server.port"))

	err = viper.Unmarshal(&global.Config)
	if err != nil {
		panic(fmt.Errorf("Unable to decode into struct: %w \n", err))
	}

	if value := os.Getenv("SERVER_PORT"); value != "" {
		global.Config.SERVER.PORT = value
	}

	if value := os.Getenv("POSTGRES_HOST"); value != "" {
		global.Config.POSTGRES.HOST = value
	}
	if value := os.Getenv("POSTGRES_PORT"); value != "" {
		if parsed, parseErr := strconv.Atoi(value); parseErr == nil {
			global.Config.POSTGRES.PORT = parsed
		}
	}
	if value := os.Getenv("POSTGRES_USER"); value != "" {
		global.Config.POSTGRES.USER = value
	}
	if value := os.Getenv("POSTGRES_PASSWORD"); value != "" {
		global.Config.POSTGRES.PASSWORD = value
	}
	if value := os.Getenv("POSTGRES_DB_NAME"); value != "" {
		global.Config.POSTGRES.DB_NAME = value
	}

	if value := os.Getenv("REDIS_HOST"); value != "" {
		global.Config.REDIS.HOST = value
	}
	if value := os.Getenv("REDIS_PORT"); value != "" {
		if parsed, parseErr := strconv.Atoi(value); parseErr == nil {
			global.Config.REDIS.PORT = parsed
		}
	}
	if value := os.Getenv("REDIS_PASSWORD"); value != "" {
		global.Config.REDIS.PASSWORD = value
	}

	if value := os.Getenv("JWT_SECRET_KEY"); value != "" {
		global.Config.JWT.SECRET_KEY = value
	}
	if value := os.Getenv("JWT_EXPIRATION_TIME"); value != "" {
		global.Config.JWT.EXPIRATION_TIME = value
	}

}
