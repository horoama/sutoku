import { useShoppingStore } from './shoppingStore';
import { useAppStore } from './appStore';
import { api } from '../api/client';

jest.mock('../api/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

describe('useShoppingStore', () => {
  beforeEach(() => {
    useShoppingStore.setState({
      categories: [],
      shoppingList: [],
      isLoading: false,
      error: null,
    });

    // アプリストアのモック状態をセット
    useAppStore.setState({
      user: { id: 'user-1', name: 'Test User' } as any,
      family: { id: 'family-1', name: 'Test Family' } as any,
      activityLogs: [],
      isLoading: false,
      error: null,
      members: [],
    });

    jest.clearAllMocks();
  });

  it('fetchCategories が成功した場合に categories がセットされること', async () => {
    const mockCategories = [{ id: 'c1', name: 'Dairy', items: [] }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategories });

    await useShoppingStore.getState().fetchCategories();

    const state = useShoppingStore.getState();
    expect(state.categories).toEqual(mockCategories);
    expect(state.error).toBeNull();
  });

  it('fetchCategories が失敗した場合に error がセットされること（異常系）', async () => {
    const errorMessage = 'Network Error';
    (api.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await useShoppingStore.getState().fetchCategories();

    const state = useShoppingStore.getState();
    expect(state.categories).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });

  it('addToShoppingList が成功した場合にフェッチ関数が呼ばれること', async () => {
    // addToShoppingList は内部で api.post を呼んだ後、fetchShoppingList 等を呼ぶ仕様
    useShoppingStore.setState({ shoppingList: [] });

    (api.post as jest.Mock).mockResolvedValueOnce({});
    // 内部で呼ばれる fetchShoppingList のためのモック
    const mockList = [{ id: 's1', itemTemplateId: 't1', status: 'PENDING' }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { SHOPPING: mockList } });
    // activity logs 用のモック
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    await useShoppingStore.getState().addToShoppingList('t1', 'NORMAL', 'test note', 'shopping');

    expect(api.post).toHaveBeenCalled();
    expect(useShoppingStore.getState().error).toBeNull();
  });

  it('addToShoppingList が失敗した場合に error がセットされること（異常系）', async () => {
    const errorMessage = 'Internal Server Error';
    (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await useShoppingStore.getState().addToShoppingList('t1', 'NORMAL');

    const state = useShoppingStore.getState();
    expect(state.shoppingList).toEqual([]);
    expect(state.error).toBe(errorMessage);
  });

  it('familyId が存在しない場合、addToShoppingList は何もせず早期リターンすること（異常系）', async () => {
    useAppStore.setState({ family: null });

    await useShoppingStore.getState().addToShoppingList('t1', 'NORMAL');

    const state = useShoppingStore.getState();
    expect(state.shoppingList).toEqual([]);
    expect(api.post).not.toHaveBeenCalled();
  });
});
