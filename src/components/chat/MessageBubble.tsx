import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatMessage } from '../../types';
import { scaleX } from '../../constants/chatStyles';
import { typography } from '../../theme';

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isGroup: boolean;
}

export default function MessageBubble({ message, isCurrentUser, isGroup }: MessageBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {/* Sender name for group chats (only for other users) */}
      {isGroup && !isCurrentUser && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      
      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.message}
        </Text>
      </View>
      
      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4 * scaleX,
    maxWidth: '75%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '600' as any,
    color: '#607AA1',
    marginBottom: 4 * scaleX,
    marginLeft: 12 * scaleX,
  },
  bubble: {
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 10 * scaleX,
    borderRadius: 18 * scaleX,
  },
  currentUserBubble: {
    backgroundColor: '#5A759D',
    borderBottomRightRadius: 4 * scaleX,
  },
  otherUserBubble: {
    backgroundColor: '#F1F6FC',
    borderBottomLeftRadius: 4 * scaleX,
  },
  messageText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    lineHeight: 20 * scaleX,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#1E1E1E',
  },
  timestamp: {
    fontSize: 11 * scaleX,
    fontFamily: typography.fontFamily.primary,
    color: '#999999',
    marginTop: 4 * scaleX,
    marginHorizontal: 4 * scaleX,
  },
});

