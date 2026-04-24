import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import RegisterItemScreen from "../screens/RegisterItemScreen";
import RegistrationSuccessScreen from "../screens/RegistrationSuccessScreen";
import DairyCategoryScreen from "../screens/DairyCategoryScreen";
import AddToShoppingListScreen from "../screens/AddToShoppingListScreen";
import ReviewListScreen from "../screens/ReviewListScreen";
import AddToStockScreen from "../screens/AddToStockScreen";
import StockSearchScreen from "../screens/StockSearchScreen";
import ActivityLogScreen from "../screens/ActivityLogScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tabs */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Detail & Transactional Screens */}
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="RegisterItem" component={RegisterItemScreen} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
      <Stack.Screen name="DairyCategory" component={DairyCategoryScreen} />
      <Stack.Screen name="AddToShoppingList" component={AddToShoppingListScreen} />
      <Stack.Screen name="ReviewList" component={ReviewListScreen} />
      <Stack.Screen name="AddToStock" component={AddToStockScreen} />
      <Stack.Screen name="StockSearch" component={StockSearchScreen} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
    </Stack.Navigator>
  );
}
