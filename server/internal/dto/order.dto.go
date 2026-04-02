package dto

type CreateOrderItemRequest struct {
	ProductID uint `json:"productId" binding:"required"`
	Quantity  int  `json:"quantity" binding:"required,gt=0"`
}

type CreateOrderRequest struct {
	FullName      string                   `json:"fullName"`
	Phone         string                   `json:"phone"`
	Address       string                   `json:"address"`
	Note          string                   `json:"note"`
	PaymentMethod string                   `json:"paymentMethod" binding:"required,oneof=cod qr"`
	ShippingFee   float64                  `json:"shippingFee" binding:"omitempty,gte=0"`
	Items         []CreateOrderItemRequest `json:"items" binding:"required,min=1,dive"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=wait_confirm confirmed shipping delivered cancelled"`
}

type AuthMeResponse struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	FullName string `json:"fullName"`
	Phone    string `json:"phone"`
	Address  string `json:"address"`
	Role     string `json:"role"`
}
