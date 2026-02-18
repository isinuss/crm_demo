import { create } from 'zustand';
import type { User } from '@shared/index';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('crm_token'),
  user: (() => {
    try {
      const stored = localStorage.getItem('crm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem('crm_token'),

  setAuth: (token: string, user: User) => {
    localStorage.setItem('crm_token', token);
    localStorage.setItem('crm_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
