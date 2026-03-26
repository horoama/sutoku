import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore, ChatMessage } from "../store/chatStore";
import { useAppStore } from "../store/appStore";
import Icon from "@expo/vector-icons/MaterialIcons";
import { format } from "date-fns";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { user, family } = useAppStore();
  const { messages, fetchMessages, sendMessage } = useChatStore();
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (family?.id) {
      fetchMessages();
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [family?.id]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText("");
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.userId === user?.id;
    const time = format(new Date(item.createdAt), "HH:mm");

    if (isMe) {
      return (
        <View className="flex-col gap-2 items-end mb-6 w-full">
          <View className="flex-row items-end gap-2 max-w-[85%] justify-end">
            <View className="bg-primary-container rounded-t-2xl rounded-bl-2xl p-4 shadow-sm">
              <Text className="text-on-primary-container text-sm leading-relaxed font-body">{item.text}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 mr-2">
            <Text className="text-[10px] text-outline font-medium">{time}</Text>
            <Icon name="done-all" size={14} className="text-primary" />
          </View>
        </View>
      );
    }

    return (
      <View className="flex-col gap-2 items-start mb-6 w-full">
        <View className="flex-row items-end gap-2 max-w-[85%]">
          <View className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-surface-variant flex items-center justify-center">
            <Text className="text-on-surface-variant font-bold text-xs">{item.user.name.charAt(0)}</Text>
          </View>
          <View className="bg-surface-container-lowest rounded-t-2xl rounded-br-2xl p-4 shadow-sm border border-surface-variant/20">
            <Text className="block text-[10px] font-bold text-secondary mb-1 uppercase tracking-tight">{item.user.name}</Text>
            <Text className="text-on-surface text-sm leading-relaxed font-body">{item.text}</Text>
          </View>
        </View>
        <Text className="ml-10 text-[10px] text-outline font-medium">{time}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
      style={{ paddingTop: insets.top }}
    >
      <View className="w-full flex-row items-center justify-between px-6 py-4 bg-surface z-50">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed flex items-center justify-center">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBP0XDOKQyxVwcGag_bB4WCemJ6bdGVMfz2esVRPbksCqaBIc6ZIvQfAxtKP9-YRKo_h_Fi-bcha96iBPqwPFj_qKjJvViVSCfmWqjxi4G6eRIVB436FOI3J7GR_ybClds73JxQtDmf-fCK4F5oT_UOP8tsrWMsYvRdhabcHCx4x9F0hChuq5518dISailXJhXoPQdfbgZgbAB4qcW9jYMY3bTwy3m5PyjsVHennXbJuda6Pgv-WXZ53nJfKAA0RUTG1G5IaEXXDrXC" }}
              className="w-full h-full"
            />
          </View>
          <Text className="font-headline font-bold text-lg tracking-tight text-primary">Chat</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="active:opacity-80 transition-opacity">
            <Icon name="search" size={24} className="text-outline" />
          </TouchableOpacity>
          <TouchableOpacity className="active:opacity-80 transition-opacity">
            <Icon name="notifications" size={24} className="text-primary" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120, paddingTop: 20 }}
        ListFooterComponent={
          <View className="flex items-center mb-6">
            <View className="bg-surface-container-low px-4 py-1 rounded-full">
              <Text className="text-[10px] font-bold uppercase tracking-widest text-outline">Today</Text>
            </View>
          </View>
        }
      />

      <View className="absolute bottom-28 w-full px-4 z-40 bg-transparent">
        <View className="bg-surface-container-lowest/90 backdrop-blur-xl rounded-full p-2 shadow-sm flex-row items-center gap-2 border border-surface-variant/50">
          <TouchableOpacity className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full transition-colors active:scale-95">
            <Icon name="add-circle" size={24} className="text-primary-container" />
          </TouchableOpacity>
          <TextInput
            className="flex-1 bg-transparent border-0 focus:ring-0 text-sm py-2 px-2 text-on-surface font-body"
            placeholder="Type a message or request..."
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full transition-colors active:scale-95">
            <Icon name="image" size={24} className="text-secondary" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 flex items-center justify-center bg-primary rounded-full shadow-lg active:scale-95 transition-transform"
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Icon name="send" size={20} className="text-on-primary" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

