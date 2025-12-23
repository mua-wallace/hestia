import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import { RoomCardData, CATEGORY_ICONS } from '../../types/allRooms.types';
import GuestInfoSection from './GuestInfoSection';
import StaffSection from './StaffSection';
import StatusButton from './StatusButton';
import NotesSection from './NotesSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface RoomCardProps {
  room: RoomCardData;
  onPress: () => void;
  onStatusPress: () => void;
}

export default function RoomCard({ room, onPress, onStatusPress }: RoomCardProps) {
  const isArrivalDeparture = room.category === 'Arrival/Departure';
  const cardHeight = isArrivalDeparture ? 292 * scaleX : (room.notes ? 222 * scaleX : 177 * scaleX);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { height: cardHeight },
        room.isPriority && styles.priorityBorder,
        room.isPriority && styles.priorityBackground,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Room Header */}
      <View style={styles.roomHeader}>
        {/* Room number badge with icon */}
        <View style={styles.roomBadge}>
          <Image
            source={CATEGORY_ICONS[room.category]}
            style={styles.roomIcon}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.roomInfo}>
          <Text style={styles.roomNumber}>{room.roomNumber}</Text>
          <Text style={styles.roomType}>{room.roomType}</Text>
          {room.priorityCount && (
            <Text style={styles.priorityText}>{room.priorityCount}</Text>
          )}
        </View>
        
        <Text style={styles.categoryLabel}>{room.category}</Text>
        
        {/* Chevron arrow */}
        <View style={styles.chevronContainer}>
          <Image
            source={require('../../../assets/icons/home/menu-icon.png')}
            style={styles.chevronIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Guest Information Sections */}
      <View style={styles.guestContainer}>
        {room.guests.map((guest, index) => (
          <React.Fragment key={index}>
            <GuestInfoSection guest={guest} priorityCount={index === 0 ? room.priorityCount : undefined} />
            {isArrivalDeparture && index === 0 && <View style={styles.dividerHorizontal} />}
          </React.Fragment>
        ))}
      </View>

      {/* Staff Section and Status Button */}
      <View style={styles.staffStatusContainer}>
        <View style={styles.dividerVertical} />
        <StaffSection staff={room.staff} />
        <StatusButton status={room.status} onPress={onStatusPress} />
      </View>

      {/* Notes Section (if applicable) */}
      {room.notes && (
        <NotesSection notes={room.notes} />
      )}

      {/* Horizontal divider for Arrival/Departure */}
      {isArrivalDeparture && room.guests.length > 1 && (
        <View style={[styles.guestDividerLine, { top: 75 * scaleX }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafc',
    borderRadius: 9 * scaleX,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginHorizontal: 7 * scaleX,
    marginBottom: 16 * scaleX,
    position: 'relative',
  },
  priorityBorder: {
    borderColor: '#f92424',
    borderWidth: 1,
  },
  priorityBackground: {
    backgroundColor: 'rgba(249, 36, 36, 0.08)',
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 17 * scaleX,
    paddingHorizontal: 14 * scaleX,
    marginBottom: 8 * scaleX,
  },
  roomBadge: {
    width: 29.348 * scaleX,
    height: 29.348 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomIcon: {
    width: 29.348 * scaleX,
    height: 29.348 * scaleX,
  },
  roomInfo: {
    marginLeft: 8 * scaleX,
  },
  roomNumber: {
    fontSize: 21 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#334866',
  },
  roomType: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#334866',
    marginTop: 2 * scaleX,
  },
  priorityText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#334866',
    marginTop: 24 * scaleX,
  },
  categoryLabel: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#334866',
    marginLeft: 6 * scaleX,
    marginTop: 23 * scaleX,
  },
  chevronContainer: {
    position: 'absolute',
    right: 15 * scaleX,
    top: 29 * scaleX,
  },
  chevronIcon: {
    width: 7 * scaleX,
    height: 14 * scaleX,
  },
  guestContainer: {
    paddingHorizontal: 14 * scaleX,
  },
  staffStatusContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  dividerVertical: {
    position: 'absolute',
    left: 227 * scaleX,
    top: 11 * scaleX,
    width: 1,
    height: 50.5 * scaleX,
    backgroundColor: '#e3e3e3',
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: '#e3e3e3',
    marginVertical: 12 * scaleX,
  },
  guestDividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e3e3e3',
  },
});

