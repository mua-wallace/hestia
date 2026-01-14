import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme';
import TabBarItem from './TabBarItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  onMorePress: () => void;
  chatBadgeCount?: number;
}

export default function BottomTabBar({ activeTab, onTabPress, onMorePress, chatBadgeCount = 0 }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabsContainer}>
        <View style={styles.tabItemContainer}>
          <TabBarItem
            icon={require('../../../assets/icons/home-icon.png')}
            label="Home"
            active={activeTab === 'Home'}
            onPress={() => onTabPress('Home')}
            iconWidth={56}
            iconHeight={56}
          />
        </View>
        <View style={styles.tabItemContainer}>
          <TabBarItem
            icon={require('../../../assets/icons/rooms-icon.png')}
            label="Rooms"
            active={activeTab === 'Rooms'}
            onPress={() => onTabPress('Rooms')}
            iconWidth={70}
            iconHeight={56}
          />
        </View>
        <View style={styles.tabItemContainer}>
          <TabBarItem
            icon={require('../../../assets/icons/chat-icon.png')}
            label="Chat"
            active={activeTab === 'Chat'}
            badge={chatBadgeCount}
            onPress={() => onTabPress('Chat')}
            iconWidth={56}
            iconHeight={56}
          />
        </View>
        <View style={[styles.tabItemContainer, styles.ticketsContainer]}>
          <TabBarItem
            icon={require('../../../assets/icons/tickets-icon.png')}
            label="Tickets"
            active={activeTab === 'Tickets'}
            onPress={() => onTabPress('Tickets')}
            iconWidth={49}
            iconHeight={54}
          />
        </View>
        <View style={styles.tabItemContainer}>
          <TabBarItem
            icon={require('../../../assets/icons/more-icon.png')}
            label="More"
            active={false}
            onPress={onMorePress}
            iconWidth={56}
            iconHeight={56}
          />
        </View>
      </View>
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Equal spacing between items (same as MorePopup)
    alignItems: 'center', // Center items vertically (same as MorePopup)
    paddingHorizontal: 16 * scaleX, // Same as MorePopup
    height: '100%', // Use full container height
    paddingVertical: 0, // Remove vertical padding to allow true centering (same as MorePopup)
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  ticketsContainer: {
    // Special alignment for Tickets tab if needed
    // Can be adjusted to center icon and text properly
  },
});

