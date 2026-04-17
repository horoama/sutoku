import { useItemTranslation } from '../i18n/utils';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useShoppingStore } from "../store/shoppingStore";
import { useAppStore } from "../store/appStore";

export default function DairyCategoryScreen() {
  const { tItem } = useItemTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("All Dairy");
  const { categories, fetchCategories, addToShoppingList } = useShoppingStore();
  const { user } = useAppStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const filters = ["All Dairy", "Milk & Cream", "Cheeses", "Yogurts", "Eggs"];

  const dairyCategory = categories.find(c => c.name.toLowerCase().includes("dairy"));
  const items = dairyCategory?.items || [];

  const handleAddItem = async (templateId: string, itemName: string) => {
    await addToShoppingList(templateId, 'NORMAL', '');
    Alert.alert("追加完了", `${itemName} をリストに追加しました`);
  };

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="active:opacity-80 transition-opacity"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-[#2D6A4F]" />
          </TouchableOpacity>
          <Text className="text-[#2D6A4F] font-headline font-bold text-2xl tracking-tight">Dairy</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="active:opacity-80 transition-opacity">
            <Icon name="search" size={24} className="text-[#2D6A4F]" />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center overflow-hidden border-2 border-primary-fixed">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBC0XdZ3BIR6gZ4XQGLq9XO4PJyFtbc1-dP9YibAbPl-ZsicWdjnct-U0QvJzVfanaWeG5a5OmlR9yNOTb9ezvwElJ4hukp8-M4gz6NelSxeKm9DsIiaoE9PrFWFb-sYH45Zvl3iX1U_sO8jGqf0sepcKHovX8_tS5qS1q1l5QvSiXSeFeUR_hCfNMK6L0shH7M7JEs5mq2Sbq-NjkGnTOLRmU6Rs5qV8LJ9iQkbz-DsKe7ZlMD-T0Z7IZ3CYSVnIdv8vAvAqSFB3sX" }}
              className="w-full h-full"
            />
          </View>
        </View>
      </View>

      <ScrollView className="max-w-screen-xl mx-auto px-6 pt-6" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Editorial Hero Section */}
        <View className="mb-10 relative overflow-hidden rounded-xl bg-primary-container p-8 flex-col gap-6">
          <View className="z-10">
            <Text className="font-label text-xs uppercase tracking-[0.2em] opacity-80 mb-2 text-on-primary-container">Pantry Essentials</Text>
            <Text className="font-headline text-4xl font-extrabold mb-4 leading-tight text-on-primary-container">Fresh from{"\n"}the Farm</Text>
            <Text className="font-body text-sm max-w-[200px] opacity-90 leading-relaxed text-on-primary-container">Keep your home nourished with our selection of organic dairy staples, delivered fresh to your digital larder.</Text>
          </View>
          <View className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-90">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdMNSXQ3aSesV-VN5cqA_KmZYgNY-Wr-cpJxLxIOgCFiptX6o5PYN8LL6-00a0mdukeBhs0YvM7OVnZzlJ4DUcv_hxqYYAWyKUkmYpAR81t5DcCSGglMCOrZb60p0Vt-tWwTHznQLc_NjqkUed_VE3sJJkBf-xVjtoRAtKk7USA_11EvXQQDE5MOH__oMbuha3i5cMbBxUpheU_OY9ybVIXW5TuAuJz2gQbzLavSdz-Nv3uSU0tBGleN--7WxXkuhbC6iuMNixpMGJ" }}
              className="w-full h-full object-contain"
              style={{ transform: [{ rotate: '12deg' }] }}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View className="mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-3 pb-2 overflow-visible">
            {filters.map(filter => (
              <TouchableOpacity
                key={filter}
                className={`px-6 py-2 rounded-full mr-3 ${activeFilter === filter ? 'bg-primary' : 'bg-surface-container-high'}`}
                onPress={() => setActiveFilter(filter)}
              >
                <Text className={`font-label text-sm ${activeFilter === filter ? 'font-bold text-on-primary' : 'font-medium text-on-surface-variant'}`}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Asymmetric Grid of Items */}
        <View className="flex-row flex-wrap justify-between">
          {items.length > 0 ? items.map((item, index) => (
            <View
              key={item.id}
              className={`w-[48%] bg-surface-container-lowest rounded-lg p-4 flex-col gap-3 mb-6 shadow-sm ${index % 2 !== 0 ? 'mt-8' : ''}`}
            >
              <View className="aspect-square rounded-lg overflow-hidden bg-surface-container-low relative">
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-surface-variant">
                    <Icon name="local-drink" size={40} className="text-outline" />
                  </View>
                )}
                <TouchableOpacity
                  className="absolute bottom-3 right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  onPress={() => handleAddItem(item.id, item.name)}
                >
                  <Icon name="add" size={24} className="text-on-primary" />
                </TouchableOpacity>
              </View>
              <View>
                <Text className="font-headline font-bold text-on-surface">{tItem(item)}</Text>
                <Text className="font-body text-xs text-on-surface-variant mt-1">Default: {item.defaultDays} Days</Text>
              </View>
            </View>
          )) : (
            <Text className="text-center text-on-surface-variant font-body">アイテムが見つかりません</Text>
          )}
        </View>

        {/* Secondary CTA: "Missing Something?" */}
        <View className="mt-10 bg-secondary-container/20 rounded-xl p-8 flex-col items-center gap-6">
          <View className="items-center">
            <Text className="font-headline font-extrabold text-2xl text-on-secondary-container mb-2 text-center">Missing your favorite?</Text>
            <Text className="font-body text-on-secondary-container/80 text-center">Can't find the specific dairy item you need? Add a custom item to your list.</Text>
          </View>
          <TouchableOpacity
            className="bg-secondary px-8 py-4 rounded-full flex-row items-center gap-2 shadow-lg active:scale-95 transition-transform"
            onPress={() => navigation.navigate("RegisterItem")}
          >
            <Icon name="edit" size={20} className="text-on-secondary" />
            <Text className="text-on-secondary font-headline font-bold">Add Custom Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-10 right-6 w-14 h-14 bg-secondary rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <Icon name="qr-code-scanner" size={24} className="text-on-secondary" />
      </TouchableOpacity>
    </View>
  );
}
