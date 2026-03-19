package service

type ProductService struct{}

func NewProductService() *ProductService {
	return &ProductService{}
}

func (ps *ProductService) GetProducts() ([]string, error) {
	// Placeholder for actual database interaction
	products := []string{"Product 1", "Product 2", "Product 3"}
	return products, nil
}

func (ps *ProductService) GetProductByID(id int) (string, error) {
	// Placeholder for actual database interaction
	product := "Product " + string(rune(id))
	return product, nil
}

func (ps *ProductService) CreateProduct(name string) (string, error) {
	// Placeholder for actual database interaction
	createdProduct := "Created " + name
	return createdProduct, nil
}
