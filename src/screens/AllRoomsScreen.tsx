import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import AllRoomsHeader from '../components/allRooms/AllRoomsHeader';
import RoomCard from '../components/allRooms/RoomCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import { MoreMenuItemId } from '../types/more.types';
import { FilterState } from '../types/filter.types';
import { BlurView } from 'expo-blur';

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

type AllRoomsScreenNavigationProp = BottomTabNavigationProp<MainTabsParamList, 'Rooms'>;

export default function AllRoomsScreen() {
  const navigation = useNavigation<AllRoomsScreenNavigationProp>();
  const route = useRoute();
  const [allRoomsData, setAllRoomsData] = useState(mockAllRoomsData);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Rooms');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedRoomForStatusChange, setSelectedRoomForStatusChange] = useState<RoomCardData | null>(null);
  const [selectedCardTop, setSelectedCardTop] = useState<number>(0);
  const [selectedCardHeight, setSelectedCardHeight] = useState<number>(0);
  const cardRefs = useRef<{ [key: string]: any }>({});
  
  // Check if we came from a stack navigation (show back button) or tab navigation (don't show)
  const showBackButton = route.params?.showBackButton ?? false;

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

  const handleFilterClose = () => {
    setShowFilterModal(false);
  };

  const handleFilterApply = (filters: FilterState) => {
    setActiveFilters(filters);
    // TODO: Apply filters to room list
    console.log('Filters applied:', filters);
  };

  const handleGoToResults = () => {
    // Filters are already applied via handleFilterApply
    // Close modal and show filtered results
    console.log('Go to results');
  };

  const handleAdvanceFilter = () => {
    // TODO: Navigate to advance filter screen or show additional options
    console.log('Advance filter');
  };

  // Calculate filtered room count (for now, just return total)
  const getFilteredRoomCount = () => {
    // TODO: Implement actual filtering logic
    return allRoomsData.rooms.length;
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRoomPress = (room: RoomCardData) => {
    // TODO: Navigate to room detail screen
    console.log('Room pressed:', room.roomNumber);
    // navigation.navigate('RoomDetail', { roomId: room.id });
  };

  const handleStatusPress = (room: RoomCardData) => {
    // Show modal for all status buttons (Dirty, InProgress, Cleaned, Inspected)
    // Calculate card height based on card type
    const isArrivalDeparture = room.category === 'Arrival/Departure';
    let cardHeight: number;
    if (isArrivalDeparture) {
      cardHeight = 292; // CARD_DIMENSIONS.heights.arrivalDeparture
    } else if (room.notes) {
      cardHeight = 222; // CARD_DIMENSIONS.heights.withNotes
    } else if (room.category === 'Departure') {
      cardHeight = 177; // CARD_DIMENSIONS.heights.standard
    } else {
      cardHeight = 185; // CARD_DIMENSIONS.heights.withGuestInfo
    }

    // Measure card position
    const cardRef = cardRefs.current[room.id];
    if (cardRef) {
      cardRef.measureInWindow((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setSelectedCardTop(pageY);
        setSelectedCardHeight(cardHeight * scaleX);
        setSelectedRoomForStatusChange(room);
        setShowStatusModal(true);
      });
    } else {
      // Fallback: estimate position based on room index
      const roomIndex = filteredRooms.findIndex(r => r.id === room.id);
      const HEADER_HEIGHT = 217;
      const CARD_SPACING = 16;
      const CARD_HEIGHT_AVG = 200; // Average card height
      const estimatedTop = HEADER_HEIGHT + (roomIndex * (CARD_HEIGHT_AVG + CARD_SPACING));
      setSelectedCardTop(estimatedTop * scaleX);
      setSelectedCardHeight(cardHeight * scaleX);
      setSelectedRoomForStatusChange(room);
      setShowStatusModal(true);
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

  // Filter rooms based on search query
  const filteredRooms = searchQuery
    ? allRoomsData.rooms.filter(room =>
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.guests.some(guest => guest.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allRoomsData.rooms;

  return (
    <View style={styles.container}>
      {/* Scrollable Content with conditional blur */}
      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showMorePopup && !showStatusModal}
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
        chatBadgeCount={0}
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
          setSelectedCardTop(0);
          setSelectedCardHeight(0);
        }}
        onStatusSelect={handleStatusSelect}
        currentStatus={selectedRoomForStatusChange?.status || 'InProgress'}
        room={selectedRoomForStatusChange || undefined}
        cardTop={selectedCardTop}
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: (217 + 23) * scaleX, // Header height (217px) + spacing from search input (23px)
    paddingBottom: 152 * scaleX + 20 * scaleX, // Bottom nav height + extra padding
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

