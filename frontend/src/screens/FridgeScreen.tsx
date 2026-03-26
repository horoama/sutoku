import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking } from 'react-native';
import { useFridgeStore, FridgeItem } from '../store/fridgeStore';
import { useAppStore } from '../store/appStore';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import Icon from '@expo/vector-icons/Ionicons';

export default function FridgeScreen() {
  const { family } = useAppStore();
  const { fridgeItems, fetchFridgeItems } = useFridgeStore();

  useEffect(() => {
    if (family?.id) {
      fetchFridgeItems();
    }
  }, [family?.id]);

  const searchRecipe = () => {
    if (fridgeItems.length === 0) return;
    const ingredients = fridgeItems.slice(0, 3).map(i => i.itemTemplate.name).join(' ');
    const url = `https://www.google.com/search?q=${encodeURIComponent(ingredients + ' レシピ')}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: FridgeItem }) => {
    const daysLeft = differenceInDays(new Date(item.expirationDate), new Date());
    const isExpired = daysLeft < 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.itemTemplate.name}</Text>
          <Text style={styles.locationBadge}>{item.location === 'FRIDGE' ? '冷蔵庫' : '食糧庫'}</Text>
        </View>

        <View style={[styles.expirationBox, isExpired ? styles.expiredBg : (daysLeft <= 2 ? styles.warningBg : styles.safeBg)]}>
          <Text style={styles.expirationText}>
            {isExpired ? '期限切れ' : `残り ${daysLeft}日`}
          </Text>
          <Text style={styles.dateText}>({formatDistanceToNow(new Date(item.expirationDate), { addSuffix: true, locale: ja })})</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.recipeBtn} onPress={searchRecipe}>
        <Icon name="search" size={20} color="#fff" />
        <Text style={styles.recipeBtnText}>冷蔵庫の中身でレシピ検索</Text>
      </TouchableOpacity>

      <FlatList
        data={fridgeItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
        ListEmptyComponent={<Text style={styles.emptyText}>冷蔵庫は空です</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  recipeBtn: { flexDirection: 'row', backgroundColor: '#4caf50', margin: 15, padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  recipeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardInfo: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  locationBadge: { fontSize: 12, color: '#666' },

  expirationBox: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  safeBg: { backgroundColor: '#e8f5e9' },
  warningBg: { backgroundColor: '#fff3e0' },
  expiredBg: { backgroundColor: '#ffebee' },

  expirationText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  dateText: { fontSize: 10, color: '#666', marginTop: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});