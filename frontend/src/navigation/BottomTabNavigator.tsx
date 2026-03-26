import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/Ionicons';

import ShoppingListScreen from '../screens/ShoppingListScreen';
import FridgeScreen from '../screens/FridgeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Shopping') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Fridge') {
            iconName = focused ? 'snow' : 'snow-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Shopping" component={ShoppingListScreen} options={{ title: '買い物リスト' }} />
      <Tab.Screen name="Fridge" component={FridgeScreen} options={{ title: '冷蔵庫・食糧庫' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: '購入履歴' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'チャット' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: '設定' }} />
    </Tab.Navigator>
  );
}