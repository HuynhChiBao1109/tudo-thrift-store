package initialize

import (
	"fmt"
	"server-gin/global"

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

}
