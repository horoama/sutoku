// store間で共通利用される型定義

/**
 * ユーザーの型定義
 */
export interface User {
  id: string;
  name: string;
  email: string;
  familyId: string;
  role: string;
  avatarUrl: string;
}

/**
 * 家族（グループ）の型定義
 */
export interface Family {
  id: string;
  name: string;
  inviteCode: string;
}

/**
 * アクティビティログの型定義
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  amount?: number;
  tags: string;
  createdAt: string;
  user?: User;
}

/**
 * アイテムテンプレートの型定義。
 * バックエンドからのオーバーライド適用後のレスポンスに合わせたプロパティを含みます。
 */
export interface ItemTemplate {
  id: string;
  name: string;
  categoryId: string;
  defaultDays: number;
  imageUrl: string;
  isSystem: boolean;
  familyId?: string;
  storageType?: 'FRIDGE' | 'FREEZER' | 'PANTRY';
  isCustomized: boolean;
  defaultNote?: string;
  category?: {
    id: string;
    name: string;
  };
}

/**
 * カテゴリーの型定義。
 * アイテム一覧を含みます。
 */
export interface Category {
  id: string;
  name: string;
  items: ItemTemplate[];
}

/**
 * 買い物リストのアイテムの型定義
 */
export interface ShoppingItem {
  id: string;
  familyId: string;
  itemTemplateId: string | null;
  name: string | null;
  categoryId: string | null;
  customDays: number | null;
  priority: 'TODAY' | 'URGENT' | 'NORMAL' | 'LOW';
  note: string | null;
  status: 'PENDING' | 'BOUGHT' | 'PURCHASED';
  itemTemplate?: ItemTemplate;
}

/**
 * 冷蔵庫・パントリーのアイテムの型定義
 */
export interface FridgeItem {
  id: string;
  familyId: string;
  itemTemplateId: string | null;
  name: string | null;
  categoryId: string | null;
  note: string | null;
  status: 'ACTIVE' | 'CONSUMED';
  startedAt: string | null;
  endDate: string | null;
  defaultDays: number;
  itemTemplate?: ItemTemplate;
}

/**
 * チャットメッセージの型定義
 */
export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: User;
}
