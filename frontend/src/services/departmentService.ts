import { apiClient } from './api';
import { Department } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const departmentService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data.data;
  },

  create: async (department: Omit<Department, 'id' | 'createdAt' | 'employeeCount'>) => {
    const response = await apiClient.post<ApiResponse<Department>>('/departments', department);
    return response.data.data;
  },

  update: async (id: string, department: Partial<Department>) => {
    const response = await apiClient.put<ApiResponse<Department>>(`/departments/${id}`, department);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/departments/${id}`);
  },
};
