package service

import (
	"fmt"
	"net/url"
	"strings"
	"unicode"

	"server-gin/global"
	"server-gin/internal/dto"
	"server-gin/internal/model"
)

type ProductService struct{}

func NewProductService() *ProductService {
	return &ProductService{}
}

func normalizeImagePath(image string) string {
	value := strings.TrimSpace(image)
	if value == "" {
		return ""
	}

	if parsed, err := url.Parse(value); err == nil && (parsed.Scheme == "http" || parsed.Scheme == "https") {
		value = parsed.Path
	}

	value = strings.ReplaceAll(value, "\\", "/")
	if strings.HasPrefix(value, "/uploads/") {
		value = strings.TrimPrefix(value, "/uploads")
	} else if strings.HasPrefix(value, "uploads/") {
		value = strings.TrimPrefix(value, "uploads")
	}

	if !strings.HasPrefix(value, "/") {
		value = "/" + value
	}

	return value
}

func normalizeImagePaths(images []string) []string {
	normalized := make([]string, 0, len(images))
	for _, image := range images {
		path := normalizeImagePath(image)
		if path == "" {
			continue
		}
		normalized = append(normalized, path)
	}
	return normalized
}

func slugify(name string) string {
	lower := strings.ToLower(strings.TrimSpace(name))
	var b strings.Builder
	prevHyphen := true
	for _, r := range lower {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') {
			b.WriteRune(r)
			prevHyphen = false
		} else if r >= 'A' && r <= 'Z' {
			b.WriteRune(unicode.ToLower(r))
			prevHyphen = false
		} else if !prevHyphen {
			b.WriteRune('-')
			prevHyphen = true
		}
	}

	slug := strings.TrimRight(b.String(), "-")
	if slug == "" {
		return "product"
	}
	return slug
}

func (ps *ProductService) generateUniqueSlug(base string, excludeID uint) string {
	candidate := base
	for i := 2; ; i++ {
		var count int64
		q := global.PostgresDB.Model(&model.Product{}).Where("slug = ?", candidate)
		if excludeID > 0 {
			q = q.Where("id != ?", excludeID)
		}
		q.Count(&count)
		if count == 0 {
			return candidate
		}
		candidate = fmt.Sprintf("%s-%d", base, i)
	}
}

func (ps *ProductService) GetProducts(search, category string, brandID uint, sizes []int, minPrice, maxPrice *float64) ([]model.Product, error) {
	query := global.PostgresDB.Model(&model.Product{}).Preload("Brand").Order("products.created_at desc")

	if strings.TrimSpace(search) != "" {
		searchLike := "%" + strings.TrimSpace(search) + "%"
		query = query.Joins("LEFT JOIN brands ON brands.id = products.brand_id").Where(
			"products.name ILIKE ? OR products.description ILIKE ? OR brands.name ILIKE ? OR products.slug ILIKE ?",
			searchLike,
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
	if len(sizes) > 0 {
		query = query.Where("products.size IN ?", sizes)
	}
	if minPrice != nil {
		query = query.Where("products.price >= ?", *minPrice)
	}
	if maxPrice != nil {
		query = query.Where("products.price <= ?", *maxPrice)
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

func (ps *ProductService) GetProductBySlug(slug string) (*model.Product, error) {
	var product model.Product
	if err := global.PostgresDB.Preload("Brand").Where("slug = ?", slug).First(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (ps *ProductService) Create(req dto.CreateProductRequest) (*model.Product, error) {
	slug := ps.generateUniqueSlug(slugify(req.Name), 0)
	product := model.Product{
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Price:       req.Price,
		Sale:        req.Sale,
		Size:        req.Size,
		Category:    req.Category,
		BrandID:     req.BrandID,
		Images:      normalizeImagePaths(req.Images),
	}

	if err := global.PostgresDB.Create(&product).Error; err != nil {
		return nil, err
	}

	if err := global.PostgresDB.Preload("Brand").First(&product, product.ID).Error; err != nil {
		return nil, err
	}

	return &product, nil
}

func (ps *ProductService) Update(id uint, req dto.UpdateProductRequest) (*model.Product, error) {
	product, err := ps.GetProductByID(id)
	if err != nil {
		return nil, err
	}

	if req.Name != "" {
		product.Name = req.Name
		product.Slug = ps.generateUniqueSlug(slugify(req.Name), product.ID)
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
	if req.Size != nil && *req.Size >= 20 && *req.Size <= 40 {
		product.Size = *req.Size
	}
	if req.Category != "" {
		product.Category = req.Category
	}
	if req.BrandID > 0 {
		product.BrandID = req.BrandID
	}
	if req.Images != nil {
		product.Images = normalizeImagePaths(*req.Images)
	}

	if err := global.PostgresDB.Save(product).Error; err != nil {
		return nil, err
	}

	if err := global.PostgresDB.Preload("Brand").First(product, product.ID).Error; err != nil {
		return nil, err
	}

	return product, nil
}

func (ps *ProductService) Delete(id uint) error {
	return global.PostgresDB.Delete(&model.Product{}, id).Error
}
