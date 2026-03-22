package service

import (
	"errors"
	"server-gin/global"
	"server-gin/internal/model"
	"server-gin/internal/utils"
)

type AuthService struct{}

func NewAuthService() *AuthService {
	return &AuthService{}
}

func (as *AuthService) Login(username, password string) (*model.User, string, error) {
	var user model.User
	if err := global.PostgresDB.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, "", errors.New("invalid credentials")
	}

	if !utils.VerifyPassword(password, user.PasswordSalt, user.PasswordHash) {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return nil, "", err
	}

	return &user, token, nil
}
