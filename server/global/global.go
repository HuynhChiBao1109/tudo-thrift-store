package global

import (
	"server-gin/package/setting"

	"gorm.io/gorm"
)

var (
	Config setting.Config
	DB     *gorm.DB
)
