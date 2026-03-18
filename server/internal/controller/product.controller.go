package controller

import (
	"github.com/gin-gonic/gin"
)

type ProductController struct{}

func NewProductController() *ProductController {
	return &ProductController{}
}

func (pc *ProductController) GetList(c *gin.Context) {
}

func (pc *ProductController) GetDetail(c *gin.Context) {}

func (pc *ProductController) Create(c *gin.Context) {}

func (pc *ProductController) Update(c *gin.Context) {}
