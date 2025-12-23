import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockHomeData } from '../data/mockHomeData';
import HomeHeader from '../components/home/HomeHeader';
import CategoryCard from '../components/home/CategoryCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
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

type HomeScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [homeData, setHomeData] = useState(mockHomeData);
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);
  const [showMorePopup, setShowMorePopup] = useState(false);

  const handleShiftToggle = (shift: ShiftType) => {
    setHomeData(prev => ({ ...prev, selectedShift: shift }));
  };

  const handleSearch = (text: string) => {
    // TODO: Implement search logic
    console.log('Search:', text);
  };

  const handleMenuPress = () => {
    // TODO: Implement menu logic
    console.log('Menu pressed');
  };

  const handleBellPress = () => {
    // TODO: Implement notifications
    console.log('Bell pressed');
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setShowMorePopup(false); // Close popup when switching tabs
    // Navigate to the respective screen
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Scrollable Content with conditional blur */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMorePopup}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {homeData.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </ScrollView>
        
        {/* Blur Overlay for content only */}
        {showMorePopup && (
          <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
      </View>

      {/* Header - Fixed at top (no blur) */}
      <HomeHeader
        user={homeData.user}
        selectedShift={homeData.selectedShift}
        date={homeData.date}
        onShiftToggle={handleShiftToggle}
        onSearch={handleSearch}
        onMenuPress={handleMenuPress}
        onBellPress={handleBellPress}
      />

      {/* Bottom Navigation (no blur) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={homeData.notifications.chat}
      />

      {/* More Popup */}
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
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 334 * scaleX, // Header height (includes search bar)
    paddingBottom: 152 * scaleX + 20 * scaleX, // Bottom nav height + extra padding
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: 334 * scaleX, // Start below header
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

