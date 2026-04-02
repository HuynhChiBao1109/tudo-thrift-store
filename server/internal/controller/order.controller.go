package controller

import (
	"strconv"

	"server-gin/internal/dto"
	"server-gin/internal/service"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type OrderController struct{}

func NewOrderController() *OrderController {
	return &OrderController{}
}

func parseOrderID(raw string) (uint, error) {
	parsed, err := strconv.ParseUint(raw, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(parsed), nil
}

func (oc *OrderController) Create(c *gin.Context) {
	var req dto.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	var userID *uint
	if value, exists := c.Get("userId"); exists {
		if parsed, ok := value.(uint); ok {
			userID = &parsed
		}
	}

	orderService := service.NewOrderService()
	createdOrder, err := orderService.CreateOrder(req, userID)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, createdOrder)
}

func (oc *OrderController) GetList(c *gin.Context) {
	orderService := service.NewOrderService()
	orders, err := orderService.GetOrders()
	if err != nil {
		response.ErrorResponse(c, response.StatusServerError, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, orders)
}

func (oc *OrderController) GetDetail(c *gin.Context) {
	orderID, err := parseOrderID(c.Param("orderId"))
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	orderService := service.NewOrderService()
	order, err := orderService.GetOrderByID(orderID)
	if err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, order)
}

func (oc *OrderController) UpdateStatus(c *gin.Context) {
	orderID, err := parseOrderID(c.Param("orderId"))
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	var req dto.UpdateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	orderService := service.NewOrderService()
	order, err := orderService.UpdateOrderStatus(orderID, req.Status)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, order)
}

func (oc *OrderController) ConfirmQRPayment(c *gin.Context) {
	orderID, err := parseOrderID(c.Param("orderId"))
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	orderService := service.NewOrderService()
	order, err := orderService.ConfirmQRPayment(orderID)
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, order)
}
