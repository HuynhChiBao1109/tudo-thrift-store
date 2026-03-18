package controller

type BrandController struct{}

func NewBrandController() *BrandController {
	return &BrandController{}
}

func (bc *BrandController) GetList() {}

func (bc *BrandController) Create() {}

func (bc *BrandController) Update() {}
