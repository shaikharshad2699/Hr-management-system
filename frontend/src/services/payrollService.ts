import { apiClient } from './api';
import { PayrollRecord, PayrollSummary } from '@/types/payroll';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const payrollService = {
  getPayrollRecords: async (month?: string, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    
    const response = await apiClient.get<ApiResponse<PayrollRecord[]>>(
      `/payroll?${params.toString()}`
    );
    return response.data.data;
  },

  getPayrollSummary: async (month?: string, year?: number) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    
    const response = await apiClient.get<ApiResponse<PayrollSummary>>(
      `/payroll/summary?${params.toString()}`
    );
    return response.data.data;
  },

  getEmployeePayroll: async (employeeId: string) => {
    const response = await apiClient.get<ApiResponse<PayrollRecord[]>>(
      `/payroll/employee/${employeeId}`
    );
    return response.data.data;
  },

  processPayroll: async (month: string, year: number) => {
    const response = await apiClient.post<ApiResponse<PayrollRecord[]>>(
      '/payroll/process',
      { month, year }
    );
    return response.data.data;
  },

  updatePayrollStatus: async (id: string, status: string, paymentData?: any) => {
    const response = await apiClient.patch<ApiResponse<PayrollRecord>>(
      `/payroll/${id}/status`,
      { status, ...paymentData }
    );
    return response.data.data;
  },
};
