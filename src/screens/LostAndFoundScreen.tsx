import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

type LostAndFoundScreenNavigationProp = NativeStackNavigationProp<MainTabsParamList, 'LostAndFound'>;

export default function LostAndFoundScreen() {
  const navigation = useNavigation<LostAndFoundScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState('Home');
  const [showMorePopup, setShowMorePopup] = useState(false);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setShowMorePopup(false);
    navigation.navigate(tab as keyof MainTabsParamList);
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

  const handleBack = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Lost & Found</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
        
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 152 * scaleX,
  },
  contentBlurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
  title: {
    fontSize: 28 * scaleX,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10 * scaleX,
  },
  subtitle: {
    fontSize: 18 * scaleX,
    color: colors.text.secondary,
    marginBottom: 30 * scaleX,
  },
  backButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 30 * scaleX,
    paddingVertical: 12 * scaleX,
    borderRadius: 8 * scaleX,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16 * scaleX,
    fontWeight: '600',
  },
});

