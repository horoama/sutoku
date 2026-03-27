import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";

import { useFridgeStore } from '../store/fridgeStore';
import { useShoppingStore } from '../store/shoppingStore';

export default function AddToPantryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const { addToFridge } = useFridgeStore();
  const { categories } = useShoppingStore();

  const handleQuickStock = async (itemTemplateId: string) => {
    // Basic mock implementation. In real app, we'd match name to templateId.
    // Here we'll fallback to a category item if we don't have exactly matching IDs for the hardcoded quick stock.
    const fallbackTemplate = categories.length > 0 && categories[0].items.length > 0 ? categories[0].items[0].id : "";
    await addToFridge(fallbackTemplate, 'FRIDGE', 'NORMAL', '');
    alert("Added to Fridge!");
  };

  const quickStockItems = [
    { id: '1', name: 'Whole Milk', info: 'Dairy • 1 Gallon', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBamihkDt5vnmuw8-0pIVWD6KcszuebUUtawDkjNTcZ6jZ9F_8rcwjVfKxHo8g64_GGWvnHfUakgXqrKoE2x9_eTV0Zunj01qbGJBj_FnPMoeCBLxgqol5JIfa-DtlxfYFFwpBm_renzzMqTzI2QfFt5VBRuN1iX1RAwoY3tiNYvgzJrIsu_ryUH_YVyKv4EMdFyl-oNmJVellLphMuXwfXCas5bSangKWZNadM0ot0so2TwIePCYrP6N292S8VMGMsWmXAC1d3_jMV' },
    { id: '2', name: 'Organic Eggs', info: 'Dairy • 12 Count', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp_wnHGtDsfRBOiItvYlySa88ZIR97yXWpmEHprdsJRVxBDg0tYjFdOj9qou_ArD13sEhREQwPCzCJM-pJ70jWssK6pVFzrzkUpgfVJmlWr-tRj6G9SvOyxEfHHCSjBGhIe54Be9gQzZLfFEX8JHEvHtZSFQncGnJlFtM54-oNhLy2dObDTg8eMwjM96lvRnlI1SPqv_YZhXAjbJzDUcH8BtvzANA_ajjspSsC7pAf66n2UjjY4jWvQ1wTnYZmZQAIeLcEVPSHKvx1' },
    { id: '3', name: 'Bananas', info: 'Produce • 1 Bunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuBs-ys-UqPUdW2AmvukfwZDIWuS4tFmFymIFXo2Vvz3V4nonVLnwlRJdtQJr3RyHuGUqARW3rtmURZanim3V05Aun7Ob7p8132aYIrEMBH47ix9etaWLM9mYTIJGyiCLpcAh6vV0A4KKM2akxVS4v-7GBok0XkdwHtUlc8jX6pnJmMlNIn6dTQ-VlILqI8TchhWiB-CwAXcjygmYvIq4loNKpDlVfd59CpQ8XY2cLgE9vfRGYDaiKTSl7qmlWApL8Ysp-5EcK2tsB' },
    { id: '4', name: 'Sourdough Loaf', info: 'Bakery • 1 Unit', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQPaOMH9l4NNJ9wYNV71NxV4g9wNEmHjiqXHO9xpXhBFU_wm4yECK6mO7tc_Tp6Ol4TI4sCGcPsXKnPaNmTF3XGNgBeMGGbxXmuFI1RAe2cjgrlwF2TGh1Q4y_4jVQU_PyyoGlOVkD5-vGtMuaiNFUO3FENoI2AqCzVjFaJm2bvax_i3lcdDrWH1meFL4LAnYiFJDUvIt5N1fQd7zLNuIkv4QsQ3jePw5eKrzXlhRISKiB3NTfgxmryNn6xYBcdNcpx9hl3RmZjkO2' },
  ];

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
                    <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <View>
                    <Text className="font-semibold text-on-surface">{item.name}</Text>
                    <Text className="text-xs font-label uppercase tracking-wider text-on-surface-variant mt-0.5">{item.info}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary shadow-sm active:scale-95 transition-transform"
                  onPress={() => handleQuickStock(item.id)}
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
    </View>
  );
}
