package service

import (
	"errors"
	"fmt"
	"strings"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"server-gin/global"
	"server-gin/internal/dto"
	"server-gin/internal/model"
)

type OrderService struct{}

const (
	OrderStatusWaitConfirm = "wait_confirm"
	OrderStatusConfirmed   = "confirmed"
	OrderStatusShipping    = "shipping"
	OrderStatusDelivered   = "delivered"
	OrderStatusCancelled   = "cancelled"

	PaymentMethodCOD = "cod"
	PaymentMethodQR  = "qr"

	ProductStatusAvailable = "available"
	ProductStatusPending   = "pending"
	ProductStatusPaid      = "paid"
)

func NewOrderService() *OrderService {
	return &OrderService{}
}

func normalizeOrderStatus(status string) string {
	normalized := strings.ToLower(strings.TrimSpace(status))
	switch normalized {
	case "pending":
		return OrderStatusWaitConfirm
	case "shipped":
		return OrderStatusShipping
	default:
		return normalized
	}
}

func isValidOrderStatus(status string) bool {
	switch normalizeOrderStatus(status) {
	case OrderStatusWaitConfirm, OrderStatusConfirmed, OrderStatusShipping, OrderStatusDelivered, OrderStatusCancelled:
		return true
	default:
		return false
	}
}

func preloadOrder(query *gorm.DB) *gorm.DB {
	return query.
		Preload("User").
		Preload("Details").
		Preload("Details.Product").
		Preload("Details.Product.Brand")
}

func updateOrderProductsStatus(tx *gorm.DB, order *model.Order, productStatus string) error {
	if len(order.Details) == 0 {
		return nil
	}

	productIDs := make([]uint, 0, len(order.Details))
	for _, detail := range order.Details {
		productIDs = append(productIDs, detail.ProductID)
	}

	return tx.Model(&model.Product{}).
		Where("id IN ?", productIDs).
		Update("status", productStatus).Error
}

func resolveNextStatus(order *model.Order, requestedStatus string) (string, string, error) {
	currentStatus := normalizeOrderStatus(order.Status)
	targetStatus := normalizeOrderStatus(requestedStatus)

	if !isValidOrderStatus(targetStatus) {
		return "", "", errors.New("invalid order status")
	}

	if currentStatus == OrderStatusCancelled || currentStatus == OrderStatusDelivered {
		if targetStatus != currentStatus {
			return "", "", fmt.Errorf("cannot update order from %s", currentStatus)
		}
		return currentStatus, "", nil
	}

	switch targetStatus {
	case OrderStatusCancelled:
		return OrderStatusCancelled, ProductStatusAvailable, nil
	case OrderStatusDelivered:
		if currentStatus != OrderStatusShipping {
			return "", "", errors.New("order must be shipping before delivered")
		}
		return OrderStatusDelivered, ProductStatusPaid, nil
	case OrderStatusConfirmed:
		if currentStatus != OrderStatusWaitConfirm {
			return "", "", errors.New("order must be waiting confirmation")
		}
		if order.PaymentMethod == PaymentMethodCOD {
			return OrderStatusShipping, ProductStatusPaid, nil
		}
		return OrderStatusConfirmed, ProductStatusPending, nil
	case OrderStatusShipping:
		if order.PaymentMethod == PaymentMethodQR && currentStatus != OrderStatusConfirmed {
			return "", "", errors.New("qr order must be confirmed before shipping")
		}
		if order.PaymentMethod == PaymentMethodCOD && currentStatus != OrderStatusWaitConfirm && currentStatus != OrderStatusConfirmed {
			return "", "", errors.New("cod order cannot move to shipping")
		}
		return OrderStatusShipping, ProductStatusPaid, nil
	case OrderStatusWaitConfirm:
		if currentStatus != OrderStatusWaitConfirm {
			return "", "", errors.New("order is already being processed")
		}
		return OrderStatusWaitConfirm, ProductStatusPending, nil
	default:
		return "", "", errors.New("unsupported order status")
	}
}

func (os *OrderService) CreateOrder(req dto.CreateOrderRequest, userID *uint) (*model.Order, error) {
	if len(req.Items) == 0 {
		return nil, errors.New("order items are required")
	}

	trimmedName := strings.TrimSpace(req.FullName)
	trimmedPhone := strings.TrimSpace(req.Phone)
	trimmedAddress := strings.TrimSpace(req.Address)

	if userID != nil {
		var user model.User
		if err := global.PostgresDB.First(&user, *userID).Error; err == nil {
			if trimmedName == "" {
				trimmedName = strings.TrimSpace(user.FullName)
				if trimmedName == "" {
					trimmedName = strings.TrimSpace(user.Username)
				}
			}
			if trimmedPhone == "" {
				trimmedPhone = strings.TrimSpace(user.Phone)
			}
			if trimmedAddress == "" {
				trimmedAddress = strings.TrimSpace(user.Address)
			}
		}
	}

	if trimmedName == "" || trimmedPhone == "" || trimmedAddress == "" {
		return nil, errors.New("fullName, phone and address are required")
	}

	order := &model.Order{}

	err := global.PostgresDB.Transaction(func(tx *gorm.DB) error {
		details := make([]model.OrderDetail, 0, len(req.Items))
		subtotal := 0.0

		for _, item := range req.Items {
			var product model.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&product, item.ProductID).Error; err != nil {
				return err
			}

			if product.Status != ProductStatusAvailable {
				return errors.New("one or more products are not available")
			}

			lineSubtotal := product.Price * float64(item.Quantity)
			subtotal += lineSubtotal

			details = append(details, model.OrderDetail{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Price:     product.Price,
				Subtotal:  lineSubtotal,
			})
		}

		order.UserID = userID
		order.FullName = trimmedName
		order.Phone = trimmedPhone
		order.Address = trimmedAddress
		order.Note = strings.TrimSpace(req.Note)
		order.PaymentMethod = req.PaymentMethod
		order.Status = OrderStatusWaitConfirm
		order.ShippingFee = req.ShippingFee
		order.Subtotal = subtotal
		order.Total = subtotal + req.ShippingFee

		if err := tx.Create(order).Error; err != nil {
			return err
		}

		productIDs := make([]uint, 0, len(details))
		for index := range details {
			details[index].OrderID = order.ID
			productIDs = append(productIDs, details[index].ProductID)
		}

		if err := tx.Create(&details).Error; err != nil {
			return err
		}

		if err := tx.Model(&model.Product{}).
			Where("id IN ?", productIDs).
			Update("status", ProductStatusPending).Error; err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	if err := preloadOrder(global.PostgresDB).First(order, order.ID).Error; err != nil {
		return nil, err
	}

	return order, nil
}

func (os *OrderService) GetOrders() ([]model.Order, error) {
	var orders []model.Order
	err := preloadOrder(global.PostgresDB).
		Order("orders.created_at desc").
		Find(&orders).Error
	return orders, err
}

func (os *OrderService) GetOrderByID(orderID uint) (*model.Order, error) {
	var order model.Order
	if err := preloadOrder(global.PostgresDB).First(&order, orderID).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (os *OrderService) UpdateOrderStatus(orderID uint, requestedStatus string) (*model.Order, error) {
	if !isValidOrderStatus(requestedStatus) {
		return nil, errors.New("invalid order status")
	}

	err := global.PostgresDB.Transaction(func(tx *gorm.DB) error {
		var order model.Order
		if err := preloadOrder(tx.Clauses(clause.Locking{Strength: "UPDATE"})).First(&order, orderID).Error; err != nil {
			return err
		}

		resolvedStatus, productStatus, err := resolveNextStatus(&order, requestedStatus)
		if err != nil {
			return err
		}

		if resolvedStatus == order.Status {
			return nil
		}

		if err := tx.Model(&order).Update("status", resolvedStatus).Error; err != nil {
			return err
		}

		if productStatus != "" {
			if err := updateOrderProductsStatus(tx, &order, productStatus); err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return os.GetOrderByID(orderID)
}

func (os *OrderService) ConfirmQRPayment(orderID uint) (*model.Order, error) {
	err := global.PostgresDB.Transaction(func(tx *gorm.DB) error {
		var order model.Order
		if err := preloadOrder(tx.Clauses(clause.Locking{Strength: "UPDATE"})).First(&order, orderID).Error; err != nil {
			return err
		}

		if order.PaymentMethod != PaymentMethodQR {
			return errors.New("order is not using qr payment")
		}

		if normalizeOrderStatus(order.Status) != OrderStatusConfirmed {
			return errors.New("order must be confirmed before qr payment")
		}

		if err := tx.Model(&order).Update("status", OrderStatusShipping).Error; err != nil {
			return err
		}

		return updateOrderProductsStatus(tx, &order, ProductStatusPaid)
	})
	if err != nil {
		return nil, err
	}

	return os.GetOrderByID(orderID)
}
