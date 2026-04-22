import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useFridgeStore } from "../store/fridgeStore";
import { useShoppingStore } from "../store/shoppingStore";
import { differenceInCalendarDays, addDays } from "date-fns";

type ParamList = {
  ItemDetails: { itemId: string };
};

export default function ItemDetailsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, 'ItemDetails'>>();

  const { fridgeItems, updateFridgeItem, updateItemTemplate } = useFridgeStore();
  const { addToShoppingList } = useShoppingStore();

  const itemId = route.params?.itemId;
  const initialItem = fridgeItems.find(i => i.id === itemId);

  const [itemName, setItemName] = useState(initialItem?.itemTemplate?.name || "");
  const [notes, setNotes] = useState(initialItem?.itemTemplate?.name ? `Stored safely.` : "");

  const initialDefaultDays = initialItem?.defaultDays || initialItem?.itemTemplate?.defaultDays || 7;
  const [defaultDays, setDefaultDays] = useState(initialDefaultDays);

  // 初期残り日数の計算
  let initialDaysLeft = 7;
  if (initialItem) {
    const itemDefaultDays = initialDefaultDays;
    if (initialItem.endDate) {
      // ユーザーが手動で終了日(endDate)を設定していた場合はそれから計算
      initialDaysLeft = differenceInCalendarDays(new Date(initialItem.endDate), new Date());
    } else if (initialItem.startedAt) {
      // なければ、保管開始日とデフォルトの日数から推定される終了日を計算
      const startDate = new Date(initialItem.startedAt);
      const endDate = new Date(startDate.setDate(startDate.getDate() + itemDefaultDays));
      initialDaysLeft = differenceInCalendarDays(endDate, new Date());
    } else {
      initialDaysLeft = itemDefaultDays;
    }
  }

  // 異常な日付データに対するフォールバック
  if (isNaN(initialDaysLeft)) {
      initialDaysLeft = 7;
  }

  const [freshness, setFreshness] = useState(Math.max(0, initialDaysLeft));
  const [activePriority, setActivePriority] = useState<"TODAY" | "URGENT" | "NORMAL" | "LOW">("NORMAL");
  const [storageType, setStorageType] = useState<'FRIDGE' | 'PANTRY'>(initialItem?.itemTemplate?.storageType || 'FRIDGE');

  const saveUpdates = async () => {
    if (initialItem) {
       try {
         // 1. アイテムテンプレートの更新
         // IsSystem=true(システム共通)のテンプレートの場合、バックエンド側で自動的に
         // FamilyID が紐づいたカスタムテンプレートとして複製(Duplicate)され返却されます
         const newTemplate = await updateItemTemplate(initialItem.itemTemplateId, {
           name: itemName,
           defaultDays: defaultDays,
           storageType: storageType
         });

         // 2. FridgeItem の更新
         // 複製されて新しくなったテンプレートIDと、UIのStepperで調整された残り日数から逆算した新しい消費期限を保存
         const newEndDate = addDays(new Date(), freshness).toISOString();
         await updateFridgeItem(initialItem.id, {
           endDate: newEndDate,
           itemTemplateId: newTemplate.id
         });

         Alert.alert("Success", "Changes saved successfully.");
       } catch (error) {
         Alert.alert("Error", "Failed to save changes.");
       }
    }
  };

  const handleAddToShoppingList = async () => {
    if (initialItem) {
      await addToShoppingList(initialItem.itemTemplateId, activePriority, notes.trim());
      Alert.alert("Success", "Added to your shopping list!");
      navigation.navigate("MainTabs", { screen: "Shopping" });
    }
  };

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* Top App Bar */}
      <View className="w-full bg-[#f8faf6] flex-row items-center justify-between px-6 py-4 z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="p-2 rounded-full hover:bg-emerald-50 transition-colors active:scale-95"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-emerald-800" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-2xl tracking-tight text-emerald-800">Item Details</Text>
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
                <Text className="font-headline font-bold text-base text-secondary">{defaultDays} Days</Text>
              </View>
              <View className="bg-secondary-container px-3 py-1 rounded-full">
                <Text className="text-on-secondary-container text-[10px] font-bold uppercase tracking-wider">Template</Text>
              </View>
            </View>
            <View className="bg-surface-container-low rounded-lg p-3 mx-2">
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setDefaultDays(Math.max(1, defaultDays - 1))}
                >
                  <Icon name="remove" size={18} className="text-secondary" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                  <Text className="text-on-surface-variant text-xs text-center">Applied when newly added</Text>
                </View>
                <TouchableOpacity
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-all"
                  onPress={() => setDefaultDays(defaultDays + 1)}
                >
                  <Icon name="add" size={18} className="text-secondary" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Storage Type Selector */}
          <View className="gap-y-3">
            <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant ml-2">Storage Location</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors flex-row gap-2 ${storageType === 'FRIDGE' ? 'bg-primary-fixed/30 border-2 border-primary-fixed-dim/50' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setStorageType('FRIDGE')}
              >
                <Icon name="kitchen" size={20} className={storageType === 'FRIDGE' ? 'text-on-primary-fixed' : 'text-on-surface-variant'} />
                <Text className={`font-headline font-bold text-sm ${storageType === 'FRIDGE' ? 'text-on-primary-fixed' : 'text-on-surface-variant'}`}>Fridge</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors flex-row gap-2 ${storageType === 'PANTRY' ? 'bg-secondary-fixed/30 border-2 border-secondary-fixed-dim/50' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setStorageType('PANTRY')}
              >
                <Icon name="inventory-2" size={20} className={storageType === 'PANTRY' ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'} />
                <Text className={`font-headline font-bold text-sm ${storageType === 'PANTRY' ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>Pantry</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Priority Selector */}
          <View className="gap-y-3">
            <Text className="font-label text-[11px] font-medium tracking-wide uppercase text-on-surface-variant ml-2">Usage Priority</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'NORMAL' ? 'bg-primary-fixed/30 border-2 border-primary-fixed-dim/50' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('NORMAL')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'NORMAL' ? 'text-on-primary-fixed' : 'text-on-surface-variant'}`}>NORMAL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'URGENT' ? 'bg-secondary-fixed border-2 border-secondary/20' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('URGENT')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'URGENT' ? 'text-on-secondary-fixed-variant' : 'text-on-surface-variant'}`}>URGENT</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-4 rounded-lg items-center justify-center transition-colors ${activePriority === 'TODAY' ? 'bg-tertiary-container border-2 border-transparent' : 'bg-surface-container-low border-2 border-transparent'}`}
                onPress={() => setActivePriority('TODAY')}
              >
                <Text className={`font-headline font-bold text-sm ${activePriority === 'TODAY' ? 'text-on-tertiary-container' : 'text-on-surface-variant'}`}>TODAY</Text>
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
