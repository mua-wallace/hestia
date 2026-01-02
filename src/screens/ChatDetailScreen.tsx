import React, { useState, useRef, useEffect, Fragment } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  Keyboard,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { mockChatMessages, CURRENT_USER_ID } from '../data/mockChatMessages';
import { mockChatData } from '../data/mockChatData';
import MessageBubble from '../components/chat/MessageBubble';
import ChatHeader from '../components/chat/ChatHeader';
import { scaleX, CHAT_HEADER } from '../constants/chatStyles';
import { colors } from '../theme';

type ChatDetailScreenRouteProp = {
  params: {
    chatId: string;
  };
};

type ChatDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatDetail'>;

export default function ChatDetailScreen() {
  const route = useRoute<ChatDetailScreenRouteProp>();
  const navigation = useNavigation<ChatDetailScreenNavigationProp>();
  const { chatId } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  
  const chat = mockChatData.find((c) => c.id === chatId);
  const initialMessages = mockChatMessages[chatId] || [];
  const isGroup = chat?.isGroup || false;
  
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  
  // Bottom navigation bar height
  const BOTTOM_NAV_HEIGHT = 152 * scaleX;

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    // Scroll to bottom when messages load
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() && chat) {
      // Create new message
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        chatId: chatId,
        senderId: CURRENT_USER_ID,
        senderName: 'You',
        message: inputText.trim(),
        timestamp: new Date().toISOString(),
      };
      
      // Add message to the messages list
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const shouldShowDateSeparator = (currentMessage: ChatMessage, prevMessage: ChatMessage | null): boolean => {
    if (!prevMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp);
    const prevDate = new Date(prevMessage.timestamp);
    
    return (
      currentDate.getDate() !== prevDate.getDate() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getFullYear() !== prevDate.getFullYear()
    );
  };

  const formatDateSeparator = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!chat) {
    return (
      <View style={styles.container}>
        <Text>Chat not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : Platform.OS === 'android' ? 0 : 0}
      >
        {/* Header */}
        <ChatHeader
          onBackPress={handleBackPress}
          showSearch={false}
          title={chat.name}
          isGroup={isGroup}
          avatar={chat.avatar}
          showAvatar={true}
          showMessageButton={false}
        />

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }}
        >
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === CURRENT_USER_ID;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
          
          return (
            <Fragment key={message.id}>
              {showDateSeparator && (
                <View style={styles.dateSeparator}>
                  <View style={styles.dateSeparatorLine} />
                  <Text style={styles.dateSeparatorText}>
                    {formatDateSeparator(message.timestamp)}
                  </Text>
                  <View style={styles.dateSeparatorLine} />
                </View>
              )}
              <MessageBubble
                message={message}
                isCurrentUser={isCurrentUser}
                isGroup={isGroup}
              />
            </Fragment>
          );
        })}
        </ScrollView>

        {/* Input Area */}
        <SafeAreaView style={styles.inputSafeArea} edges={['bottom']}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#999999"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                onFocus={scrollToBottom}
                multiline
                maxLength={500}
                returnKeyType="send"
                blurOnSubmit={false}
                textAlignVertical={Platform.OS === 'android' ? 'center' : 'top'}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inputSafeArea: {
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: CHAT_HEADER.background.height * scaleX, // Header background height (top section only, no search)
    paddingBottom: 10 * scaleX, // Add padding at bottom to prevent overlap with input
  },
  messagesContent: {
    paddingVertical: 16 * scaleX,
    paddingBottom: 20 * scaleX,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingHorizontal: 16 * scaleX,
    paddingTop: 0,
    paddingBottom: Platform.OS === 'android' ? 8 * scaleX : 8 * scaleX,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F6FC',
    borderRadius: 24 * scaleX,
    paddingLeft: 16 * scaleX,
    paddingRight: 8 * scaleX,
    paddingTop: Platform.OS === 'android' ? 8 * scaleX : 6 * scaleX,
    paddingBottom: Platform.OS === 'android' ? 8 * scaleX : 6 * scaleX,
    minHeight: Platform.OS === 'android' ? 48 * scaleX : 44 * scaleX,
    maxHeight: 120 * scaleX,
    marginTop: Platform.OS === 'android' ? 8 * scaleX : 6 * scaleX,
  },
  input: {
    flex: 1,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
    maxHeight: 104 * scaleX,
    paddingVertical: Platform.OS === 'android' ? 10 * scaleX : 8 * scaleX,
    paddingRight: 8 * scaleX,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
    includeFontPadding: Platform.OS === 'android' ? false : false,
  },
  sendButton: {
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 10 * scaleX,
    borderRadius: 20 * scaleX,
    backgroundColor: '#5A759D',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 36 * scaleX,
    minWidth: 60 * scaleX,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 14 * scaleX,
    fontWeight: '600' as any,
    color: '#FFFFFF',
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16 * scaleX,
    paddingHorizontal: 16 * scaleX,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dateSeparatorText: {
    fontSize: 12 * scaleX,
    fontFamily: 'Helvetica',
    color: '#999999',
    marginHorizontal: 12 * scaleX,
    fontWeight: '400' as any,
  },
});

