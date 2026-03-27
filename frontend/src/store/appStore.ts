import { create } from 'zustand';
import { api } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  familyId: string | null;
  role: string;
  avatarUrl: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
}

export interface ActivityLog {
  id: string;
  familyId: string;
  userId: string;
  user?: User;
  action: string;
  entity: string;
  amount?: number;
  tags: string;
  createdAt: string;
}

interface AppState {
  user: User | null;
  family: Family | null;
  members: User[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;

  initializeUser: () => Promise<void>;
  fetchFamilyMembers: () => Promise<void>;
  fetchActivityLogs: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  family: null,
  members: [],
  activityLogs: [],
  isLoading: false,
  error: null,

  initializeUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/setup-user');
      set({ user: data.user, family: data.family, isLoading: false });
      get().fetchFamilyMembers();
      get().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message || 'Failed to initialize user', isLoading: false });
    }
  },

  fetchFamilyMembers: async () => {
    const { family } = get();
    if (!family) return;
    try {
      const { data } = await api.get(`/family/${family.id}/members`);
      set({ members: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  fetchActivityLogs: async () => {
    const { family } = get();
    if (!family) return;
    try {
      const { data } = await api.get(`/family/${family.id}/logs`);
      set({ activityLogs: data });
    } catch (err: any) {
      console.error(err);
    }
  }
}));