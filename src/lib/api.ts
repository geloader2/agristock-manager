// API client for MySQL backend
const API_BASE_URL = 'http://localhost:3001/api';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Categories
  getCategories: () => fetchAPI('/categories'),
  createCategory: (data: { name: string; description?: string }) =>
    fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Suppliers
  getSuppliers: () => fetchAPI('/suppliers'),
  createSupplier: (data: { name: string; phone: string; email?: string; address?: string }) =>
    fetchAPI('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: () => fetchAPI('/products'),
  createProduct: (data: {
    name: string;
    sku: string;
    category_id?: string;
    supplier_id?: string;
    unit: string;
    quantity: number;
    expiration_date?: string;
  }) =>
    fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Stock Movements
  getStockMovements: (type?: 'in' | 'out') =>
    fetchAPI(`/stock-movements${type ? `?type=${type}` : ''}`),
  createStockMovement: (data: {
    product_id: string;
    type: 'in' | 'out';
    quantity: number;
    reason?: string;
    notes?: string;
  }) =>
    fetchAPI('/stock-movements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dashboard
  getDashboardStats: () => fetchAPI('/dashboard/stats'),
  getLowStockItems: () => fetchAPI('/dashboard/low-stock'),
  getRecentActivity: () => fetchAPI('/dashboard/recent-activity'),
};
