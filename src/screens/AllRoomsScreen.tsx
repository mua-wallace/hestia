import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { ShiftType } from '../types/home.types';
import { mockAllRoomsData } from '../data/mockAllRoomsData';
import { RoomCardData } from '../types/allRooms.types';
import AllRoomsHeader from '../components/allRooms/AllRoomsHeader';
import RoomCard from '../components/allRooms/RoomCard';
import BottomTabBar from '../components/navigation/BottomTabBar';
import MorePopup from '../components/more/MorePopup';
import { MoreMenuItemId } from '../types/more.types';
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
    // TODO: Implement filter modal
    console.log('Filter pressed');
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
    // TODO: Implement status change modal/action
    console.log('Status pressed for room:', room.roomNumber);
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
          scrollEnabled={!showMorePopup}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onPress={() => handleRoomPress(room)}
              onStatusPress={() => handleStatusPress(room)}
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
      <AllRoomsHeader
        selectedShift={allRoomsData.selectedShift}
        onShiftToggle={handleShiftToggle}
        onSearch={handleSearch}
        onFilterPress={handleFilterPress}
        onBackPress={showBackButton ? handleBackPress : undefined}
        showBackButton={showBackButton}
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
  blurOverlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
});

