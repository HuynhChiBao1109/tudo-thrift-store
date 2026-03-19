package setting

type Config struct {
	POSTGRES PostgresSetting `mapstructure:"POSTGRES"`
	REDIS    RedisSetting    `mapstructure:"REDIS"`
	SERVER   ServerSetting   `mapstructure:"SERVER"`
}

type ServerSetting struct {
	PORT      string `mapstructure:"PORT"`
	ENV       string `mapstructure:"ENV"`
	LOG_LEVEL string `mapstructure:"LOG_LEVEL"`
}

type PostgresSetting struct {
	HOST     string `mapstructure:"HOST"`
	PORT     int    `mapstructure:"PORT"`
	USER     string `mapstructure:"USER"`
	PASSWORD string `mapstructure:"PASSWORD"`
	DB_NAME  string `mapstructure:"DB_NAME"`
}

type RedisSetting struct {
	HOST     string `mapstructure:"HOST"`
	PORT     int    `mapstructure:"PORT"`
	PASSWORD string `mapstructure:"PASSWORD"`
}
