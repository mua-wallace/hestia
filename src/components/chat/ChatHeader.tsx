import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme';
import {
  CHAT_HEADER,
  SEARCH_BAR,
  CHAT_COLORS,
  CHAT_TYPOGRAPHY,
  CHAT_ITEM,
  scaleX,
} from '../../constants/chatStyles';
import SearchInput from '../SearchInput';

interface ChatHeaderProps {
  onBackPress?: () => void;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
  onMessagePress?: () => void;
  searchPlaceholder?: string | { bold: string; normal: string }; // Optional dynamic placeholder
  showSearch?: boolean; // Whether to show search input (default: true if onSearch provided)
  title?: string; // Custom title (defaults to "Chat")
  isGroup?: boolean; // Whether this is a group chat
  avatar?: any; // Avatar image source (same as in chat list)
  showAvatar?: boolean; // Whether to show avatar instead of back arrow (default: false)
  showMessageButton?: boolean; // Whether to show the create chat/message button (default: true)
}

export default function ChatHeader({
  onBackPress,
  onSearch,
  onFilterPress,
  onMessagePress,
  searchPlaceholder = 'Search',
  showSearch = true,
  title = 'Chat',
  isGroup = false,
  avatar,
  showAvatar = false,
  showMessageButton = true,
}: ChatHeaderProps) {
  const handleSearchChange = (text: string) => {
    onSearch?.(text);
  };
  
  const shouldShowSearch = showSearch && onSearch !== undefined;

  return (
    <View style={styles.container}>
      {/* Blue background */}
      <View style={styles.headerBackground} />

      {/* Top section with back button and title */}
      <View style={styles.topSection}>
        {/* Avatar or Back arrow */}
        <TouchableOpacity
          style={showAvatar ? styles.avatarButton : styles.backButton}
          onPress={onBackPress || (() => {})}
          activeOpacity={0.7}
        >
          {showAvatar ? (
            avatar ? (
              <Image
                source={avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {title.charAt(0).toUpperCase()}
                </Text>
              </View>
            )
          ) : (
            <Image
              source={require('../../../assets/icons/back-arrow.png')}
              style={styles.backArrow}
              tintColor="#607aa1"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Message Button */}
        {showMessageButton && (
          <TouchableOpacity
            style={styles.messageButton}
            onPress={onMessagePress || (() => {})}
            activeOpacity={0.7}
          >
            <View style={styles.messageButtonInner}>
              <Text style={styles.messageIconText}>+</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Search bar section */}
      {shouldShowSearch && (
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={handleSearchChange}
              inputStyle={styles.searchInput}
              placeholderStyle={styles.placeholderText}
              inputWrapperStyle={styles.searchInputWrapper}
            />

            <TouchableOpacity
              style={styles.searchIconContainer}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../../assets/icons/search-icon.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {onFilterPress && (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={onFilterPress}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../../assets/icons/menu-icon.png')}
                style={styles.filterIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CHAT_HEADER.height * scaleX,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CHAT_HEADER.background.height * scaleX,
    backgroundColor: CHAT_COLORS.headerBackground,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: CHAT_HEADER.backButton.left * scaleX,
    paddingTop: CHAT_HEADER.backButton.top * scaleX,
    height: CHAT_HEADER.background.height * scaleX,
  },
  backButton: {
    width: CHAT_HEADER.backButton.width * scaleX,
    height: CHAT_HEADER.backButton.height * scaleX,
    marginRight: 17 * scaleX, // Spacing between back button and title
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: CHAT_HEADER.backButton.width * scaleX,
    height: CHAT_HEADER.backButton.height * scaleX,
  },
  avatarButton: {
    width: CHAT_ITEM.avatar.size * scaleX,
    height: CHAT_ITEM.avatar.size * scaleX,
    marginRight: 17 * scaleX, // Same spacing as in ChatItem
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: CHAT_ITEM.avatar.borderRadius * scaleX,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: CHAT_ITEM.avatar.borderRadius * scaleX,
    backgroundColor: CHAT_COLORS.searchBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 18 * scaleX,
    fontWeight: 'bold' as any,
    color: CHAT_COLORS.textSecondary,
  },
  title: {
    fontSize: 24 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    fontStyle: 'normal',
    color: '#607AA1',
    lineHeight: 24 * scaleX, // Match font size for proper vertical alignment
    flex: 1,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  messageButton: {
    position: 'absolute',
    right: CHAT_HEADER.messageButton.right * scaleX,
    top: CHAT_HEADER.messageButton.top * scaleX,
    width: CHAT_HEADER.messageButton.width * scaleX,
    height: CHAT_HEADER.messageButton.height * scaleX,
    borderRadius: CHAT_HEADER.messageButton.borderRadius * scaleX,
    backgroundColor: CHAT_HEADER.messageButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: CHAT_HEADER.messageButton.borderRadiusInner * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIconText: {
    fontSize: 32 * scaleX,
    fontWeight: '300' as any,
    color: '#ffffff',
    lineHeight: 32 * scaleX,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SEARCH_BAR.container.left * scaleX,
    marginTop: (SEARCH_BAR.container.top - CHAT_HEADER.background.height) * scaleX,
    gap: 12 * scaleX,
  },
  searchBar: {
    flex: 1,
    height: SEARCH_BAR.container.height * scaleX,
    backgroundColor: SEARCH_BAR.container.backgroundColor,
    borderRadius: SEARCH_BAR.container.borderRadius * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SEARCH_BAR.container.paddingLeft * scaleX,
    paddingRight: SEARCH_BAR.container.paddingRight * scaleX,
  },
  searchInputWrapper: {
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: CHAT_TYPOGRAPHY.searchPlaceholder.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: CHAT_COLORS.textPrimary,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: SEARCH_BAR.container.height * scaleX,
  },
  placeholderText: {
    fontSize: CHAT_TYPOGRAPHY.searchPlaceholder.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semiBold as any,
    color: CHAT_COLORS.textPlaceholder,
    opacity: CHAT_TYPOGRAPHY.searchPlaceholder.opacity,
  },
  searchIconContainer: {
    width: 26 * scaleX,
    height: 26 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10 * scaleX,
  },
  searchIcon: {
    width: 19 * scaleX,
    height: 19 * scaleX,
    tintColor: colors.primary.main,
  },
  filterButton: {
    width: SEARCH_BAR.filterIcon.width * scaleX,
    height: SEARCH_BAR.filterIcon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: SEARCH_BAR.filterIcon.width * scaleX,
    height: SEARCH_BAR.filterIcon.height * scaleX,
  },
});

