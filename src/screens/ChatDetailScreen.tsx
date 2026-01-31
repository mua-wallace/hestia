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
  SafeAreaView,
  Image,
  Alert,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { mockChatMessages, CURRENT_USER_ID } from '../data/mockChatMessages';
import { mockChatData } from '../data/mockChatData';
import { mockStaffData } from '../data/mockStaffData';
import MessageBubble from '../components/chat/MessageBubble';
import ChatHeader from '../components/chat/ChatHeader';
import { scaleX, CHAT_HEADER } from '../constants/chatStyles';

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
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUser, setTaggedUser] = useState<{ id: string; name: string } | null>(null);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const responsiveScale = screenWidth / 440;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);
  
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

  // Recording timer - updates every second while recording
  useEffect(() => {
    if (!isRecording) return;
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

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

  const showImageSourceOptions = () => {
    Alert.alert(
      'Add Image',
      'Choose how to add an image',
      [
        {
          text: 'Take Photo',
          onPress: handleTakePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: handlePickFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickFromLibrary = async () => {
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

  const recordingRef = useRef<Audio.Recording | null>(null);

  const handleVoiceRecord = async () => {
    if (!chat) return;

    if (isRecording) {
      // Stop recording and send
      try {
        if (recordingRef.current) {
          const uri = recordingRef.current.getURI();
          const status = await recordingRef.current.stopAndUnloadAsync();
          const durationSec = status && 'durationMillis' in status && status.durationMillis != null
            ? Math.round(status.durationMillis / 1000)
            : 0;
          recordingRef.current = null;
          setIsRecording(false);
          setRecordingSeconds(0);

          if (uri && durationSec > 0) {
            const newMessage: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              chatId: chatId,
              senderId: CURRENT_USER_ID,
              senderName: 'You',
              message: '🎤 Voice message',
              timestamp: new Date().toISOString(),
              type: 'voice',
              voiceUri: uri,
              voiceDuration: durationSec,
              taggedUserId: taggedUser?.id,
              taggedUserName: taggedUser?.name,
            };
            setMessages((prev) => [...prev, newMessage]);
            setTaggedUser(null);
            scrollToBottom();
          } else {
            Alert.alert('Recording too short', 'Please record for at least 1 second.');
          }
        }
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        setRecordingSeconds(0);
        recordingRef.current = null;
        Alert.alert('Error', 'Failed to save voice message. Please try again.');
      }
      return;
    }

    // Start recording
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant microphone permissions to record voice messages.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
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

  const keyboardBehavior = Platform.select({
    ios: 'padding' as const,
    android: 'padding' as const,
    default: 'padding' as const,
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
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
          style={[styles.messagesContainer, { marginTop: CHAT_HEADER.background.height * responsiveScale }]}
          contentContainerStyle={[styles.messagesContent, { paddingVertical: 16 * responsiveScale, paddingBottom: 24 * responsiveScale }]}
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

        {/* Input Area - WhatsApp style: sits above home indicator / device nav */}
        <View style={[styles.inputSafeArea, { paddingBottom: bottomPadding }]}>
          <View style={[styles.inputContainer, { paddingHorizontal: 16 * responsiveScale, paddingTop: 12 * responsiveScale, paddingBottom: 12 * responsiveScale }]}>
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
              {/* Microphone Button - Tap to start/stop recording */}
              <TouchableOpacity
                style={[styles.micButton, isRecording && styles.micButtonRecording]}
                onPress={handleVoiceRecord}
                activeOpacity={0.7}
              >
                <View style={styles.micIcon}>
                  <View style={[styles.micBody, isRecording && styles.micBodyRecording]} />
                  <View style={[styles.micStand, isRecording && styles.micStandRecording]} />
                </View>
              </TouchableOpacity>

              {/* Recording time - shown when recording */}
              {isRecording ? (
                <Text
                  style={[styles.recordingTime, { fontSize: 14 * responsiveScale, marginLeft: 8 * responsiveScale }]}
                  numberOfLines={1}
                >
                  {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                </Text>
              ) : null}

              {/* Tag Button - Only show if group chat or has participants */}
              {!isRecording && (isGroup || getParticipants().length > 0) && (
                <TouchableOpacity
                  style={styles.tagButton}
                  onPress={handleTagUser}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tagButtonText}>@</Text>
                </TouchableOpacity>
              )}

              {!isRecording && (
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
              )}

              {/* Camera/Image Button - Hidden when recording */}
              {!isRecording && (
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={showImageSourceOptions}
                activeOpacity={0.7}
              >
                {/* Camera Icon - WhatsApp style */}
                <View style={styles.cameraIcon}>
                  <View style={styles.cameraBody} />
                  <View style={styles.cameraLens} />
                  <View style={styles.cameraFlash} />
                </View>
              </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.sendButton, (!inputText.trim() && !selectedImage && !isRecording) && styles.sendButtonDisabled]}
                onPress={isRecording ? handleVoiceRecord : handleSend}
                disabled={!inputText.trim() && !selectedImage && !isRecording}
                activeOpacity={0.7}
              >
                <Text style={styles.sendButtonText}>{isRecording ? 'Stop' : 'Send'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tag User Modal */}
        <Modal
          visible={showTagModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTagModal(false)}
          statusBarTranslucent={Platform.OS === 'android'}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
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
    borderTopWidth: 0,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
  },
  messagesContent: {
    flexGrow: 1,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
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
    minWidth: 0,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
    maxHeight: 104 * scaleX,
    paddingVertical: Platform.OS === 'android' ? 10 * scaleX : 8 * scaleX,
    paddingRight: 8 * scaleX,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
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
  micButtonRecording: {
    backgroundColor: '#ff6b6b',
  },
  recordingTime: {
    flex: 1,
    minWidth: 0,
    fontFamily: 'Helvetica',
    color: '#ff6b6b',
    fontWeight: '600' as any,
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  micBodyRecording: {
    borderColor: '#FFFFFF',
  },
  micStandRecording: {
    borderColor: '#FFFFFF',
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

