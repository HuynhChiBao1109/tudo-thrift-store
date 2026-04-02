package model

import "time"

type Order struct {
	ID            uint          `gorm:"primaryKey" json:"id"`
	UserID        *uint         `gorm:"index" json:"userId,omitempty"`
	User          *User         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"user,omitempty"`
	FullName      string        `gorm:"size:120;not null" json:"fullName"`
	Phone         string        `gorm:"size:20;not null" json:"phone"`
	Address       string        `gorm:"type:text;not null" json:"address"`
	Note          string        `gorm:"type:text" json:"note"`
	PaymentMethod string        `gorm:"size:20;not null" json:"paymentMethod"`
	Status        string        `gorm:"size:20;not null;default:wait_confirm" json:"status"`
	ShippingFee   float64       `gorm:"not null;default:0" json:"shippingFee"`
	Subtotal      float64       `gorm:"not null;default:0" json:"subtotal"`
	Total         float64       `gorm:"not null;default:0" json:"total"`
	Details       []OrderDetail `gorm:"foreignKey:OrderID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"details"`
	CreatedAt     time.Time     `json:"createdAt"`
	UpdatedAt     time.Time     `json:"updatedAt"`
}

type OrderDetail struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	OrderID   uint      `gorm:"index;not null" json:"orderId"`
	ProductID uint      `gorm:"index;not null" json:"productId"`
	Product   Product   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;" json:"product"`
	Quantity  int       `gorm:"not null;default:1" json:"quantity"`
	Price     float64   `gorm:"not null" json:"price"`
	Subtotal  float64   `gorm:"not null" json:"subtotal"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
