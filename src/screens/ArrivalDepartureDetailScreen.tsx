import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { scaleX, ROOM_DETAIL_HEADER, DETAIL_TABS, CONTENT_AREA, GUEST_INFO, NOTES_SECTION, LOST_AND_FOUND, ASSIGNED_TO } from '../constants/roomDetailStyles';
import RoomDetailHeader from '../components/roomDetail/RoomDetailHeader';
import DetailTabNavigation from '../components/roomDetail/DetailTabNavigation';
import GuestInfoCard from '../components/roomDetail/GuestInfoCard';
import NotesSection from '../components/roomDetail/NotesSection';
import LostAndFoundSection from '../components/roomDetail/LostAndFoundSection';
import AssignedToSection from '../components/roomDetail/AssignedToSection';
import StatusChangeModal from '../components/allRooms/StatusChangeModal';
import ReturnLaterModal from '../components/roomDetail/ReturnLaterModal';
import PromiseTimeModal from '../components/roomDetail/PromiseTimeModal';
import ReassignModal from '../components/roomDetail/ReassignModal';
import type { RoomCardData, StatusChangeOption } from '../types/allRooms.types';
import type { RoomDetailData, DetailTab, Note } from '../types/roomDetail.types';
import type { RootStackParamList } from '../navigation/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ArrivalDepartureDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ArrivalDepartureDetail'
>;

export default function ArrivalDepartureDetailScreen() {
  const navigation = useNavigation<ArrivalDepartureDetailScreenNavigationProp>();
  const route = useRoute();
  const room = (route.params as any)?.room as RoomCardData;

  const [activeTab, setActiveTab] = useState<DetailTab>('Overview');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReturnLaterModal, setShowReturnLaterModal] = useState(false);
  const [showPromiseTimeModal, setShowPromiseTimeModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [statusButtonPosition, setStatusButtonPosition] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const statusButtonRef = useRef<TouchableOpacity>(null);
  // Track current status to update header background color
  const [currentStatus, setCurrentStatus] = useState<RoomCardData['status']>(room.status);

  // Transform room data to detail data format
  // In a real app, this would come from an API or be passed directly
  const roomDetail: RoomDetailData = {
    ...room,
    specialInstructions: room.guests && room.guests.length > 0
      ? 'Please prepare a high-floor suite with a city view, away from the elevators, set to 21°C, with hypoallergenic pillows and a fresh orchid on the nightstand.'
      : undefined,
    // Provide default notes for display (in real app, these would come from API)
    // For In Progress rooms, show relevant notes
    notes: [
      {
        id: '1',
        text: "Guest wants 2 extra bath towels + 1 hand towel. Don't move items on desk. Refill water bottles daily. Check minibar usage. Leave AC on medium-cool.",
        staff: {
          name: room.staff?.name || 'Stella Kitou',
          avatar: require('../../assets/icons/profile-avatar.png'),
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Deep clean bathroom (heavy bath use). Change all linens + pillow protectors. Vacuum under bed. Restock all amenities. Light at entrance flickering report to maintenance.',
        staff: {
          name: room.staff?.name || 'Stella Kitou',
          avatar: require('../../assets/icons/profile-avatar.png'),
        },
        createdAt: new Date().toISOString(),
      },
    ] as Note[],
    assignedTo: room.staff
      ? {
          id: '1',
          name: room.staff.name,
          avatar: room.staff.avatar || require('../../assets/icons/profile-avatar.png'),
        }
      : undefined,
    isUrgent: room.isPriority,
  };

  const handleBackPress = () => {
    // Navigate back to previous screen (All Rooms)
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: navigate to AllRooms if can't go back
      navigation.navigate('AllRooms');
    }
  };

  const handleStatusPress = () => {
    // Measure the status button position
    if (statusButtonRef.current) {
      statusButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setStatusButtonPosition({
          x: pageX,
          y: pageY,
          width,
          height,
        });
        setShowStatusModal(true);
      });
    } else {
      // Fallback: use header position constants
      setStatusButtonPosition({
        x: ROOM_DETAIL_HEADER.statusIndicator.left * scaleX,
        y: ROOM_DETAIL_HEADER.statusIndicator.top * scaleX,
        width: ROOM_DETAIL_HEADER.statusIndicator.width * scaleX,
        height: ROOM_DETAIL_HEADER.statusIndicator.height * scaleX,
      });
      setShowStatusModal(true);
    }
  };

  const handleStatusSelect = (statusOption: StatusChangeOption) => {
    // If Return Later is selected, show the Return Later modal
    if (statusOption === 'ReturnLater') {
      setShowStatusModal(false);
      setShowReturnLaterModal(true);
      return;
    }

    // If PromisedTime is selected, show the Promise Time modal
    if (statusOption === 'PromisedTime') {
      console.log('PromisedTime selected, opening PromiseTimeModal');
      setShowStatusModal(false);
      setShowPromiseTimeModal(true);
      return;
    }

    // Map status option to RoomStatus
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

    const newStatus = mapStatusOptionToRoomStatus(statusOption);

    // Update local status state to change header background color
    setCurrentStatus(newStatus);

    // TODO: Update room status in backend/API
    console.log('Status changed for room:', room.roomNumber, 'to:', newStatus);

    // Close modal
    setShowStatusModal(false);
    setStatusButtonPosition(null);
  };

  const handleReturnLaterConfirm = (returnTime: string, period: 'AM' | 'PM') => {
    // TODO: Save return time to backend/API
    console.log('Return Later confirmed for room:', room.roomNumber, 'at:', returnTime, period);
    
    // Close modal
    setShowReturnLaterModal(false);
    
    // TODO: Update room status or show success message
  };

  const handlePromiseTimeConfirm = (date: Date, time: string, period: 'AM' | 'PM') => {
    // TODO: Save promise time to backend/API
    console.log('Promise Time confirmed for room:', room.roomNumber, 'on:', date.toDateString(), 'at:', time, period);
    
    // Close modal
    setShowPromiseTimeModal(false);
    
    // TODO: Update room status or show success message
  };

  const handleTabPress = (tab: DetailTab) => {
    setActiveTab(tab);
    // TODO: Load content for other tabs
  };

  const handleAddNote = () => {
    // TODO: Show add note modal
    console.log('Add note');
  };

  const handleAddPhotos = () => {
    // TODO: Show photo picker
    console.log('Add photos');
  };

  const handleReassign = () => {
    console.log('handleReassign called, opening ReassignModal');
    setShowReassignModal(true);
  };

  const handleStaffSelect = (staffId: string) => {
    console.log('Staff selected:', staffId);
    // TODO: Update room assignment in backend
    // Update local state
    if (roomDetail.assignedTo) {
      roomDetail.assignedTo.id = staffId;
      // In a real app, you'd fetch the staff member details
    }
    setShowReassignModal(false);
  };

  const handleAutoAssign = () => {
    console.log('Auto assign requested');
    // TODO: Implement auto assign logic
    // For now, just close the modal
    setShowReassignModal(false);
  };

  if (!room) {
    return null;
  }

  const arrivalGuest = room.guests.find((g) => g.timeLabel === 'ETA');
  const departureGuest = room.guests.find((g) => g.timeLabel === 'EDT');
  // For single guest rooms without ETA/EDT, use the first guest
  const singleGuest = room.guests.length === 1 && !arrivalGuest && !departureGuest 
    ? room.guests[0] 
    : null;
  
  // Ensure we always have at least one guest to display
  const hasGuestsToDisplay = arrivalGuest || departureGuest || singleGuest || (room.guests && room.guests.length > 0);

  return (
    <View style={styles.container}>
      {/* Gray Background - Behind everything (0-285px) */}
      <View style={styles.backgroundTop} />

      {/* Header - Yellow (0-232px) */}
      <RoomDetailHeader
        roomNumber={room.roomNumber}
        roomCode={room.roomType}
        status={currentStatus}
        onBackPress={handleBackPress}
        onStatusPress={handleStatusPress}
        statusButtonRef={statusButtonRef}
      />

      {/* Tab Navigation - Below header (252px) */}
      <DetailTabNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* Content Area - Starts at 285px */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Content Sections - Only show Overview tab content for now */}
        {activeTab === 'Overview' && (
          <>
            {/* Guest Info Section */}
            {hasGuestsToDisplay && (
              <View style={styles.guestInfoSection}>
                <Text style={styles.guestInfoTitle}>Guest Info</Text>

                {/* Arrival Guest */}
                {arrivalGuest && (
                  <GuestInfoCard
                    guest={arrivalGuest}
                    isArrival={true}
                    numberBadge={room.priorityCount?.toString()}
                    specialInstructions={roomDetail.specialInstructions}
                    absoluteTop={GUEST_INFO.arrival.name.top}
                    contentAreaTop={CONTENT_AREA.top}
                  />
                )}

                {/* Divider - show after arrival guest if there's a departure guest */}
                {arrivalGuest && departureGuest && <View style={styles.divider1} />}

                {/* Departure Guest - use arrival position if it's a single guest departure room */}
                {departureGuest && (
                  <GuestInfoCard
                    guest={departureGuest}
                    isArrival={false}
                    numberBadge={room.secondGuestPriorityCount?.toString() || room.priorityCount?.toString()}
                    specialInstructions={roomDetail.specialInstructions}
                    isSecondGuest={!!arrivalGuest} // Second guest if there's an arrival guest
                    absoluteTop={
                      // For single guest departure rooms, use arrival position
                      (room.guests.length === 1 && !arrivalGuest) 
                        ? GUEST_INFO.arrival.name.top 
                        : GUEST_INFO.departure.name.top
                    }
                    contentAreaTop={CONTENT_AREA.top}
                  />
                )}

                {/* Divider - show after departure guest in Arrival/Departure rooms or single departure guest */}
                {departureGuest && arrivalGuest && <View style={styles.divider2} />}
                {/* Divider for single departure guest after their info */}
                {departureGuest && room.guests.length === 1 && !arrivalGuest && <View style={styles.divider1} />}

                {/* For single guest rooms without ETA/EDT labels, show the first guest */}
                {singleGuest && (
                  <>
                    <GuestInfoCard
                      guest={singleGuest}
                      isArrival={singleGuest.timeLabel === 'ETA' || room.category === 'Arrival' || room.category === 'Stayover' || room.category === 'Turndown'}
                      numberBadge={room.priorityCount?.toString()}
                      specialInstructions={roomDetail.specialInstructions}
                      absoluteTop={GUEST_INFO.arrival.name.top}
                      contentAreaTop={CONTENT_AREA.top}
                    />
                    <View style={styles.divider1} />
                  </>
                )}
                
                {/* Fallback: If no guest matched ETA/EDT and no singleGuest, show first guest anyway */}
                {!arrivalGuest && !departureGuest && !singleGuest && room.guests && room.guests.length > 0 && (
                  <>
                    <GuestInfoCard
                      guest={room.guests[0]}
                      isArrival={room.category === 'Arrival' || room.category === 'Stayover' || room.category === 'Turndown'}
                      numberBadge={room.priorityCount?.toString()}
                      specialInstructions={roomDetail.specialInstructions}
                      absoluteTop={GUEST_INFO.arrival.name.top}
                      contentAreaTop={CONTENT_AREA.top}
                    />
                    <View style={styles.divider1} />
                  </>
                )}
              </View>
            )}

            {/* Notes Section */}
            <NotesSection
              notes={roomDetail.notes}
              onAddPress={handleAddNote}
            />

            {/* Lost and Found Section */}
            <LostAndFoundSection onAddPhotosPress={handleAddPhotos} />

            {/* Divider - positioned after Lost and Found at 1171px */}
            <View style={styles.divider3} />

            {/* Assigned to Section */}
            {roomDetail.assignedTo && (
              <AssignedToSection
                staff={roomDetail.assignedTo}
                onReassignPress={handleReassign}
              />
            )}
          </>
        )}

        {/* Other tabs content - placeholder */}
        {activeTab !== 'Overview' && (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              {activeTab} content coming soon
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Status Change Modal */}
      <StatusChangeModal
        visible={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusButtonPosition(null);
        }}
        onStatusSelect={handleStatusSelect}
        currentStatus={currentStatus}
        room={room}
        buttonPosition={statusButtonPosition}
        showTriangle={false}
      />

      {/* Return Later Modal */}
      <ReturnLaterModal
        visible={showReturnLaterModal}
        onClose={() => setShowReturnLaterModal(false)}
        onConfirm={handleReturnLaterConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
      />

      {/* Promise Time Modal */}
      <PromiseTimeModal
        visible={showPromiseTimeModal}
        onClose={() => setShowPromiseTimeModal(false)}
        onConfirm={handlePromiseTimeConfirm}
        roomNumber={room.roomNumber}
        assignedTo={roomDetail.assignedTo}
        onReassignPress={handleReassign}
      />

      {/* Reassign Modal */}
      <ReassignModal
        visible={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        onStaffSelect={handleStaffSelect}
        onAutoAssign={handleAutoAssign}
        currentAssignedStaffId={roomDetail.assignedTo?.id}
        roomNumber={room.roomNumber}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
    marginTop: CONTENT_AREA.top * scaleX,
  },
  scrollContent: {
    paddingTop: 0, // No extra padding at top, content starts immediately
    paddingBottom: 200 * scaleX, // Extra padding at bottom to ensure all sections are visible
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CONTENT_AREA.backgroundTopHeight * scaleX,
    backgroundColor: CONTENT_AREA.backgroundTop,
    zIndex: 0,
  },
  guestInfoSection: {
    position: 'relative',
    width: '100%',
    paddingTop: (GUEST_INFO.title.top - CONTENT_AREA.top) * scaleX, // Space from content area start to Guest Info title
    minHeight: (646 - 303) * scaleX, // From Guest Info title (303) to Notes start (646)
  },
  guestInfoTitle: {
    position: 'absolute',
    left: GUEST_INFO.title.left * scaleX,
    top: (GUEST_INFO.title.top - CONTENT_AREA.top) * scaleX, // 303 - 285 = 18px from scroll start
    fontSize: GUEST_INFO.title.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: GUEST_INFO.title.color,
  },
  divider1: {
    position: 'absolute',
    left: GUEST_INFO.divider.left,
    top: (GUEST_INFO.divider.top - CONTENT_AREA.top) * scaleX,
    width: GUEST_INFO.divider.width * scaleX,
    height: GUEST_INFO.divider.height,
    backgroundColor: GUEST_INFO.divider.color,
  },
  divider2: {
    position: 'absolute',
    left: GUEST_INFO.divider2.left,
    top: (GUEST_INFO.divider2.top - CONTENT_AREA.top) * scaleX,
    width: GUEST_INFO.divider2.width * scaleX,
    height: GUEST_INFO.divider2.height,
    backgroundColor: GUEST_INFO.divider2.color,
  },
  divider3: {
    position: 'relative',
    left: NOTES_SECTION.divider.left,
    width: NOTES_SECTION.divider.width * scaleX,
    height: NOTES_SECTION.divider.height,
    backgroundColor: NOTES_SECTION.divider.color,
    marginTop: (1171 - 1153) * scaleX, // Position after Lost and Found box ends (1153px): 1171 - 1153 = 18px
    marginBottom: 0,
  },
  placeholderContent: {
    padding: 40 * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200 * scaleX,
  },
  placeholderText: {
    fontSize: 16 * scaleX,
    color: '#999',
  },
});

