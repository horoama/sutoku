import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, Alert, TextInput, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../store/appStore";
import { useShoppingStore, ItemTemplate, ShoppingItem } from "../store/shoppingStore";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const { user, family, initializeUser } = useAppStore();
  const { categories, shoppingList, fetchCategories, fetchShoppingList, addToShoppingList, purchaseItem } = useShoppingStore();

  const [activeTab, setActiveTab] = useState<"LIST" | "ADD">("LIST");
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<ItemTemplate | null>(null);
  const [addNote, setAddNote] = useState("");

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (family?.id) {
      fetchCategories();
      fetchShoppingList();
    }
  }, [family?.id]);

  const handleLongPress = (item: ShoppingItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleMoveToFridge = async () => {
    if (selectedItem) {
      await purchaseItem(selectedItem.id);
      setModalVisible(false);
      setSelectedItem(null);
      Alert.alert("完了", "冷蔵庫に追加しました！");
    }
  };

  const openAddModal = (item: ItemTemplate) => {
    setItemToAdd(item);
    setAddNote("");
    setAddModalVisible(true);
  };

  const confirmAddItem = (priority: "TODAY" | "SOMEDAY") => {
    if (itemToAdd) {
      addToShoppingList(itemToAdd.id, priority, addNote.trim());
      setAddModalVisible(false);
      setItemToAdd(null);
      setAddNote("");
      Alert.alert("追加完了", `${itemToAdd.name} をリストに追加しました`);
    }
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <TouchableOpacity
      className="group relative overflow-hidden bg-surface-container-lowest rounded-lg p-4 flex-row items-center justify-between transition-all active:scale-[0.98] mb-3 border border-surface-variant/20"
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center gap-4 flex-1">
        <View className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
          <Icon name="local-grocery-store" size={24} className="text-primary-container" />
        </View>
        <View className="flex-1">
          <Text className="font-headline font-bold text-on-surface text-base">{item.itemTemplate.name}</Text>
          {item.note ? (
            <Text className="text-xs text-outline font-medium">{item.note}</Text>
          ) : null}
          {item.priority === "TODAY" && (
            <View className="flex-row gap-2 mt-1">
              <View className="bg-tertiary-container px-2 py-0.5 rounded-full">
                <Text className="text-on-tertiary-container text-[10px] font-bold uppercase">High Priority</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
          <Icon name="check" size={20} className="text-on-secondary-fixed-variant" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Top Navigation */}
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-background z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBowsR1V_bmcfj3DnRBJQG6Tn9zWNWiH1HX9l28XP8xy3hJ6GZeUmkN7jg8CX6lPc0KFWVP7nar6sSrHgnEIxp3oi-6nwIDVXJ9vjttUP_O4P-8suIxcEPr0tQGYEMRaXycC9CPL5WeOf9HicgMi9sggebxUZJZVj3WFLAPBH4PSDZ7FvIRfbrQwpuSrhmJKUNok5lEBM8a5pf20_XJYXBOq_YnbDTzXN86_KHrq_rnfjrvas0hhilKEbrZjzxadvuLaWdxnRqg1BuE" }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-primary font-headline font-bold text-lg tracking-tight">The Living Larder</Text>
        </View>
        <TouchableOpacity className="active:opacity-80 transition-opacity">
          <Icon name="notifications" size={24} className="text-primary" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-4" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Hero / Progress Section */}
        <View className="space-y-4 mb-8">
          <View className="flex-row justify-between items-end mb-2">
            <View className="space-y-1">
              <Text className="font-label text-xs font-bold uppercase tracking-[0.05rem] text-outline">WEEKLY RUN</Text>
              <Text className="font-headline text-3xl font-extrabold text-primary tracking-tight">Shopping List</Text>
            </View>
            <View className="items-end">
              <Text className="font-headline text-2xl font-black text-primary">{shoppingList?.length || 0}</Text>
              <Text className="font-body text-sm text-outline">items</Text>
            </View>
          </View>
          <View className="h-4 w-full bg-surface-container-high rounded-full overflow-hidden p-1">
            <View className="h-full w-1/2 bg-primary rounded-full"></View>
          </View>
        </View>

        {/* Categories / Items */}
        {activeTab === "LIST" ? (
          <View className="space-y-10">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-2">
                <Icon name="shopping-basket" size={24} className="text-primary" />
                <Text className="font-headline text-xl font-bold text-primary">To Buy</Text>
              </View>
              <View className="bg-primary-fixed px-3 py-1 rounded-full">
                <Text className="text-on-primary-fixed text-xs font-bold uppercase tracking-wider">{shoppingList?.length || 0} Items</Text>
              </View>
            </View>

            <FlatList
              data={shoppingList}
              keyExtractor={(item) => item.id}
              renderItem={renderShoppingItem}
              scrollEnabled={false}
              ListEmptyComponent={<Text className="text-center text-outline mt-10">買い物リストは空です</Text>}
            />
          </View>
        ) : (
          <View className="space-y-6">
            <Text className="font-headline text-xl font-bold text-primary mb-4">Add Items</Text>
            {categories.map(category => (
              <View key={category.id} className="mb-6 bg-surface-container-low rounded-xl p-4">
                <Text className="font-headline font-bold text-lg text-on-surface mb-3">{category.name}</Text>
                {category.items.map(item => (
                  <View key={item.id} className="flex-row justify-between items-center py-3 border-b border-surface-variant/30">
                    <Text className="font-body text-on-surface text-base">{item.name}</Text>
                    <TouchableOpacity
                      className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center"
                      onPress={() => openAddModal(item)}
                    >
                      <Icon name="add" size={20} className="text-on-secondary-fixed-variant" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Bar */}
      <View className="absolute bottom-32 right-6 z-50">
        <TouchableOpacity
          className="flex-row items-center gap-3 bg-primary px-6 py-4 rounded-xl shadow-lg active:scale-95 transition-all"
          onPress={() => setActiveTab(activeTab === "LIST" ? "ADD" : "LIST")}
        >
          <Icon name={activeTab === "LIST" ? "add-circle" : "list"} size={24} color="#ffffff" />
          <Text className="text-on-primary font-headline font-bold">
            {activeTab === "LIST" ? "Add Item" : "View List"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface-container-lowest p-6 rounded-2xl w-4/5 items-center">
            <Text className="font-headline text-lg font-bold mb-6 text-center text-on-surface">
              {selectedItem?.itemTemplate.name} を購入しましたか？
            </Text>
            <TouchableOpacity className="w-full bg-primary py-4 rounded-xl items-center mb-3" onPress={handleMoveToFridge}>
              <Text className="text-on-primary font-bold text-base">冷蔵庫 / 食糧庫に入れる</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center" onPress={() => setModalVisible(false)}>
              <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={addModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-surface-container-lowest p-6 rounded-2xl w-11/12 items-center">
            <Text className="font-headline text-lg font-bold mb-4 text-on-surface">{itemToAdd?.name} を追加</Text>
            <TextInput
              className="w-full bg-surface-container-low p-4 rounded-xl mb-6 font-body text-base text-on-surface"
              placeholder="メモ (例: 2個、メーカー指定など)"
              value={addNote}
              onChangeText={setAddNote}
            />
            <View className="flex-row justify-between w-full gap-3 mb-3">
              <TouchableOpacity className="flex-1 bg-tertiary-container py-4 rounded-xl items-center" onPress={() => confirmAddItem("TODAY")}>
                <Text className="text-on-tertiary-container font-bold text-sm">今日買う</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-primary-fixed py-4 rounded-xl items-center" onPress={() => confirmAddItem("SOMEDAY")}>
                <Text className="text-on-primary-fixed font-bold text-sm">いつか買う</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="w-full bg-surface-variant py-4 rounded-xl items-center mt-2" onPress={() => setAddModalVisible(false)}>
              <Text className="text-on-surface-variant font-bold text-base">キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

