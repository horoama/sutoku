import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatStore, ChatMessage } from '../store/chatStore';
import { useAppStore } from '../store/appStore';
import Icon from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';

export default function ChatScreen() {
  const { user, family } = useAppStore();
  const { messages, fetchMessages, sendMessage } = useChatStore();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (family?.id) {
      fetchMessages();
      // Polling for new messages just for basic MVP
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [family?.id]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMe = item.userId === user?.id;
    const time = format(new Date(item.createdAt), 'HH:mm');

    return (
      <View style={[styles.messageRow, isMe ? styles.messageMe : styles.messageOther]}>
        {!isMe && <View style={styles.avatar}><Text style={styles.avatarText}>{item.user.name.charAt(0)}</Text></View>}
        <View style={[styles.messageBubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {!isMe && <Text style={styles.senderName}>{item.user.name}</Text>}
          <Text style={[styles.messageText, isMe ? styles.textMe : styles.textOther]}>{item.text}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        inverted // Displays list from bottom up
        contentContainerStyle={{ padding: 15 }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="メッセージを入力..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!inputText.trim()}>
          <Icon name="send" size={20} color={inputText.trim() ? "tomato" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  messageMe: { justifyContent: 'flex-end' },
  messageOther: { justifyContent: 'flex-start' },

  avatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#555', fontWeight: 'bold' },

  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 20 },
  bubbleMe: { backgroundColor: 'tomato', borderBottomRightRadius: 5 },
  bubbleOther: { backgroundColor: '#fff', borderBottomLeftRadius: 5, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },

  senderName: { fontSize: 12, color: '#888', marginBottom: 5 },
  messageText: { fontSize: 16 },
  textMe: { color: '#fff' },
  textOther: { color: '#333' },

  timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 5, color: 'rgba(0,0,0,0.4)' },

  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 20, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, maxHeight: 100, fontSize: 16 },
  sendButton: { padding: 10, marginLeft: 5 }
});