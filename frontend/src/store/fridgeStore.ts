import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { StockItem, ProductTemplate } from '../types/store';

export { StockItem as FridgeItem }; // Keep backward compatibility for imports where possible

/**
 * @interface StockState
 * ストック・食糧庫の状態を管理するストアの型定義
 */
interface StockState {
  fridgeItems: StockItem[]; // Renamed internally or kept for backward compat? Let's use stockItems and map fridgeItems to it
  stockItems: StockItem[];
  consumedItems: StockItem[];
  isLoading: boolean;
  error: string | null;

  /** ストックのアイテム一覧を取得 */
  fetchFridgeItems: () => Promise<void>; // Kept for compatibility
  fetchStockItems: () => Promise<void>;
  /** アイテムをストックに追加 */
  addToFridge: (templateId: string, customDays?: number, type?: string) => Promise<void>;
  addToStock: (templateId: string, storageLocation: string) => Promise<void>;
  /** ストックのアイテムを消費済みに変更 */
  consumeItem: (id: string) => Promise<void>;
  /** ストックのアイテム情報を更新（削除用など） */
  deleteStockItem: (id: string) => Promise<void>;
  /** ストックのアイテム情報を更新（個別更新） */
  updateStockItem: (id: string, updates: Partial<StockItem>) => Promise<void>;
  /** アイテムテンプレートを更新する */
  updateItemTemplate: (templateId: string, updates: Partial<ProductTemplate>) => Promise<ProductTemplate>;
}

export const useFridgeStore = create<StockState>((set, get) => ({
  fridgeItems: [],
  stockItems: [],
  consumedItems: [],
  isLoading: false,
  error: null,

  fetchFridgeItems: async () => {
    return get().fetchStockItems();
  },

  fetchStockItems: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/lists/${familyId}`);
      set({
        stockItems: data.stock || [],
        fridgeItems: data.stock || [], // map to same data for compat
        consumedItems: data.consumed || [],
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToFridge: async (templateId, customDays, type = 'FRIDGE') => {
    return get().addToStock(templateId, type);
  },

  addToStock: async (templateId, storageLocation) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId || !userId) return;

    try {
      await api.post('/stock-items', {
        familyId,
        addedById: userId,
        templateId,
        storageLocation
      });
      await get().fetchStockItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  consumeItem: async (id) => {
    try {
      await api.put(`/stock-items/${id}/consume`, {});
      await get().fetchStockItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteStockItem: async (id) => {
    try {
      await api.delete(`/stock-items/${id}`);
      await get().fetchStockItems();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateStockItem: async (id, updates) => {
    try {
      await api.put(`/stock-items/${id}`, updates);
      await get().fetchStockItems();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateItemTemplate: async (templateId, updates) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) throw new Error("Family ID is missing");

    try {
      const { data } = await api.put(`/item-templates/${templateId}`, { ...updates, familyId, createdById: userId });
      return data;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
