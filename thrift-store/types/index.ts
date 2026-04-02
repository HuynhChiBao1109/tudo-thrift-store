export type ProductCondition = "like-new" | "good" | "fair" | "worn";
export type ProductCategory = string;
export type OrderStatus = "wait_confirm" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type ProductSize = number;
export type ProductStatus = "available" | "pending" | "paid" | "out_of_stock";

export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  sale?: number;
  originalPrice?: number;
  status: ProductStatus;
  category: ProductCategory;
  brandId?: string;
  condition: ProductCondition;
  size: ProductSize;
  brand: string;
  images: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  slug?: string;
  description: string;
  price: number;
  sale: number;
  size: ProductSize;
  status?: ProductStatus;
  category: ProductCategory;
  brandId: string;
  images: string[];
}

export interface CheckoutItemPayload {
  productId: string;
  quantity: number;
}

export interface CheckoutPayload {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "cod" | "qr";
  shippingFee: number;
  items: CheckoutItemPayload[];
}

export interface CheckoutOrderDetail {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: Product;
}

export interface CheckoutOrder {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: "cod" | "qr";
  status: OrderStatus;
  shippingFee: number;
  subtotal: number;
  total: number;
  details: CheckoutOrderDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: "cod" | "qr";
  total: number;
  fullName: string;
  phone: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { product: Product; sold: number }[];
  recentOrders: Order[];
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ProductFilters {
  category?: ProductCategory;
  brandId?: string;
  condition?: ProductCondition;
  size?: ProductSize[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "price-asc" | "price-desc" | "newest" | "oldest";
}

export interface AuthUser {
  id: number;
  username: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role: string;
}
