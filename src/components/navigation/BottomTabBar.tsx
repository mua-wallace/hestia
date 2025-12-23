import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TabBarItem
          icon={require('../../../assets/icons/navigation/home-icon.png')}
          label="Home"
          active={activeTab === 'Home'}
          onPress={() => onTabPress('Home')}
          iconWidth={36}
          iconHeight={36}
        />
        <TabBarItem
          icon={require('../../../assets/icons/navigation/rooms-icon.png')}
          label="Rooms"
          active={activeTab === 'Rooms'}
          onPress={() => onTabPress('Rooms')}
          iconWidth={50}
          iconHeight={36}
        />
        <TabBarItem
          icon={require('../../../assets/icons/navigation/chat-icon.png')}
          label="Chat"
          active={activeTab === 'Chat'}
          badge={chatBadgeCount}
          onPress={() => onTabPress('Chat')}
          iconWidth={36}
          iconHeight={36}
        />
        <TabBarItem
          icon={require('../../../assets/icons/navigation/tickets-icon.png')}
          label="Tickets"
          active={activeTab === 'Tickets'}
          onPress={() => onTabPress('Tickets')}
          iconWidth={29}
          iconHeight={34}
        />
        <TabBarItem
          icon={require('../../../assets/icons/navigation/more-icon.png')}
          label="More"
          active={false}
          onPress={onMorePress}
          iconWidth={44}
          iconHeight={22}
        />
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
    height: 152 * scaleX,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    shadowColor: 'rgba(100,131,176,0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 105.1 * scaleX / 3,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 34 * scaleX,
    paddingTop: 43 * scaleX,
  },
});

