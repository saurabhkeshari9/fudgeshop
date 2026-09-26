import { request } from './api';
import { Product, Category, Order, HomepageContent, StoreSettings } from '../types';

export const adminService = {
  // Dashboard Metrics
  getDashboardStats: async () => {
    return request<{
      success: boolean;
      data: {
        metrics: {
          totalRevenue: number;
          totalOrders: number;
          pendingOrders: number;
          processingOrders: number;
          deliveredOrders: number;
          cancelledOrders: number;
          totalProducts: number;
          activeProducts: number;
          lowStockProducts: number;
        };
        recentOrders: Order[];
        topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
      };
    }>('/admin/dashboard/stats');
  },

  // Customers
  getCustomers: async () => {
    return request<{
      success: boolean;
      count: number;
      data: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
        latestOrderStatus: string;
      }[];
    }>('/admin/customers');
  },

  // Products
  getProducts: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{
      success: boolean;
      total: number;
      page: number;
      totalPages: number;
      data: Product[];
    }>(`/products/admin/all${qs}`);
  },

  getProductById: async (id: string) => {
    return request<{ success: boolean; data: Product }>(`/products/admin/${id}`);
  },

  createProduct: async (productData: Partial<Product>) => {
    return request<{ success: boolean; message: string; data: Product }>('/products/admin', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id: string, productData: Partial<Product>) => {
    return request<{ success: boolean; message: string; data: Product }>(`/products/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/products/admin/${id}`, {
      method: 'DELETE',
    });
  },

  toggleProductStatus: async (id: string) => {
    return request<{ success: boolean; message: string; data: Product }>(
      `/products/admin/${id}/toggle-status`,
      { method: 'PATCH' }
    );
  },

  // Categories
  getCategories: async () => {
    return request<{ success: boolean; data: Category[] }>('/categories/admin/all');
  },

  createCategory: async (categoryData: Partial<Category>) => {
    return request<{ success: boolean; message: string; data: Category }>('/categories/admin', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    return request<{ success: boolean; message: string; data: Category }>(`/categories/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/categories/admin/${id}`, {
      method: 'DELETE',
    });
  },

  // Orders
  getOrders: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{
      success: boolean;
      total: number;
      page: number;
      totalPages: number;
      data: Order[];
    }>(`/orders/admin/all${qs}`);
  },

  getOrderById: async (id: string) => {
    return request<{ success: boolean; data: Order }>(`/orders/admin/${id}`);
  },

  updateOrderStatus: async (id: string, status: string, note?: string) => {
    return request<{ success: boolean; message: string; data: Order }>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  // Homepage & Settings
  updateHomepageContent: async (content: Partial<HomepageContent>) => {
    return request<{ success: boolean; message: string; data: HomepageContent }>('/homepage/admin', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  },

  updateStoreSettings: async (settings: Partial<StoreSettings>) => {
    return request<{ success: boolean; message: string; data: StoreSettings }>('/settings/admin', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
