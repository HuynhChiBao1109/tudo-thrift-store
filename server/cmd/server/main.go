package main

import (
	"server-gin/internal/router"
)

func main() {
	router := router.NewRouter()
	router.Init()
	router.Run(":8080")
}
