import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { scaleX, ROOM_DETAIL_HEADER, DETAIL_TABS, CONTENT_AREA, GUEST_INFO, NOTES_SECTION, LOST_AND_FOUND, ASSIGNED_TO, URGENT_BADGE } from '../constants/roomDetailStyles';
import RoomDetailHeader from '../components/roomDetail/RoomDetailHeader';
import DetailTabNavigation from '../components/roomDetail/DetailTabNavigation';
import GuestInfoCard from '../components/roomDetail/GuestInfoCard';
import NotesSection from '../components/roomDetail/NotesSection';
import LostAndFoundSection from '../components/roomDetail/LostAndFoundSection';
import AssignedToSection from '../components/roomDetail/AssignedToSection';
import type { RoomCardData } from '../types/allRooms.types';
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

  // Transform room data to detail data format
  // In a real app, this would come from an API or be passed directly
  const roomDetail: RoomDetailData = {
    ...room,
    specialInstructions: room.guests[0]?.timeLabel === 'ETA' 
      ? 'Please prepare a high-floor suite with a city view, away from the elevators, set to 21°C, with hypoallergenic pillows and a fresh orchid on the nightstand.'
      : undefined,
    notes: [
      {
        id: '1',
        text: "Guest wants 2 extra bath towels + 1 hand towel. Don't move items on desk. Refill water bottles daily. Check minibar usage. Leave AC on medium-cool.",
        staff: {
          name: 'Stella Kitou',
          avatar: require('../../assets/icons/profile-avatar.png'),
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Deep clean bathroom (heavy bath use). Change all linens + pillow protectors. Vacuum under bed. Restock all amenities. Light at entrance flickering report to maintenance.',
        staff: {
          name: 'Stella Kitou',
          avatar: require('../../assets/icons/profile-avatar.png'),
        },
        createdAt: new Date().toISOString(),
      },
    ] as Note[],
    assignedTo: room.staff
      ? {
          id: '1',
          name: room.staff.name,
          avatar: require('../../assets/icons/profile-avatar.png'),
        }
      : undefined,
    isUrgent: room.isPriority,
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleStatusPress = () => {
    // TODO: Show status change modal
    console.log('Status pressed');
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
    // TODO: Show reassign modal
    console.log('Reassign');
  };

  if (!room) {
    return null;
  }

  const arrivalGuest = room.guests.find((g) => g.timeLabel === 'ETA');
  const departureGuest = room.guests.find((g) => g.timeLabel === 'EDT');

  return (
    <View style={styles.container}>
      {/* Gray Background - Behind everything (0-285px) */}
      <View style={styles.backgroundTop} />

      {/* Header - Yellow (0-232px) */}
      <RoomDetailHeader
        roomNumber={room.roomNumber}
        roomCode={room.roomType}
        status={room.status}
        onBackPress={handleBackPress}
        onStatusPress={handleStatusPress}
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

              {/* Divider */}
              <View style={styles.divider1} />

              {/* Departure Guest */}
              {departureGuest && (
                <GuestInfoCard
                  guest={departureGuest}
                  isArrival={false}
                  numberBadge={room.secondGuestPriorityCount?.toString()}
                  absoluteTop={GUEST_INFO.departure.name.top}
                  contentAreaTop={CONTENT_AREA.top}
                />
              )}

              {/* Divider */}
              <View style={styles.divider2} />
            </View>

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

      {/* Urgent Badge */}
      {roomDetail.isUrgent && (
        <View style={styles.urgentBadge}>
          <Text style={styles.urgentBadgeText}>Urgent</Text>
        </View>
      )}
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
  urgentBadge: {
    position: 'absolute',
    left: URGENT_BADGE.left * scaleX,
    top: URGENT_BADGE.top * scaleX,
    backgroundColor: URGENT_BADGE.backgroundColor,
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 4 * scaleX,
    borderRadius: 4 * scaleX,
  },
  urgentBadgeText: {
    fontSize: URGENT_BADGE.fontSize * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: URGENT_BADGE.fontWeight as any,
    color: URGENT_BADGE.color,
  },
});

