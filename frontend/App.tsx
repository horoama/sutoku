import React, { useEffect, useState } from "react";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import Icon from "@expo/vector-icons/MaterialIcons";
import { initI18n } from "./src/i18n";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

cssInterop(Icon, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true }
  }
});

export default function App() {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initI18n();
      setIsI18nInitialized(true);
    };
    setup();
  }, []);

  if (!isI18nInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
