import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useShoppingStore } from "../store/shoppingStore";

export default function RegisterItemScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { categories, addToShoppingList, createItemTemplate } = useShoppingStore();

  const [itemName, setItemName] = useState("");
  const [notes, setNotes] = useState("");
  const [freshness, setFreshness] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to first category if available
  const [activeCategoryId, setActiveCategoryId] = useState(categories.length > 0 ? categories[0].id : "");
  const [activePriority, setActivePriority] = useState<"TODAY" | "URGENT" | "NORMAL" | "LOW">("NORMAL");
  const [isTemplate, setIsTemplate] = useState<boolean>(true); // Toggle between template and one-time
  const [activeStorage, setActiveStorage] = useState<'FRIDGE' | 'FREEZER' | 'PANTRY'>('FRIDGE');

  const handleRegister = async () => {
    if (!itemName) {
      Alert.alert("エラー", "アイテム名を入力してください");
      return;
    }
    if (!activeCategoryId) {
      Alert.alert("エラー", "カテゴリを選択してください");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isTemplate) {
        const newTemplate = await createItemTemplate(itemName, activeCategoryId, freshness, activeStorage);
        if (newTemplate && newTemplate.id) {
          await addToShoppingList(newTemplate.id, activePriority, notes.trim());
          navigation.navigate("RegistrationSuccess", {
            itemName: newTemplate.name,
            location: "Shopping List", // Adjusted location
            expiresIn: `${freshness} Days`
          });
        } else {
          Alert.alert("エラー", "アイテムの作成に失敗しました");
        }
      } else {
        await addToShoppingList(null, activePriority, notes.trim(), 'shopping', itemName, activeCategoryId, freshness);
        navigation.navigate("RegistrationSuccess", {
          itemName: itemName,
          location: "Shopping List", // Adjusted location
          expiresIn: `${freshness} Days`
        });
      }
    } catch (e) {
      Alert.alert("エラー", "アイテムの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-all"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-[#2D6A4F]" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl tracking-tight text-[#2D6A4F]">Register & Add to Shopping List</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-all">
          <Icon name="more-vert" size={24} className="text-[#2D6A4F]" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 gap-y-6" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Hero Image Upload Section */}
        <View className="mt-4 mb-2">
          <TouchableOpacity className="relative w-full aspect-[16/10] bg-surface-container-high rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-outline-variant/30 active:border-primary/40 transition-all">
            <View className="items-center justify-center gap-3">
              <View className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center">
                <Icon name="add-a-photo" size={30} className="text-on-primary-fixed-variant" />
              </View>
              <View className="items-center">
                <Text className="font-headline font-semibold text-on-surface">Upload Item Photo</Text>
                <Text className="text-on-surface-variant text-sm">Snap a picture for visual tracking</Text>
              </View>
            </View>
            {/* Decorative Backdrop */}
            <View className="absolute inset-0 -z-10 opacity-10 bg-primary/20"></View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="gap-y-6">
          {/* Item Name */}
          <View className="gap-y-2">
            <Text className="font-headline font-bold text-primary ml-1">Item Name</Text>
            <View className="bg-surface-container-low rounded-full px-6 py-4 flex-row items-center shadow-sm">
              <Icon name="shopping-basket" size={20} className="text-outline mr-3" />
              <TextInput
                className="flex-1 bg-transparent border-none text-on-surface font-medium"
                placeholder="Enter item name..."
                placeholderTextColor="#bfc9c1"
                value={itemName}
                onChangeText={setItemName}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View className="gap-y-2">
            <Text className="font-headline font-bold text-primary ml-1">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm ${activeCategoryId === cat.id ? 'bg-primary' : 'bg-surface-container-high'}`}
                  onPress={() => setActiveCategoryId(cat.id)}
                >
                  <Text className={`font-medium text-sm ${activeCategoryId === cat.id ? 'text-on-primary' : 'text-on-surface-variant'}`}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Type Toggle */}
          <View className="gap-y-3 mt-2 mb-2">
             <Text className="font-headline font-bold text-primary ml-1">登録方法</Text>
             <View className="flex-row bg-surface-container-low rounded-full p-1 border border-outline-variant/30">
               <TouchableOpacity
                 className={`flex-1 items-center justify-center py-3 rounded-full transition-all ${isTemplate ? 'bg-primary' : 'bg-transparent'}`}
                 onPress={() => setIsTemplate(true)}
               >
                 <Text className={`font-bold ${isTemplate ? 'text-on-primary' : 'text-on-surface-variant'}`}>定番として追加</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 className={`flex-1 items-center justify-center py-3 rounded-full transition-all ${!isTemplate ? 'bg-secondary' : 'bg-transparent'}`}
                 onPress={() => setIsTemplate(false)}
               >
                 <Text className={`font-bold ${!isTemplate ? 'text-on-secondary' : 'text-on-surface-variant'}`}>今回限りとして追加</Text>
               </TouchableOpacity>
             </View>
          </View>

          {/* Storage Type (Only visible if isTemplate is true) */}
          {isTemplate && (
            <View className="gap-y-3 mt-2 mb-2">
               <Text className="font-headline font-bold text-primary ml-1">保存先</Text>
               <View className="flex-row bg-surface-container-low rounded-lg p-1 border border-outline-variant/30 gap-1">
                 <TouchableOpacity
                   className={`flex-1 items-center justify-center py-3 rounded-lg transition-all ${activeStorage === 'FRIDGE' ? 'bg-primary' : 'bg-surface-container-high'}`}
                   onPress={() => setActiveStorage('FRIDGE')}
                 >
                   <Icon name="kitchen" size={20} className={activeStorage === 'FRIDGE' ? 'text-on-primary mb-1' : 'text-outline mb-1'} />
                   <Text className={`font-bold text-xs ${activeStorage === 'FRIDGE' ? 'text-on-primary' : 'text-on-surface-variant'}`}>冷蔵庫</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   className={`flex-1 items-center justify-center py-3 rounded-lg transition-all ${activeStorage === 'FREEZER' ? 'bg-primary' : 'bg-surface-container-high'}`}
                   onPress={() => setActiveStorage('FREEZER')}
                 >
                   <Icon name="ac-unit" size={20} className={activeStorage === 'FREEZER' ? 'text-on-primary mb-1' : 'text-outline mb-1'} />
                   <Text className={`font-bold text-xs ${activeStorage === 'FREEZER' ? 'text-on-primary' : 'text-on-surface-variant'}`}>冷凍庫</Text>
                 </TouchableOpacity>
                 <TouchableOpacity
                   className={`flex-1 items-center justify-center py-3 rounded-lg transition-all ${activeStorage === 'PANTRY' ? 'bg-primary' : 'bg-surface-container-high'}`}
                   onPress={() => setActiveStorage('PANTRY')}
                 >
                   <Icon name="inventory-2" size={20} className={activeStorage === 'PANTRY' ? 'text-on-primary mb-1' : 'text-outline mb-1'} />
                   <Text className={`font-bold text-xs ${activeStorage === 'PANTRY' ? 'text-on-primary' : 'text-on-surface-variant'}`}>パントリー</Text>
                 </TouchableOpacity>
               </View>
            </View>
          )}

          {/* Notes & Origin */}
          <View className="gap-y-2">
            <Text className="font-headline font-bold text-primary ml-1">{isTemplate ? "我が家メモ (定番メモ)" : "今回のメモ"}</Text>
            <View className="bg-surface-container-low rounded-lg px-6 py-4 shadow-sm min-h-[120px]">
              <TextInput
                className="flex-1 bg-transparent border-none text-on-surface font-medium"
                placeholder={isTemplate ? "例: いつも低脂肪を買う" : "例: 特売のやつでいいよ"}
                placeholderTextColor="#bfc9c1"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

          {/* Default Freshness Controls */}
          <View className="gap-y-2">
            <Text className="font-headline font-bold text-primary ml-1">Average Freshness (Days)</Text>
            <View className="bg-surface-container-low rounded-full px-4 py-3 flex-row items-center justify-between shadow-sm">
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center active:scale-90 transition-transform"
                onPress={() => setFreshness(Math.max(1, freshness - 1))}
              >
                <Icon name="remove" size={24} className="text-primary" />
              </TouchableOpacity>
              <View className="items-center">
                <Text className="text-2xl font-bold text-on-surface">{freshness}</Text>
                <Text className="text-sm text-outline leading-none">Days</Text>
              </View>
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-primary flex items-center justify-center active:scale-90 transition-transform"
                onPress={() => setFreshness(freshness + 1)}
              >
                <Icon name="add" size={24} className="text-on-primary" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Priority Level */}
          <View className="gap-y-3 mb-8">
            <Text className="font-headline font-bold text-primary ml-1">Priority Level</Text>
            <View className="flex-row justify-between gap-3">
              <TouchableOpacity
                className={`flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activePriority === 'NORMAL' ? 'bg-primary-fixed/30 border-primary-fixed-dim/50' : 'bg-surface-container border-transparent'}`}
                onPress={() => setActivePriority('NORMAL')}
              >
                <Icon name="low-priority" size={24} className={`mb-1 ${activePriority === 'NORMAL' ? 'text-on-primary-fixed' : 'text-outline'}`} />
                <Text className={`text-[10px] font-bold tracking-widest uppercase ${activePriority === 'NORMAL' ? 'text-on-primary-fixed' : 'text-outline'}`}>NORMAL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activePriority === 'TODAY' ? 'bg-secondary-fixed border-secondary' : 'bg-surface-container border-transparent'}`}
                onPress={() => setActivePriority('TODAY')}
              >
                <Icon name="priority-high" size={24} className={`mb-1 ${activePriority === 'TODAY' ? 'text-secondary' : 'text-outline'}`} />
                <Text className={`text-[10px] font-bold tracking-widest uppercase ${activePriority === 'TODAY' ? 'text-secondary' : 'text-outline'}`}>TODAY</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${activePriority === 'URGENT' ? 'bg-tertiary-fixed border-tertiary' : 'bg-surface-container border-transparent'}`}
                onPress={() => setActivePriority('URGENT')}
              >
                <Icon name="emergency" size={24} className={`mb-1 ${activePriority === 'URGENT' ? 'text-tertiary' : 'text-outline'}`} />
                <Text className={`text-[10px] font-bold tracking-widest uppercase ${activePriority === 'URGENT' ? 'text-tertiary' : 'text-outline'}`}>URGENT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button Section (Floating above Nav) */}
      <View className="absolute bottom-0 w-full px-6 py-6 bg-surface/90 z-50">
        <TouchableOpacity
          className="w-full bg-primary py-5 rounded-xl shadow-lg flex-row items-center justify-center gap-3 active:scale-95 transition-transform"
          onPress={handleRegister}
        >
          <Icon name="add-circle" size={24} className="text-on-primary" />
          <Text className="text-on-primary font-headline font-extrabold text-lg">Register & Add to Shopping List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
