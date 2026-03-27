import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { ItemTemplate } from './shoppingStore';

export interface FridgeItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  location: 'FRIDGE' | 'PANTRY';
  expirationDate: string;
  itemTemplate: ItemTemplate;
}

interface FridgeState {
  fridgeItems: FridgeItem[];
  isLoading: boolean;
  error: string | null;

  fetchFridgeItems: () => Promise<void>;
  addToFridge: (itemTemplateId: string, location: 'FRIDGE' | 'PANTRY', priority: string, note?: string) => Promise<void>;
  consumeItem: (id: string, quantity: number) => Promise<void>;
  updateFridgeItem: (id: string, updates: { priority?: string, expirationDate?: string, note?: string }) => Promise<void>;
}

export const useFridgeStore = create<FridgeState>((set, get) => ({
  fridgeItems: [],
  isLoading: false,
  error: null,

  fetchFridgeItems: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/lists/${familyId}`);
      set({ fridgeItems: data.FRIDGE || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToFridge: async (itemTemplateId, location, priority, note) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) return;

    try {
      await api.post('/items', { familyId, userId, itemTemplateId, priority, note, status: 'FRIDGE', location });
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  consumeItem: async (id, quantity) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { status: 'CONSUMED', quantity, userId });
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateFridgeItem: async (id, updates) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { ...updates, userId });
      get().fetchFridgeItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));