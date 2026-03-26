import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useHistoryStore, PurchaseHistoryItem } from '../store/historyStore';
import { useAppStore } from '../store/appStore';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function HistoryScreen() {
  const { family } = useAppStore();
  const { history, fetchHistory } = useHistoryStore();

  useEffect(() => {
    if (family?.id) {
      fetchHistory();
    }
  }, [family?.id]);

  // Group items by month
  const groupedHistory = history.reduce((acc, item) => {
    const monthYear = format(new Date(item.purchasedAt), 'yyyy年MM月', { locale: ja });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {} as Record<string, PurchaseHistoryItem[]>);

  const sections = Object.keys(groupedHistory).map(title => ({
    title,
    data: groupedHistory[title],
  }));

  const renderItem = ({ item }: { item: PurchaseHistoryItem }) => {
    const formattedDate = format(new Date(item.purchasedAt), 'M月d日 HH:mm', { locale: ja });

    return (
      <View style={styles.card}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.itemTemplate.name}</Text>
          <Text style={styles.quantity}>x {item.quantity}</Text>
        </View>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>購入履歴</Text>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 15 }}
        ListEmptyComponent={<Text style={styles.emptyText}>購入履歴はありません</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', margin: 15, color: '#333' },

  sectionHeader: { fontSize: 18, fontWeight: 'bold', backgroundColor: '#f5f5f5', paddingVertical: 10, color: 'tomato' },

  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  quantity: { fontSize: 14, color: '#666', marginLeft: 10 },
  date: { fontSize: 12, color: '#888' },

  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});