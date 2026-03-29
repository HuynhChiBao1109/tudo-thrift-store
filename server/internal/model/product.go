package model

import "time"

type Product struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:255;not null" json:"name"`
	Slug        string    `gorm:"size:255;uniqueIndex" json:"slug"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"not null" json:"price"`
	Sale        float64   `gorm:"not null;default:0" json:"sale"`
	Category    string    `gorm:"size:80;index;not null" json:"category"`
	BrandID     uint      `gorm:"index;not null" json:"brandId"`
	Brand       Brand     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"brand"`
	Images      []string  `gorm:"type:jsonb;serializer:json" json:"images"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
