import React, { useEffect, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFridgeStore, FridgeItem } from "../store/fridgeStore";
import { useShoppingStore } from "../store/shoppingStore";
import { useAppStore } from "../store/appStore";
import { differenceInCalendarDays } from "date-fns";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function FridgeScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const { family } = useAppStore();
  const { fridgeItems, fetchFridgeItems, consumeItem } = useFridgeStore();

  useEffect(() => {
    if (family?.id) {
      fetchFridgeItems();
    }
  }, [family?.id]);

  const activeItems = fridgeItems.filter(item => item.status === "ACTIVE");

  // Calculate expiration logic
  const getDaysLeft = (item: FridgeItem) => {
    if (!item.startedAt) return Number(item.defaultDays);

    // If we have an exact endDate, use it
    if (item.endDate) {
      return differenceInCalendarDays(new Date(item.endDate), new Date());
    }

    // Otherwise calculate based on startedAt + defaultDays
    const startDate = new Date(item.startedAt);
    const endDate = new Date(startDate.setDate(startDate.getDate() + Number(item.defaultDays)));
    return differenceInCalendarDays(endDate, new Date());
  };

  const expiringItems = activeItems.filter(item => getDaysLeft(item) <= 3).sort((a, b) => getDaysLeft(a) - getDaysLeft(b));

  // Group items by itemTemplateId (or name for custom items)
  const groupedItems = useMemo(() => {
    const map = new Map<string, FridgeItem[]>();
    activeItems.forEach(item => {
      const key = item.itemTemplateId || item.name || `custom_${item.id}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    });
    return Array.from(map.values()).map(group => {
      // Sort group so item with shortest days left is first
      group.sort((a, b) => getDaysLeft(a) - getDaysLeft(b));
      return group;
    });
  }, [activeItems]);

  // Default Days criteria for fridge vs pantry:
  const fridgeGrouped = groupedItems.filter(group => {
    const representative = group[0];
    const storageType = representative.itemTemplate?.storageType;
    if (storageType) return storageType === 'FRIDGE';

    const catName = (representative.itemTemplate as any)?.category?.name?.toLowerCase() || "";
    if (catName.includes("dairy") || catName.includes("meat") || catName.includes("produce")) return true;
    return representative.defaultDays < 30;
  });

  const freezerGrouped = groupedItems.filter(group => {
    return group[0].itemTemplate?.storageType === 'FREEZER';
  });

  const pantryGrouped = groupedItems.filter(group => {
    const representative = group[0];
    if (representative.itemTemplate?.storageType) {
      return representative.itemTemplate.storageType === 'PANTRY';
    }
    // Fallback if no storage type
    return !fridgeGrouped.includes(group) && !freezerGrouped.includes(group);
  });

  const renderUrgentItem = (item: FridgeItem, index: number) => {
    const daysLeft = getDaysLeft(item);
    const isCritical = daysLeft <= 1;
    const totalDays = item.defaultDays || 7;
    const progressPercent = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));

    if (index === 0) {
      return (
        <View key={item.id} className="relative overflow-hidden bg-primary p-4 rounded-lg text-on-primary shadow-lg flex-col mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="font-headline text-xl font-bold text-on-primary" numberOfLines={1}>{item.itemTemplate?.name || item.name || 'Unknown Item'}</Text>
            </View>
            <View className="bg-tertiary-container px-2 py-1 rounded-full flex-row items-center gap-1">
              <Icon name="timer" size={12} className="text-on-tertiary-container" />
              <Text className="text-on-tertiary-container text-[10px] font-bold">
                {daysLeft < 0 ? `期限切れ(${Math.abs(daysLeft)}日前)` : daysLeft === 0 ? "今日" : `あと${daysLeft}日`}
              </Text>
            </View>
          </View>
          <View className="gap-y-1">
            <View className="flex-row justify-between">
              <Text className="text-[10px] font-bold tracking-wider text-on-primary">FRESHNESS LEVEL</Text>
              <Text className="text-[10px] font-bold tracking-wider text-on-primary">{Math.round(progressPercent)}%</Text>
            </View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View className="h-full bg-secondary-container rounded-full" style={{ width: `${progressPercent}%` }}></View>
            </View>
          </View>
          <Icon name="restaurant" size={60} className="absolute -bottom-4 -right-4 opacity-10 text-on-primary" style={{ transform: [{ rotate: "12deg" }] }} />
        </View>
      );
    }

    return (
      <View key={item.id} className="bg-surface-container-lowest p-5 rounded-lg border-l-8 border-tertiary flex-row items-center gap-4 mb-4 shadow-sm">
        <View className="w-16 h-16 rounded-2xl bg-surface-container-low overflow-hidden flex-shrink-0 flex items-center justify-center">
           <Icon name="kitchen" size={32} className="text-tertiary" />
        </View>
        <View className="flex-1">
          <Text className="font-headline font-bold text-on-surface text-base" numberOfLines={1}>{item.itemTemplate?.name || item.name || 'Unknown Item'}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="h-1.5 w-20 bg-surface-container-high rounded-full overflow-hidden shrink">
              <View className="h-full bg-tertiary rounded-full" style={{ width: `${progressPercent}%` }}></View>
            </View>
            <Text className="text-xs font-bold text-tertiary">
              {daysLeft < 0 ? `期限切れ(${Math.abs(daysLeft)}日前)` : daysLeft === 0 ? "今日" : `あと${daysLeft}日`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-secondary px-3 py-1.5 rounded-full active:scale-95 transition-transform ml-2"
          onPress={(e) => {
            e.stopPropagation();
            handleConsumePantryItem(item);
          }}
        >
          <Text className="text-on-secondary text-[10px] font-bold uppercase">Consume</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleConsumePantryItem = async (item: FridgeItem) => {
    try {
      // Consume item from pantry
      await consumeItem(item.id);
    } catch (error) {
      console.error("Failed to consume item:", error);
    }
  };

  const handleGroupPress = (group: FridgeItem[]) => {
    if (group.length === 1) {
      navigation.navigate("ItemDetails", { itemId: group[0].id });
    } else {
      const groupName = group[0].itemTemplate?.name || group[0].name || 'Unknown Item';
      navigation.navigate("ItemSelection", { items: group, groupName });
    }
  };

  const renderFridgeItem = (group: FridgeItem[]) => {
    const item = group[0];
    const daysLeft = getDaysLeft(item);
    return (
      <TouchableOpacity
        key={item.id}
        className="bg-surface-container-low p-4 rounded-lg flex-row items-center justify-between group mb-3"
        onPress={() => handleGroupPress(group)}
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 relative">
            <Icon name="kitchen" size={24} className="text-primary" />
            {group.length > 1 && (
              <View className="absolute -top-1 -right-1 bg-tertiary rounded-full w-5 h-5 items-center justify-center border-2 border-surface-container-low">
                 <Text className="text-on-tertiary text-[9px] font-bold">{group.length}</Text>
              </View>
            )}
          </View>
          <View className="flex-1 pr-2">
            <Text className="font-headline font-semibold text-on-surface text-base" numberOfLines={1}>{item.itemTemplate?.name || item.name || 'Unknown Item'}</Text>
            <Text className="text-xs text-outline font-medium">Added recently</Text>
          </View>
        </View>
        <View className="items-end gap-1 shrink-0 ml-auto">
          <Text className="font-headline font-bold text-primary text-base">
            {daysLeft < 0 ? `期限切れ(${Math.abs(daysLeft)}日前)` : daysLeft === 0 ? "今日" : `あと${daysLeft}日`}
          </Text>
          <TouchableOpacity
            className="bg-secondary px-3 py-1.5 rounded-full active:scale-95 transition-transform"
            onPress={(e) => {
              e.stopPropagation();
              handleConsumePantryItem(item);
            }}
          >
            <Text className="text-on-secondary text-[10px] font-bold uppercase">Consume</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPantryCard = (group: FridgeItem[]) => {
    const item = group[0];
    return (
      <TouchableOpacity
        key={item.id}
        className="w-40 bg-surface-container-lowest p-5 rounded-lg shadow-sm mr-4 relative"
        onPress={() => handleGroupPress(group)}
      >
        {group.length > 1 && (
          <View className="absolute top-3 right-3 bg-tertiary rounded-full w-6 h-6 items-center justify-center z-10 border-2 border-surface-container-lowest">
             <Text className="text-on-tertiary text-[10px] font-bold">{group.length}</Text>
          </View>
        )}
        <View className="w-full aspect-square bg-surface-container-low rounded-2xl overflow-hidden mb-4 items-center justify-center">
          <Icon name="inventory-2" size={48} className="text-secondary" />
        </View>
        <View className="mb-2">
          <Text className="font-headline font-bold text-sm text-on-surface" numberOfLines={1}>{item.itemTemplate?.name || item.name || 'Unknown Item'}</Text>
          <Text className="text-xs text-outline font-medium">In stock</Text>
        </View>
        <View className="flex-col gap-2 mt-2">
          <View className="bg-primary-fixed px-2 py-0.5 rounded-full self-start">
            <Text className="text-[10px] font-bold text-primary-container">STABLE</Text>
          </View>
          <TouchableOpacity
            className="bg-secondary px-3 py-2 rounded-full active:scale-95 transition-transform w-full items-center justify-center"
            onPress={(e) => {
              e.stopPropagation();
              handleConsumePantryItem(item);
            }}
          >
            <Text className="text-on-secondary text-[10px] font-bold uppercase tracking-widest">Consume</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-surface text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <Icon name="restaurant-menu" size={24} className="text-primary" />
          <Text className="font-headline font-extrabold tracking-tight text-2xl text-primary italic">The Living Larder</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="active:scale-95 transition-transform">
            <Icon name="search" size={24} className="text-slate-500" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-fixed overflow-hidden">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXxIn9vkOJkM6PINi0yWB5YnNUFN2iUe8ENrb1prTy3CywJnqQgcSyUGjHjGzRKF5FVKQzfrFCxc1LflbtW1H-7Kjz4EyBhEG2Ir5-lzht5fkn07JXndNTHy26vznKGojtw6tQeFBobHuHP3F1c34TDx8ikUeiv0UNeKkxhi38LvSIZJnNAm67ooMtjERCHnxuSF-pUZ6hFXtDrWBbz0-UDBDlJY5EVX6A5Okq8Cx7z4ei6GutfcWV5NTCRCRvrasLGGu_o0ZPcTw" }}
              className="w-full h-full"
            />
          </View>
        </View>
      </View>

      <ScrollView className="pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 gap-y-10">
          {/* Expiring Soon Hero Section */}
          <View>
            <View className="flex-col gap-1 mb-6">
              <Text className="font-label text-xs font-semibold uppercase tracking-widest text-secondary">Eat Me First</Text>
              <Text className="font-headline text-3xl font-bold tracking-tight text-primary">Expiring Soon</Text>
            </View>

            {expiringItems.length > 0 ? (
              <View>
                {expiringItems.map((item, index) => renderUrgentItem(item, index))}
              </View>
            ) : (
              <Text className="text-on-surface-variant font-body">期限切れが近いアイテムはありません</Text>
            )}
          </View>

          {/* The Fridge Bento */}
          <View className="mt-10">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="font-headline text-3xl font-bold tracking-tight text-primary">The Fridge</Text>
              <Text className="text-sm font-bold text-outline uppercase tracking-tighter">{fridgeGrouped.length} Items</Text>
            </View>
            <View>
              {fridgeGrouped.length > 0 ? (
                fridgeGrouped.map(renderFridgeItem)
              ) : (
                <Text className="text-on-surface-variant font-body">冷蔵庫は空です</Text>
              )}
            </View>
          </View>

          {/* The Pantry Horizontal */}
          <View className="mt-10 mb-6">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="font-headline text-3xl font-bold tracking-tight text-primary">The Pantry</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text className="text-sm font-bold text-primary uppercase tracking-tighter">See All</Text>
                <Icon name="chevron-right" size={16} className="text-primary" />
              </TouchableOpacity>
            </View>
            {pantryGrouped.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 pb-4">
                {pantryGrouped.map(renderPantryCard)}
              </ScrollView>
            ) : (
                <Text className="text-on-surface-variant font-body">パントリーは空です</Text>
            )}
          </View>

          {/* The Freezer Horizontal */}
          <View className="mt-6 mb-6">
            <View className="flex-row justify-between items-end mb-6">
              <Text className="font-headline text-3xl font-bold tracking-tight text-secondary">The Freezer</Text>
            </View>
            {freezerGrouped.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 pb-4">
                {freezerGrouped.map(renderPantryCard)}
              </ScrollView>
            ) : (
                <Text className="text-on-surface-variant font-body">冷凍庫は空です</Text>
            )}
          </View>

          {/* Sustainable Tip Card */}
          <View className="mt-8 mb-4">
            <View className="bg-secondary-fixed p-8 rounded-xl relative overflow-hidden">
              <View className="relative z-10 w-[80%] gap-y-3">
                <View className="flex-row items-center gap-2 mb-2">
                  <Icon name="tips-and-updates" size={24} className="text-on-secondary-fixed" />
                  <Text className="font-headline font-bold text-lg text-on-secondary-fixed">Sustainable Tip</Text>
                </View>
                <Text className="text-sm font-medium leading-relaxed text-on-secondary-fixed mb-4">
                  Wrap your celery in aluminum foil before putting it in the fridge. It stays crisp for up to 4 weeks!
                </Text>
                <TouchableOpacity className="bg-on-secondary-fixed px-5 py-3 rounded-full self-start active:scale-95 transition-all">
                  <Text className="text-secondary-fixed text-xs font-bold uppercase tracking-widest">Learn More</Text>
                </TouchableOpacity>
              </View>
              <Icon name="recycling" size={180} className="absolute -bottom-10 -right-10 opacity-10 text-on-secondary-fixed" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl active:scale-95 transition-transform z-50"
        onPress={() => navigation.navigate("AddToPantry")}
      >
        <Icon name="add" size={28} className="text-on-primary" />
      </TouchableOpacity>
    </View>
  );
}
