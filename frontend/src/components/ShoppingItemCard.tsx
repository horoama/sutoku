import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { ShoppingItem } from '../store/shoppingStore';

/**
 * @interface ShoppingItemCardProps
 * @property {ShoppingItem} item - 表示する買い物アイテムのデータ
 * @property {(item: ShoppingItem) => void} onLongPress - 長押し時のアクション
 * @property {(item: ShoppingItem) => void} onToggleCheck - チェックトグル時のアクション
 */
interface ShoppingItemCardProps {
  item: ShoppingItem;
  onLongPress: (item: ShoppingItem) => void;
  onToggleCheck: (item: ShoppingItem) => void;
}

/**
 * 買い物リストの1アイテムを表示するコンポーネント
 */
export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item, onLongPress, onToggleCheck }) => {
  let iconName: React.ComponentProps<typeof Icon>['name'] = "local-grocery-store";
  let iconColorClass = "text-primary text-2xl";
  let iconBgClass = "bg-primary-fixed";
  let categoryName = "GROCERY";
  let priorityBadge = null;

  if (item.priority === "high") {
    iconName = "eco";
    iconColorClass = "text-tertiary text-2xl";
    iconBgClass = "bg-tertiary-fixed";
    categoryName = "PRODUCE";
    priorityBadge = (
      <View className="px-3 py-0.5 rounded-full bg-tertiary-container">
        <Text className="text-on-tertiary-fixed-variant text-[10px] font-bold tracking-[0.1em] uppercase font-label">{item.priority}</Text>
      </View>
    );
  } else if (item.template.name.toLowerCase().includes("milk") || item.template.name.toLowerCase().includes("egg") || item.template.name.toLowerCase().includes("yogurt")) {
    iconName = "egg";
    categoryName = "DAIRY";
    priorityBadge = (
      <View className="px-3 py-0.5 rounded-full bg-surface-container">
        <Text className="text-on-surface-variant text-[10px] font-bold tracking-[0.1em] uppercase font-label">NORMAL</Text>
      </View>
    );
  }

  const isChecked = item.status === 'checked';

  return (
    <Animated.View
      layout={LinearTransition.springify().damping(16).mass(0.6).stiffness(120)}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="mb-4"
    >
      <TouchableOpacity
        className={`group relative rounded-lg p-5 flex-row items-center gap-4 transition-all active:scale-[0.98] shadow-sm ${isChecked ? 'bg-surface-container-low opacity-60' : 'bg-surface-container-lowest'}`}
        onLongPress={() => onLongPress(item)}
        onPress={() => onLongPress(item)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#191c1a",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.04,
          shadowRadius: 24,
          elevation: 2,
        }}
      >
        <TouchableOpacity onPress={() => onToggleCheck(item)} className="mr-1">
          <Icon name={isChecked ? "check-circle" : "radio-button-unchecked"} size={32} className={isChecked ? "text-primary" : "text-outline-variant"} />
        </TouchableOpacity>

        <View className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBgClass} ${isChecked ? 'opacity-50' : ''}`}>
          <Icon name={iconName} size={24} className={iconColorClass} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className={`font-headline font-bold text-xl ${isChecked ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{item.template.name}</Text>
            {!isChecked && priorityBadge}
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-sm font-semibold text-on-surface-variant font-body">{item.purchaseMemo || "1 unit"}</Text>
            <View className="w-1 h-1 rounded-full bg-outline-variant"></View>
            <Text className="text-xs font-bold text-primary font-label tracking-widest uppercase">{categoryName}</Text>
          </View>
        </View>

        {/* 家族メンバーのアバター（プレースホルダー） */}
        <View className="flex-row -space-x-3">
          <View className="w-8 h-8 rounded-full border-2 border-surface-container-lowest overflow-hidden bg-surface-container">
            <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXxIn9vkOJkM6PINi0yWB5YnNUFN2iUe8ENrb1prTy3CywJnqQgcSyUGjHjGzRKF5FVKQzfrFCxc1LflbtW1H-7Kjz4EyBhEG2Ir5-lzht5fkn07JXndNTHy26vznKGojtw6tQeFBobHuHP3F1c34TDx8ikUeiv0UNeKkxhi38LvSIZJnNAm67ooMtjERCHnxuSF-pUZ6hFXtDrWBbz0-UDBDlJY5EVX6A5Okq8Cx7z4ei6GutfcWV5NTCRCRvrasLGGu_o0ZPcTw" }} className="w-full h-full" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
