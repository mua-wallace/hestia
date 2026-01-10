import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';
import { colors } from '../theme';
import SearchInput from '../components/SearchInput';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;
import type { ShiftType } from '../types/home.types';
import { mockHomeData } from '../data/mockHomeData';
import type { MoreMenuItemId } from '../types/more.types';
import type { RootStackParamList } from '../navigation/types';
import HomeHeader from '../components/home/HomeHeader';
import CategoryCard from '../components/home/CategoryCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import HomeFilterModal from '../components/home/HomeFilterModal';
import { FilterState, FilterCounts } from '../types/filter.types';

import type { MainTabsParamList } from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [homeData, setHomeData] = useState(mockHomeData);
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleShiftToggle = (shift: ShiftType) => {
    setHomeData(prev => ({ ...prev, selectedShift: shift }));
  };

  const handleSearch = (text: string) => {
    // TODO: Implement search logic
    console.log('Search:', text);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
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

  const handleCategoryPress = () => {
    // Navigate to All Rooms screen with back button
    navigation.navigate('AllRooms', { showBackButton: true } as any);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Calculate filter counts from homeData
  const filterCounts: FilterCounts = useMemo(() => {
    // Aggregate counts from all categories
    const roomStates = {
      dirty: 0,
      inProgress: 0,
      cleaned: 0,
      inspected: 0,
      priority: 0,
    };

    const guests = {
      arrivals: 0,
      departures: 0,
      turnDown: 0,
      stayOver: 0,
    };

    homeData.categories.forEach((category) => {
      // Room state counts
      roomStates.dirty += category.status.dirty;
      roomStates.inProgress += category.status.inProgress;
      roomStates.cleaned += category.status.cleaned;
      roomStates.inspected += category.status.inspected;
      if (category.priority) {
        roomStates.priority += category.priority;
      }

      // Guest counts based on category name
      if (category.name === 'Arrivals') {
        guests.arrivals += category.total;
      } else if (category.name === 'StayOvers') {
        guests.stayOver += category.total;
      }
      // Note: Departures and Turn Down would need additional data
      // For now, using mock values
      guests.departures = 18; // Mock value
      guests.turnDown = 12; // Mock value
    });

    return { roomStates, guests };
  }, [homeData]);

  const handleGoToResults = (filters: FilterState) => {
    navigation.navigate('AllRooms', {
      filters,
      showBackButton: true,
    } as any);
  };

  const handleAdvanceFilter = () => {
    // TODO: Navigate to advanced filter screen when implemented
    console.log('Advanced filter');
  };

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
            <CategoryCard key={category.id} category={category} onPress={handleCategoryPress} />
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
        onBellPress={handleBellPress}
      />

      {/* Search Bar and Filter - Fixed below header */}
      {!showFilterModal && (
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TouchableOpacity
              style={styles.searchIconButton}
              onPress={() => {/* Search action */}}
              activeOpacity={0.7}
            >
              <Image
                source={require('../../assets/icons/search-icon.png')}
                style={styles.searchIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <SearchInput
              placeholder={{ bold: 'Search ', normal: 'Rooms, Guests, Floors etc' }}
              onSearch={handleSearch}
              inputStyle={styles.searchInput}
              placeholderStyle={styles.placeholderText}
              placeholderBoldStyle={styles.placeholderBold}
              placeholderNormalStyle={styles.placeholderNormal}
              inputWrapperStyle={styles.searchInputContainer}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/menu-icon.png')}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      )}
      

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

      {/* Filter Modal */}
      <HomeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onGoToResults={handleGoToResults}
        onAdvanceFilter={handleAdvanceFilter}
        filterCounts={filterCounts}
        onFilterIconPress={handleFilterPress}
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
    paddingTop: (153 + 14 + 59) * scaleX, // Header height (153) + margin (14) + search bar height (59)
    paddingBottom: 152 * scaleX + 20 * scaleX, // Bottom nav height + extra padding
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: (153 + 14 + 59) * scaleX, // Start below header + search bar
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  searchSection: {
    position: 'absolute',
    left: 15 * scaleX,
    top: (153 + 14) * scaleX, // Header height (153) + margin (14)
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 99,
  },
  searchBar: {
    height: 59 * scaleX,
    width: 347 * scaleX,
    backgroundColor: '#f1f6fc',
    borderRadius: 82 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
  },
  searchInputContainer: {
    height: '100%',
  },
  searchInput: {
    fontFamily: 'Inter',
    fontWeight: '300' as any,
    padding: 0,
    height: '100%',
    backgroundColor: 'transparent',
  },
  placeholderText: {
    fontFamily: 'Inter',
    color: 'rgba(0,0,0,0.6)',
    includeFontPadding: false,
  },
  placeholderBold: {
    fontWeight: '700' as any, // Bold for "Search"
  },
  placeholderNormal: {
    fontWeight: '400' as any, // Regular for rest of text
  },
  searchIconButton: {
    width: 26 * scaleX,
    height: 26 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10 * scaleX,
  },
  searchIcon: {
    width: 19 * scaleX,
    height: 19 * scaleX,
    tintColor: colors.primary.main,
  },
  filterButton: {
    width: 40 * scaleX, // Increased touch target for easier clicking
    height: 40 * scaleX, // Increased touch target for easier clicking
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18 * scaleX, // Gap between search bar and filter icon
    padding: 8 * scaleX, // Add padding for better touch area
  },
  filterIcon: {
    width: 32 * scaleX, // Increased from 26px for better visibility
    height: 16 * scaleX, // Increased from 12px for better visibility (maintaining aspect ratio)
    tintColor: colors.primary.main,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

