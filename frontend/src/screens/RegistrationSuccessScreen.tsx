import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useAppStore } from "../store/appStore";

type ParamList = {
  RegistrationSuccess: { itemName: string, location: string, expiresIn: string };
};

export default function RegistrationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, 'RegistrationSuccess'>>();
  const { user } = useAppStore();

  const itemName = route.params?.itemName || "Organic Avocados (3ct)";
  const location = route.params?.location || "Main Pantry";
  const expiresIn = route.params?.expiresIn || "5 Days";

  return (
    <View className="flex-1 bg-surface font-body text-on-surface flex-col" style={{ paddingTop: insets.top }}>
      <View className="flex-grow flex-col items-center justify-center px-6 py-12">
        {/* Main Content Canvas */}
        <View className="w-full max-w-md flex-col items-center justify-center gap-y-10">

          {/* Hero Illustration/Icon Section */}
          <View className="relative w-64 h-64 flex items-center justify-center mb-10">
            {/* Decorative Layered Shapes */}
            <View className="absolute inset-0 bg-primary-fixed opacity-40 rounded-full scale-110 blur-2xl"></View>
            <View className="absolute inset-0 bg-surface-container-lowest rounded-full shadow-2xl scale-95"></View>

            {/* Item Avatar Display */}
            <View className="relative z-10 flex-col items-center">
              <View className="w-32 h-32 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-xl rotate-3">
                <Icon name="inventory-2" size={60} className="text-on-primary" />
              </View>
              <View className="absolute -bottom-2 -right-2 bg-secondary-container w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-surface-container-lowest">
                <Icon name="check-circle" size={24} className="text-on-secondary-container" />
              </View>
            </View>
          </View>

          {/* Message Block */}
          <View className="gap-y-4 mb-8">
            <Text className="font-headline font-extrabold text-4xl tracking-tight text-primary leading-tight text-center">
              Item Registered Successfully!
            </Text>
            <Text className="text-on-surface-variant text-lg px-4 leading-relaxed text-center">
              {itemName} has been added to your list and is shared with the Family.
            </Text>
          </View>

          {/* Metadata/Info Grid */}
          <View className="flex-row w-full gap-4 mb-8">
            <View className="flex-1 bg-surface-container-lowest p-5 rounded-lg text-left shadow-sm">
              <Text className="font-label text-[10px] uppercase tracking-widest text-outline block mb-1">Location</Text>
              <Text className="font-semibold text-on-surface text-base">{location}</Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest p-5 rounded-lg text-left shadow-sm">
              <Text className="font-label text-[10px] uppercase tracking-widest text-outline block mb-1">Default Expiration</Text>
              <Text className="font-semibold text-tertiary text-base">{expiresIn}</Text>
            </View>
          </View>

          {/* Action Cluster */}
          <View className="flex-col w-full gap-4 pt-4 mb-8">
            <TouchableOpacity
              className="w-full bg-primary py-5 rounded-xl shadow-xl flex-row items-center justify-center gap-3 active:scale-95 transition-transform"
              onPress={() => navigation.navigate("RegisterItem")}
            >
              <Text className="text-on-primary font-headline font-bold text-lg">Register Another</Text>
              <Icon name="add-circle" size={24} className="text-on-primary" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full bg-secondary-fixed py-5 rounded-xl flex items-center justify-center active:bg-secondary-container transition-colors"
              onPress={() => navigation.navigate("MainTabs", { screen: "Stock" })}
            >
              <Text className="text-on-secondary-fixed-variant font-headline font-bold text-lg">Back to Stock</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Metadata */}
          <View className="pt-8 opacity-60">
            <View className="flex-row items-center justify-center gap-2">
              <View className="w-6 h-6 rounded-full overflow-hidden border border-outline-variant">
                <Image source={{ uri: user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB8cMzTD2GLf2BawZZcU1HfsEzz6ahdyZPtGerCIxnTn-jkt8_Bsfqr6etkXznuhdSXIwGTLb2Gr9zyHKx_GS1h1bdnkdt831UjRQdz6rm40_OouEEdjFniBbO8tMBb4VU49s9LkIHbbXvb0KkH7iFmGJN58Egh2K5S1E4tHkJcgECBj0XaprnDJGcZfQcSD_j-LZjdvc0xeuu0X5DbyxBjp3mR-NEElVEAyQF0uefxBEhS3y4IabdMAGPMPFkF0CGOuZyTItoynKRL" }} className="w-full h-full" />
              </View>
              <Text className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Confirmed by {user?.name || "You"} • Just now</Text>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}
