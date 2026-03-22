package middleware

import (
	"strings"

	"server-gin/internal/utils"
	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			response.ErrorResponse(c, response.StatusUnauthorized, nil)
			c.Abort()
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			response.ErrorResponse(c, response.StatusUnauthorized, nil)
			c.Abort()
			return
		}

		claims, err := utils.ParseToken(parts[1])
		if err != nil {
			response.ErrorResponse(c, response.StatusUnauthorized, nil)
			c.Abort()
			return
		}

		c.Set("userId", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, ok := c.Get("role")
		if !ok || role != "admin" {
			response.ErrorResponse(c, response.StatusForbidden, nil)
			c.Abort()
			return
		}
		c.Next()
	}
}
