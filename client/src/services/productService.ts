import { request } from './api';
import { Product, Category, HomepageContent, StoreSettings } from '../types';

export const productService = {
  getProducts: async (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{
      success: boolean;
      total: number;
      page: number;
      totalPages: number;
      data: Product[];
    }>(`/products${queryString}`);
  },

  getProductBySlug: async (slug: string) => {
    return request<{
      success: boolean;
      data: Product;
      related: Product[];
    }>(`/products/slug/${slug}`);
  },

  getFeaturedProducts: async () => {
    return request<{ success: boolean; data: Product[] }>('/products/featured');
  },

  getBestsellers: async () => {
    return request<{ success: boolean; data: Product[] }>('/products/bestsellers');
  },

  getCategories: async () => {
    return request<{ success: boolean; data: Category[] }>('/categories');
  },

  getHomepageContent: async () => {
    return request<{ success: boolean; data: HomepageContent }>('/homepage');
  },

  getStoreSettings: async () => {
    return request<{ success: boolean; data: StoreSettings }>('/settings');
  },
};
