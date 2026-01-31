import React from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
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
      
      {/* Tagged User Indicator */}
      {message.taggedUserName && (
        <View style={styles.taggedIndicator}>
          <Text style={styles.taggedText}>@{message.taggedUserName}</Text>
        </View>
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        {/* Image Message */}
        {message.type === 'image' && message.imageUri && (
          <Image
            source={{ uri: message.imageUri }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}

        {/* Voice Message */}
        {message.type === 'voice' && (
          <View style={styles.voiceMessageContainer}>
            <TouchableOpacity 
              style={[
                styles.voicePlayButton,
                isCurrentUser ? styles.voicePlayButtonCurrent : styles.voicePlayButtonOther
              ]} 
              activeOpacity={0.7}
            >
              <Text style={[
                styles.voicePlayIcon,
                isCurrentUser ? styles.voicePlayIconCurrent : styles.voicePlayIconOther
              ]}>▶</Text>
            </TouchableOpacity>
            <View style={styles.voiceWaveform}>
              <View style={[
                styles.voiceBar,
                { height: 20 * scaleX },
                isCurrentUser ? styles.voiceBarCurrent : styles.voiceBarOther
              ]} />
              <View style={[
                styles.voiceBar,
                { height: 30 * scaleX },
                isCurrentUser ? styles.voiceBarCurrent : styles.voiceBarOther
              ]} />
              <View style={[
                styles.voiceBar,
                { height: 25 * scaleX },
                isCurrentUser ? styles.voiceBarCurrent : styles.voiceBarOther
              ]} />
              <View style={[
                styles.voiceBar,
                { height: 35 * scaleX },
                isCurrentUser ? styles.voiceBarCurrent : styles.voiceBarOther
              ]} />
              <View style={[
                styles.voiceBar,
                { height: 20 * scaleX },
                isCurrentUser ? styles.voiceBarCurrent : styles.voiceBarOther
              ]} />
            </View>
            <Text style={[styles.voiceDuration, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>
              {message.voiceDuration || 0}s
            </Text>
          </View>
        )}

        {/* Text Message */}
        {message.message && (
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {message.message}
          </Text>
        )}
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
  
  // Format as HH:MM (24-hour format)
  const hours24 = date.getHours();
  const mins = date.getMinutes();
  const formattedHours = hours24.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');
  
  // If message is from today, show time only
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return `${formattedHours}:${formattedMins}`;
  }
  
  // If message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${formattedHours}:${formattedMins}`;
  }
  
  // If message is from this week, show day name
  const daysDiff = Math.floor(diff / 86400000);
  if (daysDiff < 7) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${dayNames[date.getDay()]} ${formattedHours}:${formattedMins}`;
  }
  
  // Otherwise show date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2 * scaleX,
    maxWidth: '80%',
    paddingHorizontal: 16 * scaleX,
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
    fontSize: 13 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '600' as any,
    color: '#607AA1',
    marginBottom: 4 * scaleX,
    marginLeft: 0,
    paddingHorizontal: 4 * scaleX,
  },
  bubble: {
    paddingHorizontal: 14 * scaleX,
    paddingVertical: 10 * scaleX,
    borderRadius: 18 * scaleX,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
    fontSize: 15 * scaleX,
    fontFamily: 'Helvetica',
    lineHeight: 20 * scaleX,
    letterSpacing: 0.2,
  },
  currentUserText: {
    color: '#FFFFFF',
    fontWeight: '400' as any,
  },
  otherUserText: {
    color: '#1E1E1E',
    fontWeight: '400' as any,
  },
  timestamp: {
    fontSize: 11 * scaleX,
    fontFamily: 'Helvetica',
    color: '#999999',
    marginTop: 4 * scaleX,
    marginHorizontal: 4 * scaleX,
    fontWeight: '300' as any,
  },
  taggedIndicator: {
    marginBottom: 4 * scaleX,
    paddingHorizontal: 4 * scaleX,
  },
  taggedText: {
    fontSize: 12 * scaleX,
    fontFamily: 'Helvetica',
    color: '#5A759D',
    fontWeight: '600' as any,
  },
  messageImage: {
    width: 200 * scaleX,
    height: 200 * scaleX,
    borderRadius: 12 * scaleX,
    marginBottom: 8 * scaleX,
  },
  voiceMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8 * scaleX,
  },
  voicePlayButton: {
    width: 40 * scaleX,
    height: 40 * scaleX,
    borderRadius: 20 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scaleX,
  },
  voicePlayButtonCurrent: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  voicePlayButtonOther: {
    backgroundColor: 'rgba(90, 117, 157, 0.2)',
  },
  voicePlayIcon: {
    fontSize: 16 * scaleX,
    marginLeft: 2 * scaleX,
  },
  voicePlayIconCurrent: {
    color: '#FFFFFF',
  },
  voicePlayIconOther: {
    color: '#5A759D',
  },
  voiceWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12 * scaleX,
    gap: 4 * scaleX,
  },
  voiceBar: {
    width: 3 * scaleX,
    borderRadius: 2 * scaleX,
  },
  voiceBarCurrent: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  voiceBarOther: {
    backgroundColor: 'rgba(90, 117, 157, 0.4)',
  },
  voiceDuration: {
    fontSize: 12 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '400' as any,
  },
});

