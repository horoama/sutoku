import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./BottomTabNavigator";

import ItemDetailsScreen from "../screens/ItemDetailsScreen";
import RegisterItemScreen from "../screens/RegisterItemScreen";
import ItemSelectionScreen from "../screens/ItemSelectionScreen";
import RegistrationSuccessScreen from "../screens/RegistrationSuccessScreen";
import DairyCategoryScreen from "../screens/DairyCategoryScreen";
import AddToShoppingListScreen from "../screens/AddToShoppingListScreen";
import ReviewListScreen from "../screens/ReviewListScreen";
import AddToPantryScreen from "../screens/AddToPantryScreen";
import PantrySearchScreen from "../screens/PantrySearchScreen";
import ActivityLogScreen from "../screens/ActivityLogScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tabs */}
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* Detail & Transactional Screens */}
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <Stack.Screen name="ItemSelection" component={ItemSelectionScreen} />
      <Stack.Screen name="RegisterItem" component={RegisterItemScreen} />
      <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
      <Stack.Screen name="DairyCategory" component={DairyCategoryScreen} />
      <Stack.Screen name="AddToShoppingList" component={AddToShoppingListScreen} />
      <Stack.Screen name="ReviewList" component={ReviewListScreen} />
      <Stack.Screen name="AddToPantry" component={AddToPantryScreen} />
      <Stack.Screen name="PantrySearch" component={PantrySearchScreen} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
    </Stack.Navigator>
  );
}
