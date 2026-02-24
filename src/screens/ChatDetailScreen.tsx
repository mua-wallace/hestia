import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
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
import { colors } from '../theme';
import { scaleX, CHAT_HEADER, CHAT_HEADER_BAR_HEIGHT } from '../constants/chatStyles';
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
import { Ionicons } from '@expo/vector-icons';

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
    if (!isSupabaseChat || !isGroup) return;
    getGroupParticipants(chatId).then(setTagParticipantsList);
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
  const bottomPadding = insets.bottom;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
    return () => hide.remove();
  }, []);
  const handleInputFocus = useCallback(() => {
    setKeyboardVisible(true);
    scrollToBottom();
  }, []);
  
  const uid = currentUserId ?? '';
  /** Exclude current user from participant lists (they shouldn't see themselves). */
  const otherParticipants = tagParticipantsList.filter((p) => p.user_id !== uid);
  /** Format participant names for header subtitle (WhatsApp-style: "Alice, Bob and 3 others") */
  const formatParticipantsSubtitle = (participants: GroupParticipant[]): string => {
    const names = participants
      .map((p) => (p.full_name || '').trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    if (names.length === 3) return `${names[0]}, ${names[1]} and ${names[2]}`;
    return `${names[0]}, ${names[1]} and ${names.length - 2} others`;
  };
  /** Participants for tag modal: real group members when group (excluding self), else mock for DM */
  const getParticipantsForTag = () => {
    if (isGroup) return otherParticipants.map((p) => ({ id: p.user_id, name: p.full_name || 'Unknown' }));
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
    setInputText((prev) => prev + `@${userName} `);
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
        keyboardVerticalOffset={0}
      >
        {/* Header - WhatsApp style */}
        <ChatHeader
          onBackPress={handleBackPress}
          showSearch={false}
          title={typeof chat.name === 'string' ? chat.name : 'Chat'}
          subtitle={isGroup && otherParticipants.length > 0 ? formatParticipantsSubtitle(otherParticipants) : undefined}
          isGroup={isGroup}
          avatar={chat.avatar}
          showAvatar={true}
          showMessageButton={false}
          onGroupOptionsPress={isGroupAdmin ? handleGroupOptionsPress : undefined}
        />

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={[styles.messagesContainer, { marginTop: 0 }]}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingVertical: 16 * responsiveScale, paddingBottom: 12 * responsiveScale },
          ]}
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

        {/* Input Area - minimal padding, flush above keyboard when open */}
        <View style={[
          styles.inputSafeArea,
          {
            paddingBottom: keyboardVisible ? 0 : bottomPadding,
            paddingTop: keyboardVisible ? 0 : 6,
          },
        ]}>
          {/* WhatsApp-style @ mention list: inline above input, no full-screen modal */}
          {showTagModal && (
            <View style={styles.tagListPanel}>
              <FlatList
                data={getParticipantsForTag()}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                style={styles.tagListScroll}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.tagListItem}
                    onPress={() => handleSelectTaggedUser(item.id, item.name)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tagListAvatar}>
                      <Text style={styles.tagListInitial} numberOfLines={1}>
                        {(item.name || '?').charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.tagListName} numberOfLines={1}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={isGroup ? <Text style={styles.emptyTagList}>No members to tag</Text> : null}
              />
            </View>
          )}

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}

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

          <View style={styles.inputRow}>
            {!isRecording && (isGroup || getParticipantsForTag().length > 0) && (
              <TouchableOpacity style={styles.iconButton} onPress={handleTagUser} activeOpacity={0.7}>
                <Ionicons name="at-outline" size={22} color={colors.text.secondary} />
              </TouchableOpacity>
            )}

            {isRecording ? (
              <Text style={styles.recordingTime} numberOfLines={1}>
                {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
              </Text>
            ) : null}

            {!isRecording && (
              <TextInput
                style={styles.input}
                placeholder="Message"
                placeholderTextColor={colors.text.tertiary}
                value={inputText}
                onChangeText={handleInputChange}
                onFocus={handleInputFocus}
                multiline
                maxLength={500}
                returnKeyType="default"
                blurOnSubmit={false}
                textAlignVertical={Platform.OS === 'android' ? 'center' : 'top'}
                underlineColorAndroid="transparent"
              />
            )}

            {!isRecording && (
              <TouchableOpacity style={styles.iconButton} onPress={showImageSourceOptions} activeOpacity={0.7}>
                <Ionicons name="attach-outline" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            )}

            {!isRecording && (
              <TouchableOpacity style={styles.iconButton} onPress={handleTakePhoto} activeOpacity={0.7}>
                <Ionicons name="camera-outline" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.sendOrMicButton,
                (inputText.trim() || selectedImage) && styles.sendButtonActive,
                isRecording && styles.sendButtonRecording,
              ]}
              onPress={isRecording ? handleVoiceRecord : (inputText.trim() || selectedImage) ? handleSend : handleVoiceRecord}
              activeOpacity={0.7}
            >
              {(inputText.trim() || selectedImage) && !isRecording ? (
                <Ionicons name="arrow-up" size={22} color={colors.text.white} />
              ) : (
                <Ionicons name="mic-outline" size={22} color={isRecording ? colors.text.white : colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

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
                placeholderTextColor={colors.text.tertiary}
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
                data={groupParticipants.filter((p) => p.user_id !== uid)}
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
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  inputSafeArea: {
    backgroundColor: colors.background.tertiary,
    paddingTop: 6,
    paddingHorizontal: 8 * scaleX,
    paddingBottom: 0,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40 * scaleX,
    height: 40 * scaleX,
    borderRadius: 20 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4 * scaleX,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 16 * scaleX,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    borderRadius: 24 * scaleX,
    maxHeight: 104 * scaleX,
    paddingVertical: 10 * scaleX,
    paddingHorizontal: 14 * scaleX,
    textAlignVertical: Platform.OS === 'android' ? 'center' : 'top',
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  recordingTime: {
    flex: 1,
    minWidth: 0,
    fontSize: 15 * scaleX,
    color: colors.text.secondary,
    paddingHorizontal: 8 * scaleX,
    ...(Platform.OS === 'android' && { includeFontPadding: false }),
  },
  sendOrMicButton: {
    width: 44 * scaleX,
    height: 44 * scaleX,
    borderRadius: 22 * scaleX,
    backgroundColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8 * scaleX,
  },
  sendButtonActive: {
    backgroundColor: colors.primary.main,
  },
  sendButtonRecording: {
    backgroundColor: colors.primary.main,
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
    backgroundColor: colors.border.medium,
  },
  dateSeparatorText: {
    fontSize: 12 * scaleX,
    fontFamily: 'Helvetica',
    color: colors.text.tertiary,
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
    backgroundColor: colors.status.dirty,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: colors.text.white,
    fontSize: 16 * scaleX,
    fontWeight: 'bold' as any,
  },
  taggedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
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
    color: colors.primary.main,
    fontWeight: '600' as any,
    marginRight: 8 * scaleX,
  },
  removeTagButton: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    borderRadius: 9 * scaleX,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagText: {
    color: colors.text.white,
    fontSize: 12 * scaleX,
    fontWeight: 'bold' as any,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.primary,
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
    borderBottomColor: colors.border.medium,
  },
  modalTitle: {
    fontSize: 18 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '600' as any,
    color: colors.text.primary,
  },
  modalCloseText: {
    fontSize: 24 * scaleX,
    color: colors.text.tertiary,
  },
  participantItem: {
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 16 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  participantName: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: colors.text.primary,
  },
  tagListPanel: {
    maxHeight: 200,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 12 * scaleX,
    borderTopRightRadius: 12 * scaleX,
    marginHorizontal: 8 * scaleX,
    marginBottom: 8 * scaleX,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  tagListScroll: {
    maxHeight: 200,
  },
  tagListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10 * scaleX,
    paddingHorizontal: 12 * scaleX,
  },
  tagListAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scaleX,
  },
  tagListInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
  tagListName: {
    flex: 1,
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: colors.text.primary,
  },
  emptyTagList: {
    padding: 20,
    textAlign: 'center',
    color: colors.text.tertiary,
  },
  replyPreviewBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 8 * scaleX,
    paddingVertical: 8 * scaleX,
    paddingLeft: 12 * scaleX,
    paddingRight: 8 * scaleX,
    marginBottom: 8 * scaleX,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.main,
  },
  replyPreviewContent: { flex: 1 },
  replyPreviewLabel: {
    fontSize: 12 * scaleX,
    fontWeight: '600',
    color: colors.primary.main,
    marginBottom: 2,
  },
  replyPreviewSnippet: {
    fontSize: 13 * scaleX,
    color: colors.text.secondary,
  },
  replyPreviewDismiss: {
    padding: 4,
  },
  replyPreviewDismissText: {
    fontSize: 20,
    color: colors.text.tertiary,
  },
  editGroupNameInput: {
    height: 48 * scaleX,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 8 * scaleX,
    paddingHorizontal: 12 * scaleX,
    marginHorizontal: 20 * scaleX,
    marginTop: 16 * scaleX,
    fontSize: 16,
    color: colors.text.primary,
  },
  editGroupSaveBtn: {
    marginHorizontal: 20 * scaleX,
    marginTop: 20 * scaleX,
    height: 48 * scaleX,
    borderRadius: 8 * scaleX,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editGroupSaveBtnDisabled: {
    opacity: 0.5,
  },
  editGroupSaveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
  },
  groupMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 12 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
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
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupMemberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.main,
  },
  groupMemberInfo: {
    flex: 1,
    marginLeft: 12 * scaleX,
  },
  groupMemberName: {
    fontSize: 16 * scaleX,
    fontFamily: 'Helvetica',
    color: colors.text.primary,
  },
  groupMemberRole: {
    fontSize: 13 * scaleX,
    color: colors.text.secondary,
    marginTop: 2,
  },
  makeAdminBtn: {
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 6 * scaleX,
    borderRadius: 6 * scaleX,
    backgroundColor: colors.primary.main,
  },
  makeAdminBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.white,
  },
});

