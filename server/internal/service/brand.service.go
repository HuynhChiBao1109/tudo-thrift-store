package service

import (
	"server-gin/global"
	"server-gin/internal/model"
)

type BrandService struct{}

func NewBrandService() *BrandService {
	return &BrandService{}
}

func (bs *BrandService) GetList() ([]model.Brand, error) {
	var brands []model.Brand
	err := global.PostgresDB.Order("name asc").Find(&brands).Error
	return brands, err
}

func (bs *BrandService) GetByID(id uint) (*model.Brand, error) {
	var brand model.Brand
	if err := global.PostgresDB.First(&brand, id).Error; err != nil {
		return nil, err
	}
	return &brand, nil
}

func (bs *BrandService) Create(name string) (*model.Brand, error) {
	brand := model.Brand{Name: name}
	if err := global.PostgresDB.Create(&brand).Error; err != nil {
		return nil, err
	}
	return &brand, nil
}

func (bs *BrandService) Update(id uint, name string) (*model.Brand, error) {
	brand, err := bs.GetByID(id)
	if err != nil {
		return nil, err
	}
	brand.Name = name
	if err := global.PostgresDB.Save(brand).Error; err != nil {
		return nil, err
	}
	return brand, nil
}

func (bs *BrandService) Delete(id uint) error {
	return global.PostgresDB.Delete(&model.Brand{}, id).Error
}
