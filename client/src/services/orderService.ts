import { request } from './api';
import { Order } from '../types';

export const orderService = {
  createOrder: async (orderData: {
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      address: string;
      city: string;
      state: string;
      postcode: string;
      country?: string;
    };
    items: {
      productId: string;
      quantity: number;
    }[];
    shippingMethod?: 'standard' | 'express';
    paymentMethod?: string;
    notes?: string;
  }) => {
    return request<{
      success: boolean;
      message: string;
      data: Order;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getOrderById: async (id: string) => {
    return request<{ success: boolean; data: Order }>(`/orders/lookup/${id}`);
  },

  getMyOrders: async () => {
    return request<{ success: boolean; total: number; data: Order[] }>('/orders/my-orders');
  },

  getMyOrderById: async (id: string) => {
    return request<{ success: boolean; data: Order }>(`/orders/my-orders/${id}`);
  },
};
