package service

import (
	"server-gin/global"
	"server-gin/internal/model"
)

type CategoryService struct{}

func NewCategoryService() *CategoryService {
	return &CategoryService{}
}

func (cs *CategoryService) GetList() ([]model.Category, error) {
	var categories []model.Category
	err := global.PostgresDB.Order("name asc").Find(&categories).Error
	return categories, err
}

func (cs *CategoryService) GetByID(id uint) (*model.Category, error) {
	var category model.Category
	if err := global.PostgresDB.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (cs *CategoryService) Create(name string) (*model.Category, error) {
	category := model.Category{Name: name}
	if err := global.PostgresDB.Create(&category).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (cs *CategoryService) Update(id uint, name string) (*model.Category, error) {
	category, err := cs.GetByID(id)
	if err != nil {
		return nil, err
	}
	category.Name = name
	if err := global.PostgresDB.Save(category).Error; err != nil {
		return nil, err
	}
	return category, nil
}

func (cs *CategoryService) Delete(id uint) error {
	return global.PostgresDB.Delete(&model.Category{}, id).Error
}
