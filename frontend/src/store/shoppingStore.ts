import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { useStockStore } from './stockStore';
import { Category, ShoppingItem, ItemTemplate } from '../types/store';

export { Category, ShoppingItem, ItemTemplate };

/**
 * @interface ShoppingState
 * 買い物リストに関する状態を管理するストアの型定義
 */
interface ShoppingState {
  categories: Category[];
  shoppingList: ShoppingItem[];
  isLoading: boolean;
  error: string | null;

  /** カテゴリーとアイテム一覧を取得 */
  fetchCategories: () => Promise<void>;
  /** 買い物リストのアイテム一覧を取得 */
  fetchShoppingList: () => Promise<void>;
  /** 買い物リストに新しいアイテムを追加 */
  addToShoppingList: (itemTemplateId: string, priority: 'TODAY' | 'URGENT' | 'NORMAL' | 'LOW', note?: string, type?: string) => Promise<void>;
  /** 買い物アイテムを購入済みに変更し、必要に応じて冷蔵庫に移動 */
  purchaseItem: (id: string, price?: number, endDate?: string) => Promise<void>;
  /** 買い物アイテムのチェック状態を切り替える */
  toggleBoughtStatus: (id: string, isBought: boolean) => Promise<void>;
  /** 新しいカスタムアイテムテンプレートを作成 */
  createItemTemplate: (name: string, categoryId: string, defaultDays: number) => Promise<ItemTemplate | null>;
  /** 買い物アイテムの優先度を変更する */
  updateItemPriority: (id: string, priority: string) => Promise<void>;
  /** 買い物アイテムを削除する */
  deleteItem: (id: string) => Promise<void>;
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

  addToShoppingList: async (itemTemplateId, priority, note, type = 'shopping') => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) return;

    try {
      await api.post('/items', { familyId, userId, itemTemplateId, priority, note, type });
      await get().fetchShoppingList();
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
      await get().fetchCategories();
      return data;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  toggleBoughtStatus: async (id, isBought) => {
    const userId = useAppStore.getState().user?.id;
    const status = isBought ? 'BOUGHT' : 'PENDING';
    try {
      await api.put(`/items/${id}`, { status, userId, type: 'shopping' });
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  purchaseItem: async (id, price, endDate) => {
    const userId = useAppStore.getState().user?.id;
    try {
      // Send to fridge by marking as 'PURCHASED'
      const payload: any = { status: 'PURCHASED', price, userId, type: 'shopping' };
      if (endDate) {
        payload.endDate = endDate;
      }
      await api.put(`/items/${id}`, payload);
      await Promise.all([
        get().fetchShoppingList(),
        useStockStore.getState().fetchStockItems(),
        useAppStore.getState().fetchActivityLogs()
      ]);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateItemPriority: async (id, priority) => {
    try {
      await api.put(`/items/${id}`, { priority, type: 'shopping' });
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteItem: async (id) => {
    try {
      await api.delete(`/items/${id}`);
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
