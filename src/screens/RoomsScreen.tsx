import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../theme';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import { mockHomeData } from '../data/mockHomeData';
import { MoreMenuItemId } from '../types/more.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

type RoomsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Rooms'>;

export default function RoomsScreen() {
  const navigation = useNavigation<RoomsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Rooms');
  const [showMorePopup, setShowMorePopup] = useState(false);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setShowMorePopup(false);
    if (tab === 'Home') {
      navigation.navigate('Home');
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms');
    } else if (tab === 'Chat') {
      navigation.navigate('Chat');
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets');
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

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>
        <Text style={styles.text}>Rooms Screen</Text>
        
        {showMorePopup && (
          <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
      </View>
      
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={mockHomeData.notifications.chat}
      />
      
      <MorePopup
        visible={showMorePopup}
        onClose={handleClosePopup}
        onMenuItemPress={handleMenuItemPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 152 * scaleX,
  },
  text: {
    fontSize: parseInt(typography.fontSizes['4xl']),
    color: colors.text.primary,
  },
  contentBlurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

