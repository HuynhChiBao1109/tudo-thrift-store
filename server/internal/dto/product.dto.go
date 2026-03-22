package dto

type CreateProductRequest struct {
	Name        string   `json:"name" binding:"required"`
	Description string   `json:"description"`
	Price       float64  `json:"price" binding:"required,gt=0"`
	Sale        float64  `json:"sale" binding:"omitempty,gte=0"`
	Category    string   `json:"category" binding:"required"`
	BrandID     uint     `json:"brandId" binding:"required"`
	Images      []string `json:"images"`
}

type UpdateProductRequest struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	Sale        *float64  `json:"sale"`
	Category    string    `json:"category"`
	BrandID     uint      `json:"brandId"`
	Images      *[]string `json:"images"`
}
