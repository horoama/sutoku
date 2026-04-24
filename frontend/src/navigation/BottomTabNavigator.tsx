import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/MaterialIcons";
import { View, Text, Platform, TouchableOpacity, Dimensions, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ShoppingListScreen from "../screens/ShoppingListScreen";
import StockScreen from "../screens/StockScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const EDGE_THRESHOLD = 40;
const SWIPING_DISTANCE = 50;

const ScreenEdgeSwipeContainer = ({ children, prevRoute, nextRoute, navigation }: any) => {
  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      // Allow swiping from anywhere on the screen by removing x0 edge constraints.
      // Strict horizontal swipe check to prevent accidental triggering during vertical scroll.
      if (Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy) * 2) {
         if (dx > 0 && prevRoute) return true; // Swipe Right -> Go back
         if (dx < 0 && nextRoute) return true; // Swipe Left -> Go forward
      }
      return false;
    },
    onPanResponderRelease: (evt, gestureState) => {
      const { dx } = gestureState;
      if (dx > SWIPING_DISTANCE && prevRoute) {
        navigation.navigate(prevRoute);
      } else if (dx < -SWIPING_DISTANCE && nextRoute) {
        navigation.navigate(nextRoute);
      }
    }
  }), [prevRoute, nextRoute, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const TabBarIcon = ({ focused, routeName }: { focused: boolean, routeName: string }) => {
  let iconName: React.ComponentProps<typeof Icon>['name'] = "home";
  let label = "";

  if (routeName === "Shopping") {
    iconName = "shopping-basket";
    label = "List";
  } else if (routeName === "Stock") {
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

const CustomTabBar = ({ state, descriptors, navigation, insets }: any) => {
  return (
    <View 
      style={{ 
        flexDirection: 'row', 
        backgroundColor: "#ffffff", 
        borderTopWidth: 1, 
        borderTopColor: "#e7e9e5", 
        height: 70 + insets.bottom, 
        paddingTop: 10, 
        paddingBottom: insets.bottom > 0 ? insets.bottom : 10 
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.8}
          >
            <TabBarIcon focused={isFocused} routeName={route.name} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} insets={insets} />}
      screenOptions={{ 
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: '#ffffff' }
      }}
    >
      <Tab.Screen name="Shopping">
        {(props) => (
          <ScreenEdgeSwipeContainer nextRoute="Stock" navigation={props.navigation}>
            <ShoppingListScreen />
          </ScreenEdgeSwipeContainer>
        )}
      </Tab.Screen>
      <Tab.Screen name="Stock">
        {(props) => (
          <ScreenEdgeSwipeContainer prevRoute="Shopping" nextRoute="Settings" navigation={props.navigation}>
            <StockScreen navigation={props.navigation} />
          </ScreenEdgeSwipeContainer>
        )}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => (
          <ScreenEdgeSwipeContainer prevRoute="Stock" navigation={props.navigation}>
            <SettingsScreen navigation={props.navigation} />
          </ScreenEdgeSwipeContainer>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
