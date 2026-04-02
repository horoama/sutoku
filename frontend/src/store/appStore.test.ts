import { useAppStore } from './appStore';
import { api } from '../api/client';

// api client をモック化する
jest.mock('../api/client', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('useAppStore', () => {
  beforeEach(() => {
    // 各テストの前にストアの状態をリセット
    useAppStore.setState({
      user: null,
      family: null,
      members: [],
      activityLogs: [],
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  it('初期状態が正しく設定されていること', () => {
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.family).toBeNull();
    expect(state.members).toEqual([]);
    expect(state.activityLogs).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('initializeUser が成功した場合に状態が更新されること', async () => {
    const mockUser = { id: 'u1', name: 'Test User' };
    const mockFamily = { id: 'f1', name: 'Test Family' };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser, family: mockFamily } });

    // fetchFamilyMembers は別のテストで確認するためモック化してもよいが、今回は実行させる
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockUser] });

    await useAppStore.getState().initializeUser();

    const state = useAppStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.family).toEqual(mockFamily);
    expect(state.error).toBeNull();
  });

  it('initializeUser が失敗した場合にエラーがセットされること', async () => {
    const errorMessage = 'Network Error';
    (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await useAppStore.getState().initializeUser();

    const state = useAppStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.user).toBeNull();
  });
});
