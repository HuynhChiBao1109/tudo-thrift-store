package router

import (
	"server-gin/internal/controller"
	"server-gin/internal/middleware"

	"github.com/gin-gonic/gin"
)

type Router struct{}

func NewRouter() *Router {
	return &Router{}
}

func (r *Router) InitRoutes(engine *gin.Engine) {
	authController := controller.NewAuthController()
	brandController := controller.NewBrandController()
	productController := controller.NewProductController()
	uploadController := controller.NewUploadController()

	api := engine.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", authController.Login)
		}

		brands := api.Group("/brands")
		{
			brands.GET("", brandController.GetList)
			brands.GET("/:brandId", brandController.GetDetail)

			adminBrands := brands.Group("", middleware.AuthRequired(), middleware.AdminOnly())
			adminBrands.POST("", brandController.Create)
			adminBrands.PUT("/:brandId", brandController.Update)
			adminBrands.DELETE("/:brandId", brandController.Delete)
		}

		uploads := api.Group("/uploads", middleware.AuthRequired(), middleware.AdminOnly())
		{
			uploads.POST("/products/images", uploadController.UploadProductImages)
		}

		products := api.Group("/products")
		{
			products.GET("", productController.GetList)
			products.GET("/:productId", productController.GetDetail)

			adminProducts := products.Group("", middleware.AuthRequired(), middleware.AdminOnly())
			adminProducts.POST("", productController.Create)
			adminProducts.PUT("/:productId", productController.Update)
			adminProducts.DELETE("/:productId", productController.Delete)
		}
	}
}
