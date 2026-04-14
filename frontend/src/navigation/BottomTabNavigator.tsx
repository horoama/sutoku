import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigationState } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { View, Text, Platform, TouchableOpacity } from "react-native";
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
    iconName = "kitchen";
    label = "Pantry";
  } else if (routeName === "Settings") {
    iconName = "group";
    label = "Family";
  }

  if (focused) {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#a1f4c8', borderRadius: 9999, paddingHorizontal: 20, paddingVertical: 8 }}>
        <Icon name={iconName} size={24} color="#005236" />
        <Text style={{ color: "#005236", fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 'bold', marginTop: 4 }}>
          {label}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 8 }}>
      <Icon name={iconName} size={24} color="#707973" />
      <Text style={{ color: "#707973", fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 'bold', marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
};

const CustomTabBarButton = (props: any) => {
  const { routeName, itemStyle, ...rest } = props;
  
  // Use navigation state directly to guarantee 100% accurate focus tracking
  const activeRouteName = useNavigationState((state: any) => state?.routes[state.index]?.name);
  const focused = activeRouteName === routeName;
  
  return (
    <TouchableOpacity 
      {...rest} 
      activeOpacity={0.8}
      style={[itemStyle, { justifyContent: 'center', alignItems: 'center' }]}
    >
      <TabBarIcon focused={focused} routeName={routeName} />
    </TouchableOpacity>
  );
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  
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
          height: 70 + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
        tabBarShowLabel: false,
        tabBarButton: (props) => (
          <CustomTabBarButton 
            {...props} 
            routeName={route.name} 
            itemStyle={props.style} 
          />
        ),
      })}
    >
      <Tab.Screen name="Shopping" component={ShoppingListScreen} />
      <Tab.Screen name="Fridge" component={FridgeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
