// store間で共通利用される型定義

export interface User {
  id: string;
  name: string;
  email: string;
  familyId: string;
  role: string;
  avatarUrl: string;
}

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
}

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

export interface ItemTemplate {
  id: string;
  name: string;
  categoryId: string;
  defaultDays: number;
  imageUrl: string;
  category?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  items: ItemTemplate[];
}

export interface ShoppingItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  priority: 'TODAY' | 'URGENT' | 'NORMAL' | 'LOW';
  note: string | null;
  status: 'PENDING' | 'BOUGHT' | 'PURCHASED';
  sortOrder?: number;
  itemTemplate: ItemTemplate;
}

export interface FridgeItem {
  id: string;
  familyId: string;
  itemTemplateId: string;
  status: 'ACTIVE' | 'CONSUMED';
  startedAt: string | null;
  endDate: string | null;
  defaultDays: number;
  location?: 'FRIDGE' | 'PANTRY';
  sortOrder?: number;
  itemTemplate: ItemTemplate;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: User;
}
