package router

import "github.com/gin-gonic/gin"

func NewRouter() *Router {
	return &Router{}
}

type Router struct {
	engine *gin.Engine
}

func (r *Router) Init() {
	r.engine = gin.Default()
	r.engine.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})
}

func (r *Router) Run(addr string) {
	r.engine.Run(addr)
}
