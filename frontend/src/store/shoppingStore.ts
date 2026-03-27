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
  imageUrl: string;
}

export interface ShoppingItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'SOMEDAY';
  note: string | null;
  status: string;
  itemTemplate: ItemTemplate;
}

interface ShoppingState {
  categories: Category[];
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchShoppingList: () => Promise<void>;
  addToShoppingList: (itemTemplateId: string, priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'SOMEDAY', note?: string) => Promise<void>;
  purchaseItem: (id: string, price?: number) => Promise<void>;
  createItemTemplate: (name: string, categoryId: string, defaultDays: number) => Promise<ItemTemplate | null>;
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
      const { data } = await api.get(`/lists/${familyId}`);
      set({ shoppingList: data.SHOPPING || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToShoppingList: async (itemTemplateId, priority, note) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) return;

    try {
      await api.post('/items', { familyId, userId, itemTemplateId, priority, note, status: 'SHOPPING' });
      get().fetchShoppingList();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createItemTemplate: async (name, categoryId, defaultDays) => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return null;

    try {
      const { data } = await api.post('/item-templates', { name, categoryId, defaultDays, familyId });
      get().fetchCategories();
      return data;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  purchaseItem: async (id, price) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { status: 'FRIDGE', price, userId });
      get().fetchShoppingList();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));