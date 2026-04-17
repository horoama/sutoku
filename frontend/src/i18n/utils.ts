import { useTranslation } from 'react-i18next';
import { ItemTemplate, Category } from '../types/store';

export const useItemTranslation = () => {
  const { t } = useTranslation();

  const tItem = (itemTemplate: ItemTemplate | any): string => {
    if (!itemTemplate) return '';
    // Use raw name if it's a custom item (isSystem === false)
    if (itemTemplate.isSystem === false) {
      return String(itemTemplate.name);
    }
    // Attempt to find translation, fallback to original name
    const translation = t(`items.${itemTemplate.name}`);
    return typeof translation === 'string' && translation !== `items.${itemTemplate.name}` ? translation : String(itemTemplate.name);
  };

  const tCategory = (category: Category | any): string => {
    if (!category) return '';
    const translation = t(`categories.${category.name}`);
    return typeof translation === 'string' && translation !== `categories.${category.name}` ? translation : String(category.name);
  };

  return { tItem, tCategory };
};
