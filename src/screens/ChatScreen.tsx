import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import ChatHeader from '../components/chat/ChatHeader';
import ChatItem, { ChatItemData } from '../components/chat/ChatItem';
import NewChatMenu, { NewChatMenuOption } from '../components/chat/NewChatMenu';
import { mockHomeData } from '../data/mockHomeData';
import { mockChatData } from '../data/mockChatData';
import { MoreMenuItemId } from '../types/more.types';
import {
  CHAT_SPACING,
  CHAT_COLORS,
  CHAT_ITEM_POSITIONS,
  CHAT_ITEM,
  scaleX,
} from '../constants/chatStyles';

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
  const [activeTab, setActiveTab] = useState('Chat');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [chats] = useState<ChatItemData[]>(mockChatData);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Update immediately
    setShowMorePopup(false);
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    }
  };

  const handleMorePress = () => {
    setShowMorePopup(true);
  };

  const handleMenuItemPress = (menuItem: MoreMenuItemId) => {
    setShowMorePopup(false);
    switch (menuItem) {
      case 'lostAndFound':
        navigation.navigate('LostAndFound');
        break;
      case 'staff':
        navigation.navigate('Staff');
        break;
      case 'settings':
        navigation.navigate('Settings');
        break;
      default:
        break;
    }
  };

  const handleClosePopup = () => {
    setShowMorePopup(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleChatPress = (chat: ChatItemData) => {
    navigation.navigate('ChatDetail', { chatId: chat.id });
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
    switch (option) {
      case 'createGroup':
        // TODO: Navigate to create group screen
        console.log('Create Chat Group pressed');
        // navigation.navigate('CreateChatGroup');
        break;
      case 'newChat':
        // TODO: Navigate to new chat screen
        console.log('New Chat pressed');
        // navigation.navigate('NewChat');
        break;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Calculate total unread chat messages for badge
  const chatBadgeCount = React.useMemo(() => {
    return chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }, [chats]);

  // Filter chats based on search query
  const filteredChats = searchQuery
    ? chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
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
            scrollEnabled={!showMorePopup && !showNewChatMenu}
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
                {/* Divider */}
                {index < filteredChats.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </ScrollView>

          {/* Blur Overlay for content only */}
          {(showMorePopup || showNewChatMenu) && (
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
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={chatBadgeCount}
      />

      {/* More Popup */}
      <MorePopup
        visible={showMorePopup}
        onClose={handleClosePopup}
        onMenuItemPress={handleMenuItemPress}
      />

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

