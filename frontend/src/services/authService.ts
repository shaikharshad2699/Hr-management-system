import { apiClient } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/auth/register', {
      ...data,
      email: data.email.trim().toLowerCase(),
    });
    return response.data;
  },
};
