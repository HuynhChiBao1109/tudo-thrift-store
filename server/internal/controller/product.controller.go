package controller

import (
	"strconv"

	"server-gin/internal/dto"
	"server-gin/internal/service"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type ProductController struct{}

func NewProductController() *ProductController {
	return &ProductController{}
}

func (pc *ProductController) GetList(c *gin.Context) {
	search := c.Query("search")
	category := c.Query("category")
	sizeParams := c.QueryArray("size")
	sizes := make([]int, 0, len(sizeParams))
	for _, sizeParam := range sizeParams {
		parsed, err := strconv.Atoi(sizeParam)
		if err == nil && parsed >= 20 && parsed <= 40 {
			sizes = append(sizes, parsed)
		}
	}

	var minPrice *float64
	if minPriceParam := c.Query("minPrice"); minPriceParam != "" {
		parsed, err := strconv.ParseFloat(minPriceParam, 64)
		if err == nil {
			minPrice = &parsed
		}
	}

	var maxPrice *float64
	if maxPriceParam := c.Query("maxPrice"); maxPriceParam != "" {
		parsed, err := strconv.ParseFloat(maxPriceParam, 64)
		if err == nil {
			maxPrice = &parsed
		}
	}

	var brandID uint
	if brandIDParam := c.Query("brandId"); brandIDParam != "" {
		parsed, err := strconv.ParseUint(brandIDParam, 10, 64)
		if err == nil {
			brandID = uint(parsed)
		}
	}

	productService := service.NewProductService()
	products, err := productService.GetProducts(search, category, brandID, sizes, minPrice, maxPrice)
	if err != nil {
		response.ErrorResponse(c, response.StatusServerError, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, gin.H{
		"items": products,
		"total": len(products),
	})
}

func (pc *ProductController) GetDetail(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("productId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	productService := service.NewProductService()
	product, err := productService.GetProductByID(uint(id))
	if err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, product)
}

func (pc *ProductController) GetDetailBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	productService := service.NewProductService()
	product, err := productService.GetProductBySlug(slug)
	if err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, product)
}

func (pc *ProductController) Create(c *gin.Context) {
	var req dto.CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	productService := service.NewProductService()
	product, err := productService.Create(req)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, product)
}

func (pc *ProductController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("productId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	var req dto.UpdateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	productService := service.NewProductService()
	product, err := productService.Update(uint(id), req)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, product)
}

func (pc *ProductController) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("productId"), 10, 64)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	productService := service.NewProductService()
	if err := productService.Delete(uint(id)); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, gin.H{"deleted": true})
}
