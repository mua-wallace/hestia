import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import TabBarItem from './TabBarItem';
import { MORE_MENU_OPTIONS } from '../../types/more.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onMorePress?: () => void; // Optional now since we're removing popup
  chatBadgeCount?: number;
}

const MAIN_TABS = [
  {
    id: 'Home',
    icon: require('../../../assets/icons/home-icon.png'),
    label: 'Home',
    iconWidth: 56,
    iconHeight: 56,
  },
  {
    id: 'Rooms',
    icon: require('../../../assets/icons/rooms-icon.png'),
    label: 'Rooms',
    iconWidth: 70,
    iconHeight: 56,
  },
  {
    id: 'Chat',
    icon: require('../../../assets/icons/chat-icon.png'),
    label: 'Chat',
    iconWidth: 56,
    iconHeight: 56,
  },
  {
    id: 'Tickets',
    icon: require('../../../assets/icons/tickets-icon.png'),
    label: 'Tickets',
    iconWidth: 49,
    iconHeight: 54,
  },
  {
    id: 'AIHome',
    icon: require('../../../assets/icons/ai-home-icon.png'),
    label: '', // Icon only, no label
    iconWidth: 56,
    iconHeight: 56,
  },
];

export default function BottomTabBar({ activeTab, onTabPress, onMorePress, chatBadgeCount = 0 }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  const allTabs = [
    ...MAIN_TABS,
    ...MORE_MENU_OPTIONS.map(option => ({
      id: option.navigationTarget,
      icon: option.icon,
      label: option.label,
      iconWidth: option.iconWidth,
      iconHeight: option.iconHeight,
    })),
  ];
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {allTabs.map((tab) => (
          <View key={tab.id} style={styles.tabItemContainer}>
            <TabBarItem
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.id}
              badge={tab.id === 'Chat' && chatBadgeCount > 0 ? chatBadgeCount : undefined}
              onPress={() => onTabPress(tab.id)}
              iconWidth={tab.iconWidth}
              iconHeight={tab.iconHeight}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 152 * scaleX, // Use minHeight to allow safe area padding
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    shadowColor: 'rgba(100,131,176,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 105.1 * scaleX / 3,
    elevation: 8,
    zIndex: 100, // Ensure it stays on top
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16 * scaleX,
    height: '100%',
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12 * scaleX, // Spacing between tabs
    minWidth: 80 * scaleX, // Minimum width for each tab
  },
});

