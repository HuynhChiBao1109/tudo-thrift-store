package service

import (
	"strings"

	"server-gin/global"
	"server-gin/internal/dto"
	"server-gin/internal/model"
)

type ProductService struct{}

func NewProductService() *ProductService {
	return &ProductService{}
}

func (ps *ProductService) GetProducts(search, category string, brandID uint) ([]model.Product, error) {
	query := global.PostgresDB.Model(&model.Product{}).Preload("Brand").Order("products.created_at desc")

	if strings.TrimSpace(search) != "" {
		searchLike := "%" + strings.TrimSpace(search) + "%"
		query = query.Joins("LEFT JOIN brands ON brands.id = products.brand_id").Where(
			"products.name ILIKE ? OR products.description ILIKE ? OR brands.name ILIKE ?",
			searchLike,
			searchLike,
			searchLike,
		)
	}
	if strings.TrimSpace(category) != "" {
		query = query.Where("products.category = ?", category)
	}
	if brandID > 0 {
		query = query.Where("products.brand_id = ?", brandID)
	}

	var products []model.Product
	err := query.Find(&products).Error
	return products, err
}

func (ps *ProductService) GetProductByID(id uint) (*model.Product, error) {
	var product model.Product
	if err := global.PostgresDB.Preload("Brand").First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (ps *ProductService) CreateProduct(req dto.CreateProductRequest) (*model.Product, error) {
	product := model.Product{
		Name:        req.Name,
		Description: req.Description,
		Price:       req.Price,
		Sale:        req.Sale,
		Category:    req.Category,
		BrandID:     req.BrandID,
		Images:      req.Images,
	}

	if err := global.PostgresDB.Create(&product).Error; err != nil {
		return nil, err
	}

	if err := global.PostgresDB.Preload("Brand").First(&product, product.ID).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (ps *ProductService) UpdateProduct(id uint, req dto.UpdateProductRequest) (*model.Product, error) {
	product, err := ps.GetProductByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		product.Name = req.Name
	}
	if req.Description != "" {
		product.Description = req.Description
	}
	if req.Price > 0 {
		product.Price = req.Price
	}
	if req.Sale != nil && *req.Sale >= 0 {
		product.Sale = *req.Sale
	}
	if req.Category != "" {
		product.Category = req.Category
	}
	if req.BrandID > 0 {
		product.BrandID = req.BrandID
	}
	if req.Images != nil {
		product.Images = *req.Images
	}

	if err := global.PostgresDB.Save(product).Error; err != nil {
		return nil, err
	}

	if err := global.PostgresDB.Preload("Brand").First(product, product.ID).Error; err != nil {
		return nil, err
	}

	return product, nil
}

func (ps *ProductService) DeleteProduct(id uint) error {
	return global.PostgresDB.Delete(&model.Product{}, id).Error
}
