import { request } from './api';
import { User } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: {
      address?: string;
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
  }) => {
    return request<{
      success: boolean;
      message: string;
      token: string;
      user: User;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return request<{
      success: boolean;
      message: string;
      token: string;
      user: User;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  getMe: async () => {
    return request<{ success: boolean; user: User }>('/auth/me');
  },

  updateProfile: async (data: {
    name?: string;
    phone?: string;
    address?: {
      address?: string;
      city?: string;
      state?: string;
      postcode?: string;
      country?: string;
    };
    currentPassword?: string;
    newPassword?: string;
  }) => {
    return request<{
      success: boolean;
      message: string;
      user: User;
    }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
