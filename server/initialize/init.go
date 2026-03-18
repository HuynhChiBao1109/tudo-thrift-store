package initialize

import "server-gin/global"

func Init() {
	InitConfig()
	InitMySQL()
	InitRedis()

	r := InitRouter()

	r.Run(":" + global.Config.SERVER.PORT)
}
