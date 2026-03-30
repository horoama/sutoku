import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useShoppingStore, ItemTemplate, Category } from "../store/shoppingStore";

export default function AddToShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { categories, fetchCategories, addToShoppingList, shoppingList } = useShoppingStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories().then(() => {
      const storeCats = useShoppingStore.getState().categories;
      if (storeCats.length > 0) {
        setActiveCategoryId(storeCats[0].id);
      }
    });
  }, []);

  const handleAddItem = async (templateId: string, itemName: string, priority: 'TODAY' | 'URGENT' | 'NORMAL' | 'LOW' = 'NORMAL') => {
    await addToShoppingList(templateId, priority, '');
    Alert.alert("Success", `${itemName} added to shopping list.`);
  };

  const activeCategoryData = categories.find(c => c.id === activeCategoryId);
  const allItemsToDisplay = activeCategoryData ? activeCategoryData.items : [];
  const itemsToDisplay = allItemsToDisplay.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Generate suggestions based on available templates, taking top 3
  let suggestions: ItemTemplate[] = [];
  if (categories.length > 0) {
    const allItems = categories.flatMap(c => c.items);
    suggestions = allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3);
  }

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* Top Navigation Anchor */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center gap-4 z-50">
        <TouchableOpacity
          className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50/50 active:scale-95 transition-all"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} className="text-emerald-900" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-2xl tracking-tight text-emerald-900">Add to Shopping List</Text>
      </View>

      <ScrollView className="px-6 space-y-8" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Search Bar Section */}
        <View className="mt-4">
          <View className="relative justify-center">
            <View className="absolute left-5 z-10">
              <Icon name="search" size={24} className="text-outline" />
            </View>
            <TextInput
              className="w-full bg-surface-container-high border-none rounded-full py-4 pl-14 pr-6 text-on-surface font-body text-base"
              placeholder="Search for groceries..."
              placeholderTextColor="#707973"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View className="mt-2 px-1">
          <TouchableOpacity
            className="w-full flex-row items-center justify-between p-3 bg-surface-container-low border border-dashed border-outline-variant/40 rounded-xl active:bg-surface-container-high transition-colors"
            onPress={() => navigation.navigate("RegisterItem")}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="add-circle" size={20} className="text-primary" />
              </View>
              <View>
                <Text className="font-headline font-semibold text-sm text-on-surface">Can't find what you're looking for?</Text>
                <Text className="text-[10px] text-outline font-medium">Add a custom item to your list</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} className="text-primary/60" />
          </TouchableOpacity>
        </View>

        {/* Suggestions Horizontal Scroll */}
        <View>
          <View className="flex-row justify-between items-end mb-4 pr-2">
            <Text className="font-headline text-xl font-bold text-primary">Running Low</Text>
            <Text className="font-label text-xs font-bold tracking-wider text-outline uppercase">Based on Pantry</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 overflow-visible">
            {suggestions.map(item => (
              <View key={item.id} className="w-40 bg-surface-container-lowest rounded-lg overflow-hidden mr-4 shadow-sm border border-surface-variant/20">
                <View className="h-32 w-full bg-surface-container-low">
                  {item.imageUrl ? (
                     <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                     <View className="w-full h-full items-center justify-center">
                        <Icon name="eco" size={32} className="text-outline" />
                     </View>
                  )}
                </View>
                <View className="p-4 space-y-3">
                  <Text className="font-headline font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                  <TouchableOpacity
                    className="w-full bg-secondary-fixed py-2 rounded-xl flex-row items-center justify-center gap-2 active:bg-secondary-container"
                    onPress={() => handleAddItem(item.id, item.name)}
                  >
                    <Icon name="add" size={16} className="text-on-secondary-fixed-variant" />
                    <Text className="text-on-secondary-fixed-variant font-label text-xs font-bold">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Category Tabs */}
        <View className="pt-2 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                className={`px-6 py-3 rounded-full mr-2 ${activeCategoryId === cat.id ? 'bg-primary' : 'bg-surface-container-high'}`}
                onPress={() => setActiveCategoryId(cat.id)}
              >
                <Text className={`font-label text-sm font-bold ${activeCategoryId === cat.id ? 'text-on-primary' : 'text-on-surface-variant'}`}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Item List Grid */}
        <View className="space-y-4 pb-12">
          {itemsToDisplay.length > 0 ? itemsToDisplay.map((item, index) => (
             <View key={item.id} className="bg-surface-container-low rounded-lg p-4 flex-row items-center gap-4 mb-3">
               <View className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
                 {item.imageUrl ? (
                   <Image source={{ uri: item.imageUrl }} className="w-full h-full" />
                 ) : (
                   <View className="w-full h-full items-center justify-center">
                     <Icon name="eco" size={32} className="text-outline" />
                   </View>
                 )}
               </View>
               <View className="flex-1">
                 <Text className="font-headline font-bold text-on-surface text-base">{item.name}</Text>
                 <Text className="text-xs text-outline font-medium">Default freshness: {item.defaultDays} days</Text>
               </View>
               <TouchableOpacity
                 className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm active:bg-primary"
                 onPress={() => handleAddItem(item.id, item.name)}
               >
                 <Icon name="add" size={24} className="text-primary" />
               </TouchableOpacity>
             </View>
          )) : (
             <Text className="text-center font-body text-on-surface-variant mt-10">このカテゴリにはアイテムがありません</Text>
          )}
        </View>
      </ScrollView>

      {/* Review List Floating Bottom Bar */}
      <View className="absolute bottom-0 w-full px-6 pb-8 pt-4 z-50">
        <View className="bg-[#126c4a]/95 rounded-2xl p-4 flex-row items-center justify-between shadow-lg border border-primary/20">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Text className="text-on-primary font-headline font-bold text-lg">{shoppingList.length}</Text>
            </View>
            <View>
              <Text className="font-label text-xs font-bold text-[#99ebc0] uppercase tracking-widest">items in list</Text>
              <Text className="text-[10px] text-primary-fixed-dim">Family List: Active</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-full flex-row items-center gap-2 active:scale-95 transition-transform"
            onPress={() => navigation.navigate("ReviewList")}
          >
            <Text className="text-on-primary font-headline font-bold">Review List</Text>
            <Icon name="arrow-forward" size={16} className="text-on-primary" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
