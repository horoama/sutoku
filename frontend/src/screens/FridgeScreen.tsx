import React, { useEffect } from "react";
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

  // Default Days criteria for fridge vs pantry:
  // Usually short lifespan goes to fridge, longer to pantry.
  // Or check category name if populated, but fallback to all active items
  const fridgeSection = activeItems.filter(item => {
    // NOTE: TypeScript error fix. Casting itemTemplate to any to access nested category for now.
    const catName = (item.itemTemplate as any).category?.name?.toLowerCase() || "";
    if (catName.includes("dairy") || catName.includes("meat") || catName.includes("produce")) return true;
    return item.defaultDays < 30; // Shorter lived items typically go to fridge
  });

  const pantrySection = activeItems.filter(item => !fridgeSection.includes(item));

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
              <Text className="font-headline text-xl font-bold text-on-primary" numberOfLines={1}>{item.itemTemplate.name}</Text>
            </View>
            <View className="bg-tertiary-container px-2 py-1 rounded-full flex-row items-center gap-1">
              <Icon name="timer" size={12} className="text-on-tertiary-container" />
              <Text className="text-on-tertiary-container text-[10px] font-bold">
                {daysLeft < 0 ? "EXPIRED" : daysLeft === 0 ? "TODAY" : `${daysLeft} DAYS LEFT`}
              </Text>
            </View>
          </View>
          <View className="space-y-1">
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
        <View className="flex-grow">
          <Text className="font-headline font-bold text-on-surface text-base">{item.itemTemplate.name}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <View className="h-1.5 w-24 bg-surface-container-high rounded-full overflow-hidden">
              <View className="h-full bg-tertiary rounded-full" style={{ width: `${progressPercent}%` }}></View>
            </View>
            <Text className="text-xs font-bold text-tertiary">
              {daysLeft < 0 ? "Expired" : daysLeft === 0 ? "Today" : `${daysLeft} Days`}
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

  const renderFridgeItem = (item: FridgeItem) => {
    const daysLeft = getDaysLeft(item);
    return (
      <TouchableOpacity
        key={item.id}
        className="bg-surface-container-low p-4 rounded-lg flex-row items-center justify-between group mb-3"
        onPress={() => navigation.navigate("ItemDetails", { itemId: item.id })}
      >
        <View className="flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary">
            <Icon name="kitchen" size={24} className="text-primary" />
          </View>
          <View>
            <Text className="font-headline font-semibold text-on-surface text-base">{item.itemTemplate.name}</Text>
            <Text className="text-xs text-outline font-medium">Added recently</Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <Text className="font-headline font-bold text-primary text-base">{daysLeft} Days</Text>
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

  const renderPantryCard = (item: FridgeItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        className="w-40 bg-surface-container-lowest p-5 rounded-lg shadow-sm mr-4"
        onPress={() => navigation.navigate("ItemDetails", { itemId: item.id })}
      >
        <View className="w-full aspect-square bg-surface-container-low rounded-2xl overflow-hidden mb-4 items-center justify-center">
          <Icon name="inventory-2" size={48} className="text-secondary" />
        </View>
        <View className="mb-2">
          <Text className="font-headline font-bold text-sm text-on-surface" numberOfLines={1}>{item.itemTemplate.name}</Text>
          <Text className="text-xs text-outline font-medium">In stock</Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <View className="bg-primary-fixed px-2 py-0.5 rounded-full self-start">
            <Text className="text-[10px] font-bold text-primary-container">STABLE</Text>
          </View>
          <TouchableOpacity
            className="bg-secondary px-3 py-1.5 rounded-full active:scale-95 transition-transform"
            onPress={() => handleConsumePantryItem(item)}
          >
            <Text className="text-on-secondary text-[10px] font-bold uppercase">Consume</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-surface text-on-surface pb-32" style={{ paddingTop: insets.top }}>
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

      <ScrollView className="pt-4" contentContainerStyle={{ paddingBottom: 160 }}>
        <View className="px-6 space-y-10">
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
              <Text className="text-sm font-bold text-outline uppercase tracking-tighter">{fridgeSection.length} Items</Text>
            </View>
            <View>
              {fridgeSection.length > 0 ? (
                fridgeSection.map(renderFridgeItem)
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
            {pantrySection.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 pb-4">
                {pantrySection.map(renderPantryCard)}
              </ScrollView>
            ) : (
                <Text className="text-on-surface-variant font-body">食糧庫は空です</Text>
            )}
          </View>

          {/* Sustainable Tip Card */}
          <View className="mt-8 mb-4">
            <View className="bg-secondary-fixed p-8 rounded-xl relative overflow-hidden">
              <View className="relative z-10 w-[80%] space-y-3">
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
        className="absolute bottom-28 right-6 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl active:scale-95 transition-transform z-50"
        onPress={() => navigation.navigate("AddToPantry")}
      >
        <Icon name="add" size={28} className="text-on-primary" />
      </TouchableOpacity>
    </View>
  );
}
