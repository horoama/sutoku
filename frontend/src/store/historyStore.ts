import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { ItemTemplate } from './shoppingStore';

export interface PurchaseHistoryItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  purchasedAt: string;
  price: number | null;
  quantity: number;
  itemTemplate: ItemTemplate;
}

interface HistoryState {
  history: PurchaseHistoryItem[];
  isLoading: boolean;
  error: string | null;

  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  isLoading: false,
  error: null,

  fetchHistory: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/history/${familyId}`);
      set({ history: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));