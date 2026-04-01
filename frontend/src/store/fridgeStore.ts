import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { ItemTemplate } from './shoppingStore';

export interface FridgeItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  status: 'ACTIVE' | 'CONSUMED';
  startedAt: string | null;
  endDate: string | null;
  defaultDays: number;
  itemTemplate: ItemTemplate;
}

interface FridgeState {
  fridgeItems: FridgeItem[];
  consumedItems: FridgeItem[];
  isLoading: boolean;
  error: string | null;

  fetchFridgeItems: () => Promise<void>;
  addToFridge: (itemTemplateId: string, type?: string, priority?: string, note?: string, endDate?: string) => Promise<void>;
  consumeItem: (id: string) => Promise<void>;
  updateFridgeItem: (id: string, updates: { endDate?: string }) => Promise<void>;
}

export const useFridgeStore = create<FridgeState>((set, get) => ({
  fridgeItems: [],
  consumedItems: [],
  isLoading: false,
  error: null,

  fetchFridgeItems: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/lists/${familyId}`);
      set({ fridgeItems: data.FRIDGE || [], consumedItems: data.CONSUMED || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToFridge: async (itemTemplateId, type = 'fridge', priority = 'NORMAL', note = '', endDate) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) return;

    try {
      const payload: any = { familyId, userId, itemTemplateId, status: 'ACTIVE', type };
      if (endDate) {
        payload.endDate = endDate;
      }
      await api.post('/items', payload);
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  consumeItem: async (id) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { status: 'CONSUMED', userId, type: 'fridge' });
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateFridgeItem: async (id, updates) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { ...updates, userId, type: 'fridge' });
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));