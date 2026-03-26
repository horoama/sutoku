import { create } from 'zustand';
import { api } from '../api/client';
import { useAppStore, User } from './appStore';

export interface ChatMessage {
  id: string;
  familyId: string;
  userId: string;
  text: string;
  createdAt: string;
  user: User;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  fetchMessages: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    const familyId = useAppStore.getState().family?.id;
    if (!familyId) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get(`/chat/${familyId}`);
      set({ messages: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  sendMessage: async (text: string) => {
    const { family, user } = useAppStore.getState();
    if (!family?.id || !user?.id) return;

    try {
      await api.post('/chat', { familyId: family.id, userId: user.id, text });
      get().fetchMessages();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));