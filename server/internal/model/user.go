package model

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"size:80;uniqueIndex;not null" json:"username"`
	FullName     string    `gorm:"size:120" json:"fullName"`
	Phone        string    `gorm:"size:20" json:"phone"`
	Address      string    `gorm:"type:text" json:"address"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
	PasswordSalt string    `gorm:"size:255;not null" json:"-"`
	Role         string    `gorm:"size:20;not null;default:user" json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
