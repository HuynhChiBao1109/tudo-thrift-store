import { Product, Customer, Order, DashboardStats, ProductFilters, ApiResponse } from '@/types';

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Vintage Levi\'s 501 Jeans',
    description: 'Classic Levi\'s 501 straight-leg jeans in excellent condition. Faded wash gives a perfectly worn-in look.',
    price: 45,
    originalPrice: 150,
    category: 'bottoms',
    condition: 'good',
    size: 'M',
    brand: "Levi's",
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['vintage', 'denim', 'classic'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Floral Midi Dress',
    description: 'Beautiful floral print midi dress. Perfect for summer occasions. Light and airy fabric.',
    price: 28,
    originalPrice: 89,
    category: 'dresses',
    condition: 'like-new',
    size: 'S',
    brand: 'Zara',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['floral', 'summer', 'feminine'],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: '3',
    name: 'Oversized Wool Blazer',
    description: 'Chic oversized blazer in deep navy. Perfect for layering. Minimal wear, excellent quality.',
    price: 65,
    originalPrice: 220,
    category: 'outerwear',
    condition: 'good',
    size: 'L',
    brand: 'H&M Studio',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['blazer', 'work', 'elegant'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '4',
    name: 'Nike Air Force 1 - White',
    description: 'Classic white Nike Air Force 1s. Some minor scuffs but overall great condition.',
    price: 55,
    originalPrice: 110,
    category: 'shoes',
    condition: 'good',
    size: 'M',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    ],
    stock: 2,
    featured: false,
    tags: ['sneakers', 'classic', 'white'],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'Cashmere Crewneck Sweater',
    description: 'Luxurious cashmere sweater in camel color. Barely worn. Incredibly soft.',
    price: 80,
    originalPrice: 340,
    category: 'tops',
    condition: 'like-new',
    size: 'M',
    brand: 'Everlane',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['cashmere', 'luxury', 'winter'],
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
  {
    id: '6',
    name: 'Vintage Band Tee - The Cure',
    description: 'Authentic vintage The Cure band tee. Minor fading adds to the authentic vintage feel.',
    price: 35,
    originalPrice: 0,
    category: 'tops',
    condition: 'fair',
    size: 'L',
    brand: 'Vintage',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    ],
    stock: 1,
    featured: false,
    tags: ['vintage', 'band-tee', 'music'],
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '7',
    name: 'Leather Crossbody Bag',
    description: 'Genuine leather crossbody bag. Minimal signs of use. Adjustable strap.',
    price: 42,
    originalPrice: 180,
    category: 'bags',
    condition: 'good',
    size: 'One Size',
    brand: 'Coach',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    ],
    stock: 1,
    featured: false,
    tags: ['leather', 'bag', 'classic'],
    createdAt: '2024-02-12T10:00:00Z',
    updatedAt: '2024-02-12T10:00:00Z',
  },
  {
    id: '8',
    name: 'Silk Slip Dress',
    description: 'Elegant silk slip dress in champagne. Perfect for special occasions.',
    price: 50,
    originalPrice: 195,
    category: 'dresses',
    condition: 'like-new',
    size: 'XS',
    brand: 'ASOS',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['silk', 'elegant', 'party'],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '9',
    name: 'Trench Coat - Camel',
    description: 'Timeless camel trench coat. Classic silhouette, excellent condition.',
    price: 95,
    originalPrice: 380,
    category: 'outerwear',
    condition: 'good',
    size: 'S',
    brand: 'Burberry',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    ],
    stock: 1,
    featured: true,
    tags: ['trench', 'classic', 'luxury'],
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '10',
    name: 'Mom Jeans - High Rise',
    description: 'Trendy high-rise mom jeans in light wash. Super comfortable and stylish.',
    price: 32,
    originalPrice: 79,
    category: 'bottoms',
    condition: 'good',
    size: 'S',
    brand: 'Topshop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
    ],
    stock: 3,
    featured: false,
    tags: ['mom jeans', 'high rise', 'casual'],
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '11',
    name: 'Chunky Gold Chain Necklace',
    description: 'Bold statement gold chain necklace. Perfect for layering or wearing solo.',
    price: 18,
    originalPrice: 45,
    category: 'accessories',
    condition: 'like-new',
    size: 'One Size',
    brand: 'Unknown',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    ],
    stock: 1,
    featured: false,
    tags: ['jewelry', 'gold', 'statement'],
    createdAt: '2024-03-05T10:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z',
  },
  {
    id: '12',
    name: 'Denim Jacket - Cropped',
    description: 'Cute cropped denim jacket. Great for spring and autumn layering.',
    price: 38,
    originalPrice: 95,
    category: 'outerwear',
    condition: 'good',
    size: 'M',
    brand: 'Mango',
    images: [
      'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600&q=80',
    ],
    stock: 1,
    featured: false,
    tags: ['denim', 'casual', 'cropped'],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Emma Johnson', email: 'emma@example.com', phone: '+1 555-0101', totalOrders: 5, totalSpent: 234, createdAt: '2024-01-10T10:00:00Z' },
  { id: 'c2', name: 'Sophia Williams', email: 'sophia@example.com', phone: '+1 555-0102', totalOrders: 3, totalSpent: 128, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'c3', name: 'Olivia Brown', email: 'olivia@example.com', phone: '+1 555-0103', totalOrders: 8, totalSpent: 450, createdAt: '2024-01-20T10:00:00Z' },
  { id: 'c4', name: 'Ava Davis', email: 'ava@example.com', totalOrders: 2, totalSpent: 75, createdAt: '2024-02-01T10:00:00Z' },
  { id: 'c5', name: 'Isabella Martinez', email: 'isabella@example.com', phone: '+1 555-0105', totalOrders: 6, totalSpent: 312, createdAt: '2024-02-10T10:00:00Z' },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'c1',
    customer: mockCustomers[0],
    items: [{ product: mockProducts[0], quantity: 1, price: 45 }, { product: mockProducts[4], quantity: 1, price: 80 }],
    status: 'delivered',
    total: 125,
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z',
  },
  {
    id: 'ORD-002',
    customerId: 'c2',
    customer: mockCustomers[1],
    items: [{ product: mockProducts[1], quantity: 1, price: 28 }],
    status: 'shipped',
    total: 28,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-12T10:00:00Z',
  },
  {
    id: 'ORD-003',
    customerId: 'c3',
    customer: mockCustomers[2],
    items: [{ product: mockProducts[2], quantity: 1, price: 65 }, { product: mockProducts[6], quantity: 1, price: 42 }],
    status: 'confirmed',
    total: 107,
    shippingAddress: '789 Pine St, Chicago, IL 60601',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'ORD-004',
    customerId: 'c4',
    customer: mockCustomers[3],
    items: [{ product: mockProducts[7], quantity: 1, price: 50 }],
    status: 'pending',
    total: 50,
    shippingAddress: '321 Elm Rd, Houston, TX 77001',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'ORD-005',
    customerId: 'c5',
    customer: mockCustomers[4],
    items: [{ product: mockProducts[8], quantity: 1, price: 95 }],
    status: 'delivered',
    total: 95,
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-18T10:00:00Z',
  },
];

// ─── Fake API Delay ───────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Product API ──────────────────────────────────────────────────────────────

export const productsApi = {
  getAll: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    await delay(600);
    let products = [...mockProducts];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (filters?.category) products = products.filter(p => p.category === filters.category);
    if (filters?.condition) products = products.filter(p => p.condition === filters.condition);
    if (filters?.size) products = products.filter(p => p.size === filters.size);
    if (filters?.featured !== undefined) products = products.filter(p => p.featured === filters.featured);
    if (filters?.minPrice) products = products.filter(p => p.price >= filters.minPrice!);
    if (filters?.maxPrice) products = products.filter(p => p.price <= filters.maxPrice!);

    if (filters?.sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    if (filters?.sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    if (filters?.sortBy === 'newest') products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = products.length;
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const start = (page - 1) * pageSize;
    products = products.slice(start, start + pageSize);

    return { data: products, total, page, pageSize };
  },

  getById: async (id: string): Promise<Product> => {
    await delay(400);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    await delay(800);
    const product: Product = {
      ...data,
      id: String(mockProducts.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(product);
    return product;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    await delay(600);
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    mockProducts[idx] = { ...mockProducts[idx], ...data, updatedAt: new Date().toISOString() };
    return mockProducts[idx];
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    mockProducts.splice(idx, 1);
  },
};

// ─── Orders API ───────────────────────────────────────────────────────────────

export const ordersApi = {
  getAll: async (): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return { data: [...mockOrders], total: mockOrders.length };
  },

  getById: async (id: string): Promise<Order> => {
    await delay(400);
    const order = mockOrders.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return order;
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    await delay(500);
    const idx = mockOrders.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Order not found');
    mockOrders[idx] = { ...mockOrders[idx], status, updatedAt: new Date().toISOString() };
    return mockOrders[idx];
  },
};

// ─── Customers API ────────────────────────────────────────────────────────────

export const customersApi = {
  getAll: async (): Promise<ApiResponse<Customer[]>> => {
    await delay(600);
    return { data: [...mockCustomers], total: mockCustomers.length };
  },

  getById: async (id: string): Promise<Customer> => {
    await delay(400);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  },
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delay(700);
    return {
      totalRevenue: 4285,
      totalOrders: 47,
      totalProducts: mockProducts.length,
      totalCustomers: mockCustomers.length,
      revenueChange: 12.5,
      ordersChange: 8.3,
      revenueByMonth: [
        { month: 'Sep', revenue: 420 },
        { month: 'Oct', revenue: 680 },
        { month: 'Nov', revenue: 890 },
        { month: 'Dec', revenue: 1240 },
        { month: 'Jan', revenue: 760 },
        { month: 'Feb', revenue: 295 },
      ],
      topProducts: [
        { product: mockProducts[8], sold: 3 },
        { product: mockProducts[4], sold: 5 },
        { product: mockProducts[0], sold: 7 },
        { product: mockProducts[2], sold: 4 },
      ],
      recentOrders: mockOrders.slice(0, 5),
    };
  },
};
