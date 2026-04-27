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

export interface ProductTemplate {
  id: string;
  familyId: string | null;
  createdById: string | null;
  sourceTemplateId: string | null;
  name: string;
  defaultExpiryDays: number;
  defaultStorageLocation: string;
  memo: string;
  imageUrl: string;
  categoryId: string;
  isSystem?: boolean; // System if familyId is null
  category?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  items: ProductTemplate[];
}

export interface ShoppingListItem {
  id: string;
  familyId: string;
  templateId: string;
  addedById: string;
  priority: 'high' | 'medium' | 'low';
  purchaseMemo: string;
  storeHint: string;
  status: 'pending' | 'checked' | 'moved';
  checkedAt: string | null;
  template: ProductTemplate;
  addedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface StockItem {
  id: string;
  familyId: string;
  templateId: string;
  shoppingItemId: string | null;
  addedById: string;
  storageLocation: string;
  expiryDate: string | null;
  consumedAt: string | null;
  template: ProductTemplate;
  addedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: User;
}
