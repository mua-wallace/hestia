import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { mockHomeData } from '../data/mockHomeData';
import { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import AllRoomsHeader from '../components/allRooms/AllRoomsHeader';
import RoomCard from '../components/allRooms/RoomCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import { MoreMenuItemId } from '../types/more.types';
import type { RootStackParamList } from '../navigation/types';
import { BlurView } from 'expo-blur';
import { FilterState, FilterCounts } from '../types/filter.types';
import HomeFilterModal from '../components/home/HomeFilterModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Modal dimensions for positioning calculations
const MODAL_HEIGHT_ESTIMATE = 200 * scaleX; // Approximate modal height
const MODAL_SPACING = 20 * scaleX; // Spacing between button and modal (increased for better visibility)
const BOTTOM_NAV_HEIGHT = 152 * scaleX; // Bottom navigation height
const HEADER_HEIGHT = 217 * scaleX; // Header height

type MainTabsParamList = {
  Home: undefined;
  Rooms: undefined;
  Chat: undefined;
  Tickets: undefined;
  LostAndFound: undefined;
  Staff: undefined;
  Settings: undefined;
};

type AllRoomsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Rooms'> & 
  NativeStackNavigationProp<RootStackParamList>;

export default function AllRoomsScreen() {
  const navigation = useNavigation<AllRoomsScreenNavigationProp>();
  const route = useRoute();
  const [allRoomsData, setAllRoomsData] = useState(mockAllRoomsData);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Rooms');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRoomForStatusChange, setSelectedRoomForStatusChange] = useState<RoomCardData | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState<number>(0);
  const [selectedCardHeight, setSelectedCardHeight] = useState<number>(0);
  const [statusButtonPosition, setStatusButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const cardRefs = useRef<{ [key: string]: any }>({});
  const statusButtonRefs = useRef<{ [key: string]: any }>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  
  // Check if we came from a stack navigation (show back button) or tab navigation (don't show)
  const showBackButton = (route.params as any)?.showBackButton ?? false;
  const routeFilters = (route.params as any)?.filters as FilterState | undefined;
  
  // Initialize local filters with route filters if available
  const [localFilters, setLocalFilters] = useState<FilterState | undefined>(routeFilters);
  
  // Sync local filters with route filters when route params change
  React.useEffect(() => {
    if (routeFilters) {
      setLocalFilters(routeFilters);
    }
  }, [routeFilters]);
  
  // Use route filters if available, otherwise use local filters
  const activeFilters = routeFilters || localFilters;

  const handleShiftToggle = (shift: ShiftType) => {
    setAllRoomsData(prev => ({ ...prev, selectedShift: shift }));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // TODO: Implement search filtering logic
    console.log('Search:', text);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  // Calculate filter counts from rooms data
  const filterCounts: FilterCounts = useMemo(() => {
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

    allRoomsData.rooms.forEach((room) => {
      // Room state counts
      if (room.status === 'Dirty') roomStates.dirty++;
      if (room.status === 'InProgress') roomStates.inProgress++;
      if (room.status === 'Cleaned') roomStates.cleaned++;
      if (room.status === 'Inspected') roomStates.inspected++;
      if (room.isPriority) roomStates.priority++;

      // Guest counts based on category
      if (room.category === 'Arrival' || room.category === 'Arrival/Departure') {
        guests.arrivals++;
      }
      if (room.category === 'Departure' || room.category === 'Arrival/Departure') {
        guests.departures++;
      }
      if (room.category === 'Turndown') {
        guests.turnDown++;
      }
      if (room.category === 'Stayover') {
        guests.stayOver++;
      }
    });

    return { roomStates, guests };
  }, [allRoomsData.rooms]);

  const handleApplyFilters = (appliedFilters: FilterState) => {
    setLocalFilters(appliedFilters);
    setShowFilterModal(false);
  };

  const handleGoToResults = (appliedFilters: FilterState) => {
    setLocalFilters(appliedFilters);
    setShowFilterModal(false);
    // Filters are already applied via activeFilters, no need to navigate
  };

  const handleAdvanceFilter = () => {
    // TODO: Navigate to advanced filter screen when implemented
    console.log('Advanced filter');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRoomPress = (room: RoomCardData) => {
    // Navigate to detail screen for all room statuses including In Progress
    if (room.category === 'Arrival/Departure' || room.status === 'Dirty' || room.status === 'Cleaned' || room.status === 'Inspected' || room.status === 'InProgress') {
      navigation.navigate('ArrivalDepartureDetail', { room } as any);
    } else {
      // TODO: Navigate to other room detail screens
      console.log('Room pressed:', room.roomNumber);
    }
  };

  const handleStatusPress = (room: RoomCardData) => {
    // Measure status button position
    const statusButtonRef = statusButtonRefs.current[room.id];
    if (statusButtonRef) {
      statusButtonRef.measureInWindow((x: number, y: number, width: number, height: number) => {
        const buttonBottom = y + height;
        const modalTop = buttonBottom + MODAL_SPACING;
        const modalBottom = modalTop + MODAL_HEIGHT_ESTIMATE;
        const availableBottomSpace = SCREEN_HEIGHT - BOTTOM_NAV_HEIGHT;
        
        // Calculate desired position: button should be positioned so modal appears with consistent margin
        // We want modal bottom to be at: SCREEN_HEIGHT - BOTTOM_NAV_HEIGHT - some margin
        const desiredModalBottom = SCREEN_HEIGHT - BOTTOM_NAV_HEIGHT - 20 * scaleX; // 20px margin from bottom nav
        const desiredButtonBottom = desiredModalBottom - MODAL_HEIGHT_ESTIMATE - MODAL_SPACING;
        const desiredButtonTop = desiredButtonBottom - height;
        const currentButtonTop = y;
        
        // Always scroll to center the card if it's below the desired position
        // This ensures modal always appears with consistent margins
        const cardRef = cardRefs.current[room.id];
        const scrollOffset = currentButtonTop - desiredButtonTop;
        
        // Store room and position for fallback
        const roomData = room;
        const initialPosition = { x, y, width, height };
        
        // Only scroll if button is below desired position (positive scrollOffset means we need to scroll up)
        if (cardRef && scrollViewRef.current && scrollOffset > 5) { // Only scroll if offset is significant (>5px)
          cardRef.measureInWindow((cardX: number, cardY: number, cardWidth: number, cardHeight: number) => {
            // Calculate scroll offset needed
            // The card's y position relative to scroll view content (accounting for header)
            const cardTopRelativeToScroll = Math.max(0, cardY - HEADER_HEIGHT);
            const newScrollY = Math.max(0, cardTopRelativeToScroll - scrollOffset);
            
            // Scroll to position card so button is at desired position
            scrollViewRef.current?.scrollTo({
              y: newScrollY,
              animated: true,
            });
            
            // Wait for scroll to complete, then measure again and show modal
            // Increased timeout to ensure scroll completes, especially for last cards
            setTimeout(() => {
              // Try to measure button position after scroll
              const buttonRefAfterScroll = statusButtonRefs.current[roomData.id];
              if (buttonRefAfterScroll) {
                try {
                  buttonRefAfterScroll.measureInWindow((x2: number, y2: number, width2: number, height2: number) => {
                    // Verify we got valid coordinates
                    if (x2 !== undefined && y2 !== undefined && !isNaN(x2) && !isNaN(y2)) {
                      setStatusButtonPosition({ x: x2, y: y2, width: width2, height: height2 });
                      setSelectedRoomForStatusChange(roomData);
                      setShowStatusModal(true);
                    } else {
                      // Fallback: use original position if measurement is invalid
                      setStatusButtonPosition(initialPosition);
                      setSelectedRoomForStatusChange(roomData);
                      setShowStatusModal(true);
                    }
                  });
                } catch (error) {
                  // Fallback: use original position if measurement fails
                  console.log('Error measuring button after scroll:', error);
                  setStatusButtonPosition(initialPosition);
                  setSelectedRoomForStatusChange(roomData);
                  setShowStatusModal(true);
                }
              } else {
                // Fallback: use original position if ref is not available
                setStatusButtonPosition(initialPosition);
                setSelectedRoomForStatusChange(roomData);
                setShowStatusModal(true);
              }
            }, 400); // Increased timeout for last cards
          });
        } else {
          // Button is already in good position or no scroll needed, show modal directly
          setStatusButtonPosition(initialPosition);
          setSelectedRoomForStatusChange(roomData);
          setShowStatusModal(true);
        }
      });
    } else {
      // Fallback: use card position if button ref not available
      const cardRef = cardRefs.current[room.id];
      if (cardRef) {
        cardRef.measureInWindow((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          // Estimate button position from card position
          const isArrivalDeparture = room.category === 'Arrival/Departure';
          let buttonLeft: number;
          let buttonTop: number;
          if (isArrivalDeparture) {
            buttonLeft = 255;
            buttonTop = 114;
          } else if (room.notes) {
            buttonLeft = 256;
            buttonTop = 74;
          } else if (room.category === 'Departure') {
            buttonLeft = 262;
            buttonTop = 81;
          } else {
            buttonLeft = 270;
            buttonTop = 87;
          }
          const buttonX = pageX + buttonLeft * scaleX;
          const buttonY = pageY + buttonTop * scaleX;
          setStatusButtonPosition({ 
            x: buttonX, 
            y: buttonY, 
            width: 134 * scaleX, 
            height: 70 * scaleX 
          });
          setSelectedRoomForStatusChange(room);
          setShowStatusModal(true);
        });
      } else {
        setSelectedRoomForStatusChange(room);
        setShowStatusModal(true);
      }
    }
  };

  const mapStatusOptionToRoomStatus = (option: StatusChangeOption): RoomCardData['status'] => {
    switch (option) {
      case 'Dirty':
        return 'Dirty';
      case 'Cleaned':
        return 'Cleaned';
      case 'Inspected':
        return 'Inspected';
      case 'Priority':
      case 'Pause':
      case 'ReturnLater':
      case 'RefuseService':
      case 'PromisedTime':
        // These might be actions/metadata, not status changes
        // For now, keep InProgress status
        return 'InProgress';
      default:
        return 'InProgress';
    }
  };

  const handleStatusSelect = (statusOption: StatusChangeOption) => {
    if (!selectedRoomForStatusChange) return;

    // Map status option to RoomStatus
    const newStatus = mapStatusOptionToRoomStatus(statusOption);

    // Update room status in state
    setAllRoomsData((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room) =>
        room.id === selectedRoomForStatusChange.id
          ? { ...room, status: newStatus }
          : room
      ),
    }));

    // Reset state
    setShowStatusModal(false);
    setSelectedRoomForStatusChange(null);

    // TODO: Save to backend/API
    console.log('Status changed for room:', selectedRoomForStatusChange.roomNumber, 'to:', newStatus);
  };

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter rooms based on search query and filters
  const filteredRooms = useMemo(() => {
    let rooms = allRoomsData.rooms;

    // Apply filters if provided
    if (activeFilters) {
      const hasRoomStateFilter = Object.values(activeFilters.roomStates).some(v => v);
      const hasGuestFilter = Object.values(activeFilters.guests).some(v => v);

      if (hasRoomStateFilter || hasGuestFilter) {
        rooms = rooms.filter((room) => {
          // Check room state filters
          if (hasRoomStateFilter) {
            const matchesRoomState =
              (activeFilters.roomStates.dirty && room.status === 'Dirty') ||
              (activeFilters.roomStates.inProgress && room.status === 'InProgress') ||
              (activeFilters.roomStates.cleaned && room.status === 'Cleaned') ||
              (activeFilters.roomStates.inspected && room.status === 'Inspected') ||
              (activeFilters.roomStates.priority && room.isPriority);

            if (!matchesRoomState) {
              return false;
            }
          }

          // Check guest filters
          if (hasGuestFilter) {
            const matchesGuest =
              (activeFilters.guests.arrivals && (room.category === 'Arrival' || room.category === 'Arrival/Departure')) ||
              (activeFilters.guests.departures && (room.category === 'Departure' || room.category === 'Arrival/Departure')) ||
              (activeFilters.guests.turnDown && room.category === 'Turndown') ||
              (activeFilters.guests.stayOver && room.category === 'Stayover');

            if (!matchesGuest) {
              return false;
            }
          }

          return true;
        });
      }
    }

    // Apply search query filter
    if (searchQuery) {
      rooms = rooms.filter(
        (room) =>
          room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.guests.some((guest) =>
            guest.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    return rooms;
  }, [allRoomsData.rooms, activeFilters, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Scrollable Content with conditional blur */}
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMorePopup && !showStatusModal}
          clipsToBounds={false}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              ref={(ref) => {
                if (ref) {
                  cardRefs.current[room.id] = ref;
                }
              }}
              room={room}
              onPress={() => handleRoomPress(room)}
              onStatusPress={() => handleStatusPress(room)}
              statusButtonRef={(ref) => {
                if (ref) {
                  statusButtonRefs.current[room.id] = ref;
                }
              }}
            />
          ))}
        </ScrollView>
        
        {/* Blur Overlay for More Popup - covers content area */}
        {showMorePopup && (
          <BlurView intensity={80} style={styles.contentBlurOverlay} tint="light">
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
        
        {/* Blur Overlay for Status Modal - starts from bottom of target card, covers everything below including tabs */}
        {showStatusModal && selectedCardTop > 0 && (
          <BlurView 
            intensity={80} 
            style={[
              styles.statusModalBlurOverlay,
              { top: selectedCardTop + selectedCardHeight }
            ]} 
            tint="light"
          >
            <View style={styles.blurOverlayDarkener} />
          </BlurView>
        )}
      </View>

      {/* Header - Fixed at top (no blur) */}
      <AllRoomsHeader
        selectedShift={allRoomsData.selectedShift}
        onShiftToggle={handleShiftToggle}
        onSearch={handleSearch}
        onFilterPress={handleFilterPress}
        onBackPress={handleBackPress}
      />

      {/* Bottom Navigation (no blur) */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onMorePress={handleMorePress}
        chatBadgeCount={mockHomeData.notifications.chat}
      />

      {/* More Popup */}
      <MorePopup
        visible={showMorePopup}
        onClose={handleClosePopup}
        onMenuItemPress={handleMenuItemPress}
      />

      {/* Status Change Modal */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedRoomForStatusChange(null);
          setStatusButtonPosition(null);
        }}
        onStatusSelect={handleStatusSelect}
        currentStatus={selectedRoomForStatusChange?.status || 'InProgress'}
        room={selectedRoomForStatusChange || undefined}
        buttonPosition={statusButtonPosition}
      />

      {/* Filter Modal */}
      <HomeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onGoToResults={handleGoToResults}
        onAdvanceFilter={handleAdvanceFilter}
        onApplyFilters={handleApplyFilters}
        initialFilters={activeFilters || undefined}
        filterCounts={filterCounts}
        headerHeight={217 * scaleX} // AllRoomsScreen header height
        searchBarHeight={59 * scaleX} // Same search bar height
        searchBarTop={(133 + 25) * scaleX} // Top section (133px) + marginTop (25px) = 158px
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
    position: 'relative',
    overflow: 'visible', // Allow content to overflow on iOS
  },
  scrollView: {
    flex: 1,
    overflow: 'visible', // Allow content to overflow on iOS
  },
  scrollContent: {
    paddingTop: (217 + 23) * scaleX, // Header height (217px) + spacing from search input (23px)
    paddingBottom: 152 * scaleX + 20 * scaleX, // Bottom nav height + extra padding
    overflow: 'visible', // Allow content to overflow on iOS
  },
  contentBlurOverlay: {
    position: 'absolute',
    top: 217 * scaleX, // Start below header
    left: 0,
    right: 0,
    bottom: 152 * scaleX, // Stop above bottom nav
    zIndex: 1,
  },
  statusModalBlurOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Extends to bottom of screen, covering tabs
    zIndex: 1,
  },
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

