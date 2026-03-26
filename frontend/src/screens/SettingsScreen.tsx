import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAppStore } from '../store/appStore';
import Icon from '@expo/vector-icons/Ionicons';

export default function SettingsScreen() {
  const { user, family } = useAppStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>家族共有設定</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="people-outline" size={24} color="#666" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>家族グループ名</Text>
            <Text style={styles.menuSubtitle}>{family?.name || '未設定'}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-add-outline" size={24} color="#666" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>メンバーを招待する</Text>
            <Text style={styles.menuSubtitle}>家族に共有リンクを送信</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリ設定</Text>
        <View style={styles.menuItem}>
          <Icon name="notifications-outline" size={24} color="#666" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>通知設定</Text>
            <Text style={styles.menuSubtitle}>期限切れ前にお知らせ</Text>
          </View>
          <Switch value={true} onValueChange={() => {}} trackColor={{ false: "#767577", true: "tomato" }} />
        </View>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="fast-food-outline" size={24} color="#666" />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>食材の基本データ設定</Text>
            <Text style={styles.menuSubtitle}>デフォルトの消費期限を変更</Text>
          </View>
          <Icon name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>ログアウト</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileSection: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 30, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'tomato', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#888', marginTop: 5 },

  section: { backgroundColor: '#fff', marginBottom: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginHorizontal: 15, marginTop: 15, marginBottom: 5 },

  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#f9f9f9' },
  menuTextContainer: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 16, color: '#333' },
  menuSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },

  logoutButton: { margin: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: 'tomato' },
  logoutText: { color: 'tomato', fontSize: 16, fontWeight: 'bold' }
});