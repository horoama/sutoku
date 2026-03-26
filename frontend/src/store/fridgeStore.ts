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
  addedAt: string;
  itemTemplate: ItemTemplate;
}

interface FridgeState {
  fridgeItems: FridgeItem[];
  isLoading: boolean;
  error: string | null;

  fetchFridgeItems: () => Promise<void>;
}

export const useFridgeStore = create<FridgeState>((set) => ({
  fridgeItems: [],
  isLoading: false,
  error: null,

  fetchFridgeItems: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/fridge/${familyId}`);
      set({ fridgeItems: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));