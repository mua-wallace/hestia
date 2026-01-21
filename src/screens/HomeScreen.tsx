import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
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
import { mockChatData } from '../data/mockChatData';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import type { MoreMenuItemId } from '../types/more.types';
import type { RootStackParamList } from '../navigation/types';
import HomeHeader from '../components/home/HomeHeader';
import CategoryCard from '../components/home/CategoryCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import HomeFilterModal from '../components/home/HomeFilterModal';
import { FilterState, FilterCounts } from '../types/filter.types';
import type { CategorySection } from '../types/home.types';
import type { RoomCardData } from '../types/allRooms.types';
import { getShiftFromTime } from '../utils/shiftUtils';

import type { MainTabsParamList } from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute();
  const [homeData, setHomeData] = useState(() => ({
    ...mockHomeData,
    selectedShift: getShiftFromTime(),
  }));
  const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(
    (route.params as any)?.filters as FilterState | undefined
  );
  const [activeTab, setActiveTab] = useState('Home');
  const [refreshing, setRefreshing] = useState(false);
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Sync activeTab with current route
  useFocusEffect(
    React.useCallback(() => {
      const routeName = route.name as string;
      if (routeName === 'Home' || routeName === 'Rooms' || routeName === 'Chat' || routeName === 'Tickets') {
        setActiveTab(routeName);
      }
    }, [route.name])
  );

  // Calculate total unread chat messages for badge
  const chatBadgeCount = useMemo(() => {
    return mockChatData.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }, []);

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
    setActiveTab(tab); // Update immediately
    setShowMorePopup(false); // Close popup when switching tabs
    // Navigate to the respective screen
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any);
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
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
    navigation.navigate('AllRooms', { showBackButton: true, filters: activeFilters } as any);
  };

  const getRoomFloor = (roomNumber: string): number | null => {
    const firstChar = (roomNumber || '').trim()[0];
    const floor = Number.parseInt(firstChar || '', 10);
    return Number.isFinite(floor) ? floor : null;
  };

  const filterRoomsByFloors = (rooms: RoomCardData[], filters?: FilterState) => {
    const floorFilters = filters?.floors;
    if (!floorFilters) return rooms;

    const anySelected = Object.values(floorFilters).some(Boolean);
    if (!anySelected) return rooms;

    if (floorFilters.all) return rooms;

    const allowedFloors = new Set<number>();
    if (floorFilters.first) allowedFloors.add(1);
    if (floorFilters.second) allowedFloors.add(2);
    if (floorFilters.third) allowedFloors.add(3);
    if (floorFilters.fourth) allowedFloors.add(4);

    if (allowedFloors.size === 0) return rooms;

    return rooms.filter((r) => {
      const floor = getRoomFloor(r.roomNumber);
      return floor !== null && allowedFloors.has(floor);
    });
  };

  const buildCategory = (name: CategorySection['name'], id: string, borderColor: string, rooms: RoomCardData[]): CategorySection => {
    const status = {
      dirty: 0,
      inProgress: 0,
      cleaned: 0,
      inspected: 0,
    };

    rooms.forEach((room) => {
      if (room.status === 'Dirty') status.dirty += 1;
      if (room.status === 'InProgress') status.inProgress += 1;
      if (room.status === 'Cleaned') status.cleaned += 1;
      if (room.status === 'Inspected') status.inspected += 1;
    });

    const priority = rooms.reduce((sum, r) => sum + (r.isPriority ? 1 : 0), 0);

    return {
      id,
      name,
      total: rooms.length,
      priority,
      borderColor,
      status,
    };
  };

  const derivedCategories = useMemo(() => {
    const rooms = filterRoomsByFloors(mockAllRoomsData.rooms, activeFilters);

    const flaggedRooms = rooms.filter((r) => !!r.flagged);
    const arrivalRooms = rooms.filter((r) => r.category === 'Arrival' || r.category === 'Arrival/Departure');
    const stayOverRooms = rooms.filter((r) => r.category === 'Stayover');

    return [
      buildCategory('Flagged', 'flagged', '#6e1eee', flaggedRooms),
      buildCategory('Arrivals', 'arrivals', '#41d541', arrivalRooms),
      buildCategory('StayOvers', 'stayovers', '#8d908d', stayOverRooms),
    ];
  }, [activeFilters]);

  // Sync route filters -> local state
  useEffect(() => {
    const routeFilters = (route.params as any)?.filters as FilterState | undefined;
    if (routeFilters) setActiveFilters(routeFilters);
  }, [(route.params as any)?.filters]);

  // Update visible home categories based on derived data
  useEffect(() => {
    setHomeData((prev) => ({ ...prev, categories: derivedCategories }));
  }, [derivedCategories]);

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
    let totalRooms = 0;

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
      totalRooms += category.total;
      // Note: Departures and Turn Down would need additional data
      // For now, using mock values
      guests.departures = 18; // Mock value
      guests.turnDown = 12; // Mock value
    });

    const floors = {
      all: totalRooms,
      first: totalRooms,
      second: totalRooms,
      third: totalRooms,
      fourth: totalRooms,
    };

    return { roomStates, guests, floors, totalRooms };
  }, [homeData]);

  const handleGoToResults = (filters: FilterState) => {
    // AM: apply filters to Home stats/cards
    if (homeData.selectedShift === 'AM') {
      setActiveFilters(filters);
      return;
    }
    // PM: existing behavior (navigate to Rooms list with filters)
    navigation.navigate('AllRooms', { filters, showBackButton: true } as any);
  };

  const handleAdvanceFilter = () => {
    // TODO: Navigate to advanced filter screen when implemented
    console.log('Advanced filter');
  };

  return (
    <View style={[
      styles.container,
      homeData.selectedShift === 'PM' && styles.containerPM
    ]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Scrollable Content with conditional blur */}
        <View style={styles.scrollContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!showMorePopup}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {homeData.categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onPress={handleCategoryPress}
                selectedShift={homeData.selectedShift}
              />
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
            <View style={[
              styles.searchBar,
              homeData.selectedShift === 'PM' && styles.searchBarPM
            ]}>
              <TouchableOpacity
                style={styles.searchIconButton}
                onPress={() => {/* Search action */}}
                activeOpacity={0.7}
              >
                <Image
                  source={require('../../assets/icons/search-icon.png')}
                  style={[
                    styles.searchIcon,
                    homeData.selectedShift === 'PM' && styles.searchIconPM
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <SearchInput
                placeholder={{ bold: 'Search ', normal: 'Rooms, Guests, Floors etc' }}
                onSearch={handleSearch}
                inputStyle={[
                  styles.searchInput,
                  homeData.selectedShift === 'PM' && styles.searchInputPM
                ]}
                placeholderStyle={[
                  styles.placeholderText,
                  homeData.selectedShift === 'PM' && styles.placeholderTextPM
                ]}
                placeholderBoldStyle={[
                  styles.placeholderBold,
                  homeData.selectedShift === 'PM' && styles.placeholderBoldPM
                ]}
                placeholderNormalStyle={[
                  styles.placeholderNormal,
                  homeData.selectedShift === 'PM' && styles.placeholderNormalPM
                ]}
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
                style={[
                  styles.filterIcon,
                  homeData.selectedShift === 'PM' && styles.filterIconPM
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Bottom Navigation - Outside KeyboardAvoidingView to prevent movement */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={chatBadgeCount}
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
        selectedShift={homeData.selectedShift}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  containerPM: {
    backgroundColor: '#38414F', // Dark slate gray for PM mode
  },
  keyboardAvoidingView: {
    flex: 1,
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
    backgroundColor: '#F1F6FC',
    borderRadius: 82 * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
  },
  searchBarPM: {
    backgroundColor: '#F1F6FC',
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
  searchInputPM: {
    color: '#000000',
  },
  placeholderTextPM: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
  placeholderBoldPM: {
    color: 'rgba(0, 0, 0, 0.6)',
  },
  placeholderNormalPM: {
    color: 'rgba(0, 0, 0, 0.6)',
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
  searchIconPM: {
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
  filterIconPM: {
    tintColor: colors.primary.main,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

