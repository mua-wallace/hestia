import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import { LoadingOverlay } from '../components/shared/LoadingOverlay';
import ChatHeader from '../components/chat/ChatHeader';
import ChatItem, { ChatItemData } from '../components/chat/ChatItem';
import NewChatMenu, { NewChatMenuOption } from '../components/chat/NewChatMenu';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import { useChatStore } from '../store/useChatStore';
import { invalidateNotificationBadges } from '../services/inAppNotifications';
import { CHAT_SPACING, CHAT_COLORS, CHAT_ITEM, scaleX } from '../constants/chatStyles';

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

import type { RootStackParamList } from '../navigation/types';

type ChatScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Chat'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ChatScreen() {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const [activeTab, setActiveTab] = useState('Chat');
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { chats, loading, fetchChats } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);

  const loadChats = useCallback(async () => {
    await fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useFocusEffect(
    useCallback(() => {
      void loadChats();
      invalidateNotificationBadges();
    }, [loadChats])
  );

  const handleTabPress = (tab: string) => {
    if (tab === 'AIHome') {
      openAIChatOverlay();
      return;
    }
    setActiveTab(tab); // Update immediately
    const returnToTab = (route.name as string) as 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    } else if (tab === 'LostAndFound') {
      (navigation as any).navigate('LostAndFound', { returnToTab });
    } else if (tab === 'Staff') {
      (navigation as any).navigate('Staff', { returnToTab });
    } else if (tab === 'Settings') {
      (navigation as any).navigate('Settings', { returnToTab });
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleChatPress = (chat: ChatItemData) => {
    navigation.navigate('ChatDetail', { chatId: chat.id, chat });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMessagePress = () => {
    setShowNewChatMenu(true);
  };

  const handleNewChatMenuClose = () => {
    setShowNewChatMenu(false);
  };

  const handleNewChatOptionPress = (option: NewChatMenuOption) => {
    setShowNewChatMenu(false);
    switch (option) {
      case 'createGroup':
        (navigation as any).navigate('CreateChatGroup');
        break;
      case 'newChat':
        (navigation as any).navigate('NewChat');
        break;
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  }, [loadChats]);

  const isLoading = loading && chats.length === 0;

  // Filter chats based on search query
  const filteredChats = searchQuery
    ? chats.filter(
        (chat) =>
          (typeof chat.name === 'string' && chat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (typeof chat.lastMessage === 'string' && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : chats;

  return (
    <View style={styles.container}>
      {refreshing || isLoading ? <LoadingOverlay fullScreen message={refreshing ? 'Refreshing…' : 'Loading chats…'} /> : null}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.scrollContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!showNewChatMenu}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyboardShouldPersistTaps="handled"
          >
            {/* Chat Items */}
            {filteredChats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ChatItem
                  chat={chat}
                  onPress={() => handleChatPress(chat)}
                />
                {index < filteredChats.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </React.Fragment>
            ))}
          </ScrollView>

          {/* Blur Overlay for content only */}
          {showNewChatMenu && (
            <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
              <View style={styles.blurOverlayDarkener} />
            </BlurView>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Header - Fixed at top */}
      <ChatHeader
        onBackPress={handleBackPress}
        onSearch={handleSearch}
        onMessagePress={handleMessagePress}
      />

      {/* Bottom Navigation - Outside KeyboardAvoidingView to prevent movement */}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />

      {/* New Chat Menu */}
      <NewChatMenu
        visible={showNewChatMenu}
        onClose={handleNewChatMenuClose}
        onOptionPress={handleNewChatOptionPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CHAT_COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: CHAT_SPACING.contentPaddingTop * scaleX,
    paddingBottom: CHAT_SPACING.contentPaddingBottom * scaleX,
    minHeight: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: CHAT_ITEM.divider.color,
    marginHorizontal: CHAT_ITEM.avatar.left * scaleX,
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: 217 * scaleX, // Start below header
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

