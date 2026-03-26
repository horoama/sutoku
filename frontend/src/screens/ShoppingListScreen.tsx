import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { useAppStore } from '../store/appStore';
import { useShoppingStore, ItemTemplate, ShoppingItem } from '../store/shoppingStore';
import Icon from '@expo/vector-icons/Ionicons';

export default function ShoppingListScreen() {
  const { user, family, initializeUser } = useAppStore();
  const { categories, shoppingList, fetchCategories, fetchShoppingList, addToShoppingList, purchaseItem } = useShoppingStore();

  const [activeTab, setActiveTab] = useState<'LIST' | 'ADD'>('LIST');
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // New states for item addition with note
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState<ItemTemplate | null>(null);
  const [addNote, setAddNote] = useState('');

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
      Alert.alert('完了', '冷蔵庫に追加しました！');
    }
  };

  const renderShoppingItem = ({ item }: { item: ShoppingItem }) => (
    <TouchableOpacity
      style={styles.listItem}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemInfo}>
        <View>
          <Text style={styles.itemName}>{item.itemTemplate.name}</Text>
          {item.note && <Text style={styles.itemNote}>メモ: {item.note}</Text>}
        </View>
        <Text style={[styles.priorityBadge, item.priority === 'TODAY' ? styles.todayBadge : styles.somedayBadge]}>
          {item.priority === 'TODAY' ? '今日買う' : 'いつか'}
        </Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const openAddModal = (item: ItemTemplate) => {
    setItemToAdd(item);
    setAddNote('');
    setAddModalVisible(true);
  };

  const confirmAddItem = (priority: 'TODAY' | 'SOMEDAY') => {
    if (itemToAdd) {
      addToShoppingList(itemToAdd.id, priority, addNote.trim());
      setAddModalVisible(false);
      setItemToAdd(null);
      setAddNote('');
      Alert.alert('追加完了', `${itemToAdd.name} をリストに追加しました`);
    }
  };

  const renderCategoryItem = ({ item }: { item: ItemTemplate }) => (
    <View style={styles.addItemRow}>
      <Text style={styles.addItemName}>{item.name}</Text>
      <TouchableOpacity style={styles.openAddModalBtn} onPress={() => openAddModal(item)}>
        <Icon name="add-circle" size={24} color="tomato" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'LIST' && styles.activeTab]} onPress={() => setActiveTab('LIST')}>
          <Text style={[styles.tabText, activeTab === 'LIST' && styles.activeTabText]}>買い物リスト</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'ADD' && styles.activeTab]} onPress={() => setActiveTab('ADD')}>
          <Text style={[styles.tabText, activeTab === 'ADD' && styles.activeTabText]}>アイテムを追加</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'LIST' ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.helpText}>長押しで冷蔵庫へ移動</Text>
          <FlatList
            data={shoppingList}
            keyExtractor={item => item.id}
            renderItem={renderShoppingItem}
            ListEmptyComponent={<Text style={styles.emptyText}>買い物リストは空です</Text>}
          />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item: category }) => (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              <FlatList
                data={category.items}
                keyExtractor={item => item.id}
                renderItem={renderCategoryItem}
              />
            </View>
          )}
        />
      )}

      {/* Long Press Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem?.itemTemplate.name} を購入しましたか？</Text>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'tomato' }]} onPress={handleMoveToFridge}>
              <Text style={styles.modalButtonText}>冷蔵庫 / 食糧庫に入れる</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Item with Note Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{itemToAdd?.name} を追加</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="メモ (例: 2個、メーカー指定など)"
              value={addNote}
              onChangeText={setAddNote}
            />
            <View style={styles.addButtonsRow}>
              <TouchableOpacity style={[styles.modalButton, styles.todayBtn]} onPress={() => confirmAddItem('TODAY')}>
                <Text style={styles.modalButtonText}>今日買う</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.somedayBtn]} onPress={() => confirmAddItem('SOMEDAY')}>
                <Text style={styles.modalButtonText}>いつか買う</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton, { marginTop: 10 }]} onPress={() => setAddModalVisible(false)}>
              <Text style={styles.cancelButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#eee' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: 'tomato' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: 'tomato', fontWeight: 'bold' },

  helpText: { textAlign: 'center', padding: 10, color: '#888', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },

  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 5, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  itemInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemNote: { fontSize: 12, color: '#888', marginTop: 2 },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, fontSize: 12, color: '#fff', overflow: 'hidden' },
  todayBadge: { backgroundColor: 'tomato' },
  somedayBadge: { backgroundColor: '#4db8ff' },

  categoryContainer: { marginBottom: 20, backgroundColor: '#fff', paddingVertical: 10 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginBottom: 10, color: '#333' },
  addItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  addItemName: { fontSize: 16 },
  addButtons: { flexDirection: 'row' },
  addBtnToday: { backgroundColor: 'tomato', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5, marginRight: 10 },
  addBtnSomeday: { backgroundColor: '#4db8ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5 },
  openAddModalBtn: { padding: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 15, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  noteInput: { width: '100%', backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  addButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 10 },
  todayBtn: { backgroundColor: 'tomato', width: '48%' },
  somedayBtn: { backgroundColor: '#4db8ff', width: '48%' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#eee' },
  cancelButtonText: { color: '#666', fontSize: 16, fontWeight: 'bold' }
});