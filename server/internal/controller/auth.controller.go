package controller

import (
	"server-gin/global"
	"server-gin/internal/dto"
	"server-gin/internal/model"
	"server-gin/internal/service"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type AuthController struct{}

func NewAuthController() *AuthController {
	return &AuthController{}
}

func (ac *AuthController) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	authService := service.NewAuthService()
	user, token, err := authService.Login(req.Username, req.Password)
	if err != nil {
		response.ErrorResponse(c, response.StatusUnauthorized, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"role":     user.Role,
		},
	})
}

func (ac *AuthController) Me(c *gin.Context) {
	value, exists := c.Get("userId")
	if !exists {
		response.ErrorResponse(c, response.StatusUnauthorized, nil)
		return
	}

	userID, ok := value.(uint)
	if !ok {
		response.ErrorResponse(c, response.StatusUnauthorized, nil)
		return
	}

	var user model.User
	if err := global.PostgresDB.First(&user, userID).Error; err != nil {
		response.ErrorResponse(c, response.StatusNotFound, nil)
		return
	}

	response.SuccessResponse(c, response.StatusOK, dto.AuthMeResponse{
		ID:       user.ID,
		Username: user.Username,
		FullName: user.FullName,
		Phone:    user.Phone,
		Address:  user.Address,
		Role:     user.Role,
	})
}
