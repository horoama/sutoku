import { useItemTranslation } from '../i18n/utils';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useShoppingStore, ShoppingItem } from "../store/shoppingStore";

export default function ReviewListScreen() {
  const { tItem } = useItemTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { shoppingList, fetchShoppingList } = useShoppingStore();

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-tertiary';
      case 'HIGH': return 'text-secondary';
      default: return 'text-primary';
    }
  };

  const getIconForCategory = (name: string) => {
    const lowname = name.toLowerCase();
    if (lowname.includes('milk') || lowname.includes('dairy') || lowname.includes('egg')) return 'egg';
    if (lowname.includes('meat') || lowname.includes('chicken') || lowname.includes('beef')) return 'restaurant';
    return 'local-grocery-store';
  };

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar Section */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="active:scale-95 transition-transform"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-[#2D6A4F]" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl text-[#2D6A4F]">Review List</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="font-headline font-extrabold text-[#2D6A4F]">LARDER</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-8 pb-32 max-w-2xl mx-auto w-full" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Editorial Header Section */}
        <View className="mb-10 ml-2">
          <Text className="font-label text-[10px] tracking-[0.1em] uppercase text-on-surface-variant mb-2">Pending Additions</Text>
          <Text className="font-headline text-4xl font-extrabold text-primary leading-tight">Your Grocery{"\n"}Forecast</Text>
        </View>

        {/* Bento-style List Container */}
        <View className="gap-y-4">
          {shoppingList.length > 0 ? shoppingList.map((item: ShoppingItem) => (
            <View key={item.id} className="bg-surface-container-lowest p-5 rounded-lg flex-row items-center gap-5 transition-all mb-4 border border-transparent shadow-sm">
              <View className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center">
                <Icon name={getIconForCategory(item.itemTemplate.name) as any} size={30} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-headline font-bold text-lg text-on-surface">{tItem(item.itemTemplate)}</Text>
                <Text className={`font-label text-[10px] font-semibold tracking-widest uppercase ${getPriorityColor(item.priority)}`}>{item.priority}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View className="bg-primary-fixed px-3 py-1 rounded-full">
                  <Text className="text-on-primary-fixed-variant text-xs font-bold font-label">Listed</Text>
                </View>
                <Icon name="drag-indicator" size={24} className="text-outline-variant" />
              </View>
            </View>
          )) : (
            <Text className="text-center text-on-surface-variant font-body">リストにはアイテムがありません</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View className="absolute bottom-0 w-full px-6 pb-8 pt-4 bg-surface/95 z-50">
        <View className="flex-row items-center justify-between bg-primary-container/10 border border-primary/10 px-5 py-3 rounded-full mb-4">
          <View className="flex-row items-center gap-2.5">
            <View className="w-2 h-2 rounded-full bg-primary"></View>
            <Text className="font-headline text-sm font-semibold text-primary">{shoppingList.length} items in Shopping List</Text>
          </View>
          <Icon name="check-circle" size={16} className="text-primary font-bold" />
        </View>
        <TouchableOpacity
          className="w-full bg-primary py-5 rounded-xl flex-row items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
          onPress={() => navigation.navigate("MainTabs", { screen: "Shopping" })}
        >
          <Text className="text-on-primary font-headline font-bold text-lg">Confirm & Start Shopping</Text>
          <Icon name="arrow-forward" size={20} className="text-on-primary" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
