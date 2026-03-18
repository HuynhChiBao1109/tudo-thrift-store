package setting

type Config struct {
	MYSQL  MySQLSetting  `mapstructure:"MYSQL"`
	REDIS  RedisSetting  `mapstructure:"REDIS"`
	SERVER ServerSetting `mapstructure:"SERVER"`
}

type ServerSetting struct {
	PORT      string `mapstructure:"PORT"`
	ENV       string `mapstructure:"ENV"`
	LOG_LEVEL string `mapstructure:"LOG_LEVEL"`
}

type MySQLSetting struct {
	HOST     string `mapstructure:"HOST"`
	PORT     string `mapstructure:"PORT"`
	USER     string `mapstructure:"USER"`
	PASSWORD string `mapstructure:"PASSWORD"`
	DB_NAME  string `mapstructure:"DB_NAME"`
}

type RedisSetting struct {
	HOST     string `mapstructure:"HOST"`
	PORT     string `mapstructure:"PORT"`
	PASSWORD string `mapstructure:"PASSWORD"`
}
