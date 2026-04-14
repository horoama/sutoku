import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialIcons";
import { View, Text, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ShoppingListScreen from "../screens/ShoppingListScreen";
import FridgeScreen from "../screens/FridgeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, routeName }: { focused: boolean, routeName: string }) => {
  let iconName: React.ComponentProps<typeof Icon>['name'] = "home";
  let label = "";

  if (routeName === "Shopping") {
    iconName = "shopping-basket";
    label = "List";
  } else if (routeName === "Fridge") {
    iconName = "kitchen"; // changed from inventory-2 just in case missing in some expo icon versions
    label = "Pantry";
  } else if (routeName === "Settings") {
    iconName = "group";
    label = "Family";
  }

  if (focused) {
    return (
      <View className="flex-col items-center justify-center bg-primary-fixed dark:bg-primary rounded-full px-5 py-2">
        <Icon name={iconName} size={24} color="#005236" />
        <Text className="font-body text-[10px] uppercase tracking-[0.05rem] font-bold mt-1 text-primary-fixed-variant">
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-col items-center justify-center px-5 py-2">
      <Icon name={iconName} size={24} className="text-outline" />
      <Text className="font-body text-[10px] uppercase tracking-[0.05rem] font-bold mt-1 text-outline">
        {label}
      </Text>
    </View>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e7e9e5",
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} routeName={route.name} />,
      })}
    >
      <Tab.Screen name="Shopping" component={ShoppingListScreen} />
      <Tab.Screen name="Fridge" component={FridgeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
