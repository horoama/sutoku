import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function ActivityLogScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-surface text-on-surface font-body" style={{ paddingTop: insets.top }}>
      {/* Top App Bar */}
      <View className="bg-[#f8faf6] w-full z-50 px-6 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-container-high transition-colors"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-[#2D6A4F]" />
          </TouchableOpacity>
          <Icon name="restaurant-menu" size={24} className="text-[#2D6A4F]" />
          <Text className="font-headline font-bold text-2xl tracking-tight text-[#2D6A4F]">The Living Larder</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-surface-container-highest">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCndy3Eg0VavGhQvKpnyrhcKUI7eNG3TKjtbmjiCQpiNmIkNNR6YNQv0hUlMuNl9_sDcTfpU-r1ES6fyJcGdMPO9w0-Xy2HLgE13bCUlIEF2k03qFuUWw6ydFCBfwi_Rhvf35c6LA6cP06UmUvkpvT71bc7Iuo9803xsSYD9MFcjwRbFNb2TaiEJp8iqxmV5FiKcrYeR5lH2hdx0Xh9v9AJsdUunhCRtENo9Qcl6dBQDTwNnYZaUrBRAaqJluLKE0Sh3JkOqw4-m8W0" }}
              className="w-full h-full"
            />
          </View>
        </View>
      </View>

      <ScrollView className="max-w-screen-xl mx-auto px-6 pt-8 w-full" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Editorial Header Section */}
        <View className="mb-12 relative flex-col gap-6">
          <View className="max-w-2xl">
            <Text className="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-3">Collective Hearth</Text>
            <Text className="font-headline text-5xl font-extrabold text-primary leading-tight tracking-tighter">Family Activity Log</Text>
            <Text className="mt-4 text-on-surface-variant text-lg leading-relaxed max-w-md">
              A chronological pulse of your home's kitchen. Track every addition, purchase, and pantry update as it happens.
            </Text>
          </View>

          {/* Mini Stats Bento */}
          <View className="flex-row gap-4 w-full">
            <View className="flex-1 bg-surface-container-low p-6 rounded-lg items-center">
              <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Today's Events</Text>
              <Text className="font-headline text-3xl font-bold text-primary">12</Text>
            </View>
            <View className="flex-1 bg-primary-fixed p-6 rounded-lg items-center">
              <Text className="font-label text-[10px] uppercase tracking-widest text-on-primary-fixed-variant mb-1">Active Members</Text>
              <Text className="font-headline text-3xl font-bold text-on-primary-fixed-variant">4</Text>
            </View>
          </View>
        </View>

        {/* Search & Filter Bar */}
        <View className="mb-10">
          <View className="bg-surface-container-lowest border border-outline-variant/30 rounded-full px-6 py-3 flex-row items-center gap-4 shadow-sm">
            <Icon name="search" size={24} className="text-outline" />
            <TextInput
              className="flex-1 bg-transparent border-none text-on-surface font-body p-0"
              placeholder="Search activities or members..."
              placeholderTextColor="#707973"
            />
            <View className="h-6 w-px bg-outline/20"></View>
            <TouchableOpacity className="flex-row items-center gap-2 px-2 py-1 rounded-full active:bg-surface-container-high transition-colors">
              <Icon name="filter-list" size={20} className="text-on-surface-variant" />
              <Text className="text-sm font-medium text-on-surface-variant">Filter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Timeline */}
        <View className="space-y-12 relative pb-8">
          {/* Vertical Line for Timeline */}
          <View className="absolute left-[27px] top-4 bottom-0 w-0.5 bg-surface-container-high"></View>

          {/* Date Group: Today */}
          <View className="relative">
            <View className="flex-row items-center gap-6 mb-8">
              <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg z-10">
                <Icon name="today" size={24} className="text-on-primary" />
              </View>
              <Text className="font-headline text-2xl font-bold text-on-surface">Today</Text>
            </View>

            <View className="space-y-4 ml-10">
              {/* Activity Card 1 */}
              <View className="bg-surface-container-lowest p-6 rounded-lg flex-row items-center justify-between mb-4 shadow-sm">
                <View className="flex-row items-center gap-5 flex-1">
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full border-4 border-surface-container-low overflow-hidden">
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbJ7EBLUjK9eEbpmdUK9d7W5djhyY6OEdQ9bCnV8mZv2OEntQ6JQcMlZ2YFJs26c5ck8DhOc2EGMxEG4K51zDVBJ6ZycwFgCzEZZ5R_ZmphPO73kAZ5h58_9pKhd-LnH4puG5fSrRCO4GU8s-BuJr-BwM45hPhq5cPryZ4HmvMe7XPIH82CzeHNEYz8cRg0dY_XFj6OYgCtkX1rxYSNN8WSEVLLH0NtVHwxGBRmgJd0_EZzH-aoSZANQz6V8zdA14LoBjrl-gvjfbe" }} className="w-full h-full" />
                    </View>
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-fixed rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                      <Icon name="add-shopping-cart" size={14} className="text-on-primary-fixed-variant" />
                    </View>
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-on-surface text-base">
                      <Text className="font-bold text-primary">Sarah</Text> added <Text className="font-semibold italic">Organic Whole Milk</Text> to List
                    </Text>
                    <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">10:45 AM • GROCERIES</Text>
                  </View>
                </View>
                <View className="bg-primary-fixed px-3 py-1 rounded-full hidden sm:flex">
                  <Text className="text-[10px] font-bold tracking-widest text-on-primary-fixed-variant uppercase">New Item</Text>
                </View>
              </View>

              {/* Activity Card 2 */}
              <View className="bg-surface-container-lowest p-6 rounded-lg flex-row items-center justify-between mb-4 shadow-sm">
                <View className="flex-row items-center gap-5 flex-1">
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full border-4 border-surface-container-low overflow-hidden">
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuArKSqFH7Rhv2vHftL6qeb2EF7qBf5LYhYUDPRqcuShDSlpQGuSHDWKg-aGJqGL94YTJfbKu_CrbXVrnCSXuShUQzMfcwERYqWQONURydndxkTFgOf2NcsuFVUJfZ7ffhY_akIp20lZ-VHCNCn9oX_sn5Cc4PHps05pSYLuhVKTyNQ6iz2KOHE_IoMazK4u82qbMVycnnegA8U8WpDGOTOveCwAUueB-znRQUD9imHiozmqUHVrc71e0HBNStz3sOMVspHOepvodPRp" }} className="w-full h-full" />
                    </View>
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary-fixed rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                      <Icon name="payments" size={14} className="text-on-secondary-fixed-variant" />
                    </View>
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-on-surface text-base">
                      <Text className="font-bold text-primary">James</Text> bought <Text className="font-semibold italic">Farm Fresh Eggs (12pk)</Text>
                    </Text>
                    <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">09:12 AM • PANTRY UPDATE</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-primary font-bold text-lg">-$6.50</Text>
                </View>
              </View>

              {/* Activity Card 3 */}
              <View className="bg-surface-container-lowest p-6 rounded-lg flex-row items-center justify-between shadow-sm">
                <View className="flex-row items-center gap-5 flex-1">
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full border-4 border-surface-container-low overflow-hidden">
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_5LHo6KK_v2rZlBxYIHa2YrSweALBYX0HHrxpOwLXxqHZpcQA0lZ9Uy95tiUmJ-XoTqiZcRFQCamJrmdm9ybLoiTEIjajKKvNeF6kiO7bNLdtUmhoqmrZ2FWTaSt5EEgJYcabB3xdUdzkvZseojmMjime2Y6NFA8pTRuXf3ypJFy8-g925eU5RfmuWSUkNw0cOIF8eTaM-ilPlqlPRp6ZrNYDEGfxp4gnA5Tm4syGwyNmsR3ML_SacvW4EL_KVWg3xjM5-tjaUaK8" }} className="w-full h-full" />
                    </View>
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-tertiary-container rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                      <Icon name="warning" size={14} className="text-on-tertiary-container" />
                    </View>
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-on-surface text-base">
                      <Text className="font-bold text-primary">Emma</Text> marked <Text className="font-semibold italic">Greek Yogurt</Text> as expiring
                    </Text>
                    <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">08:30 AM • SHELF LIFE</Text>
                  </View>
                </View>
                <View className="bg-tertiary-container px-3 py-1 rounded-full hidden sm:flex">
                  <Text className="text-[10px] font-bold tracking-widest text-on-tertiary-container uppercase">Urgent</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Date Group: Yesterday */}
          <View className="relative mt-8">
            <View className="flex-row items-center gap-6 mb-8">
              <View className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center z-10">
                <Icon name="history" size={24} className="text-on-surface-variant" />
              </View>
              <Text className="font-headline text-2xl font-bold text-on-surface-variant">Yesterday</Text>
            </View>

            <View className="space-y-4 ml-10 opacity-80">
              {/* Activity Card 4 */}
              <View className="bg-surface-container-low p-6 rounded-lg flex-row items-center justify-between mb-4 shadow-sm">
                <View className="flex-row items-center gap-5 flex-1">
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full border-4 border-surface-container-low overflow-hidden">
                      <Image source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzz3NUtB9-r9MvGE16B1SludBIkQ6nzGlFYtXgSTRvyy7tnesBWkLWogAlOnuCydvFUDqx0MsXEfFLHpOI8fHbLn0yw_EcCmBkGVZLulLKcwgfSeqjFXYj9yYz6FPZ9Tu-7lu0wHB2ZkWvX4I6cRlTcdlAR0-Ug5QH6K-4ofg-IaxQbv-_IuC5xZm1UaDctHarnP7sGaUO7NM1kiN-FwSF5DPY0e1EALmMX1Jq2_4sI2IcAP4_EzbifrQUZu50wcKmbMhF9muRjZOr" }} className="w-full h-full" />
                    </View>
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-outline-variant rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                      <Icon name="inventory-2" size={14} className="text-on-surface-variant" />
                    </View>
                  </View>
                  <View className="flex-1 pr-2">
                    <Text className="text-on-surface text-base">
                      <Text className="font-bold text-primary">Dad</Text> cleared the <Text className="font-semibold italic">Produce Drawer</Text>
                    </Text>
                    <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">06:45 PM • CLEANUP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Load More CTA */}
        <View className="mt-8 mb-10 flex items-center">
          <TouchableOpacity className="px-8 py-4 bg-surface-container-low rounded-xl flex-row items-center gap-3 active:bg-surface-container-high transition-colors">
            <Text className="font-headline font-bold text-primary">View Older Activities</Text>
            <Icon name="expand-more" size={24} className="text-primary" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
