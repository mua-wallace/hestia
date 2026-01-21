import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl, useWindowDimensions, Text, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { mockHomeData } from '../data/mockHomeData';
import { mockChatData } from '../data/mockChatData';
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
import { CARD_DIMENSIONS, CARD_COLORS } from '../constants/allRoomsStyles';

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
  const [originalScrollY, setOriginalScrollY] = useState<number>(0); // Store original scroll position before modal opens
  const currentScrollYRef = useRef<number>(0); // Track current scroll position
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
  
  // Prefer local filters (user's current selection) over route filters (initial state)
  // This allows reset to work properly by overriding route filters
  const activeFilters = localFilters !== undefined ? localFilters : routeFilters;
  
  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    if (!activeFilters) return false;
    const hasRoomStateFilter = Object.values(activeFilters.roomStates || {}).some(v => v);
    const hasGuestFilter = Object.values(activeFilters.guests || {}).some(v => v);
    const hasFloorFilter = Object.values(activeFilters.floors || {}).some(v => v);
    return hasRoomStateFilter || hasGuestFilter || hasFloorFilter || !!searchQuery;
  }, [activeFilters, searchQuery]);

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
    const totalRooms = allRoomsData.rooms.length;

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

    const floors = {
      all: totalRooms,
      first: totalRooms,
      second: totalRooms,
      third: totalRooms,
      fourth: totalRooms,
    };

    return { roomStates, guests, floors, totalRooms };
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

  const handleGoToHomeWithFilters = (appliedFilters: FilterState) => {
    setShowFilterModal(false);
    navigation.navigate('Home' as any, { filters: appliedFilters } as any);
  };

  const handleAdvanceFilter = () => {
    // TODO: Navigate to advanced filter screen when implemented
    console.log('Advanced filter');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRoomPress = (room: RoomCardData) => {
    // Map room category to RoomType
    const mapCategoryToRoomType = (category: string) => {
      switch (category) {
        case 'Arrival':
          return 'Arrival';
        case 'Departure':
          return 'Departure';
        case 'Arrival/Departure':
          return 'ArrivalDeparture';
        case 'Stayover':
          return 'Stayover';
        case 'Turndown':
          return 'Turndown';
        default:
          return 'ArrivalDeparture'; // Default fallback
      }
    };

    const roomType = mapCategoryToRoomType(room.category);
    
    // Navigate to the new reusable RoomDetail screen
    navigation.navigate('RoomDetail', { room, roomType } as any);
  };

  const handleStatusPress = (room: RoomCardData) => {
    // Store current scroll position before any changes
    const savedScrollY = currentScrollYRef.current;
    
    // Measure status button position
    const statusButtonRef = statusButtonRefs.current[room.id];
    if (statusButtonRef) {
      statusButtonRef.measureInWindow((x: number, y: number, width: number, height: number) => {
        const buttonBottom = y + height;
        const spacing = 50 * scaleX; // Spacing between button and modal (matches StatusChangeModal)
        const modalHeight = 324.185 * scaleX; // Modal height from StatusChangeModal
        const modalTop = buttonBottom + spacing;
        const modalBottom = modalTop + modalHeight;
        const marginFromBottom = 20 * scaleX; // Desired margin from bottom nav
        const maxModalBottom = SCREEN_HEIGHT - BOTTOM_NAV_HEIGHT - marginFromBottom;
        
        // Check if modal would be cut off at the bottom
        const wouldBeCutOff = modalBottom > maxModalBottom;
        
        // Store room and position
        const roomData = room;
        const initialPosition = { x, y, width, height };
        
        if (wouldBeCutOff && scrollViewRef.current) {
          // Calculate how much we need to scroll up
          // We want modal bottom to be at maxModalBottom
          const desiredModalBottom = maxModalBottom;
          const desiredModalTop = desiredModalBottom - modalHeight;
          const desiredButtonBottom = desiredModalTop - spacing;
          const desiredButtonTop = desiredButtonBottom - height;
          
          // Calculate how much the button needs to move up
          const buttonMoveUp = y - desiredButtonTop;
          
          if (buttonMoveUp > 0) {
            // Store original scroll position
            setOriginalScrollY(savedScrollY);
            
            // Calculate new scroll position (scroll up by the amount button needs to move)
            const newScrollY = Math.max(0, savedScrollY + buttonMoveUp);
            
            // Scroll up to make room for modal
            scrollViewRef.current?.scrollTo({
              y: newScrollY,
              animated: true,
            });
            
            // Wait for scroll to complete, then measure button again and show modal
            setTimeout(() => {
              const buttonRefAfterScroll = statusButtonRefs.current[roomData.id];
              if (buttonRefAfterScroll) {
                try {
                  buttonRefAfterScroll.measureInWindow((x2: number, y2: number, width2: number, height2: number) => {
                    if (x2 !== undefined && y2 !== undefined && !isNaN(x2) && !isNaN(y2)) {
                      setStatusButtonPosition({ x: x2, y: y2, width: width2, height: height2 });
                      setSelectedRoomForStatusChange(roomData);
                      setShowStatusModal(true);
                    } else {
                      // Fallback: use original position
                      setStatusButtonPosition(initialPosition);
                      setSelectedRoomForStatusChange(roomData);
                      setShowStatusModal(true);
                    }
                  });
                } catch (error) {
                  console.log('Error measuring button after scroll:', error);
                  setStatusButtonPosition(initialPosition);
                  setSelectedRoomForStatusChange(roomData);
                  setShowStatusModal(true);
                }
              } else {
                setStatusButtonPosition(initialPosition);
                setSelectedRoomForStatusChange(roomData);
                setShowStatusModal(true);
              }
            }, 400);
          } else {
            // No scroll needed
            setOriginalScrollY(0);
            setStatusButtonPosition(initialPosition);
            setSelectedRoomForStatusChange(roomData);
            setShowStatusModal(true);
          }
        } else {
          // Modal fits, no scroll needed
          setOriginalScrollY(0);
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
  const chatBadgeCount = React.useMemo(() => {
    return mockChatData.reduce((total, chat) => total + (chat.unreadCount || 0), 0);
  }, []);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab); // Update immediately
    setShowMorePopup(false);
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

    // PM mode: show only Turndown cards (per Figma / requirements)
    if (allRoomsData.selectedShift === 'PM') {
      rooms = rooms.filter((room) => room.category === 'Turndown');
    }

    return rooms;
  }, [allRoomsData.rooms, allRoomsData.selectedShift, activeFilters, searchQuery]);

  return (
    <View style={[
      styles.container,
      allRoomsData.selectedShift === 'PM' && styles.containerPM
    ]}>
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
          onScroll={(event) => {
            // Track current scroll position
            currentScrollYRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {hasActiveFilters && filteredRooms.length === 0 ? (
            // Empty state card when filters don't match any rooms
            <View style={[
              styles.emptyStateCard,
              allRoomsData.selectedShift === 'PM' && styles.emptyStateCardPM
            ]}>
              <View style={styles.emptyStateIconContainer}>
                <View style={styles.emptyStateIconCircle}>
                  <Image
                    source={require('../../assets/icons/menu-icon.png')}
                    style={styles.emptyStateIcon}
                    resizeMode="contain"
                    tintColor="#5a759d"
                  />
                </View>
              </View>
              <Text style={[
                styles.emptyStateTitle,
                allRoomsData.selectedShift === 'PM' && styles.emptyStateTitlePM
              ]}>
                No rooms found
              </Text>
              <Text style={[
                styles.emptyStateMessage,
                allRoomsData.selectedShift === 'PM' && styles.emptyStateMessagePM
              ]}>
                The chosen filter options do not match any rooms.{'\n'}Try adjusting your filters or search query.
              </Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
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
                selectedShift={allRoomsData.selectedShift}
              />
            ))
          )}
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
        showFilterModal={showFilterModal}
      />

      {/* Bottom Navigation (no blur) */}
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

      {/* Status Change Modal */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedRoomForStatusChange(null);
          setStatusButtonPosition(null);
          
          // Restore original scroll position if we scrolled
          if (originalScrollY > 0 && scrollViewRef.current) {
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({
                y: originalScrollY,
                animated: true,
              });
              setOriginalScrollY(0); // Reset after restoring
            }, 100); // Small delay to ensure modal close animation completes
          }
        }}
        onStatusSelect={handleStatusSelect}
        currentStatus={selectedRoomForStatusChange?.status || 'InProgress'}
        room={selectedRoomForStatusChange || undefined}
        buttonPosition={statusButtonPosition}
        headerHeight={217} // AllRoomsScreen header height
      />

      {/* Filter Modal */}
      <HomeFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onGoToResults={allRoomsData.selectedShift === 'AM' ? handleGoToHomeWithFilters : handleGoToResults}
        onAdvanceFilter={handleAdvanceFilter}
        onApplyFilters={allRoomsData.selectedShift === 'AM' ? undefined : handleApplyFilters}
        initialFilters={activeFilters || undefined}
        filterCounts={filterCounts}
        headerHeight={153 * scaleX} // Match HomeScreen header height when modal is open
        searchBarHeight={59 * scaleX} // Same search bar height
        searchBarTop={undefined} // Don't pass searchBarTop when modal is open - use HomeScreen logic
        onFilterIconPress={handleFilterPress}
        selectedShift={allRoomsData.selectedShift}
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
  emptyStateCard: {
    width: CARD_DIMENSIONS.width * scaleX,
    alignSelf: 'center',
    backgroundColor: '#f8faff',
    borderWidth: 2,
    borderColor: '#d4e3f7',
    borderRadius: 16 * scaleX,
    padding: 32 * scaleX,
    marginTop: 20 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220 * scaleX,
    shadowColor: 'rgba(90, 117, 157, 0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
    // Gradient-like effect using multiple layers
    overflow: 'hidden',
  },
  emptyStateIconContainer: {
    marginBottom: 20 * scaleX,
  },
  emptyStateIconCircle: {
    width: 80 * scaleX,
    height: 80 * scaleX,
    borderRadius: 40 * scaleX,
    backgroundColor: 'rgba(90, 117, 157, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#5a759d',
    shadowColor: '#5a759d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyStateIcon: {
    width: 40 * scaleX,
    height: 40 * scaleX,
  },
  emptyStateTitle: {
    fontSize: 22 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '700' as any,
    color: '#5a759d',
    marginBottom: 12 * scaleX,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 15 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: '400' as any,
    color: '#607AA1',
    textAlign: 'center',
    lineHeight: 22 * scaleX,
    paddingHorizontal: 10 * scaleX,
  },
  emptyStateCardPM: {
    backgroundColor: '#3A3D49', // Dark gray for PM mode
    borderColor: '#4A4D59', // Darker border for PM mode
  },
  emptyStateTitlePM: {
    color: colors.text.white,
  },
  emptyStateMessagePM: {
    color: colors.text.white,
  },
});

