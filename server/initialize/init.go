package initialize

import "server-gin/global"

func Init() {
	InitConfig()
	InitPostgres()
	InitRedis()

	r := InitRouter()

	r.Run(":" + global.Config.SERVER.PORT)
}
