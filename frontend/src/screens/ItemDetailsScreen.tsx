import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFridgeStore } from "../store/fridgeStore";
import { useShoppingStore } from "../store/shoppingStore";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { differenceInCalendarDays, parseISO, formatISO } from "date-fns";

type RootStackParamList = {
  ItemDetails: { itemId: string };
};

type ItemDetailsRouteProp = RouteProp<RootStackParamList, 'ItemDetails'>;

export default function ItemDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<ItemDetailsRouteProp>();
  const { itemId } = route.params;

  const { stockItems, updateItemTemplate, updateStockItem } = useFridgeStore();
  const { addToShoppingList } = useShoppingStore();

  const item = stockItems.find(i => i.id === itemId);

  const [itemName, setItemName] = useState("");
  const [notes, setNotes] = useState("");
  const [freshness, setFreshness] = useState(0);
  const [defaultExpiryDays, setDefaultExpiryDays] = useState(7);
  const [activePriority, setActivePriority] = useState<"medium" | "high" | "low">("medium");

  useEffect(() => {
    if (item) {
      setItemName(item.template?.name || "Unknown Item");
      setNotes(item.template?.memo || "");
      setDefaultExpiryDays(item.template?.defaultExpiryDays || 7);

      let daysLeft = 0;
      if (item.expiryDate) {
        daysLeft = differenceInCalendarDays(parseISO(item.expiryDate), new Date());
      } else {
        const startedAt = item.createdAt ? parseISO(item.createdAt) : new Date();
        const expiry = new Date(startedAt);
        expiry.setDate(expiry.getDate() + (item.template?.defaultExpiryDays || 7));
        daysLeft = differenceInCalendarDays(expiry, new Date());
      }
      setFreshness(Math.max(0, daysLeft));
    }
  }, [item]);

  if (!item) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-on-surface">アイテムが見つかりません</Text>
      </View>
    );
  }

  const saveUpdates = async () => {
    try {
      if (item.templateId) {
        await updateItemTemplate(item.templateId, {
          name: itemName,
          memo: notes,
          defaultExpiryDays: defaultExpiryDays
        });
      }

      // Update specific stock item details like expiryDate here
      const newExpiryDate = new Date();
      newExpiryDate.setDate(newExpiryDate.getDate() + freshness);
      await updateStockItem(item.id, {
        expiryDate: formatISO(newExpiryDate)
      });

      Alert.alert("Success", "Item updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      await addToShoppingList(item.templateId, activePriority);
      Alert.alert("Success", "Added to your shopping list!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add to shopping list.");
    }
  };

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Detail Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface-container-low bg-surface z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="p-2 -ml-2 rounded-full hover:bg-surface-variant transition-colors active:scale-95"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-on-surface" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl text-emerald-950">Item Details</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full hover:bg-emerald-50 transition-colors active:scale-95">
          <Icon name="more-vert" size={24} className="text-emerald-800" />
        </TouchableOpacity>
      </View>

      <ScrollView className="max-w-2xl mx-auto px-6 pb-32 w-full pt-4">
        {/* Hero Section: Image and Name */}
        <View className="relative mb-14 group">
          <View className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-surface-container-low">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAphcCDOkYvs1752de8SpmyNNuM8Fl7S-0X1FEIn9KHi1oUitU-vQjjCzqLKaW8u4eNlLGqsDPDSNIOCLcvR4S5ji_wq8mQE2l12I4ONpGsHi0-ypXF4ZwRfzAreJ_-EyRw897J_RAnEPxgxb8LWk6sq76KNe9iboAjaY7D86F1ujc5hPk1Yxt1FiHclR98h81GfvEY7pZ_5Cv5jhmw7W2ECRa65yZFgb95Dqpb5wcf2pmd-aEoEQJmOgEeJ5pcU3Qgb8BNLCuCtuss" }}
              className="w-full h-full"
            />
          </View>
          <View className="absolute -bottom-8 left-8 right-8">
            <View className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/20">
              <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant mb-1">Item Identity</Text>
              <TextInput
                className="w-full bg-transparent border-none p-0 font-headline font-extrabold text-3xl text-primary"
                placeholder="Enter item name..."
                value={itemName}
                onChangeText={setItemName}
              />
            </View>
          </View>
        </View>

        {/* Details Form */}
        <View className="gap-y-8 mt-12">
          {/* Description */}
          <View className="gap-y-3">
            <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant ml-2">Notes & Origin</Text>
            <View className="bg-surface-container-low rounded-lg p-4">
              <TextInput
                className="w-full bg-transparent border-none p-0 text-on-surface text-base leading-relaxed"
                placeholder="Add details about storage or farm source..."
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* Freshness Stepper */}
          <View className="gap-y-4">
            <View className="flex-row justify-between items-end px-2">
              <View>
                <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant mb-1">Vitality Gauge</Text>
                <Text className="font-headline font-bold text-xl text-primary">{freshness} Days Left</Text>
              </View>
              <View className="bg-primary-fixed px-4 py-1.5 rounded-full">
                <Text className="text-on-primary-fixed text-xs font-bold uppercase tracking-wider">Fresh</Text>
              </View>
            </View>
            <View className="bg-surface-container-low rounded-lg p-6">
              <View className="flex-row items-center gap-6">
                <TouchableOpacity
                  className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setFreshness(Math.max(0, freshness - 1))}
                >
                  <Icon name="remove" size={24} className="text-primary" />
                </TouchableOpacity>
                <View className="flex-1 h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <View className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (freshness / 14) * 100)}%` }}></View>
                </View>
                <TouchableOpacity
                  className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setFreshness(freshness + 1)}
                >
                  <Icon name="add" size={24} className="text-primary" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Template Default Days Stepper (Compact) */}
          <View className="gap-y-3">
            <View className="flex-row justify-between items-end px-2">
              <View>
                <Text className="font-label text-[10px] font-medium tracking-wide uppercase text-on-surface-variant mb-0.5">Default Shelf Life</Text>
                <Text className="font-headline font-bold text-base text-secondary">{defaultExpiryDays} Days</Text>
              </View>
              <View className="bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">Template</Text>
              </View>
            </View>
            <View className="bg-surface-container-low rounded-lg p-3 mx-2">
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setDefaultExpiryDays(Math.max(1, defaultExpiryDays - 1))}
                >
                  <Icon name="remove" size={18} className="text-secondary" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-on-surface-variant text-xs text-center">Applied when newly added</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setDefaultExpiryDays(defaultExpiryDays + 1)}
                >
                  <Icon name="add" size={18} className="text-secondary" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Priority Selector */}
          <View className="gap-y-3">
            <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant ml-2">Usage Priority</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'medium' ? 'bg-primary-fixed/30 border-2 border-primary-fixed-dim/50' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('medium')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'medium' ? 'text-on-primary-fixed' : 'text-on-surface-variant'}`}>MEDIUM</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'high' ? 'bg-secondary-fixed border-2 border-secondary/20' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('high')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'high' ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>HIGH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'low' ? 'bg-tertiary-container border-2 border-transparent' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('low')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'low' ? 'text-on-tertiary-container' : 'text-on-surface-variant'}`}>LOW</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-8 mb-4">
            <TouchableOpacity
              className="w-full py-4 px-8 rounded-xl bg-primary flex-row items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              onPress={saveUpdates}
            >
              <Icon name="save" size={20} className="text-on-primary" />
              <Text className="text-on-primary font-headline font-bold text-lg">Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Shopping List Section */}
          <View className="bg-secondary-container/10 border-2 border-dashed border-secondary-container/30 rounded-lg p-8 mt-12 items-center">
            <View className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mb-4">
              <Icon name="shopping-cart" size={30} className="text-on-secondary-container" />
            </View>
            <Text className="font-headline font-bold text-xl text-on-secondary-container mb-2">Out of Stock?</Text>
            <Text className="text-on-surface-variant text-sm mb-6 max-w-xs text-center font-body">Running low on greens? Tap below to add this to your family's collaborative shopping list.</Text>
            <TouchableOpacity
              className="w-full py-5 px-8 rounded-xl bg-primary flex-row items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
              onPress={handleAddToShoppingList}
            >
              <Text className="text-on-primary font-headline font-extrabold text-lg">Add to Shopping List</Text>
              <Icon name="add-circle" size={24} className="text-on-primary" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
