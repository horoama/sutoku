import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore } from './appStore';
import { ChatMessage } from '../types/store';

/**
 * @interface ChatState
 * チャット状態を管理するストアの型定義
 */
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  /** チャットメッセージ一覧を取得 */
  fetchMessages: () => Promise<void>;
  /** 新しいチャットメッセージを送信 */
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    try {
      const { data } = await api.get(`/chat/${familyId}`);
      set({ messages: data });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  sendMessage: async (text) => {
    const familyId = useAppStore.getState().family?.id;
    const userId = useAppStore.getState().user?.id;
    if (!familyId || !userId) return;

    try {
      await api.post(`/chat`, { familyId, userId, text });
      await get().fetchMessages();
    } catch (err: any) {
      set({ error: err.message });
    }
  }
}));
