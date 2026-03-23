package controller

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"server-gin/package/response"

	"github.com/gin-gonic/gin"
)

type UploadController struct{}

func NewUploadController() *UploadController {
	return &UploadController{}
}

func (uc *UploadController) UploadProductImages(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		response.ErrorResponse(c, response.StatusBadRequest, nil)
		return
	}

	dateDir := time.Now().Format("20060102")
	uploadDir := filepath.Join("uploads", "products", dateDir)
	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		response.ErrorResponse(c, response.StatusServerError, nil)
		return
	}

	directory := fmt.Sprintf("/products/%s", dateDir)
	items := make([]gin.H, 0, len(files))
	urls := make([]string, 0, len(files))

	for index, file := range files {
		ext := strings.ToLower(filepath.Ext(file.Filename))
		fileName := fmt.Sprintf("%d_%d%s", time.Now().UnixNano(), index, ext)
		relativePath := fmt.Sprintf("/products/%s/%s", dateDir, fileName)
		absolutePath := filepath.Join(uploadDir, fileName)

		if err := c.SaveUploadedFile(file, absolutePath); err != nil {
			response.ErrorResponse(c, response.StatusServerError, nil)
			return
		}

		urls = append(urls, relativePath)
		items = append(items, gin.H{
			"filename":  fileName,
			"directory": directory,
			"path":      relativePath,
			"url":       relativePath,
		})
	}

	response.SuccessResponse(c, response.StatusOK, gin.H{
		"directory": directory,
		"urls":      urls,
		"items":     items,
	})
}
