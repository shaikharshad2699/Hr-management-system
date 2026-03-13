import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim() ?? "https://hr-management-system.onrender.com/api";

if (!rawApiUrl) {
  throw new Error(
    'VITE_API_URL is not configured. Set it in the frontend environment configuration.'
  );
}

const API_BASE_URL = `${rawApiUrl.replace(/\/+$/, '')}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
