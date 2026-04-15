import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "../store/appStore";
import Icon from "@expo/vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const { user, family, members } = useAppStore();
  const { t } = useTranslation();
  const [isLangVisible, setIsLangVisible] = React.useState(false);

  const langOptions = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' }
  ];

  const changeLanguage = async (newLang: string) => {
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem("@app_language", newLang);
  };

  const getLanguageLabel = (langCode: string) => {
    switch (langCode) {
      case 'en': return 'English';
      case 'ja': return '日本語';
      default: return 'English';
    }
  };

  return (
    <View className="flex-1 bg-surface text-on-surface" style={{ paddingTop: insets.top }}>
      {/* TopAppBar */}
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-surface z-40">
        <View className="flex-row items-center gap-3">
          <Icon name="restaurant-menu" size={24} className="text-primary" />
          <Text className="font-headline font-extrabold tracking-tight text-2xl text-primary italic">{t('settings.title', 'Moteri')}</Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-primary-fixed overflow-hidden">
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYK2O8UU3Hrcy41SrKBZnOZJVM9jf_tzT0upvGUzd6qjevQE9gSGXqoBepTPn89JoO6W5jY_EMoIEsibnh31mTaiLZ4t_yTbwngstayukp2lUox0zqwvxUiY3bfjNv0jP3Wic-GU3kDd44hr7cgEahPPI7C5Jp_SqC5KMGsTo79xJqD1tJvtq4YrCueV4qai3BQtOFVJhKRrki6syipGLE1LbbUG_TQyG8icw_8R6M1npGlMFNaNWn_mS6xcCkcaYvkpg5_f4H9Khx" }}
            className="w-full h-full"
          />
        </View>
      </View>

      <ScrollView className="px-6 pt-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Section */}
        <View className="relative mb-12 rounded-xl overflow-hidden min-h-[280px] justify-end p-8 bg-primary">
          <View className="absolute inset-0 z-0">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZR6nYSfMTCPcm0DIbg822mhirC4zMNFYoUguvKybrMEkhyAxfsGIDfA9Hh5ZTg5egiXRUnmOrD5GETy2V8xYtcO89Gz-897f1OM-FREuoFP_Yizc3J2abYW6XgMTGdx0xmo7_uWPE6cPwXYNI45NJRDGna3hpf3IraWlYLgJCJL30iqR_BGk9Xevjvt5X2HmacO2NDiLy18mZYjg-hDClgCN2lZn5WZIhnGAEwhou9ZKbfAh6JpOTSxId5bcSo2lby1wRJnb0isOR" }}
              className="w-full h-full opacity-60"
            />
            <View className="absolute inset-0 bg-black/30"></View>
          </View>
          <View className="relative z-10">
            <Text className="font-headline text-4xl font-extrabold text-white mb-2 tracking-tight">{t('settings.heroTitle', 'Our Kitchen Collective')}</Text>
            <Text className="text-primary-fixed font-medium text-lg leading-relaxed">{t('settings.heroSubtitle', 'Nurturing the heart of our home through shared organization and culinary love.')}</Text>
          </View>
        </View>

        <View className="flex-col md:flex-row gap-8">
          {/* Left Column Equivalent */}
          <View className="gap-y-8">
            {/* Invite Code */}
            <View className="bg-surface-container-lowest rounded-lg p-8 shadow-sm relative overflow-hidden mb-8">
              <View className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-full -mr-16 -mt-16"></View>
              <Text className="font-headline text-xs font-bold uppercase tracking-widest text-secondary mb-4">{t('settings.inviteCodeTitle', 'Household Invite Code')}</Text>

              <View className="gap-y-4">
                <View className="bg-surface-container rounded-lg p-6 flex-row items-center justify-between border border-outline-variant/20">
                  <Text className="font-headline text-3xl font-extrabold tracking-widest text-primary">{family?.inviteCode || "KITCH-829"}</Text>
                  <TouchableOpacity className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                    <Icon name="content-copy" size={20} className="text-primary" />
                  </TouchableOpacity>
                </View>
                <Text className="text-on-surface-variant text-sm font-medium mb-2">{t('settings.inviteCodeDesc', 'Share this code to invite new family members to collaborate on your kitchen inventory.')}</Text>
                <TouchableOpacity className="w-full py-4 bg-secondary rounded-xl active:scale-95 transition-transform flex-row items-center justify-center gap-2">
                  <Icon name="share" size={20} className="text-on-secondary" />
                  <Text className="text-on-secondary font-headline font-bold text-base">{t('settings.inviteBtn', 'Invite New Member')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Kitchen Settings */}
            <View className="bg-surface-container-low rounded-lg p-8 mb-10">
              <Text className="font-headline text-xl font-bold text-on-surface mb-6">{t('settings.kitchenSettingsTitle', 'Kitchen Settings')}</Text>
              <View className="gap-y-4">
                <TouchableOpacity className="flex-row items-center justify-between p-4 bg-surface-container-lowest rounded-full mb-3">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center">
                      <Icon name="notifications" size={20} className="text-on-secondary-fixed" />
                    </View>
                    <Text className="font-bold text-on-surface">{t('settings.familyAlerts', 'Family Alerts')}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} className="text-outline" />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 bg-surface-container-lowest rounded-full mb-3"
                  onPress={() => navigation.navigate("ActivityLog")}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                      <Icon name="history" size={20} className="text-on-primary-fixed" />
                    </View>
                    <Text className="font-bold text-on-surface">{t('settings.activityLog', 'Activity Log')}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} className="text-outline" />
                </TouchableOpacity>

                {/* Language Menu */}
                <TouchableOpacity
                  className="flex-row items-center justify-between p-4 bg-surface-container-lowest rounded-full mb-3"
                  onPress={() => setIsLangVisible(true)}
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                      <Icon name="language" size={20} className="text-on-tertiary-fixed" />
                    </View>
                    <Text className="font-bold text-on-surface">{t('settings.language', 'Language')}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-on-surface-variant font-medium">{getLanguageLabel(i18n.language)}</Text>
                    <Icon name="chevron-right" size={24} className="text-outline" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Right Column Equivalent */}
          <View className="gap-y-10">
            {/* Active Members */}
            <View className="mb-10">
              <View className="flex-row items-center gap-2 mb-6">
                <Text className="font-headline text-2xl font-extrabold text-primary">{t('settings.activeMembers', 'Active Members')}</Text>
                <View className="bg-primary-fixed px-3 py-1 rounded-full">
                  <Text className="text-on-primary-fixed text-sm font-bold">{members.length}</Text>
                </View>
              </View>

              <View className="gap-y-3">
                {members.map(member => (
                  <View key={member.id} className="bg-surface-container-lowest p-4 rounded-lg flex-row items-center justify-between mb-3 shadow-sm">
                    <View className="flex-row items-center gap-4">
                      <View className={`w-14 h-14 rounded-full overflow-hidden ${member.role === 'admin' ? 'border-4 border-primary-fixed/30' : ''}`}>
                        <Image source={{ uri: member.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBLBmGsR-kJweeqc6UJ7tFTPqnu0oh9i1NT_cdc4QrCHqzM38OL6rZzEeb_JORaDSbyD4BoBvZ5M2B3oQH0L3EHIAZGXO-ZRlAOFSzcna5YjAqVtDHtwM-lH0DAkGAO3zl4m-fMd9bM-BL9Bv3fT1EHpVnzbi_BDmIrQkYSOdK_xXrt2w1Vu5c8P9wC5_Buwe0_-unnxrPTVH2B1vQoq6lLZRjPDAd5R40L68I9IV9D4v_KPWgyT63nEMuvk5CDeO_eFgcF-GBYw4se" }} className="w-full h-full" />
                      </View>
                      <View>
                        <Text className="font-bold text-on-surface text-base">{member.name}</Text>
                        <View className={`${member.role === 'admin' ? 'bg-primary-fixed' : 'bg-secondary-fixed'} px-2 py-0.5 rounded self-start mt-1`}>
                          <Text className={`font-headline text-[10px] font-extrabold uppercase tracking-[0.1em] ${member.role === 'admin' ? 'text-primary' : 'text-secondary'}`}>
                            {member.role === 'admin' ? t('settings.admin', 'Admin') : t('settings.contributor', 'Contributor')}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity className="p-2">
                      <Icon name="more-vert" size={24} className="text-outline" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Pending Invitations */}
            <View>
              <Text className="font-headline text-sm font-bold text-outline-variant mb-6 uppercase tracking-[0.15em]">{t('settings.pendingInvitations', 'Pending Invitations')}</Text>
              <View className="bg-surface-container-low/50 p-4 rounded-lg flex-row items-center justify-between border border-dashed border-outline-variant">
                <View className="flex-row items-center gap-4 opacity-70">
                  <View className="w-12 h-12 rounded-full bg-surface-dim flex items-center justify-center">
                    <Icon name="person" size={24} className="text-outline" />
                  </View>
                  <View>
                    <Text className="font-bold text-on-surface">lilly.smith@email.com</Text>
                    <Text className="text-xs font-semibold text-tertiary uppercase tracking-wider mt-0.5">{t('settings.invitedDaysAgo', { defaultValue: 'Invited {{days}} days ago', days: 2 })}</Text>
                  </View>
                </View>
                <TouchableOpacity className="px-4 py-2 border border-error/30 rounded-full">
                  <Text className="text-sm font-bold text-error">{t('settings.revoke', 'Revoke')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal visible={isLangVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={() => setIsLangVisible(false)}
          />
          <View className="bg-surface w-4/5 rounded-2xl overflow-hidden p-6 shadow-lg">
            <Text className="font-headline font-extrabold text-xl text-primary mb-4 tracking-tight">
              {t('settings.selectLanguage', 'Select Language')}
            </Text>
            <View className="gap-y-4">
              {langOptions.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  className={`px-5 py-5 rounded-xl flex-row items-center justify-between ${i18n.language === opt.value ? 'bg-secondary-container' : 'bg-surface-container-lowest'}`}
                  onPress={() => {
                    changeLanguage(opt.value);
                    setIsLangVisible(false);
                  }}
                >
                  <Text className={`font-bold text-base ${i18n.language === opt.value ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                    {opt.label}
                  </Text>
                  {i18n.language === opt.value && <Icon name="check" size={20} className="text-on-secondary-container" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
