package controller

import (
	"strconv"

	"server-gin/internal/dto"
	"server-gin/internal/service"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type CategoryController struct{}

func NewCategoryController() *CategoryController {
	return &CategoryController{}
}

func (cc *CategoryController) GetList(c *gin.Context) {
	categoryService := service.NewCategoryService()
	categories, err := categoryService.GetList()
	if err != nil {
		response.ErrorResponse(c, response.StatusServerError, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, categories)
}

func (cc *CategoryController) GetDetail(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("categoryId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	categoryService := service.NewCategoryService()
	category, err := categoryService.GetByID(uint(id))
	if err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, category)
}

func (cc *CategoryController) Create(c *gin.Context) {
	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	categoryService := service.NewCategoryService()
	category, err := categoryService.Create(req.Name)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, category)
}

func (cc *CategoryController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("categoryId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	var req dto.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	categoryService := service.NewCategoryService()
	category, err := categoryService.Update(uint(id), req.Name)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, category)
}

func (cc *CategoryController) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("categoryId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	categoryService := service.NewCategoryService()
	if err := categoryService.Delete(uint(id)); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, gin.H{"deleted": true})
}
