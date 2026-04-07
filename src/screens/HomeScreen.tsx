import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useDesignScale } from '../hooks/useDesignScale';
import { HOME_HEADER_HEIGHT_DESIGN_PX } from '../constants/homeLayout';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import SearchInput from '../components/SearchInput';

import type { ShiftType } from '../types/home.types';
import { mockHomeData } from '../data/mockHomeData';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../store/useUserStore';
import { userProfileFromSession } from '../services/user';
import { useAIChatOverlay } from '../contexts/AIChatOverlayContext';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { useRoomsStore } from '../store/useRoomsStore';
import { LoadingOverlay } from '../components/shared/LoadingOverlay';
import type { MoreMenuItemId } from '../types/more.types';
import type { RootStackParamList } from '../navigation/types';
import HomeHeader from '../components/home/HomeHeader';
import CategoryCard from '../components/home/CategoryCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import HomeFilterModal from '../components/home/HomeFilterModal';
import { FilterState, FilterCounts } from '../types/filter.types';
import type { CategorySection } from '../types/home.types';
import type { RoomCardData } from '../types/allRooms.types';
import { getShiftFromTime } from '../utils/shiftUtils';
import { getFloorFromRoomNumber } from '../utils/formatting';

import type { MainTabsParamList } from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const { scaleX } = useDesignScale();
  const styles = useMemo(() => buildHomeScreenStyles(scaleX), [scaleX]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute();
  const { open: openAIChatOverlay } = useAIChatOverlay();
  const { session } = useAuth();
  const [homeData, setHomeData] = useState(() => ({
    ...mockHomeData,
    selectedShift: getShiftFromTime(),
  }));
  const { data: roomsStoreData, loading: roomsLoading, fetchRooms } = useRoomsStore();
  const roomsForHome = useMemo(
    () => ({
      rooms: roomsStoreData?.rooms ?? mockAllRoomsData?.rooms ?? [],
      roomsPM: roomsStoreData?.roomsPM ?? mockAllRoomsData?.roomsPM ?? [],
    }),
    [roomsStoreData?.rooms, roomsStoreData?.roomsPM]
  );
  const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(
    (route.params as any)?.filters as FilterState | undefined
  );
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // PM should behave like AM during AM hours; PM home categories differ from AM (see derivedCategories).
  const currentShiftFromClock = useMemo(() => getShiftFromTime(), []);
  const effectiveShift: ShiftType =
    homeData.selectedShift === 'PM' && currentShiftFromClock === 'AM'
      ? 'AM'
      : homeData.selectedShift;

  const { profile, loading: userLoading, fetchProfile } = useUserStore();
  const sessionFallback = useMemo(
    () =>
      session?.user
        ? userProfileFromSession(session.user.user_metadata, session.user.email, mockHomeData.user.hasFlag)
        : mockHomeData.user,
    [session?.user]
  );
  useEffect(() => {
    if (session?.user) fetchProfile(session.user.id, sessionFallback);
  }, [session?.user?.id, fetchProfile]);
  useFocusEffect(
    React.useCallback(() => {
      if (session?.user) fetchProfile(session.user.id, sessionFallback);
    }, [session?.user?.id, sessionFallback, fetchProfile])
  );
  useEffect(() => {
    setHomeData((prev) => ({
      ...prev,
      user: session ? (profile ?? sessionFallback) : mockHomeData.user,
    }));
  }, [session, profile, sessionFallback]);

  // Sync activeTab with current route
  useFocusEffect(
    React.useCallback(() => {
      const routeName = route.name as string;
      if (routeName === 'Home' || routeName === 'Rooms' || routeName === 'Chat' || routeName === 'Tickets') {
        setActiveTab(routeName);
      }
    }, [route.name])
  );

  const handleShiftToggle = (shift: ShiftType) => {
    setHomeData(prev => ({ ...prev, selectedShift: shift }));
    // Reset filters and search when shift changes
    setActiveFilters(undefined);
    setSearchQuery('');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleBellPress = () => {
    // TODO: Implement notifications
    console.log('Bell pressed');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', { user: homeData.user });
  };

  const handleTabPress = (tab: string, options?: { fromRoomsAssignmentBadge?: boolean }) => {
    if (tab === 'AIHome') {
      openAIChatOverlay();
      return;
    }
    setActiveTab(tab); // Update immediately
    const returnToTab = (route.name as string) as 'Home' | 'Rooms' | 'Chat' | 'Tickets' | 'LostAndFound' | 'Staff' | 'Settings';
    // Navigate to the respective screen
    if (tab === 'Home') {
      navigation.navigate('Home' as any);
    } else if (tab === 'Rooms') {
      navigation.navigate('Rooms' as any, {
        prioritizeMyAssignedRooms: !!options?.fromRoomsAssignmentBadge,
      });
    } else if (tab === 'Chat') {
      navigation.navigate('Chat' as any);
    } else if (tab === 'Tickets') {
      navigation.navigate('Tickets' as any);
    } else if (tab === 'LostAndFound') {
      navigation.navigate('LostAndFound', { returnToTab });
    } else if (tab === 'Staff') {
      navigation.navigate('Staff', { returnToTab });
    } else if (tab === 'Settings') {
      navigation.navigate('Settings', { returnToTab });
    }
  };

  const handleCategoryPress = () => {
    // Navigate to All Rooms screen with back button and current shift
    navigation.navigate('AllRooms', { 
      showBackButton: true, 
      filters: activeFilters,
      selectedShift: effectiveShift,
    } as any);
  };

  /** When user taps a status badge (e.g. cleaned[2] under Flagged), filter and show only those rooms. */
  const handleStatusPress = (category: CategorySection, roomState: keyof import('../types/home.types').RoomStatus) => {
    navigation.navigate('AllRooms', {
      showBackButton: true,
      filters: activeFilters,
      categoryFilter: { category: category.name, roomState },
      selectedShift: effectiveShift,
    } as any);
  };

  /** When user taps priority badge, filter and show only priority rooms for that category. */
  const handlePriorityPress = (category: CategorySection) => {
    navigation.navigate('AllRooms', {
      showBackButton: true,
      filters: activeFilters,
      categoryFilter: { category: category.name, roomState: 'priority' },
      selectedShift: effectiveShift,
    } as any);
  };

  const filterRoomsByFloors = (rooms: RoomCardData[], filters?: FilterState) => {
    const floorFilters = filters?.floors;
    if (!floorFilters) return rooms;

    const anySelected = Object.values(floorFilters).some(Boolean);
    if (!anySelected) return rooms;

    if (floorFilters.all) return rooms;

    const allowedFloors = new Set<number>();
    Object.entries(floorFilters).forEach(([key, selected]) => {
      if (key !== 'all' && selected) {
        const floorNum = Number.parseInt(key, 10);
        if (!isNaN(floorNum)) allowedFloors.add(floorNum);
      }
    });

    if (allowedFloors.size === 0) return rooms;

    return rooms.filter((r) => {
      const floor = getFloorFromRoomNumber(r.roomNumber);
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
      if (room.houseKeepingStatus === 'Dirty') status.dirty += 1;
      if (room.houseKeepingStatus === 'InProgress') status.inProgress += 1;
      if (room.houseKeepingStatus === 'Cleaned') status.cleaned += 1;
      if (room.houseKeepingStatus === 'Inspected') status.inspected += 1;
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
    const roomsPM = roomsForHome.roomsPM ?? [];
    // Match the AM/PM toggle, not `effectiveShift` (which can force AM during morning hours for fetch).
    const uiShift = homeData.selectedShift;
    const usePMRooms = uiShift === 'PM' && Array.isArray(roomsPM) && roomsPM.length > 0;
    const sourceRooms = usePMRooms ? roomsPM : (roomsForHome.rooms ?? []);
    
    // Apply filters to the correct shift's data
    let rooms = filterRoomsByFloors(sourceRooms, activeFilters);

    // Apply search filter (room number, guest name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rooms = rooms.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.guests.some((g) => g.name.toLowerCase().includes(q))
      );
    }

    const categories: CategorySection[] = [];

    if (uiShift === 'PM') {
      // PM shift: Flagged, Arrivals, Turndown
      const flaggedRooms = rooms.filter((r) => !!r.flagged);
      const arrivalRooms = rooms.filter(
        (r) => r.frontOfficeStatus === 'Arrival' || r.frontOfficeStatus === 'Arrival/Departure'
      );
      const turndownRooms = rooms.filter((r) => r.frontOfficeStatus === 'Turndown');
      categories.push(buildCategory('Flagged', 'flagged', '#6e1eee', flaggedRooms));
      categories.push(buildCategory('Arrivals', 'arrivals', '#41d541', arrivalRooms));
      categories.push(buildCategory('Turndown', 'turndown', '#4a91fc', turndownRooms));
    } else {
      // AM shift: Flagged, Arrivals, StayOvers — hide Turndown from AM buckets
      rooms = rooms.filter((r) => r.frontOfficeStatus !== 'Turndown');
      const flaggedRooms = rooms.filter((r) => !!r.flagged);
      const arrivalRooms = rooms.filter((r) => r.frontOfficeStatus === 'Arrival' || r.frontOfficeStatus === 'Arrival/Departure');
      const stayOverRooms = rooms.filter((r) => r.frontOfficeStatus === 'Stayover');
      categories.push(buildCategory('Flagged', 'flagged', '#6e1eee', flaggedRooms));
      categories.push(buildCategory('Arrivals', 'arrivals', '#41d541', arrivalRooms));
      categories.push(buildCategory('StayOvers', 'stayovers', '#8d908d', stayOverRooms));
    }

    return categories;
  }, [activeFilters, homeData.selectedShift, searchQuery, roomsForHome]);

  // Sync route filters -> local state
  useEffect(() => {
    const routeFilters = (route.params as any)?.filters as FilterState | undefined;
    if (routeFilters) setActiveFilters(routeFilters);
  }, [(route.params as any)?.filters]);

  // Update visible home categories based on derived data
  useEffect(() => {
    setHomeData((prev) => ({ ...prev, categories: derivedCategories }));
  }, [derivedCategories]);

  React.useEffect(() => {
    fetchRooms(effectiveShift);
  }, [effectiveShift, fetchRooms]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRooms(effectiveShift);
    }, [effectiveShift, fetchRooms])
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchRooms(effectiveShift);
    setRefreshing(false);
  }, [fetchRooms, effectiveShift]);

  // Calculate filter counts from homeData (use derivedCategories when categories not yet synced for current shift)
  const filterCounts: FilterCounts = useMemo(() => {
    const categoriesForCounts = homeData.categories.length > 0 ? homeData.categories : derivedCategories;

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

    categoriesForCounts.forEach((category) => {
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
      } else if (category.name === 'Turndown') {
        guests.turnDown += category.total;
      }
      totalRooms += category.total;
    });

    const roomsPM = roomsForHome.roomsPM ?? [];
    const usePMRooms = homeData.selectedShift === 'PM' && Array.isArray(roomsPM) && roomsPM.length > 0;
    const sourceRooms = usePMRooms ? roomsPM : (roomsForHome.rooms ?? []);

    const reservations = {
      occupied: 0,
      vacant: 0,
    };
    sourceRooms.forEach((r) => {
      if (r.reservationStatus === 'Vacant') reservations.vacant += 1;
      else if (r.reservationStatus === 'Occupied') reservations.occupied += 1;
    });

    // Calculate departures from actual room data for current shift
    const departureRooms = sourceRooms.filter(
      (r) => r.frontOfficeStatus === 'Departure' || r.frontOfficeStatus === 'Arrival/Departure'
    );
    guests.departures = departureRooms.length;

    // Calculate floor counts from first digit of room number (101->1, 305->3, 507->5)
    const floorCounts: Record<number, number> = {};
    sourceRooms.forEach((room) => {
      const floor = getFloorFromRoomNumber(room.roomNumber);
      if (floor !== null) {
        floorCounts[floor] = (floorCounts[floor] || 0) + 1;
      }
    });

    const floors: Record<string, number> = {
      all: Object.values(floorCounts).reduce((sum, n) => sum + n, 0),
      ...Object.fromEntries(Object.entries(floorCounts).map(([k, v]) => [k, v])),
    };

    return { roomStates, guests, floors, totalRooms, reservations };
  }, [homeData.categories, derivedCategories, homeData.selectedShift, roomsForHome]);

  const handleGoToResults = (filters: FilterState) => {
    // Apply filters to Home stats/cards in both AM and PM modes
    setActiveFilters(filters);
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
      {(roomsLoading && !roomsStoreData) ? <LoadingOverlay fullScreen message="Loading…" /> : null}
      {(session && userLoading && !profile) ? <LoadingOverlay fullScreen message="Loading profile…" /> : null}
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
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {derivedCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
                onStatusPress={handleStatusPress}
                onPriorityPress={handlePriorityPress}
                selectedShift={homeData.selectedShift}
              />
            ))}
          </ScrollView>
          
        </View>

        {/* Header - Fixed at top (no blur) */}
        <HomeHeader
          user={homeData.user}
          selectedShift={homeData.selectedShift}
          date={homeData.date}
          onShiftToggle={handleShiftToggle}
          onBellPress={handleBellPress}
          onProfilePress={handleProfilePress}
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
                placeholder={{ bold: 'Search ', normal: 'by room number, guest name' }}
                value={searchQuery}
                onChangeText={handleSearch}
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
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />

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

function buildHomeScreenStyles(scaleX: number) {
  return StyleSheet.create({
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
    top: (HOME_HEADER_HEIGHT_DESIGN_PX + 14 + 59) * scaleX, // Start below header + search bar
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  searchSection: {
    position: 'absolute',
    left: 15 * scaleX,
    top: (HOME_HEADER_HEIGHT_DESIGN_PX + 14) * scaleX, // Header + margin
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
}

