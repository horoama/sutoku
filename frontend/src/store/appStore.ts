import { create } from 'zustand';
import { api } from '../api/client';
import { User, Family, ActivityLog } from '../types/store';

/**
 * @interface AppState
 * アプリケーション全体のグローバルな状態を管理するストアの型定義
 */
interface AppState {
  user: User | null;
  family: Family | null;
  activityLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;

  members: User[];
  /** ユーザーの初期化処理 */
  initializeUser: () => Promise<void>;
  /** アクティビティログの取得 */
  fetchActivityLogs: () => Promise<void>;
  /** 家族メンバーの取得 */
  fetchFamilyMembers: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  family: null,
  members: [],
  activityLogs: [],
  isLoading: false,
  error: null,

  initializeUser: async () => {
    set({ isLoading: true });
    try {
      // 本来は認証トークンで取得するが、モック的に/setupをコールする
      const { data } = await api.post('/setup-user');
      set({ user: data.user, family: data.family, isLoading: false });
      await get().fetchFamilyMembers();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchFamilyMembers: async () => {
    const familyId = get().family?.id;
    if (!familyId) return;

    try {
      const { data } = await api.get(`/family/${familyId}/members`);
      set({ members: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  fetchActivityLogs: async () => {
    const familyId = get().family?.id;
    if (!familyId) return;

    try {
      const { data } = await api.get(`/family/${familyId}/logs`);
      set({ activityLogs: data });
    } catch (err: any) {
      console.error(err);
    }
  },
}));
