import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFridgeStore, FridgeItem } from "../store/fridgeStore";
import { useAppStore } from "../store/appStore";
import { differenceInDays } from "date-fns";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function FridgeScreen() {
  const insets = useSafeAreaInsets();
  const { family } = useAppStore();
  const { fridgeItems, fetchFridgeItems } = useFridgeStore();

  useEffect(() => {
    if (family?.id) {
      fetchFridgeItems();
    }
  }, [family?.id]);

  const searchRecipe = () => {
    if (fridgeItems.length === 0) return;
    const ingredients = fridgeItems.slice(0, 3).map((i) => i.itemTemplate.name).join(" ");
    const url = `https://www.google.com/search?q=${encodeURIComponent(ingredients + " レシピ")}`;
    Linking.openURL(url);
  };

  const expiringItems = fridgeItems.filter(item => differenceInDays(new Date(item.expirationDate), new Date()) <= 3);
  const fridgeSection = fridgeItems.filter(item => item.location === "FRIDGE");
  const pantrySection = fridgeItems.filter(item => item.location === "PANTRY");

  const renderUrgentItem = (item: FridgeItem) => {
    const daysLeft = differenceInDays(new Date(item.expirationDate), new Date());
    const isCritical = daysLeft <= 1;

    return (
      <View key={item.id} className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm relative overflow-hidden mb-4">
        <View className={`absolute top-0 left-0 w-1 h-full ${isCritical ? "bg-error" : "bg-secondary-container"}`}></View>
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-row items-center gap-3">
            <View className={`w-12 h-12 rounded-full flex items-center justify-center ${isCritical ? "bg-error-container" : "bg-secondary-fixed"}`}>
              <Icon name="restaurant" size={24} className={isCritical ? "text-on-error-container" : "text-on-secondary-fixed-variant"} />
            </View>
            <View>
              <Text className="font-headline font-bold text-on-surface text-base">{item.itemTemplate.name}</Text>
              <Text className="text-xs text-on-surface-variant font-body">{item.location === "FRIDGE" ? "Fridge Section" : "Pantry Section"}</Text>
            </View>
          </View>
          <View className={`${isCritical ? "bg-error-container" : "bg-secondary-container"} px-2 py-1 rounded-full`}>
            <Text className={`${isCritical ? "text-on-error-container" : "text-on-secondary-container"} text-[10px] font-bold`}>
              {daysLeft < 0 ? "EXPIRED" : daysLeft === 0 ? "TODAY" : `${daysLeft} DAYS`}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-2 mt-4">
          <TouchableOpacity className="flex-1 bg-primary py-2 rounded-xl items-center transition-all active:scale-95">
            <Text className="text-on-primary text-xs font-bold">Consume</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderListItem = (item: FridgeItem) => {
    const daysLeft = differenceInDays(new Date(item.expirationDate), new Date());
    return (
      <View key={item.id} className="bg-surface-container-low p-4 rounded-lg flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-4 flex-1">
          <View className={`w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center ${item.location === "FRIDGE" ? "text-primary-container" : "text-secondary"}`}>
            <Icon name={item.location === "FRIDGE" ? "kitchen" : "shelves"} size={20} className={item.location === "FRIDGE" ? "text-primary-container" : "text-secondary"} />
          </View>
          <View className="flex-1">
            <Text className="font-headline font-bold text-on-surface text-base">{item.itemTemplate.name}</Text>
            <View className="flex-row items-center gap-2 mt-1">
              <View className="flex-1 h-1 bg-outline-variant/30 rounded-full overflow-hidden">
                <View className={`h-full ${daysLeft > 7 ? "bg-primary-fixed w-[80%]" : daysLeft > 3 ? "bg-secondary-container w-[40%]" : "bg-error w-[10%]"}`}></View>
              </View>
              <Text className={`text-[10px] font-bold uppercase tracking-tighter ${daysLeft > 7 ? "text-on-surface-variant" : daysLeft > 3 ? "text-secondary" : "text-error"}`}>
                {daysLeft < 0 ? "Expired" : `${daysLeft} Days Left`}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row gap-2 ml-4">
          <TouchableOpacity className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
            <Icon name="check-circle" size={16} className="text-on-surface-variant" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-surface text-on-surface" style={{ paddingTop: insets.top }}>
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy8DZP0G25aqYUnJmE19bNA76PgkOTsaM4_kS0tc_htL8LfVNbfzwZOZled6YyAWWDo6D_b-U4vGd0nVIfogk6AfeKPx1gexkXq9nRA3V0ZJeDtOjJ1DkxtZdVq49_G-HTh8gj7_ibBKAWfmXSn5IBHdX8WS1rslxQMZ_tdQASK9cwhHtqTBi2G0AQ4KuTnvaueAKFc72XDPsT3RyNKGEoK2LRDSFBOskfFcUEwJAu_-Q7Gatnz1Hd_su39om5qilWtygtUW13JvGs" }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-primary font-headline font-bold text-lg tracking-tight">The Living Larder</Text>
        </View>
        <TouchableOpacity className="active:opacity-80 transition-opacity">
          <Icon name="notifications" size={24} className="text-outline" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-4" contentContainerStyle={{ paddingBottom: 160 }}>
        <View className="mb-10 mt-4">
          <Text className="font-headline text-primary font-extrabold text-4xl leading-tight tracking-tighter">
            Inventory{"\n"}<Text className="text-secondary">Freshness Hub</Text>
          </Text>
          <Text className="text-on-surface-variant mt-2 font-body text-base">Keeping your kitchen vibrant and waste-free.</Text>
        </View>

        {expiringItems.length > 0 && (
          <View className="mb-12">
            <View className="flex-row items-center justify-between mb-4 px-2">
              <Text className="font-headline font-bold text-xl text-on-surface">Expiring Soon</Text>
              <View className="bg-tertiary-container px-3 py-1 rounded-full">
                <Text className="text-on-tertiary-container text-[10px] font-bold tracking-widest uppercase">Action Required</Text>
              </View>
            </View>
            <View>
              {expiringItems.map(renderUrgentItem)}
            </View>
          </View>
        )}

        <View className="space-y-12">
          {fridgeSection.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center gap-3 mb-6">
                <View className="p-2 bg-primary-fixed rounded-xl">
                  <Icon name="kitchen" size={24} className="text-on-primary-fixed-variant" />
                </View>
                <Text className="font-headline font-bold text-2xl text-primary">The Fridge</Text>
              </View>
              <View>
                {fridgeSection.map(renderListItem)}
              </View>
            </View>
          )}

          {pantrySection.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center gap-3 mb-6">
                <View className="p-2 bg-secondary-fixed rounded-xl">
                  <Icon name="shelves" size={24} className="text-on-secondary-fixed-variant" />
                </View>
                <Text className="font-headline font-bold text-2xl text-secondary">The Pantry</Text>
              </View>
              <View>
                {pantrySection.map(renderListItem)}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          className="mt-4 mb-8 bg-primary-container p-6 rounded-lg relative overflow-hidden active:scale-95 transition-all"
          onPress={searchRecipe}
        >
          <View className="relative z-10">
            <Text className="font-headline font-bold text-lg mb-2 text-on-primary-container">Recipe Suggestions</Text>
            <Text className="text-on-primary-container text-sm leading-relaxed font-body">Tap to search Google for recipes using items in your inventory.</Text>
          </View>
          <Icon name="restaurant-menu" size={80} className="absolute -right-4 -bottom-4 opacity-20 text-on-primary-container" />
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-32 right-6 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all z-40"
      >
        <Icon name="add" size={28} className="text-on-primary" />
      </TouchableOpacity>
    </View>
  );
}

