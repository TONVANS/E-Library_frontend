import axios from 'axios';
import { API_BASE_URL, AUTH_COOKIE, BASE_PATH } from './api-config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nuol_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Don't auto-redirect if we are already on the login page
      if (!window.location.pathname.startsWith(`${BASE_PATH}/login`)) {
        localStorage.removeItem('nuol_token');
        localStorage.removeItem('nuol_user');
        document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
