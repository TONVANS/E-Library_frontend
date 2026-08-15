import { create } from 'zustand';
import { User } from '../types';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<User | null>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nuol_token', token);
      localStorage.setItem('nuol_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nuol_token');
      localStorage.removeItem('nuol_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  fetchProfile: async () => {
    try {
      const res = await api.get('/auth/profile');
      const user = res.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('nuol_user', JSON.stringify(user));
      }
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch {
      get().logout();
      return null;
    }
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nuol_token');
      const userStr = localStorage.getItem('nuol_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, isLoading: false });
          // asynchronously refresh profile
          get().fetchProfile();
          return;
        } catch {
          // ignore parsing error
        }
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
