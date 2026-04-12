import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialIcons";
import { View, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ShoppingListScreen from "../screens/ShoppingListScreen";
import FridgeScreen from "../screens/FridgeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80 + insets.bottom,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#191c1a",
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          paddingBottom: insets.bottom ? insets.bottom : 20,
          paddingTop: 12,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName: React.ComponentProps<typeof Icon>['name'] = "home";
          let label = "";

          if (route.name === "Shopping") {
            iconName = "shopping-basket";
            label = "List";
          } else if (route.name === "Fridge") {
            iconName = "inventory-2";
            label = "Pantry";
          } else if (route.name === "Settings") {
            iconName = "group";
            label = "Family";
          }

          if (focused) {
            return (
              <View className="flex flex-col items-center justify-center bg-[#a1f4c8] dark:bg-[#005236] rounded-full px-6 py-2">
                <Icon name={iconName} size={24} color="#005236" />
                <Text className="font-body text-[10px] uppercase tracking-[0.05rem] font-bold mt-1 text-[#005236]">
                  {label}
                </Text>
              </View>
            );
          }

          return (
            <View className="flex flex-col items-center justify-center px-6 py-2 rounded-full">
              <Icon name={iconName} size={24} color="#64748b" />
              <Text className="font-body text-[10px] uppercase tracking-[0.05rem] font-bold mt-1 text-slate-500">
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Shopping" component={ShoppingListScreen} />
      <Tab.Screen name="Fridge" component={FridgeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
