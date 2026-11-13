import axios from 'axios';
import { Category, Medicine, Order } from '../../../types.ts';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const medicineApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },
  getMedicines: async (params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    sort?: string;
  }): Promise<Medicine[]> => {
    const response = await api.get<{ success: boolean; data: Medicine[] }>('/medicines', { params });
    return response.data.data;
  },
  getMedicineById: async (id: string): Promise<Medicine> => {
    const response = await api.get<{ success: boolean; data: Medicine }>(`/medicines/${id}`);
    return response.data.data;
  },
};

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  items: { medicine_id: string; quantity: number }[];
}

export const orderApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<{ success: boolean; data: Order }>('/orders', payload);
    return response.data.data;
  },
  trackOrder: async (reference: string, email: string): Promise<Order> => {
    const response = await api.get<{ success: boolean; data: Order }>('/orders/track', {
      params: { reference, email },
    });
    return response.data.data;
  },
};
