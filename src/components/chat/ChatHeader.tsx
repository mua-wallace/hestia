import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme';
import {
  CHAT_HEADER,
  SEARCH_BAR,
  CHAT_COLORS,
  CHAT_TYPOGRAPHY,
  scaleX,
} from '../../constants/chatStyles';
import SearchInput from '../SearchInput';

interface ChatHeaderProps {
  onBackPress?: () => void;
  onSearch: (text: string) => void;
  onFilterPress?: () => void;
  onMessagePress?: () => void;
  searchPlaceholder?: string | { bold: string; normal: string }; // Optional dynamic placeholder
}

export default function ChatHeader({
  onBackPress,
  onSearch,
  onFilterPress,
  onMessagePress,
  searchPlaceholder = 'Search',
}: ChatHeaderProps) {
  const handleSearchChange = (text: string) => {
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* Blue background */}
      <View style={styles.headerBackground} />

      {/* Top section with back button and title */}
      <View style={styles.topSection}>
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress || (() => {})}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/back-arrow.png')}
            style={styles.backArrow}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Chat</Text>

        {/* Message Button */}
        <TouchableOpacity
          style={styles.messageButton}
          onPress={onMessagePress || (() => {})}
          activeOpacity={0.7}
        >
          <View style={styles.messageButtonInner}>
            <Text style={styles.messageIconText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search bar section */}
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
    position: 'absolute',
    left: CHAT_HEADER.backButton.left * scaleX,
    top: CHAT_HEADER.backButton.top * scaleX,
    width: CHAT_HEADER.backButton.width * scaleX,
    height: CHAT_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: CHAT_HEADER.backButton.width * scaleX, // Increased icon size to match Figma visual appearance
    height: CHAT_HEADER.backButton.height * scaleX, // Increased icon size to match Figma visual appearance
    transform: [{ rotate: '270deg' }], // Rotate to point left (as per Figma)
  },
  title: {
    fontSize: CHAT_TYPOGRAPHY.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: CHAT_TYPOGRAPHY.title.fontWeight as any,
    color: CHAT_TYPOGRAPHY.title.color,
    position: 'absolute',
    left: CHAT_HEADER.title.left * scaleX,
    top: CHAT_HEADER.title.top * scaleX,
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
    width: 54 * scaleX,
    height: 54 * scaleX,
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

