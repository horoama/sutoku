import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../store/appStore";
import { useShoppingStore, ItemTemplate, ShoppingItem } from "../store/shoppingStore";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { ShoppingItemCard } from "../components/ShoppingItemCard";
import { ActionModal } from "../components/modals/ActionModal";
import { DateModal } from "../components/modals/DateModal";

/**
 * 買い物リスト画面のコンポーネント
 */
export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user, family, initializeUser } = useAppStore();
  const { categories, shoppingList, fetchCategories, fetchShoppingList, purchaseItem, toggleBoughtStatus, updateItemPriority, deleteItem } = useShoppingStore();

  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [customDays, setCustomDays] = useState("7");

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (family?.id) {
      fetchCategories();
      fetchShoppingList();
    }
  }, [family?.id]);

  /**
   * アイテムの長押しアクション
   */
  const handleLongPress = (item: ShoppingItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  /**
   * チェック状態のトグル
   */
  const handleToggleCheck = async (item: ShoppingItem) => {
    const isBought = item.status === 'BOUGHT';
    await toggleBoughtStatus(item.id, !isBought);
  };

  /**
   * モーダル経由でのチェックトグル処理
   */
  const handleModalToggleCheck = () => {
    if (selectedItem) {
      handleToggleCheck(selectedItem);
      setModalVisible(false);
    }
  };

  /**
   * 冷蔵庫への移動処理（消費期限確認）
   */
  const handleMoveToFridge = async () => {
    if (selectedItem) {
      if (!selectedItem.itemTemplate.defaultDays || selectedItem.itemTemplate.defaultDays === 0) {
        setModalVisible(false);
        setDateModalVisible(true);
      } else {
        await purchaseItem(selectedItem.id);
        setModalVisible(false);
        setSelectedItem(null);
        Alert.alert("完了", "冷蔵庫に追加しました！");
      }
    }
  };

  /**
   * 日付指定付きでの冷蔵庫への移動処理
   */
  const confirmMoveToFridgeWithDate = async () => {
    if (selectedItem) {
      const days = parseInt(customDays, 10) || 7;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      await purchaseItem(selectedItem.id, undefined, endDate.toISOString());
      setDateModalVisible(false);
      setSelectedItem(null);
      Alert.alert("完了", "冷蔵庫に追加しました！");
    }
  };

  const handleChangePriority = async (id: string, priority: string) => {
    await updateItemPriority(id, priority);
    setModalVisible(false);
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      "確認",
      "このアイテムをリストから削除しますか？",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            await deleteItem(id);
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const handleMoveAllCheckedToPantry = async () => {
    const checkedItems = shoppingList.filter(item => item.status === "BOUGHT");
    if (checkedItems.length === 0) return;
    
    // Concurrently process all purchases
    try {
      // Create a loading state or just execute
      await Promise.all(checkedItems.map(item => purchaseItem(item.id)));
      Alert.alert("完了", `${checkedItems.length}件のアイテムをTHE PANTRYに追加しました！`);
    } catch (e) {
      console.error(e);
      Alert.alert("エラー", "一部のアイテムの移動に失敗しました。");
    }
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
          <TouchableOpacity
            className="active:opacity-80 transition-opacity active:scale-95"
            accessibilityRole="button"
            accessibilityLabel="Search"
          >
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

      <ScrollView className="px-6 pt-8" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Editorial Header Section */}
        <View className="mb-12 ml-4">
          <Text className="font-headline font-extrabold text-primary leading-tight tracking-tighter text-4xl mb-2">Shopping List</Text>
          <Text className="font-body text-on-surface-variant text-lg">Fresh ingredients for the week ahead.</Text>
        </View>

        {/* List Section */}
        <View className="gap-y-4">
          {shoppingList.filter((item) => item.status !== "PURCHASED").length > 0 ? (
            <>
              {shoppingList
                .filter((item) => item.status === "PENDING")
                .map((item) => (
                  <ShoppingItemCard
                    key={item.id}
                    item={item}
                    onLongPress={handleLongPress}
                    onToggleCheck={handleToggleCheck}
                  />
                ))}

              {shoppingList.filter((item) => item.status === "BOUGHT").length > 0 && (
                <Animated.View
                  layout={LinearTransition.springify().damping(16).mass(0.6).stiffness(120)}
                  entering={FadeIn.duration(300)}
                  className="mt-6 mb-4 border-t border-surface-container pt-6"
                >
                  <View className="flex-row items-center justify-between mb-4 px-2">
                    <Text className="font-headline text-lg font-bold text-on-surface-variant">チェック済み</Text>
                    <TouchableOpacity 
                      className="bg-primary/10 px-4 py-2 rounded-full flex-row items-center gap-1 active:scale-95 transition-transform"
                      onPress={handleMoveAllCheckedToPantry}
                    >
                      <Icon name="input" size={14} className="text-primary" />
                      <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">全て送る</Text>
                    </TouchableOpacity>
                  </View>
                  {shoppingList
                    .filter((item) => item.status === "BOUGHT")
                    .map((item) => (
                      <ShoppingItemCard
                        key={item.id}
                        item={item}
                        onLongPress={handleLongPress}
                        onToggleCheck={handleToggleCheck}
                      />
                    ))}
                </Animated.View>
              )}
            </>
          ) : (
            <Text className="text-center text-outline mt-10 font-body">買い物リストは空です</Text>
          )}
        </View>
      </ScrollView>

      {/* Contextual FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl active:scale-90 transition-all z-50"
        onPress={() => navigation.navigate("AddToShoppingList")}
        accessibilityRole="button"
        accessibilityLabel="Add new item"
      >
        <Icon name="add" size={28} className="text-on-primary" />
      </TouchableOpacity>

      {/* Modals */}
      <ActionModal
        visible={isModalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
        onMoveToFridge={handleMoveToFridge}
        onToggleCheck={handleModalToggleCheck}
        onChangePriority={handleChangePriority}
        onDelete={handleDeleteItem}
      />

      <DateModal
        visible={dateModalVisible}
        days={customDays}
        setDays={setCustomDays}
        onConfirm={confirmMoveToFridgeWithDate}
        onClose={() => setDateModalVisible(false)}
      />
    </View>
  );
}
