package controller

import (
	"strconv"

	"server-gin/internal/dto"
	"server-gin/internal/service"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type BrandController struct{}

func NewBrandController() *BrandController {
	return &BrandController{}
}

func (bc *BrandController) GetList(c *gin.Context) {
	brandService := service.NewBrandService()
	brands, err := brandService.GetList()
	if err != nil {
		response.ErrorResponse(c, response.StatusServerError, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, brands)
}

func (bc *BrandController) GetDetail(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("brandId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	brandService := service.NewBrandService()
	brand, err := brandService.GetByID(uint(id))
	if err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, brand)
}

func (bc *BrandController) Create(c *gin.Context) {
	var req dto.CreateBrandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	brandService := service.NewBrandService()
	brand, err := brandService.Create(req.Name)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, brand)
}

func (bc *BrandController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("brandId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	var req dto.UpdateBrandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	brandService := service.NewBrandService()
	brand, err := brandService.Update(uint(id), req.Name)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, brand)
}

func (bc *BrandController) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("brandId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	brandService := service.NewBrandService()
	if err := brandService.Delete(uint(id)); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}
	response.SuccessResponse(c, response.StatusOK, gin.H{"deleted": true})
}
