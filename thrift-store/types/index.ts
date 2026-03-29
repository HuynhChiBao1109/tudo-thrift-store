export type ProductCondition = "like-new" | "good" | "fair" | "worn";
export type ProductCategory = string;
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type ProductSize = number;

export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  sale?: number;
  originalPrice?: number;
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
  category: ProductCategory;
  brandId: string;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
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
  customerId: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
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
  role: string;
}
