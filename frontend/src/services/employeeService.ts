import { apiClient } from './api';
import { Employee } from '@/types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const employeeService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Employee[]>>('/employees');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
    return response.data.data;
  },

  create: async (employee: Omit<Employee, 'id'>) => {
    const response = await apiClient.post<ApiResponse<Employee>>('/employees', employee);
    return response.data.data;
  },

  update: async (id: string, employee: Partial<Employee>) => {
    const response = await apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, employee);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/employees/${id}`);
  },
};
