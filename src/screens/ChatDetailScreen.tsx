import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  Image,
  Alert,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { mockStaffData } from '../data/mockStaffData';
import MessageBubble from '../components/chat/MessageBubble';
import ChatHeader from '../components/chat/ChatHeader';
import { scaleX, CHAT_HEADER } from '../constants/chatStyles';
import {
  getCurrentUserId,
  getChatById,
  getMyRoleInChat,
  getGroupParticipants,
  setParticipantRole,
  subscribeToMessages,
  updateGroupChat,
  deleteGroupChat,
  type GroupParticipant,
} from '../services/chat';
import { useChatStore } from '../store/useChatStore';

type ChatDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatDetail'>;

export default function ChatDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ChatDetail'>>();
  const navigation = useNavigation<ChatDetailScreenNavigationProp>();
  const { chatId, chat: chatParam } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

  const isSupabaseChat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chatId);
  const [fetchedChat, setFetchedChat] = useState<{ name: string; isGroup: boolean; created_by_id: string } | null>(null);
  const baseChat = chatParam ?? (isSupabaseChat ? { id: chatId, name: 'Chat', lastMessage: '', isGroup: false } : null);
  const isGroup = fetchedChat ? fetchedChat.isGroup : (baseChat?.isGroup ?? false);
  const chat = baseChat
    ? {
        ...baseChat,
        name: (fetchedChat?.name != null && fetchedChat.name !== '' ? fetchedChat.name : baseChat.name) ?? 'Chat',
        isGroup,
      }
    : null;

  const [myRole, setMyRole] = useState<'admin' | 'member' | null>(null);
  const isGroupAdmin = isGroup && myRole === 'admin';
  const isGroupCreator = Boolean(isGroup && currentUserId && fetchedChat?.created_by_id && currentUserId === fetchedChat.created_by_id);

  const { messagesByChatId, loadMessages, appendMessage, sendMessage: sendMessageToStore, removeChat, updateChatName, clearMessages } = useChatStore();
  const messages = messagesByChatId[chatId] ?? [];

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUser, setTaggedUser] = useState<{ id: string; name: string } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [showGroupMembersModal, setShowGroupMembersModal] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState<GroupParticipant[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [tagParticipantsList, setTagParticipantsList] = useState<GroupParticipant[]>([]);

  useEffect(() => {
    if (!isSupabaseChat) return;
    getCurrentUserId().then(setCurrentUserId);
    loadMessages(chatId);
  }, [chatId, isSupabaseChat, loadMessages]);

  useEffect(() => {
    if (!isSupabaseChat) return;
    getChatById(chatId).then((row) => {
      if (row) {
        setFetchedChat({
          name: row.type === 'group' && row.name && row.name.trim() ? row.name.trim() : (row.name ?? ''),
          isGroup: row.type === 'group',
          created_by_id: row.created_by_id,
        });
      }
    });
  }, [chatId, isSupabaseChat]);

  useEffect(() => {
    if (!isSupabaseChat || !isGroup) return;
    getMyRoleInChat(chatId).then(setMyRole);
  }, [chatId, isSupabaseChat, isGroup]);

  useEffect(() => {
    if (!isSupabaseChat) return;
    const unsub = subscribeToMessages(chatId, (msg) => {
      appendMessage(chatId, msg);
    });
    return () => {
      unsub?.();
    };
  }, [chatId, isSupabaseChat, appendMessage]);

  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const responsiveScale = screenWidth / 440;
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 8);
  
  const uid = currentUserId ?? '';
  /** Participants for tag modal: real group members when group, else mock for DM */
  const getParticipantsForTag = () => {
    if (isGroup && tagParticipantsList.length > 0) {
      return tagParticipantsList.map((p) => ({ id: p.user_id, name: p.full_name || 'Unknown' }));
    }
    if (isGroup) return [];
    const otherPerson = mockStaffData.find((s) => s.id !== uid) || mockStaffData[0];
    return [{ id: otherPerson.id, name: otherPerson.name }];
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

  const handleSend = async () => {
    if (!(inputText.trim() || selectedImage) || !chat) return;

    if (isSupabaseChat) {
      try {
        const content = inputText.trim() || (selectedImage ? '📷 Image' : '');
        const options: import('../services/chat').SendMessageOptions = {};
        if (taggedUser) {
          options.taggedUserId = taggedUser.id;
          options.taggedUserName = taggedUser.name;
        }
        if (replyToMessage) {
          options.replyToMessageId = replyToMessage.id;
          options.replyToSenderName = replyToMessage.senderName;
          options.replyToMessagePreview = (replyToMessage.message || '').slice(0, 80) + ((replyToMessage.message || '').length > 80 ? '…' : '');
        }
        await sendMessageToStore(chatId, content, selectedImage ? 'image' : 'text', Object.keys(options).length > 0 ? options : undefined);
        setInputText('');
        setSelectedImage(null);
        setTaggedUser(null);
        setReplyToMessage(null);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (e) {
        console.warn('Send failed', e);
      }
      return;
    }

    setInputText('');
    setSelectedImage(null);
    setTaggedUser(null);
    setReplyToMessage(null);
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

          if (uri && durationSec > 0 && isSupabaseChat) {
            const newMessage: ChatMessage = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              chatId: chatId,
              senderId: uid,
              senderName: 'You',
              message: '🎤 Voice message',
              timestamp: new Date().toISOString(),
              type: 'voice',
              voiceUri: uri,
              voiceDuration: durationSec,
              taggedUserId: taggedUser?.id,
              taggedUserName: taggedUser?.name,
            };
            appendMessage(chatId, newMessage);
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

  const handleTagUser = async () => {
    if (isGroup && isSupabaseChat) {
      const participants = await getGroupParticipants(chatId);
      setTagParticipantsList(participants);
    } else {
      setTagParticipantsList([]);
    }
    setShowTagModal(true);
  };

  const handleSelectTaggedUser = (userId: string, userName: string) => {
    setTaggedUser({ id: userId, name: userName });
    setShowTagModal(false);
  };

  /** When user types @ in the input, open the tag modal to pick a member */
  const handleInputChange = (text: string) => {
    if (text.endsWith('@')) {
      setInputText(text.slice(0, -1));
      handleTagUser();
    } else {
      setInputText(text);
    }
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

  const handleGroupOptionsPress = () => {
    const options: Parameters<typeof Alert.alert>[2] = [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Edit group name',
        onPress: () => {
          setEditGroupName(typeof chat?.name === 'string' ? chat.name : '');
          setShowEditGroupModal(true);
        },
      },
      {
        text: 'Group members',
        onPress: async () => {
          const participants = await getGroupParticipants(chatId);
          setGroupParticipants(participants);
          setShowGroupMembersModal(true);
        },
      },
    ];
    if (isGroupCreator) {
      options.push({
        text: 'Delete group',
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Delete group?',
            'This will permanently delete the group and all messages. This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  const ok = await deleteGroupChat(chatId);
                  if (ok) {
                    removeChat(chatId);
                    clearMessages(chatId);
                    navigation.goBack();
                  } else {
                    Alert.alert('Error', 'Could not delete the group.');
                  }
                },
              },
            ]
          );
        },
      });
    }
    Alert.alert('Group options', undefined, options);
  };

  const handleMakeAdmin = async (participantUserId: string) => {
    const ok = await setParticipantRole(chatId, participantUserId, 'admin');
    if (ok) {
      const participants = await getGroupParticipants(chatId);
      setGroupParticipants(participants);
    } else {
      Alert.alert('Error', 'Could not make admin.');
    }
  };

  const handleEditGroupSave = async () => {
    const name = editGroupName.trim();
    if (!name) return;
    const ok = await updateGroupChat(chatId, { name });
    if (ok) {
      updateChatName(chatId, name);
      setFetchedChat((prev) => (prev ? { ...prev, name } : null));
      setShowEditGroupModal(false);
    } else {
      Alert.alert('Error', 'Could not update group name.');
    }
  };

  if (!chat || !chatId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
          title={typeof chat.name === 'string' ? chat.name : 'Chat'}
          isGroup={isGroup}
          avatar={chat.avatar}
          showAvatar={true}
          showMessageButton={false}
          onGroupOptionsPress={isGroupAdmin ? handleGroupOptionsPress : undefined}
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
          const effectiveCurrentId = currentUserId ?? '';
          const isCurrentUser = message.senderId === effectiveCurrentId;
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
          // Key: id + index so duplicate ids (e.g. from realtime race) don't break React
          return (
            <Fragment key={`${message.id}-${index}`}>
              {showDateSeparator ? (
                <View style={styles.dateSeparator}>
                  <View style={styles.dateSeparatorLine} />
                  <Text style={styles.dateSeparatorText}>
                    {formatDateSeparator(message.timestamp)}
                  </Text>
                  <View style={styles.dateSeparatorLine} />
                </View>
              ) : null}
              <MessageBubble
                message={message}
                isCurrentUser={isCurrentUser}
                isGroup={isGroup}
                onLongPress={(msg) => setReplyToMessage(msg)}
                onSwipeReply={(msg) => setReplyToMessage(msg)}
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

            {/* Reply-to preview */}
            {replyToMessage && (
              <View style={styles.replyPreviewBar}>
                <View style={styles.replyPreviewContent}>
                  <Text style={styles.replyPreviewLabel}>Replying to {replyToMessage.senderName}</Text>
                  <Text style={styles.replyPreviewSnippet} numberOfLines={1}>{replyToMessage.message}</Text>
                </View>
                <TouchableOpacity onPress={() => setReplyToMessage(null)} style={styles.replyPreviewDismiss}>
                  <Text style={styles.replyPreviewDismissText}>×</Text>
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

              {/* Tag Button - Only show if group chat or has participants to tag */}
              {!isRecording && (isGroup || getParticipantsForTag().length > 0) && (
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
                placeholder="Type a message... (use @ to tag)"
                placeholderTextColor="#999999"
                value={inputText}
                onChangeText={handleInputChange}
                onFocus={scrollToBottom}
                multiline
                maxLength={500}
                returnKeyType="default"
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
                data={getParticipantsForTag()}
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
                ListEmptyComponent={isGroup ? <Text style={styles.emptyTagList}>Loading members…</Text> : null}
              />
            </View>
          </View>
        </Modal>

        {/* Edit Group Name Modal (admin only) */}
        <Modal
          visible={showEditGroupModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowEditGroupModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit group name</Text>
                <TouchableOpacity onPress={() => setShowEditGroupModal(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.editGroupNameInput}
                placeholder="Group name"
                placeholderTextColor="#999"
                value={editGroupName}
                onChangeText={setEditGroupName}
                maxLength={64}
                autoFocus
              />
              <TouchableOpacity
                style={[styles.editGroupSaveBtn, !editGroupName.trim() && styles.editGroupSaveBtnDisabled]}
                onPress={handleEditGroupSave}
                disabled={!editGroupName.trim()}
                activeOpacity={0.7}
              >
                <Text style={styles.editGroupSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Group members modal (admins): list participants, creator can Make admin */}
        <Modal
          visible={showGroupMembersModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGroupMembersModal(false)}
          statusBarTranslucent={Platform.OS === 'android'}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Group members</Text>
                <TouchableOpacity onPress={() => setShowGroupMembersModal(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={groupParticipants}
                keyExtractor={(item) => item.user_id}
                renderItem={({ item }) => (
                  <View style={styles.groupMemberRow}>
                    {item.avatar_url ? (
                      <Image source={{ uri: item.avatar_url }} style={styles.groupMemberAvatar} />
                    ) : (
                      <View style={styles.groupMemberAvatarPlaceholder}>
                        <Text style={styles.groupMemberInitial}>
                          {(item.full_name || '?').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.groupMemberInfo}>
                      <Text style={styles.groupMemberName} numberOfLines={1}>
                        {item.full_name || 'Unknown'}
                        {item.is_creator ? ' (creator)' : ''}
                      </Text>
                      <Text style={styles.groupMemberRole}>{item.role === 'admin' ? 'Admin' : 'Member'}</Text>
                    </View>
                    {isGroupCreator && item.role === 'member' && item.user_id !== currentUserId ? (
                      <TouchableOpacity
                        style={styles.makeAdminBtn}
                        onPress={() => handleMakeAdmin(item.user_id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.makeAdminBtnText}>Make admin</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
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
  emptyTagList: {
    padding: 20,
    textAlign: 'center',
    color: '#999',
  },
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F6FC',
    borderRadius: 8 * scaleX,
    paddingVertical: 8 * scaleX,
    paddingLeft: 12 * scaleX,
    paddingRight: 8 * scaleX,
    marginBottom: 8 * scaleX,
    borderLeftWidth: 3,
    borderLeftColor: '#5A759D',
  },
  replyPreviewContent: { flex: 1 },
  replyPreviewLabel: {
    fontSize: 12 * scaleX,
    fontWeight: '600',
    color: '#5A759D',
    marginBottom: 2,
  },
  replyPreviewSnippet: {
    fontSize: 13 * scaleX,
    color: '#666',
  },
  replyPreviewDismiss: {
    padding: 4,
  },
  replyPreviewDismissText: {
    fontSize: 20,
    color: '#999',
  },
  editGroupNameInput: {
    height: 48 * scaleX,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8 * scaleX,
    paddingHorizontal: 12 * scaleX,
    marginHorizontal: 20 * scaleX,
    marginTop: 16 * scaleX,
    fontSize: 16,
    color: '#1E1E1E',
  },
  editGroupSaveBtn: {
    marginHorizontal: 20 * scaleX,
    marginTop: 20 * scaleX,
    height: 48 * scaleX,
    borderRadius: 8 * scaleX,
    backgroundColor: '#5A759D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editGroupSaveBtnDisabled: {
    opacity: 0.5,
  },
  editGroupSaveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  groupMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 12 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  groupMemberAvatar: {
    width: 40 * scaleX,
    height: 40 * scaleX,
    borderRadius: 20 * scaleX,
  },
  groupMemberAvatarPlaceholder: {
    width: 40 * scaleX,
    height: 40 * scaleX,
    borderRadius: 20 * scaleX,
    backgroundColor: '#E3ECF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupMemberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5A759D',
  },
  groupMemberInfo: {
    flex: 1,
    marginLeft: 12 * scaleX,
  },
  groupMemberName: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: '#1E1E1E',
  },
  groupMemberRole: {
    fontSize: 13 * scaleX,
    color: '#666',
    marginTop: 2,
  },
  makeAdminBtn: {
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 6 * scaleX,
    borderRadius: 6 * scaleX,
    backgroundColor: '#5A759D',
  },
  makeAdminBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});

