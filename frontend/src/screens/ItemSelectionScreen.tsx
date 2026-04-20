import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { differenceInCalendarDays } from 'date-fns';
import { FridgeItem } from '../types/store';

type RootStackParamList = {
  ItemSelection: { items: FridgeItem[], groupName: string };
  ItemDetails: { itemId: string };
};

type ItemSelectionRouteProp = RouteProp<RootStackParamList, 'ItemSelection'>;

export default function ItemSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<ItemSelectionRouteProp>();
  const { items, groupName } = route.params;
  const insets = useSafeAreaInsets();

  const getDaysLeft = (item: FridgeItem) => {
    if (item.endDate) return differenceInCalendarDays(new Date(item.endDate), new Date());
    if (item.startedAt) {
      const start = new Date(item.startedAt);
      const end = new Date(start.setDate(start.getDate() + (item.defaultDays || 7)));
      return differenceInCalendarDays(end, new Date());
    }
    return item.defaultDays || 7;
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => getDaysLeft(a) - getDaysLeft(b));
  }, [items]);

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top }}>
      {/* Top App Bar */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center justify-between z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low active:scale-95 transition-all"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-primary" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-xl tracking-tight text-primary">{groupName} の在庫</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-4 pb-32">
        <Text className="text-on-surface-variant mb-4">
          同じアイテムが {items.length} 個あります。確認または編集したいアイテムを選んでください。
        </Text>

        <View className="gap-y-3">
          {sortedItems.map((item, index) => {
            const daysLeft = getDaysLeft(item);
            return (
              <TouchableOpacity
                key={item.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex-row items-center justify-between shadow-sm active:scale-[0.98] transition-all"
                onPress={() => navigation.navigate("ItemDetails", { itemId: item.id })}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-headline font-bold text-base text-on-surface mb-1">
                    アイテム #{index + 1}
                  </Text>
                  {item.note && (
                    <View className="flex-row items-center gap-1.5 mt-1">
                      <Icon name="sticky-note-2" size={12} className="text-tertiary" />
                      <Text className="text-sm text-on-surface-variant" numberOfLines={2}>
                        {item.note}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="items-end gap-1 shrink-0 ml-auto bg-primary-container/20 px-3 py-2 rounded-lg">
                  <Text className="font-label text-[10px] uppercase font-bold text-primary">期限</Text>
                  <Text className={`font-headline font-bold text-base ${daysLeft < 0 ? 'text-error' : 'text-primary'}`}>
                    {daysLeft < 0 ? `期限切れ(${Math.abs(daysLeft)}日前)` : daysLeft === 0 ? "今日" : `あと${daysLeft}日`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
