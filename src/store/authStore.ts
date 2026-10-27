import { create } from 'zustand';
import { User } from '../types';
import api from '../lib/axios';
import { AUTH_COOKIE } from '../lib/api-config';

// Mirror the token into a cookie so src/proxy.ts can guard pages on the server (matches the 7d JWT expiry)
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

function setTokenCookie(token: string | null) {
  document.cookie = token
    ? `${AUTH_COOKIE}=${token}; path=/; max-age=${TOKEN_MAX_AGE}; samesite=lax`
    : `${AUTH_COOKIE}=; path=/; max-age=0`;
}

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
      setTokenCookie(token);
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nuol_token');
      localStorage.removeItem('nuol_user');
      setTokenCookie(null);
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
          // Sessions created before the cookie existed only have localStorage
          setTokenCookie(token);
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
