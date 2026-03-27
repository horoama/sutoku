import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useShoppingStore } from "../store/shoppingStore";

export default function AddToShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  // This would typically come from a store, mocking for UI
  const suggestions = [
    { id: '1', name: 'Avocados', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzOSU-2v4ZJP-JVFluqYX3ESN9tRG4-6g29R3EUvuCymSsY2Hmx7q-eeo_1lZc9sh_y6wmpwcAiyitVV7Vb4yUxOlvR3dief-JzPdW1j1YKaDKAHKOo_4cf58UVYA0xLbWinMdhx0lcXCAaPKCWigJKbNh5-4W0nPCSbROiSNhkvQEpDMrcaIgUarkrx91oexWbfIJSa5_6VA8ENClXIXUBFQquJU-HpnCEd4FA8s5afDANcXyZ7pNG_87ru58QELzIju3v0Pag3-C' },
    { id: '2', name: 'Whole Milk', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHM1cl2XHfGXVe0fURNtZwkgbdyspcpTt2B8_EdcUUMWD5Vz66ZkVLwzzAvg6KxcFV_8BfxRYseIYRx9deN4q3I1GsXU3CpsgTOhCwzwVzrAKmuetYJkMdDA6G_RAjcTDFufIHPyU5mwicvzvCIQf0692n-2f2VIK1Tq5fkbj6XnrJymso97Qqfd0FOy99iLVONqyoI7YuyzhtyPr1eVnWiWzuh_WZWPJD4N1thLakHXgh9wma9vJ8UVDf1GoQ7Gl6BvcQOWI_Tm7n' },
    { id: '3', name: 'Sourdough', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDm56M2nO3h2qsoH2HfjNIHlpwtAo6kjNJ_DP618AZ-R4oJmNboYnZ9aegn0_nbxZLxooNSBaCjSVcLnjLA2yZOW5cecV19zSF2LtNeEH7mVfuT6sGxsSXWNR6u4chrXzoSnCcVEMA258u-1MLBYA5IFHWeHMJjoH-XK6t3M9gm2SZot3cFfsML0azHS_HgJXxNPWxJ60ApBzPzZnizNyUwwws0-xViDS8pQ-FRhA8cQvmV-uiJopjqpMS4YnS9oNBz_QJurUD7VXnb' }
  ];

  const categories = ["Produce", "Dairy & Eggs", "Pantry", "Meat & Seafood"];
  const [activeCategory, setActiveCategory] = useState("Produce");

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* Top Navigation Anchor */}
      <View className="w-full bg-surface px-6 py-4 flex-row items-center gap-4 z-50">
        <TouchableOpacity
          className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50/50 active:scale-95 transition-all"
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} className="text-emerald-900" />
        </TouchableOpacity>
        <Text className="font-headline font-bold text-2xl tracking-tight text-emerald-900">Add to Shopping List</Text>
      </View>

      <ScrollView className="px-6 space-y-8" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Search Bar Section */}
        <View className="mt-4">
          <View className="relative justify-center">
            <View className="absolute left-5 z-10">
              <Icon name="search" size={24} className="text-outline" />
            </View>
            <TextInput
              className="w-full bg-surface-container-high border-none rounded-full py-4 pl-14 pr-6 text-on-surface font-body text-base"
              placeholder="Search for groceries..."
              placeholderTextColor="#707973"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View className="mt-2 px-1">
          <TouchableOpacity
            className="w-full flex-row items-center justify-between p-3 bg-surface-container-low border border-dashed border-outline-variant/40 rounded-xl active:bg-surface-container-high transition-colors"
            onPress={() => navigation.navigate("RegisterItem")}
          >
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="add-circle" size={20} className="text-primary" />
              </View>
              <View>
                <Text className="font-headline font-semibold text-sm text-on-surface">Can't find what you're looking for?</Text>
                <Text className="text-[10px] text-outline font-medium">Add a custom item to your list</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} className="text-primary/60" />
          </TouchableOpacity>
        </View>

        {/* Suggestions Horizontal Scroll */}
        <View>
          <View className="flex-row justify-between items-end mb-4 pr-2">
            <Text className="font-headline text-xl font-bold text-primary">Running Low</Text>
            <Text className="font-label text-xs font-bold tracking-wider text-outline uppercase">Based on Pantry</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4 overflow-visible">
            {suggestions.map(item => (
              <View key={item.id} className="w-40 bg-surface-container-lowest rounded-lg overflow-hidden mr-4 shadow-sm border border-surface-variant/20">
                <View className="h-32 w-full bg-surface-container-low">
                  <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="p-4 space-y-3">
                  <Text className="font-headline font-semibold text-sm" numberOfLines={1}>{item.name}</Text>
                  <TouchableOpacity className="w-full bg-secondary-fixed py-2 rounded-xl flex-row items-center justify-center gap-2 active:bg-secondary-container">
                    <Icon name="add" size={16} className="text-on-secondary-fixed-variant" />
                    <Text className="text-on-secondary-fixed-variant font-label text-xs font-bold">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Category Tabs */}
        <View className="pt-2 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                className={`px-6 py-3 rounded-full mr-2 ${activeCategory === cat ? 'bg-primary' : 'bg-surface-container-high'}`}
                onPress={() => setActiveCategory(cat)}
              >
                <Text className={`font-label text-sm font-bold ${activeCategory === cat ? 'text-on-primary' : 'text-on-surface-variant'}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Item List Grid */}
        <View className="space-y-4 pb-12">
          {/* Item Card 1 */}
          <View className="bg-surface-container-low rounded-lg p-4 flex-row items-center gap-4 mb-3">
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8kkp34mw6Wt-qiNyZaQFhf9wlTQKDGN2ziPMQZR3fzr3ExFv4FIlfbsxBidCVtIZNjCWcNU1TPZ70zHUqDb9yhTSR0K8B2Uqw4GXL6E5PIituNp2IqeFYAT8U0_yT8Hwhvd1gAZ9eqPh6hfPnFa3seJhLm1hKcy1T1X64oMd0ltH3p4Idp7ES7_IMVgc-xZBZtBA6-KE9Q1uy5WqgudOQ7hzrSfW7NsZobszgdw89_yl2CJtPiP3__exBSrmbViOtqs4Eogyogc8Y' }} className="w-full h-full" />
            </View>
            <View className="flex-1">
              <Text className="font-headline font-bold text-on-surface text-base">Vine Tomatoes</Text>
              <Text className="text-xs text-outline font-medium">Produce • ~500g</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm active:bg-primary">
              <Icon name="add" size={24} className="text-primary" />
            </TouchableOpacity>
          </View>

          {/* Item Card 2 (With Priority Mockup) */}
          <View className="bg-surface-container-low rounded-lg p-4 space-y-4 mb-3">
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSLzYs2y0wrPXChIsW32ulotHgEUxbCtpkuUjICxa7xGzKRcwuUPvGiYLwhoIMkvSxlV0dBMFTetPgSjlN6feLIsEkrCkS6AaWU4eSbCFfuAKeyZA0PidqaU_5cNJXonB_VyaWYJp58Gum1xqkvqCXJXi4YY1twokTlemJ_FmIzMvhewQD5EaGt3RXH9rSH80pPzB5TebM5ZfUjVZQDy1yPOINJcpRIP8qE5VDDERDE6576JjgiYlTBZ140JENDYV-qbk1TzDQFL0x' }} className="w-full h-full" />
              </View>
              <View className="flex-1">
                <Text className="font-headline font-bold text-on-surface text-base">Organic Eggs</Text>
                <Text className="text-xs text-outline font-medium">Dairy • 12 Pack</Text>
              </View>
              <View className="flex-row items-center gap-1 bg-tertiary-container/20 px-3 py-1 rounded-full">
                <View className="w-2 h-2 rounded-full bg-tertiary"></View>
                <Text className="text-[10px] font-bold text-on-tertiary-fixed-variant uppercase tracking-tighter">Urgent</Text>
              </View>
            </View>

            <View className="flex-row gap-2 pt-2 border-t border-outline-variant/20">
              <TouchableOpacity className="flex-1 py-2 bg-error-container rounded-full items-center">
                <Text className="text-on-error-container text-[11px] font-bold uppercase tracking-wider">Urgent</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2 bg-secondary-fixed rounded-full items-center">
                <Text className="text-on-secondary-fixed-variant text-[11px] font-bold uppercase tracking-wider">High</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 py-2 bg-surface-container-highest rounded-full items-center">
                <Text className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Normal</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Item Card 3 */}
          <View className="bg-surface-container-low rounded-lg p-4 flex-row items-center gap-4 mb-3">
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA21PhyN_KyriPgkdWJ23qVHr99lipQBpzwLjfaKrudlApUatqdrxgSlBdfOhBONz1Y4zXapCZ8rW6wMgez0guCKVrfncwI0VYw3Hazvxi3h5hoXN4MCf5sKjYmMbf4uferEYOPmptb_2mdfbtbsaB1lbv8KiKIHF3acMpEwy_57TpHtUcyR7TwP5X2OPhh4m0616OkJVHv7CbNmF37J7GiXjcoqym7-_movAuqmmb76IhOkjQiDA6Yd3vccmGr_kNKKoc5isnuY4h' }} className="w-full h-full" />
            </View>
            <View className="flex-1">
              <Text className="font-headline font-bold text-on-surface text-base">Romaine Lettuce</Text>
              <Text className="text-xs text-outline font-medium">Produce • 2 heads</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm active:bg-primary">
              <Icon name="add" size={24} className="text-primary" />
            </TouchableOpacity>
          </View>

          {/* Item Card 4 */}
          <View className="bg-surface-container-low rounded-lg p-4 flex-row items-center gap-4 mb-3">
            <View className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-highest">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtaJkj1EDExPCp2WlkpD2HY_9syXTGXTxhzTXz0SDAbe6xZ_yjuXsO0mRUoPcIHD5zTBRKYa9Fi0imCVfxtuJElDBDvFHFYiSjY6Ab1QLcFKNb0Iqz-8jCIqPzUMjfPOTErVo8zRCGRrc1lkT8q8evOeE6Apzf-vRrQnXAmQYqip2TDTl5lJJZP1BUb7JJ9tvzjxKkw9uZoHR2Avj608YkLtpQUP3gxgr-QqlvHlws3pU9YmMMkiq3jGvj7_0Fzr0wO9sUrDgGN9GF' }} className="w-full h-full" />
            </View>
            <View className="flex-1">
              <Text className="font-headline font-bold text-on-surface text-base">Gala Apples</Text>
              <Text className="text-xs text-outline font-medium">Produce • 1 kg</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-sm active:bg-primary">
              <Icon name="add" size={24} className="text-primary" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Review List Floating Bottom Bar */}
      <View className="absolute bottom-0 w-full px-6 pb-8 pt-4 z-50">
        <View className="bg-[#126c4a]/95 rounded-2xl p-4 flex-row items-center justify-between shadow-lg border border-primary/20">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Text className="text-on-primary font-headline font-bold text-lg">3</Text>
            </View>
            <View>
              <Text className="font-label text-xs font-bold text-[#99ebc0] uppercase tracking-widest">items in list</Text>
              <Text className="text-[10px] text-primary-fixed-dim">Family List: Active</Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-primary px-6 py-3 rounded-full flex-row items-center gap-2 active:scale-95 transition-transform"
            onPress={() => navigation.navigate("ReviewList")}
          >
            <Text className="text-on-primary font-headline font-bold">Review List</Text>
            <Icon name="arrow-forward" size={16} className="text-on-primary" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
