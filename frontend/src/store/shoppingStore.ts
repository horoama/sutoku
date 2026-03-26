import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';

export interface Category {
  id: string;
  name: string;
  items: ItemTemplate[];
}

export interface ItemTemplate {
  id: string;
  name: string;
  categoryId: string;
  defaultDays: number;
}

export interface ShoppingItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  priority: 'TODAY' | 'SOMEDAY';
  note: string | null;
  isPurchased: boolean;
  itemTemplate: ItemTemplate;
}

interface ShoppingState {
  categories: Category[];
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchShoppingList: () => Promise<void>;
  addToShoppingList: (itemTemplateId: string, priority: 'TODAY' | 'SOMEDAY', note?: string) => Promise<void>;
  purchaseItem: (id: string) => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  categories: [],
  shoppingList: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    try {
      const { data } = await api.get('/items');
      set({ categories: data });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchShoppingList: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/shopping/${familyId}`);
      set({ shoppingList: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToShoppingList: async (itemTemplateId, priority, note) => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    try {
      await api.post('/shopping', { familyId, itemTemplateId, priority, note });
      get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  purchaseItem: async (id) => {
    try {
      await api.post(`/shopping/${id}/purchase`);
      get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));