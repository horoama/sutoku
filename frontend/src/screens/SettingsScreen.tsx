import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../store/appStore";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, family } = useAppStore();

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzbaFB05vaKYiVbBxp7yzh8Q88Nkpv14IlOFQcRkRb9ch9563mtSqueAVfSg33drZ2RwKyxVqs_FzA_p_aOnmGqTVBhXN6RRyiWbeR4DA6ElBR_wOorw0XwgvIyrKDtER4DHgmNis2bGIid-itnHZIq_P1mo3rLfmfll1gFxnE08K9xbbcTDvmu0OH8-04xeGtsveN0tVTVGaHncX_-E8Z8S_bPKNOsb-MrZRuQrxtzXxu8SIAQyr0wHSNcnlyaUwqOErGkKlDfd-9" }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-primary font-headline font-black text-xl tracking-tighter">The Living Larder</Text>
        </View>
        <TouchableOpacity className="active:opacity-80 transition-opacity">
          <Icon name="notifications" size={24} className="text-primary" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-8 space-y-10" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Profile Hero Section */}
        <View className="flex-col gap-8 items-start mb-10">
          <View className="flex-1 w-full">
            <Text className="text-primary font-label text-xs uppercase tracking-[0.2rem] font-bold mb-2">Kitchen Manager</Text>
            <Text className="text-4xl font-extrabold text-on-surface leading-tight tracking-tighter font-headline">
              {user?.name?.split(" ")[0] || "Eleanor"} {"\n"}
              {user?.name?.split(" ")[1] || "Shelton"}
            </Text>
            <Text className="mt-4 text-on-surface-variant font-body">Managing the "Shelton Family Hearth" since October 2023.</Text>
          </View>
          <View className="w-full h-48 rounded-2xl overflow-hidden bg-surface-container-low">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCW-VNTZeXt9Bt8NVBBKO7yWxWVonESsHLg66Xewth7Dd2ljsog69Q3aBlVRh2L1MJu6q2LRHDm3tJffihoFUJkelsUWtUznCNL_JVS8GIGTn9SkN178r6mtr1o5p8pJ9TGXpYQu7yAklebXbkmH84vZ6Kr-iVbF4ez00SRqQAa-TWnC3nlqlWPEOduh99nfqc-0iCXMdSp3qU8nkwJF9Dy9f-fMFSlzvOH4tS_LgZy2rbfookRWKZ5VFkcgifPZBQf-iIzxxFNat1x" }}
              className="w-full h-full"
            />
          </View>
        </View>

        {/* Premium Upgrade Card */}
        <View className="relative overflow-hidden rounded-2xl bg-primary p-8 text-on-primary shadow-xl mb-10">
          <View className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary-fixed opacity-10 rounded-full"></View>
          <View className="relative z-10">
            <View className="flex-row items-center gap-2 mb-4">
              <Icon name="stars" size={24} className="text-on-primary" />
              <Text className="font-bold text-xl tracking-tight text-on-primary font-headline">Upgrade to Premium</Text>
            </View>
            <View className="space-y-3 mb-8">
              <View className="flex-row items-center gap-3">
                <Icon name="check-circle" size={16} className="text-primary-fixed opacity-90" />
                <Text className="text-primary-fixed opacity-90 font-medium font-body text-sm">Unlimited Family Members</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Icon name="check-circle" size={16} className="text-primary-fixed opacity-90" />
                <Text className="text-primary-fixed opacity-90 font-medium font-body text-sm">AI Recipe Suggestions from Pantry</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Icon name="check-circle" size={16} className="text-primary-fixed opacity-90" />
                <Text className="text-primary-fixed opacity-90 font-medium font-body text-sm">Advanced Shelf-Life Tracking</Text>
              </View>
            </View>
            <TouchableOpacity className="w-full bg-primary-fixed py-4 rounded-xl items-center active:scale-95 transition-all">
              <Text className="text-on-primary-fixed font-bold font-body">Unlock Premium Access</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manage Family Section */}
        <View className="space-y-4 mb-10">
          <Text className="text-sm font-label uppercase tracking-widest text-outline font-bold ml-1 mb-2">Manage Family</Text>
          <View className="bg-surface-container-low rounded-2xl p-6 space-y-6">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row -space-x-3">
                <View className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-container-highest overflow-hidden">
                  <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjtFv-GOsN6v6SwrMzwJdC_0FGpdyCZfd4W6cRzaBy8uiVzOktYMf-yrENcfg7mMJeJZtCFQIooJsHF74gZKsHJf7PavdTtQ-0xijNveZ2ni6qor70HMROj5isgf7jcVTIU24vZjevOKOFxmVOnR9UIhsMO3p5Iio9DxkuJg8taHWj7nrouYv7wMCS-3tbX19WiBNNplimdBSbN5Jts_C13uOKeZpj7u46kxAeWnkfM_-YdreETrJDsvJtAqi_CU9WjF9oirSOH9uP" }} className="w-full h-full" />
                </View>
                <View className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-container-highest overflow-hidden">
                  <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiP8m3hYLUFsDob6QjilYST3qd6f6SG7Tor0mj2xvy_2cAJpdcJ76JeSKjg2QBpfy0oTQoVMELWVBSchaa67lLKqHA1LHAk4Sw9EiHZskYaCIG0Hos--nnXRgL5WZgkH0zAIfD25C3OVSpDXioSxWSIUMRgb4C8l5YVCt26H9f6OPt-RHCWIiFp2UpXz1Zx_dLfPXw_IRo2eVYp88yLZjQkE-vRxsQEK739SUqEtIMOzOdxpyObQd6oMgOy3UX2LACRK-bMpHoRNBa" }} className="w-full h-full" />
                </View>
                <View className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center">
                  <Text className="text-xs font-bold text-outline">+2</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Text className="text-primary font-bold text-sm">Edit Members</Text>
              </TouchableOpacity>
            </View>
            <View className="bg-surface-container-lowest p-4 rounded-full flex-row items-center justify-between">
              <View className="flex-col ml-2">
                <Text className="text-[10px] uppercase font-bold text-outline tracking-tighter">Invite Code</Text>
                <Text className="text-primary font-bold font-body text-xs">HEARTH-2024-LARDER</Text>
              </View>
              <TouchableOpacity className="bg-secondary-fixed px-6 py-2 rounded-full active:scale-95 transition-all">
                <Text className="text-on-secondary-fixed-variant font-bold text-sm">Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View className="space-y-4 mb-10">
          <Text className="text-sm font-label uppercase tracking-widest text-outline font-bold ml-1 mb-2">App Settings</Text>
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between p-5 bg-surface-container-lowest rounded-2xl active:bg-surface-container transition-colors mb-2">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <Icon name="notifications-active" size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="font-bold text-on-surface font-body">Notifications</Text>
                  <Text className="text-xs text-on-surface-variant font-body mt-0.5">Expiration & restock alerts</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} className="text-outline" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-5 bg-surface-container-lowest rounded-2xl active:bg-surface-container transition-colors mb-2">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <Icon name="account-circle" size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="font-bold text-on-surface font-body">Account Privacy</Text>
                  <Text className="text-xs text-on-surface-variant font-body mt-0.5">Data sharing & family permissions</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} className="text-outline" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-5 bg-surface-container-lowest rounded-2xl active:bg-surface-container transition-colors mb-2">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <Icon name="palette" size={20} className="text-primary" />
                </View>
                <View>
                  <Text className="font-bold text-on-surface font-body">Appearance</Text>
                  <Text className="text-xs text-on-surface-variant font-body mt-0.5">Modern Hearth theme settings</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={24} className="text-outline" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-5 bg-surface-container-lowest rounded-2xl active:bg-error-container/20 transition-colors">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center">
                  <Icon name="logout" size={20} className="text-error" />
                </View>
                <View>
                  <Text className="font-bold text-error font-body">Log Out</Text>
                  <Text className="text-xs text-outline font-body mt-0.5">Signed in as {user?.email || "eleanor@larder.com"}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center py-10 mt-10">
          <Text className="text-outline text-xs uppercase tracking-widest font-bold font-body">The Living Larder v2.4.0</Text>
          <Text className="text-outline/40 text-[10px] mt-2 italic font-body">Crafted for a more mindful kitchen.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

