import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import {
  CHAT_ITEM,
  CHAT_COLORS,
  CHAT_TYPOGRAPHY,
  scaleX,
} from '../../constants/chatStyles';

export interface ChatItemData {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageSender?: string; // Optional sender name (e.g., "Zoe:")
  unreadCount?: number;
  avatar?: any; // Image source
  isGroup?: boolean;
}

interface ChatItemProps {
  chat: ChatItemData;
  onPress?: () => void;
}

export default function ChatItem({ chat, onPress }: ChatItemProps) {
  const hasUnread = chat.unreadCount && chat.unreadCount > 0;
  const messageText = chat.lastMessageSender
    ? `${chat.lastMessageSender} ${chat.lastMessage}`
    : chat.lastMessage;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {chat.avatar ? (
          <Image source={chat.avatar} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {chat.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Name */}
        <Text style={styles.name}>{chat.name}</Text>

        {/* Last Message */}
        <Text
          style={[
            styles.message,
            chat.lastMessageSender && styles.messageLight,
          ]}
          numberOfLines={1}
        >
          {messageText}
        </Text>

        {/* Group Label */}
        {chat.isGroup && (
          <View style={styles.groupLabel}>
            <Text style={styles.groupLabelText}>Group</Text>
          </View>
        )}
      </View>

      {/* Unread Badge */}
      {hasUnread && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {chat.unreadCount && chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: CHAT_ITEM.avatar.left * scaleX,
    paddingVertical: 12 * scaleX,
    minHeight: 98 * scaleX,
  },
  avatarContainer: {
    width: CHAT_ITEM.avatar.size * scaleX,
    height: CHAT_ITEM.avatar.size * scaleX,
    borderRadius: CHAT_ITEM.avatar.borderRadius * scaleX,
    overflow: 'hidden',
    marginRight: 17 * scaleX, // Spacing between avatar and content
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: CHAT_COLORS.searchBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18 * scaleX,
    fontWeight: 'bold' as any,
    color: CHAT_COLORS.textSecondary,
  },
  contentContainer: {
    flex: 1,
    marginRight: 60 * scaleX, // Leave space for badge
  },
  name: {
    fontSize: CHAT_TYPOGRAPHY.chatName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: CHAT_TYPOGRAPHY.chatName.fontWeight as any,
    color: CHAT_TYPOGRAPHY.chatName.color,
    marginBottom: 2 * scaleX,
  },
  message: {
    fontSize: CHAT_TYPOGRAPHY.message.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: CHAT_TYPOGRAPHY.message.fontWeight as any,
    color: CHAT_TYPOGRAPHY.message.color,
    marginTop: 2 * scaleX,
  },
  messageLight: {
    fontWeight: CHAT_TYPOGRAPHY.messageLight.fontWeight as any,
  },
  groupLabel: {
    alignSelf: 'flex-start',
    backgroundColor: CHAT_ITEM.groupLabel.backgroundColor,
    borderRadius: CHAT_ITEM.groupLabel.borderRadius * scaleX,
    paddingHorizontal: CHAT_ITEM.groupLabel.paddingHorizontal * scaleX,
    paddingVertical: CHAT_ITEM.groupLabel.paddingVertical * scaleX,
    marginTop: 4 * scaleX,
  },
  groupLabelText: {
    fontSize: CHAT_TYPOGRAPHY.groupLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: CHAT_TYPOGRAPHY.groupLabel.fontWeight as any,
    color: CHAT_TYPOGRAPHY.groupLabel.color,
  },
  badgeContainer: {
    position: 'absolute',
    right: CHAT_ITEM.badge.right * scaleX,
    top: 12 * scaleX,
    width: CHAT_ITEM.badge.size * scaleX,
    height: CHAT_ITEM.badge.size * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    width: CHAT_ITEM.badge.size * scaleX,
    height: CHAT_ITEM.badge.size * scaleX,
    borderRadius: CHAT_ITEM.badge.borderRadius * scaleX,
    backgroundColor: CHAT_ITEM.badge.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: CHAT_ITEM.badge.size * scaleX,
  },
  badgeText: {
    fontSize: CHAT_TYPOGRAPHY.badge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: CHAT_TYPOGRAPHY.badge.fontWeight as any,
    color: CHAT_TYPOGRAPHY.badge.color,
  },
});

