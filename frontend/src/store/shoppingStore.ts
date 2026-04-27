import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { useFridgeStore } from './fridgeStore';
import { Category, ShoppingListItem, ProductTemplate } from '../types/store';

export { Category, ProductTemplate };
export { ShoppingListItem as ShoppingItem }; // backward compatibility

/**
 * @interface ShoppingState
 * 買い物リストに関する状態を管理するストアの型定義
 */
interface ShoppingState {
  categories: Category[];
  shoppingList: ShoppingListItem[];
  isLoading: boolean;
  error: string | null;

  /** カテゴリーとアイテム一覧を取得 */
  fetchCategories: () => Promise<void>;
  /** 買い物リストのアイテム一覧を取得 */
  fetchShoppingList: () => Promise<void>;
  /** 買い物リストに新しいアイテムを追加 */
  addToShoppingList: (templateId: string, priority: 'high' | 'medium' | 'low', purchaseMemo?: string, storeHint?: string) => Promise<void>;
  /** 買い物アイテムのステータスを更新する（チェックなど） */
  updateItemStatus: (id: string, status: 'pending' | 'checked') => Promise<void>;
  /** 買い物アイテムをストックへ移動する */
  moveToStock: (id: string) => Promise<void>;
  /** 新しいカスタムアイテムテンプレートを作成 */
  createItemTemplate: (name: string, categoryId: string, defaultExpiryDays: number, defaultStorageLocation: string, memo?: string) => Promise<ProductTemplate | null>;
  /** 買い物アイテムの優先度を変更する */
  updateItemPriority: (id: string, priority: string) => Promise<void>;
  /** 買い物アイテムを削除する */
  deleteItem: (id: string) => Promise<void>;

  // Legacy stubs for compatibility
  toggleBoughtStatus: (id: string, isBought: boolean) => Promise<void>;
  purchaseItem: (id: string, price?: number, endDate?: string) => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  categories: [],
  shoppingList: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    try {
      const { data } = await api.get(`/items?familyId=${familyId}`);
      set({ categories: data || [] });
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
      set({ shoppingList: data.shopping || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToShoppingList: async (templateId, priority, purchaseMemo = '', storeHint = '') => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId || !userId) return;

    try {
      await api.post('/shopping-items', { familyId, addedById: userId, templateId, priority, purchaseMemo, storeHint });
      await get().fetchShoppingList();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createItemTemplate: async (name, categoryId, defaultExpiryDays, defaultStorageLocation, memo = '') => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId || !userId) return null;

    try {
      const { data } = await api.post('/item-templates', { name, categoryId, defaultExpiryDays, defaultStorageLocation, memo, familyId, createdById: userId });
      await get().fetchCategories();
      return data;
    } catch (err: any) {
      set({ error: err.message });
      return null;
    }
  },

  updateItemStatus: async (id, status) => {
    try {
      await api.put(`/shopping-items/${id}/status`, { status });
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  moveToStock: async (id) => {
    const userId = useAppStore.getState().user?.id;
    if (!userId) return;

    try {
      await api.post(`/shopping-items/${id}/move`, { addedById: userId });
      await Promise.all([
        get().fetchShoppingList(),
        useFridgeStore.getState().fetchStockItems(),
        useAppStore.getState().fetchActivityLogs()
      ]);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateItemPriority: async (id, priority) => {
    try {
      await api.put(`/shopping-items/${id}`, { priority });
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteItem: async (id) => {
    try {
      await api.delete(`/shopping-items/${id}`);
      await get().fetchShoppingList();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // Legacy mappings
  toggleBoughtStatus: async (id, isBought) => {
    return get().updateItemStatus(id, isBought ? 'checked' : 'pending');
  },

  purchaseItem: async (id, price, endDate) => {
    return get().moveToStock(id);
  }
}));
