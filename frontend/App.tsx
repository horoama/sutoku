import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";
import Icon from "@expo/vector-icons/MaterialIcons";

cssInterop(Icon, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true }
  }
});

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
