import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import TabBarItem from './TabBarItem';
import { MORE_MENU_OPTIONS } from '../../types/more.types';
import { useDesignScale } from '../../hooks/useDesignScale';

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onMorePress?: () => void;
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
    label: '',
    iconWidth: 56,
    iconHeight: 56,
  },
];

export default function BottomTabBar({ activeTab, onTabPress, onMorePress, chatBadgeCount = 0 }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { scaleX } = useDesignScale();
  const styles = useMemo(() => buildBottomTabBarStyles(scaleX), [scaleX]);

  const allTabs = [
    ...MAIN_TABS,
    ...MORE_MENU_OPTIONS.map((option) => ({
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
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
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

function buildBottomTabBarStyles(scaleX: number) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      minHeight: 152 * scaleX,
      backgroundColor: colors.background.primary,
      borderTopWidth: 1,
      borderTopColor: '#e6e6e6',
      shadowColor: 'rgba(100,131,176,0.4)',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: (105.1 * scaleX) / 3,
      elevation: 8,
      zIndex: 100,
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
      paddingHorizontal: 12 * scaleX,
      minWidth: 80 * scaleX,
    },
  });
}
