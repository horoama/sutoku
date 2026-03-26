import { create } from 'zustand';
import { api } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  familyId: string | null;
}

export interface Family {
  id: string;
  name: string;
}

interface AppState {
  user: User | null;
  family: Family | null;
  isLoading: boolean;
  error: string | null;

  initializeUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  family: null,
  isLoading: false,
  error: null,

  initializeUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/setup-user');
      set({ user: data.user, family: data.family, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to initialize user', isLoading: false });
    }
  },
}));