import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useFridgeStore } from '../store/fridgeStore';
import { useShoppingStore } from '../store/shoppingStore';

export default function PantrySearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const { categories, fetchCategories } = useShoppingStore();
  const { addToFridge } = useFridgeStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const produceCategory = categories.find(c => c.name.includes("野") || c.name.toLowerCase().includes("produce"));
  const allItems = produceCategory?.items || [];
  const items = allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddItem = async (templateId: string, itemName: string) => {
    if (!produceCategory) return;
    await addToFridge(templateId, itemName, produceCategory.id, undefined, 'fridge');
    Alert.alert("追加完了", `${itemName} を追加しました`);
  };

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full bg-[#f8faf6] flex-row items-center justify-between px-6 py-4 z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="p-2 rounded-full hover:bg-emerald-50 transition-colors active:scale-95 -ml-2"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-emerald-900" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-2xl tracking-tight text-emerald-900">Produce</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-95 transition-transform">
          <Icon name="filter-list" size={24} className="text-on-surface-variant" />
        </TouchableOpacity>
      </View>

      <ScrollView className="max-w-screen-xl mx-auto px-6 pt-4 w-full" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Search Bar Section */}
        <View className="mb-8">
          <View className="relative justify-center">
            <View className="absolute left-5 z-10">
              <Icon name="search" size={24} className="text-outline" />
            </View>
            <TextInput
              className="w-full bg-surface-container-high border-none rounded-full py-4 pl-14 pr-6 text-on-surface font-body text-base"
              placeholder="Search fresh produce..."
              placeholderTextColor="#707973"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Banner */}
        <View className="mb-10 flex-col gap-6">
          <View className="relative h-48 rounded-lg overflow-hidden shadow-sm">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRLgIUsFqbmgrCYe-oB33ql35R2Ik6C8yjW9oXvtAX_iWIyz6RJf8O5Mnz0DTnXLPCKM6rsnS4beeAiZmEQjMzZfO_zMKtnO1dmRbEZdnCnOEwJ8AAj2jyHfbISkG9gLmt2I5QoCi0rkLBTgn6Jr_KiJkzjW1O_nzxB3Mti1jbzdbN3yPo4-VrQt9Pok9yrAkGReNlzvnu7Yg4ySUoVxPVAa8ifcyz3Q4avzlrrsvmAjjxHfWnqt5AZ1LAzchQP1loQFGzGfIP4I1N" }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-primary/30"></View>
          </View>
          <View className="pr-4">
            <Text className="text-primary font-label text-sm font-bold tracking-[0.15em] uppercase mb-2">Weekly Staples</Text>
            <Text className="text-4xl font-extrabold text-on-surface leading-tight mb-2 font-headline">Farm-to-Table{"\n"}Freshness</Text>
            <Text className="text-on-surface-variant text-lg font-body">Organize your kitchen with seasonal greens and roots. Tap to add what's in your basket.</Text>
          </View>
        </View>

        {/* Items Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {items.length > 0 ? items.map((item, index) => (
            <View key={item.id} className="w-[48%] bg-surface-container-lowest p-4 rounded-lg flex-col items-center shadow-sm">
              <View className="w-full aspect-square rounded-full overflow-hidden mb-4 bg-surface-container">
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
                ) : (
                  <View className="w-full h-full items-center justify-center bg-surface-variant">
                    <Icon name="eco" size={40} className="text-outline" />
                  </View>
                )}
              </View>
              <View className="flex-row justify-between items-end w-full">
                <View>
                  <Text className="font-headline text-lg font-bold text-on-surface leading-tight" numberOfLines={1}>{item.name}</Text>
                  <Text className="font-label text-[10px] font-bold tracking-widest text-outline uppercase">{item.defaultDays} Days</Text>
                </View>
                <TouchableOpacity
                  className="h-10 w-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                  onPress={() => handleAddItem(item.id, item.name)}
                >
                  <Icon name="add" size={24} className="text-on-secondary-fixed-variant" />
                </TouchableOpacity>
              </View>
            </View>
          )) : (
            <Text className="text-center font-body text-on-surface-variant mt-10 w-full">このカテゴリにはアイテムがありません</Text>
          )}
        </View>

        {/* Contextual Help */}
        <View className="mt-12 p-8 rounded-lg bg-surface-container-low flex-col items-center gap-6 text-center">
          <View className="items-center">
            <Text className="font-headline text-2xl font-bold text-emerald-900 mb-2">Can't find an item?</Text>
            <Text className="text-on-surface-variant font-body text-center">Tap the 'Custom Entry' button to create a custom entry for your unique finds.</Text>
          </View>
          <TouchableOpacity
            className="w-full py-4 bg-primary rounded-xl shadow-lg active:scale-95 transition-all items-center justify-center"
            onPress={() => navigation.navigate("RegisterItem")}
          >
            <Text className="text-on-primary font-headline font-bold text-base">Custom Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Review/Finish Floating Button */}
      <View className="absolute bottom-10 left-0 right-0 px-6 items-center z-50">
        <TouchableOpacity
          className="w-full max-w-xs py-5 bg-primary rounded-xl shadow-2xl flex-row items-center justify-center gap-3 active:scale-95 transition-all"
          onPress={() => navigation.navigate("MainTabs", { screen: "Fridge" })}
        >
          <Text className="text-on-primary font-headline font-bold text-lg">Finish Adding</Text>
          <Icon name="check-circle" size={24} className="text-on-primary" />
          <View className="absolute right-4 h-7 w-7 rounded-full bg-on-primary flex items-center justify-center shadow-inner">
            <Text className="text-primary font-black text-xs">3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
