import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";

export default function PantrySearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    { id: '1', name: 'Carrots', volume: 'Bunch', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmEf1ocDbLzrqvFcRqmDJYImVFoG6qLxez3ejH-JIh0Vgpds626uOk6aHB_Q51lKEDLavremHnpZocce_zztN0IFPnof8Yu0AjAqauU1DlRIzlDHZn2C-8XJSV6MnkqArAhqcS3fLI8vpKPvA6jl9DEnSqrWqo97z3wgRaqNfGKQtermU53zBDDfhXRXFqn7i9KCr1o5P3ZTD8ZoQQy0z3-pzEB_Uk2aqBemhNprppUSzDXxCiEBYXb_ium0O5kIJjJVlOS86jv_98' },
    { id: '2', name: 'Apples', volume: 'Lb', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBe8SAQppYSOQb4r9Nz4RbjszYL-D9x2MWT142BJbJ0YGoBmCA36JRJ6fJ8zwSOfe2SsbCss-JvP0TYUnVLl3A0OgBhlS1fAZJ1aKD0YX8V3jEGiS_12GGOdouqQExnWdq0a1H70rEGf_V4I0L6eXgTht9ZVX92X68ABJ2zBuNJQq8LiBHk8WDnEC_kgQsnB1GAx4W2fYIVx3UxAXu7ws7OAuChQrtM1FzJxzntaPagoGwt5fDFWO9dE2yWsfKhyzLEY9RTFjW5rJGN' },
    { id: '3', name: 'Spinach', volume: 'Bag', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqqpvCnM9jGI55k0ahSbfr2NJwlK53qp1HtcX0KLR_4Pz3NSG0V33e9HvofKiKwQu8ttPIGwl-FdR0oHQdJveFPXN5_EfmJWZP-hek-dHl_Wh-eDDFmznD-meHsoytPquhtkCk6VbTxGGZGh9ShjYzRYkMzILEAylYX7qNv-a3sh55fm69chHudom6ScZ3NoTEUSJbpy4t_VYBsiQeLqNQLwjPKZT20_X6zXJCauS9ivhv1LzJG0xdNKqOeO23jRaeDekCV3Rpk_gs' },
    { id: '4', name: 'Tomatoes', volume: 'Pack', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn4gOPz7THvqGBRxEueOyCP_fgogtInYxLSalHpNEa6bFxc6U2Jdm_4Ek04BO0CKRuJx9ZD-38Y8HQ8q0_QVqutDybOJLkW9oM49Wb-v5ByKHDNdyr1AxLjak-iBU9UIxn1z05jJvoczBF96Hi879BbBljwRVt6grM3czixSgLKoPxJK_K8os-atifraFZeftBDJTLu0B2B085vsv2s2UU6-nQSzl4IVjFUaeVOdg6hrxUuZbmvaDdnSoNIMQifwHZzGWLDWLDLiw-' },
    { id: '5', name: 'Avocados', volume: 'Each', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIRJooNZM5JMscAsEkuZWyc4a2E85IjQccqEefMIf67cQbCGcUFbxE7mfcemFdPo5FobUZcSWjJh_Ru6cBEJJMZ2UG8EcAlT8HuR8pc1MQ0YI-hv5Hlm2S76FY10aQURROao-mTkq4Lv2AKbYMq2f5I9Hq1mHw5ip2nyuPqOGpw3-DhzBAyn4Ivn2rnqEiE3sQkdS-GJfUCoUznGe0CLYZGQoLznm2mgvxDwwqrq9uSJyKqfHujMXvzpWnfTPlRGYTrvIJyAzIZmgj' },
    { id: '6', name: 'Broccoli', volume: 'Head', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHbTKl3WbVsHVnwOAPT0WBPIlrHh-HYTnNJ7qz4D1yB4HbkJrDbXVnC2DBRdBFTWe5PVMkW5PUj7pcCXxK3UI71v127XMiwk7Ox-reugpVARihgKU8Bih5hHAi594Em8pAOsED8ZYLJaHkfAR6ZlfE0FTmfxOvdRYYoRTiJK-h6LueWTy93m7IN5pvaLBqf_pZKKXFhAROHBZyuyJ3MNkErwO1rqsJDNXxWYe2Qbaqpa-rTYfM2LPrTzP9FtwTupTzMKRVW4tdCN23' },
  ];

  return (
    <View className="flex-1 bg-surface font-body text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full bg-[#f8faf6] flex-row items-center justify-between px-6 py-4 z-50">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="p-2 rounded-full hover:bg-emerald-50 transition-colors active:scale-95 -ml-2"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} className="text-emerald-900" />
          </TouchableOpacity>
          <Text className="font-headline font-bold text-2xl tracking-tight text-emerald-900">Produce</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center active:scale-95 transition-transform">
          <Icon name="filter-list" size={24} className="text-on-surface-variant" />
        </TouchableOpacity>
      </View>

      <ScrollView className="max-w-screen-xl mx-auto px-6 pt-4 w-full" contentContainerStyle={{ paddingBottom: 150 }}>
        {/* Search Bar Section */}
        <View className="mb-8">
          <View className="relative justify-center">
            <View className="absolute left-5 z-10">
              <Icon name="search" size={24} className="text-outline" />
            </View>
            <TextInput
              className="w-full bg-surface-container-high border-none rounded-full py-4 pl-14 pr-6 text-on-surface font-body text-base"
              placeholder="Search fresh produce..."
              placeholderTextColor="#707973"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Banner */}
        <View className="mb-10 flex-col gap-6">
          <View className="relative h-48 rounded-lg overflow-hidden shadow-sm">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRLgIUsFqbmgrCYe-oB33ql35R2Ik6C8yjW9oXvtAX_iWIyz6RJf8O5Mnz0DTnXLPCKM6rsnS4beeAiZmEQjMzZfO_zMKtnO1dmRbEZdnCnOEwJ8AAj2jyHfbISkG9gLmt2I5QoCi0rkLBTgn6Jr_KiJkzjW1O_nzxB3Mti1jbzdbN3yPo4-VrQt9Pok9yrAkGReNlzvnu7Yg4ySUoVxPVAa8ifcyz3Q4avzlrrsvmAjjxHfWnqt5AZ1LAzchQP1loQFGzGfIP4I1N" }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-primary/30"></View>
          </View>
          <View className="pr-4">
            <Text className="text-primary font-label text-sm font-bold tracking-[0.15em] uppercase mb-2">Weekly Staples</Text>
            <Text className="text-4xl font-extrabold text-on-surface leading-tight mb-2 font-headline">Farm-to-Table{"\n"}Freshness</Text>
            <Text className="text-on-surface-variant text-lg font-body">Organize your kitchen with seasonal greens and roots. Tap to add what's in your basket.</Text>
          </View>
        </View>

        {/* Items Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {items.map((item) => (
            <View key={item.id} className="w-[48%] bg-surface-container-lowest p-4 rounded-lg flex-col items-center shadow-sm">
              <View className="w-full aspect-square rounded-full overflow-hidden mb-4 bg-surface-container">
                <Image source={{ uri: item.image }} className="w-full h-full" />
              </View>
              <View className="flex-row justify-between items-end w-full">
                <View>
                  <Text className="font-headline text-lg font-bold text-on-surface leading-tight">{item.name}</Text>
                  <Text className="font-label text-[10px] font-bold tracking-widest text-outline uppercase">{item.volume}</Text>
                </View>
                <TouchableOpacity className="h-10 w-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center active:scale-90 transition-transform shadow-sm">
                  <Icon name="add" size={24} className="text-on-secondary-fixed-variant" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Contextual Help */}
        <View className="mt-12 p-8 rounded-lg bg-surface-container-low flex-col items-center gap-6 text-center">
          <View className="items-center">
            <Text className="font-headline text-2xl font-bold text-emerald-900 mb-2">Can't find an item?</Text>
            <Text className="text-on-surface-variant font-body text-center">Tap the 'Custom Entry' button to create a custom entry for your unique finds.</Text>
          </View>
          <TouchableOpacity
            className="w-full py-4 bg-primary rounded-xl shadow-lg active:scale-95 transition-all items-center justify-center"
            onPress={() => navigation.navigate("RegisterItem")}
          >
            <Text className="text-on-primary font-headline font-bold text-base">Custom Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Review/Finish Floating Button */}
      <View className="absolute bottom-10 left-0 right-0 px-6 items-center z-50">
        <TouchableOpacity
          className="w-full max-w-xs py-5 bg-primary rounded-xl shadow-2xl flex-row items-center justify-center gap-3 active:scale-95 transition-all"
          onPress={() => navigation.navigate("MainTabs", { screen: "Fridge" })}
        >
          <Text className="text-on-primary font-headline font-bold text-lg">Finish Adding</Text>
          <Icon name="check-circle" size={24} className="text-on-primary" />
          <View className="absolute right-4 h-7 w-7 rounded-full bg-on-primary flex items-center justify-center shadow-inner">
            <Text className="text-primary font-black text-xs">3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
