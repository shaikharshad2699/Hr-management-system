import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

const rawApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim();

const isLocalHostname = (hostname: string) =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

const resolveApiBaseUrl = () => {
  if (rawApiUrl) {
    return rawApiUrl.replace(/\/+$/, '');
  }

  if (typeof window === 'undefined') {
    throw new Error(
      'API base URL is not configured. Set VITE_API_URL in the frontend environment configuration.'
    );
  }

  if (isLocalHostname(window.location.hostname)) {
    return 'http://localhost:5000/api';
  }

  return `${window.location.origin.replace(/\/+$/, '')}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

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
