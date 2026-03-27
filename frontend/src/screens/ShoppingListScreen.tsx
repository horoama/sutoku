import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, TextInput, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../store/appStore";
import { useShoppingStore, ItemTemplate, ShoppingItem } from "../store/shoppingStore";
import Icon from "@expo/vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, family, initializeUser } = useAppStore();
  const { categories, shoppingList, fetchCategories, fetchShoppingList, addToShoppingList, purchaseItem } = useShoppingStore();

  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<ItemTemplate | null>(null);
  const [addNote, setAddNote] = useState("");

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (family?.id) {
      fetchCategories();
      fetchShoppingList();
    }
  }, [family?.id]);

  const handleLongPress = (item: ShoppingItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleMoveToFridge = async () => {
    if (selectedItem) {
      await purchaseItem(selectedItem.id);
      setModalVisible(false);
      setSelectedItem(null);
      Alert.alert("完了", "冷蔵庫に追加しました！");
    }
  };

  const openAddModal = (item: ItemTemplate) => {
    setItemToAdd(item);
    setAddNote("");
    setAddModalVisible(true);
  };

  const confirmAddItem = (priority: "TODAY" | "SOMEDAY") => {
    if (itemToAdd) {
      addToShoppingList(itemToAdd.id, priority, addNote.trim());
      setAddModalVisible(false);
      setItemToAdd(null);
      setAddNote("");
      Alert.alert("追加完了", `${itemToAdd.name} をリストに追加しました`);
    }
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => {
    let iconName: React.ComponentProps<typeof Icon>['name'] = "local-grocery-store";
    let iconColorClass = "text-primary text-2xl";
    let iconBgClass = "bg-primary-fixed";
    let categoryName = "GROCERY";
    let priorityBadge = null;

    if (item.priority === "TODAY") {
      iconName = "eco";
      iconColorClass = "text-tertiary text-2xl";
      iconBgClass = "bg-tertiary-fixed";
      categoryName = "PRODUCE";
      priorityBadge = (
        <View className="px-3 py-0.5 rounded-full bg-tertiary-container">
          <Text className="text-on-tertiary-fixed-variant text-[10px] font-bold tracking-[0.1em] uppercase font-label">URGENT</Text>
        </View>
      );
    } else if (item.itemTemplate.name.toLowerCase().includes("milk") || item.itemTemplate.name.toLowerCase().includes("egg") || item.itemTemplate.name.toLowerCase().includes("yogurt")) {
      iconName = "egg";
      categoryName = "DAIRY";
      priorityBadge = (
        <View className="px-3 py-0.5 rounded-full bg-surface-container">
          <Text className="text-on-surface-variant text-[10px] font-bold tracking-[0.1em] uppercase font-label">NORMAL</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        className="group relative bg-surface-container-lowest rounded-lg p-5 flex-row items-center gap-5 transition-all active:scale-[0.98] mb-4 shadow-sm"
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.8}
        style={{
          shadowColor: "#191c1a",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.04,
          shadowRadius: 24,
          elevation: 2,
        }}
      >
        <View className={`w-14 h-14 rounded-full flex items-center justify-center ${iconBgClass}`}>
          <Icon name={iconName} size={24} className={iconColorClass} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="font-headline font-bold text-xl text-on-surface">{item.itemTemplate.name}</Text>
            {priorityBadge}
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-sm font-semibold text-on-surface-variant font-body">{item.note || "1 unit"}</Text>
            <View className="w-1 h-1 rounded-full bg-outline-variant"></View>
            <Text className="text-xs font-bold text-primary font-label tracking-widest uppercase">{categoryName}</Text>
          </View>
        </View>

        {/* Placeholder for family member avatars who requested this */}
        <View className="flex-row -space-x-3">
          <View className="w-8 h-8 rounded-full border-2 border-surface-container-lowest overflow-hidden bg-surface-container">
             <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXxIn9vkOJkM6PINi0yWB5YnNUFN2iUe8ENrb1prTy3CywJnqQgcSyUGjHjGzRKF5FVKQzfrFCxc1LflbtW1H-7Kjz4EyBhEG2Ir5-lzht5fkn07JXndNTHy26vznKGojtw6tQeFBobHuHP3F1c34TDx8ikUeiv0UNeKkxhi38LvSIZJnNAm67ooMtjERCHnxuSF-pUZ6hFXtDrWBbz0-UDBDlJY5EVX6A5Okq8Cx7z4ei6GutfcWV5NTCRCRvrasLGGu_o0ZPcTw" }} className="w-full h-full" />
          </View>
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
          <TouchableOpacity className="active:opacity-80 transition-opacity active:scale-95">
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

      <ScrollView className="px-6 pt-8" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Editorial Header Section */}
        <View className="mb-12 ml-4">
          <Text className="font-headline font-extrabold text-primary leading-tight tracking-tighter text-4xl mb-2">Shopping List</Text>
          <Text className="font-body text-on-surface-variant text-lg">Fresh ingredients for the week ahead.</Text>
        </View>

        {/* List Section */}
        <View className="space-y-4">
          {shoppingList.length > 0 ? (
            <FlatList
              data={shoppingList}
              keyExtractor={(item) => item.id}
              renderItem={renderShoppingItem}
              scrollEnabled={false}
            />
          ) : (
            <Text className="text-center text-outline mt-10 font-body">買い物リストは空です</Text>
          )}
        </View>
      </ScrollView>

      {/* Contextual FAB */}
      <TouchableOpacity
        className="absolute bottom-28 right-6 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl active:scale-90 transition-all z-50"
        onPress={() => navigation.navigate("AddToShoppingList")}
      >
        <Icon name="add" size={28} className="text-on-primary" />
      </TouchableOpacity>

      {/* Modals */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
            <Text className="font-headline text-lg font-bold mb-6 text-center text-on-surface">
              {selectedItem?.itemTemplate.name} を購入しましたか？
            </Text>
            <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={handleMoveToFridge}>
              <Text className="text-on-primary font-bold text-base">冷蔵庫 / 食糧庫に入れる</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={() => setModalVisible(false)}>
              <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={addModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface-container-lowest p-6 rounded-2xl w-11/12 items-center">
            <Text className="font-headline text-lg font-bold mb-4 text-on-surface">{itemToAdd?.name} を追加</Text>
            <TextInput
              className="w-full bg-surface-container-low p-4 rounded-xl mb-6 font-body text-base text-on-surface"
              placeholder="メモ (例: 2個、メーカー指定など)"
              value={addNote}
              onChangeText={setAddNote}
            />
            <View className="flex-row justify-between w-full gap-3 mb-3">
              <TouchableOpacity className="flex-1 bg-tertiary-container py-4 rounded-xl items-center" onPress={() => confirmAddItem("TODAY")}>
                <Text className="text-on-tertiary-container font-bold text-sm">今日買う</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-primary-fixed py-4 rounded-xl items-center" onPress={() => confirmAddItem("SOMEDAY")}>
                <Text className="text-on-primary-fixed font-bold text-sm">いつか買う</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center mt-2" onPress={() => setAddModalVisible(false)}>
              <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

