import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { StockItem, ItemTemplate } from '../types/store';

export { StockItem };

/**
 * @interface StockState
 * 冷蔵庫・食糧庫の状態を管理するストアの型定義
 */
interface StockState {
  stockItems: StockItem[];
  consumedItems: StockItem[];
  isLoading: boolean;
  error: string | null;

  /** 冷蔵庫のアイテム一覧を取得 */
  fetchStockItems: () => Promise<void>;
  /** アイテムを冷蔵庫に追加 */
  addToStock: (itemTemplateId: string, customDays?: number, type?: string, note?: string) => Promise<void>;
  /** 冷蔵庫のアイテムを消費済みに変更 */
  consumeItem: (id: string) => Promise<void>;
  /** 冷蔵庫のアイテム情報を更新 */
  updateStockItem: (id: string, updates: Partial<StockItem>) => Promise<void>;
  /** アイテムテンプレートを更新する */
  updateItemTemplate: (templateId: string, updates: Partial<ItemTemplate>) => Promise<ItemTemplate>;
}

export const useStockStore = create<StockState>((set, get) => ({
  stockItems: [],
  consumedItems: [],
  isLoading: false,
  error: null,

  fetchStockItems: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/lists/${familyId}`);
      set({ stockItems: data.STOCK || [], consumedItems: data.CONSUMED || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addToStock: async (itemTemplateId, customDays, type = 'fridge', note) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId) return;

    try {
      let payload: any = { familyId, userId, itemTemplateId, status: 'ACTIVE', type };

      if (customDays) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + customDays);
        payload.endDate = endDate.toISOString();
      }

      await api.post('/items', payload);
      await get().fetchStockItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  consumeItem: async (id) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { status: 'CONSUMED', userId, type: 'fridge' });
      await get().fetchStockItems();
      useAppStore.getState().fetchActivityLogs();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateStockItem: async (id, updates) => {
    const userId = useAppStore.getState().user?.id;
    try {
      await api.put(`/items/${id}`, { ...updates, userId, type: 'fridge' });
      await get().fetchStockItems();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateItemTemplate: async (templateId, updates) => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) throw new Error("Family ID is missing");

    try {
      const { data } = await api.put(`/item-templates/${templateId}`, { ...updates, familyId });
      return data;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
