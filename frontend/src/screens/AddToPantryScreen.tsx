import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";

import { useFridgeStore } from '../store/fridgeStore';
import { useShoppingStore } from '../store/shoppingStore';

export default function AddToPantryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [customDays, setCustomDays] = useState("7");
  const [selectedItemToAdd, setSelectedItemToAdd] = useState<any>(null);

  const { addToFridge } = useFridgeStore();
  const { categories } = useShoppingStore();

  const handleQuickStock = async (item: any) => {
    if (!item.id) return;

    if (!item.defaultDays || item.defaultDays === 0) {
      setSelectedItemToAdd(item);
      setDateModalVisible(true);
    } else {
      await addToFridge(item.id, 'fridge', 'NORMAL', '');
      Alert.alert("完了", "冷蔵庫に追加しました！");
    }
  };

  const confirmAddWithDate = async () => {
    if (selectedItemToAdd) {
      const days = parseInt(customDays, 10) || 7;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      await addToFridge(selectedItemToAdd.id, 'fridge', 'NORMAL', '', endDate.toISOString());
      setDateModalVisible(false);
      setSelectedItemToAdd(null);
      Alert.alert("完了", "冷蔵庫に追加しました！");
    }
  };

  // Generate suggestions based on available templates, taking top 4
  let quickStockItems: any[] = [];
  if (categories.length > 0) {
    const allItems = categories.flatMap(c => c.items);
    quickStockItems = allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4);
  }

  return (
    <View className="flex-1 bg-background font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-6 justify-between bg-background z-50">
        <TouchableOpacity
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} className="text-on-surface" />
        </TouchableOpacity>
        <Text className="font-headline text-xl font-bold text-on-surface pr-10 flex-1 text-center tracking-tight">Add to Pantry</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search Experience */}
        <View className="px-6 mb-8">
          <View className="flex-row w-full items-center rounded-full bg-surface-container-high h-14 shadow-sm px-5">
            <Icon name="search" size={24} className="text-on-surface-variant" />
            <TextInput
              className="flex-1 border-none bg-transparent text-on-surface font-body text-base px-3"
              placeholder="Search for items to add"
              placeholderTextColor="#707973"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories Section */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between px-8 mb-4">
            <Text className="font-headline text-lg font-bold text-on-surface">Categories</Text>
          </View>
          <View className="flex-row flex-wrap justify-between px-6 gap-y-3">
            {/* Category Buttons */}
            <TouchableOpacity className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm">
              <Icon name="eco" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Produce</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm"
              onPress={() => navigation.navigate("DairyCategory")}
            >
              <Icon name="water-drop" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Dairy</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm">
              <Icon name="kitchen" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Pantry</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm">
              <Icon name="ac-unit" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Frozen</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm">
              <Icon name="bakery-dining" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Bakery</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[48%] flex-row items-center gap-3 p-4 rounded-lg bg-surface-container-lowest active:bg-primary-fixed shadow-sm">
              <Icon name="restaurant" size={24} className="text-primary" />
              <Text className="text-on-surface font-semibold text-sm">Meat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stock Section */}
        <View>
          <View className="px-8 mb-4 flex-row items-center gap-2">
            <Icon name="bolt" size={24} className="text-secondary" />
            <Text className="font-headline text-lg font-bold text-on-surface">Quick Stock</Text>
          </View>
          <View className="px-6 space-y-3">
            {quickStockItems.map((item) => (
              <View key={item.id} className="flex-row items-center justify-between p-4 rounded-lg bg-surface-container-low mb-3">
                <View className="flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                    {item.imageUrl ? (
                       <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                       <View className="w-full h-full flex items-center justify-center">
                          <Icon name="eco" size={24} className="text-outline" />
                       </View>
                    )}
                  </View>
                  <View>
                    <Text className="font-semibold text-on-surface">{item.name}</Text>
                    <Text className="text-xs font-label uppercase tracking-wider text-on-surface-variant mt-0.5">Default freshness: {item.defaultDays} Days</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-sm active:scale-95 transition-transform"
                  onPress={() => handleQuickStock(item)}
                >
                  <Icon name="add" size={20} className="text-on-primary" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Area */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background/90 z-50 flex items-center justify-center">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-3 bg-secondary px-8 py-4 rounded-xl shadow-xl active:bg-secondary-container transition-colors w-full max-w-[300px]"
          onPress={() => navigation.navigate("MainTabs", { screen: "Fridge" })}
        >
          <Text className="text-on-secondary font-headline font-bold text-lg">Finish Adding</Text>
          <Icon name="check-circle" size={20} className="text-on-secondary" />
        </TouchableOpacity>
      </View>

      <Modal visible={dateModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
            <Text className="font-headline text-lg font-bold mb-4 text-on-surface">消費期限を設定</Text>
            <Text className="text-sm text-on-surface-variant mb-6 text-center">
              このアイテムにはデフォルトの消費期限が設定されていません。何日持ちますか？
            </Text>
            <TextInput
              className="w-full bg-surface-container-low p-4 rounded-xl mb-6 font-body text-base text-on-surface text-center"
              placeholder="日数 (例: 7)"
              keyboardType="number-pad"
              value={customDays}
              onChangeText={setCustomDays}
            />
            <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={confirmAddWithDate}>
              <Text className="text-on-primary font-bold text-base">決定</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={() => setDateModalVisible(false)}>
              <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
