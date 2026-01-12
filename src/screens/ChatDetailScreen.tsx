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
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { mockChatMessages, CURRENT_USER_ID } from '../data/mockChatMessages';
import { mockChatData } from '../data/mockChatData';
import { mockStaffData } from '../data/mockStaffData';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUser, setTaggedUser] = useState<{ id: string; name: string } | null>(null);
  
  // Bottom navigation bar height
  const BOTTOM_NAV_HEIGHT = 152 * scaleX;
  
  // Get participants for tagging (mock data - in real app, get from chat participants)
  const getParticipants = () => {
    if (isGroup) {
      // For group chats, return all staff members
      return mockStaffData.map(staff => ({ id: staff.id, name: staff.name }));
    } else {
      // For one-on-one, return the other person
      const otherPerson = mockStaffData.find(s => s.id !== CURRENT_USER_ID) || mockStaffData[0];
      return [{ id: otherPerson.id, name: otherPerson.name }];
    }
  };

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
    if ((inputText.trim() || selectedImage) && chat) {
      // Create new message
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        chatId: chatId,
        senderId: CURRENT_USER_ID,
        senderName: 'You',
        message: inputText.trim() || (selectedImage ? '📷 Image' : ''),
        timestamp: new Date().toISOString(),
        type: selectedImage ? 'image' : 'text',
        imageUri: selectedImage || undefined,
        taggedUserId: taggedUser?.id,
        taggedUserName: taggedUser?.name,
      };
      
      // Add message to the messages list
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      setSelectedImage(null);
      setTaggedUser(null);
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleVoiceRecord = () => {
    // Note: This requires expo-av package. For now, we'll show a placeholder.
    // To implement fully, install: npm install expo-av
    Alert.alert(
      'Voice Recording',
      'Voice recording requires expo-av package. Install it with: npm install expo-av',
      [{ text: 'OK' }]
    );
    // TODO: Implement voice recording with expo-av
    // For now, create a mock voice message
    if (chat) {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        chatId: chatId,
        senderId: CURRENT_USER_ID,
        senderName: 'You',
        message: '🎤 Voice message',
        timestamp: new Date().toISOString(),
        type: 'voice',
        voiceUri: 'mock-voice-uri',
        voiceDuration: 5,
        taggedUserId: taggedUser?.id,
        taggedUserName: taggedUser?.name,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTaggedUser(null);
    }
  };

  const handleTagUser = () => {
    setShowTagModal(true);
  };

  const handleSelectTaggedUser = (userId: string, userName: string) => {
    setTaggedUser({ id: userId, name: userName });
    setShowTagModal(false);
  };

  const removeTaggedUser = () => {
    setTaggedUser(null);
  };

  const removeImage = () => {
    setSelectedImage(null);
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
            {/* Selected Image Preview */}
            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Tagged User Display */}
            {taggedUser && (
              <View style={styles.taggedUserContainer}>
                <Text style={styles.taggedUserText}>@{taggedUser.name}</Text>
                <TouchableOpacity onPress={removeTaggedUser} style={styles.removeTagButton}>
                  <Text style={styles.removeTagText}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputWrapper}>
              {/* Microphone Button - Left side next to input (WhatsApp style) */}
              <TouchableOpacity
                style={styles.micButton}
                onPress={handleVoiceRecord}
                activeOpacity={0.7}
              >
                {/* Microphone Icon - WhatsApp style */}
                <View style={styles.micIcon}>
                  <View style={styles.micBody} />
                  <View style={styles.micStand} />
                </View>
              </TouchableOpacity>

              {/* Tag Button - Only show if group chat or has participants */}
              {(isGroup || getParticipants().length > 0) && (
                <TouchableOpacity
                  style={styles.tagButton}
                  onPress={handleTagUser}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tagButtonText}>@</Text>
                </TouchableOpacity>
              )}

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

              {/* Camera Button - Right side next to send button (WhatsApp style) */}
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleImagePicker}
                activeOpacity={0.7}
              >
                {/* Camera Icon - WhatsApp style */}
                <View style={styles.cameraIcon}>
                  <View style={styles.cameraBody} />
                  <View style={styles.cameraLens} />
                  <View style={styles.cameraFlash} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() && !selectedImage) && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim() && !selectedImage}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Tag User Modal */}
        <Modal
          visible={showTagModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTagModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tag someone</Text>
                <TouchableOpacity onPress={() => setShowTagModal(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={getParticipants()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.participantItem}
                    onPress={() => handleSelectTaggedUser(item.id, item.name)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.participantName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
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
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8 * scaleX,
    marginHorizontal: 16 * scaleX,
    alignSelf: 'flex-start',
  },
  imagePreview: {
    width: 120 * scaleX,
    height: 120 * scaleX,
    borderRadius: 8 * scaleX,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8 * scaleX,
    right: -8 * scaleX,
    width: 24 * scaleX,
    height: 24 * scaleX,
    borderRadius: 12 * scaleX,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16 * scaleX,
    fontWeight: 'bold' as any,
  },
  taggedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3ECF5',
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 6 * scaleX,
    borderRadius: 16 * scaleX,
    marginBottom: 8 * scaleX,
    marginHorizontal: 16 * scaleX,
    alignSelf: 'flex-start',
  },
  taggedUserText: {
    fontSize: 13 * scaleX,
    fontFamily: 'Helvetica',
    color: '#5A759D',
    fontWeight: '600' as any,
    marginRight: 8 * scaleX,
  },
  removeTagButton: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    borderRadius: 9 * scaleX,
    backgroundColor: '#5A759D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagText: {
    color: '#FFFFFF',
    fontSize: 12 * scaleX,
    fontWeight: 'bold' as any,
  },
  micButton: {
    width: 32 * scaleX,
    height: 32 * scaleX,
    borderRadius: 16 * scaleX,
    backgroundColor: '#E3ECF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8 * scaleX,
  },
  tagButton: {
    width: 32 * scaleX,
    height: 32 * scaleX,
    borderRadius: 16 * scaleX,
    backgroundColor: '#E3ECF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8 * scaleX,
  },
  cameraButton: {
    width: 32 * scaleX,
    height: 32 * scaleX,
    borderRadius: 16 * scaleX,
    backgroundColor: '#E3ECF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8 * scaleX,
  },
  // Camera Icon - WhatsApp style (simplified line icon)
  cameraIcon: {
    width: 20 * scaleX,
    height: 16 * scaleX,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBody: {
    width: 16 * scaleX,
    height: 12 * scaleX,
    borderWidth: 2 * scaleX,
    borderColor: '#5A759D',
    borderRadius: 2 * scaleX,
  },
  cameraLens: {
    position: 'absolute',
    width: 6 * scaleX,
    height: 6 * scaleX,
    borderRadius: 3 * scaleX,
    borderWidth: 2 * scaleX,
    borderColor: '#5A759D',
    backgroundColor: 'transparent',
  },
  cameraFlash: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4 * scaleX,
    height: 3 * scaleX,
    borderTopRightRadius: 2 * scaleX,
    backgroundColor: '#5A759D',
  },
  // Microphone Icon - WhatsApp style (simplified line icon)
  micIcon: {
    width: 14 * scaleX,
    height: 18 * scaleX,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micBody: {
    width: 10 * scaleX,
    height: 14 * scaleX,
    borderRadius: 5 * scaleX,
    borderWidth: 2 * scaleX,
    borderColor: '#5A759D',
    backgroundColor: 'transparent',
  },
  micStand: {
    position: 'absolute',
    bottom: -1 * scaleX,
    left: '50%',
    marginLeft: -4 * scaleX,
    width: 8 * scaleX,
    height: 3 * scaleX,
    borderTopWidth: 2 * scaleX,
    borderLeftWidth: 2 * scaleX,
    borderRightWidth: 2 * scaleX,
    borderColor: '#5A759D',
    borderBottomWidth: 0,
    borderTopLeftRadius: 2 * scaleX,
    borderTopRightRadius: 2 * scaleX,
  },
  tagButtonText: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: '#5A759D',
    fontWeight: '600' as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20 * scaleX,
    borderTopRightRadius: 20 * scaleX,
    maxHeight: '60%',
    paddingBottom: 40 * scaleX,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 16 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '600' as any,
    color: '#1E1E1E',
  },
  modalCloseText: {
    fontSize: 24 * scaleX,
    color: '#999999',
  },
  participantItem: {
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 16 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  participantName: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
  },
});

