import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useAppStore } from "../store/appStore";
import { format, differenceInCalendarDays } from "date-fns";

export default function ActivityLogScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { activityLogs, fetchActivityLogs } = useAppStore();

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "added": return { name: "add-shopping-cart", bg: "bg-primary-fixed", color: "text-on-primary-fixed-variant" };
      case "bought": return { name: "payments", bg: "bg-secondary-fixed", color: "text-on-secondary-fixed-variant" };
      case "marked_expiring": return { name: "warning", bg: "bg-tertiary-container", color: "text-on-tertiary-container" };
      case "consumed": return { name: "restaurant", bg: "bg-outline-variant", color: "text-on-surface-variant" };
      case "stocked": return { name: "inventory-2", bg: "bg-secondary-container", color: "text-on-secondary-container" };
      case "moved": return { name: "swap-horiz", bg: "bg-surface-variant", color: "text-on-surface-variant" };
      default: return { name: "history", bg: "bg-surface-container", color: "text-on-surface-variant" };
    }
  };

  // Group logs by date
  const logsByDate: { [key: string]: typeof activityLogs } = {};
  activityLogs.forEach(log => {
    const dateStr = format(new Date(log.createdAt), "yyyy-MM-dd");
    if (!logsByDate[dateStr]) logsByDate[dateStr] = [];
    logsByDate[dateStr].push(log);
  });

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
              A chronological pulse of your home's kitchen. Track every addition, purchase, and stock update as it happens.
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
        <View className="gap-y-12 relative pb-8">
          <View className="absolute left-[27px] top-4 bottom-0 w-0.5 bg-surface-container-high"></View>

          {Object.keys(logsByDate).length > 0 ? (
            Object.entries(logsByDate).map(([dateStr, logs]) => {
              const dateObj = new Date(dateStr);
              const daysDiff = differenceInCalendarDays(new Date(), dateObj);

              let displayDate = "Older";
              let dateIcon: any = "history";
              let dateColor = "text-on-surface-variant";
              let bgIconColor = "bg-surface-container-high";

              if (daysDiff === 0) {
                displayDate = "Today";
                dateIcon = "today";
                dateColor = "text-on-surface";
                bgIconColor = "bg-primary";
              } else if (daysDiff === 1) {
                displayDate = "Yesterday";
              } else {
                displayDate = format(dateObj, "MMM d, yyyy");
              }

              return (
                <View key={dateStr} className={`relative ${daysDiff > 0 ? "mt-8 opacity-80" : ""}`}>
                  <View className="flex-row items-center gap-6 mb-8">
                    <View className={`w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-sm ${bgIconColor}`}>
                      <Icon name={dateIcon as any} size={24} className={daysDiff === 0 ? "text-on-primary" : "text-on-surface-variant"} />
                    </View>
                    <Text className={`font-headline text-2xl font-bold ${dateColor}`}>{displayDate}</Text>
                  </View>

                  <View className="gap-y-4 ml-10">
                    {logs.map((log) => {
                      const iconConfig = getActionIcon(log.action);
                      return (
                        <View key={log.id} className="bg-surface-container-lowest p-6 rounded-lg flex-row items-center justify-between mb-4 shadow-sm">
                          <View className="flex-row items-center gap-5 flex-1">
                            <View className="relative">
                              <View className="w-14 h-14 rounded-full border-4 border-surface-container-low overflow-hidden bg-surface-container">
                                <Image source={{ uri: log.user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXxIn9vkOJkM6PINi0yWB5YnNUFN2iUe8ENrb1prTy3CywJnqQgcSyUGjHjGzRKF5FVKQzfrFCxc1LflbtW1H-7Kjz4EyBhEG2Ir5-lzht5fkn07JXndNTHy26vznKGojtw6tQeFBobHuHP3F1c34TDx8ikUeiv0UNeKkxhi38LvSIZJnNAm67ooMtjERCHnxuSF-pUZ6hFXtDrWBbz0-UDBDlJY5EVX6A5Okq8Cx7z4ei6GutfcWV5NTCRCRvrasLGGu_o0ZPcTw" }} className="w-full h-full" />
                              </View>
                              <View className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface-container-lowest ${iconConfig.bg}`}>
                                <Icon name={iconConfig.name as any} size={14} className={iconConfig.color} />
                              </View>
                            </View>
                            <View className="flex-1 pr-2">
                              <Text className="text-on-surface text-base font-body">
                                <Text className="font-bold text-primary">{log.user?.name || "Someone"}</Text> {log.action} <Text className="font-semibold italic">{log.entity}</Text>
                              </Text>
                              <Text className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                                {format(new Date(log.createdAt), "hh:mm a")} • {log.tags ? log.tags : "UPDATE"}
                              </Text>
                            </View>
                          </View>
                          {log.amount != null && (
                            <View className="items-end">
                              <Text className="text-primary font-bold text-lg">-${log.amount.toFixed(2)}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })
          ) : (
             <Text className="text-on-surface-variant mt-10 text-center font-body">最近のアクティビティはありません</Text>
          )}
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
