import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { RoomCardData, CATEGORY_ICONS } from '../../types/allRooms.types';
import GuestInfoSection from './GuestInfoSection';
import StaffSection from './StaffSection';
import StatusButton from './StatusButton';
import NotesSection from './NotesSection';
import {
  scaleX,
  CARD_DIMENSIONS,
  CARD_COLORS,
  ROOM_HEADER,
  GUEST_INFO,
  GUEST_CONTAINER_BG,
  STAFF_SECTION,
  DIVIDERS,
} from '../../constants/allRoomsStyles';

interface RoomCardProps {
  room: RoomCardData;
  onPress: () => void;
  onStatusPress: () => void;
}

export default function RoomCard({ room, onPress, onStatusPress }: RoomCardProps) {
  const isArrivalDeparture = room.category === 'Arrival/Departure';
  // Calculate height based on card type and notes
  let cardHeight = CARD_DIMENSIONS.heights.standard * scaleX;
  if (isArrivalDeparture) {
    cardHeight = CARD_DIMENSIONS.heights.arrivalDeparture * scaleX;
  } else if (room.notes) {
    cardHeight = CARD_DIMENSIONS.heights.withNotes * scaleX;
  } else if (room.guests.length === 1) {
    cardHeight = CARD_DIMENSIONS.heights.standard * scaleX;
  }

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
        <View style={[
          styles.roomBadge,
          !room.isPriority && styles.roomBadgeStandard
        ]}>
          <Image
            source={CATEGORY_ICONS[room.category]}
            style={styles.roomIcon}
            resizeMode="contain"
          />
        </View>
        
        <View style={[
          styles.roomInfo,
          !room.isPriority && styles.roomInfoStandard
        ]}>
          <View style={styles.roomNumberRow}>
            <Text style={styles.roomNumber}>{room.roomNumber}</Text>
          </View>
          <Text style={[
            styles.roomType,
            !room.isPriority && styles.roomTypeStandard
          ]}>{room.roomType}</Text>
        </View>
        
        <Text style={[
          styles.categoryLabel,
          !room.isPriority && styles.categoryLabelStandard
        ]}>{room.category}</Text>
        
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
        {/* Guest container background - only for standard cards, not Arrival/Departure */}
        {!isArrivalDeparture && (
          <View style={styles.guestContainerBg} />
        )}
        {room.guests.map((guest, index) => {
          // Determine which priority count to show for each guest
          let guestPriorityCount: number | undefined;
          if (isArrivalDeparture) {
            guestPriorityCount = index === 0 ? room.priorityCount : room.secondGuestPriorityCount;
          } else if (index === 0) {
            guestPriorityCount = room.priorityCount;
          }
          
          return (
            <React.Fragment key={index}>
              <GuestInfoSection 
                guest={guest} 
                priorityCount={guestPriorityCount}
                isPriority={room.isPriority}
                isFirstGuest={index === 0}
                isSecondGuest={index === 1}
              />
              {isArrivalDeparture && index === 0 && <View style={styles.dividerHorizontal} />}
            </React.Fragment>
          );
        })}
      </View>

      {/* Staff Section and Status Button */}
      <View style={styles.staffStatusContainer}>
        <View style={[
          styles.dividerVertical,
          !room.isPriority && styles.dividerVerticalStandard
        ]} />
        <StaffSection staff={room.staff} isPriority={room.isPriority} />
        <StatusButton 
          status={room.status} 
          onPress={onStatusPress}
          isPriority={room.isPriority}
          isArrivalDeparture={isArrivalDeparture}
          hasNotes={!!room.notes}
        />
      </View>

      {/* Notes Section (if applicable) */}
      {room.notes && (
        <NotesSection notes={room.notes} isArrivalDeparture={isArrivalDeparture} />
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
    backgroundColor: CARD_COLORS.background,
    borderRadius: CARD_DIMENSIONS.borderRadius * scaleX,
    borderWidth: 1,
    borderColor: CARD_COLORS.border,
    marginHorizontal: CARD_DIMENSIONS.marginHorizontal * scaleX,
    marginBottom: CARD_DIMENSIONS.marginBottom * scaleX,
    position: 'relative',
    width: CARD_DIMENSIONS.width * scaleX,
  },
  priorityBorder: {
    borderColor: CARD_COLORS.priorityBorder,
    borderWidth: 1,
  },
  priorityBackground: {
    backgroundColor: CARD_COLORS.priorityBackground,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: ROOM_HEADER.paddingTop * scaleX,
    paddingHorizontal: ROOM_HEADER.paddingHorizontal * scaleX,
    marginBottom: 0,
    position: 'relative',
  },
  roomBadge: {
    position: 'absolute',
    width: ROOM_HEADER.icon.width * scaleX,
    height: ROOM_HEADER.icon.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    left: ROOM_HEADER.icon.left * scaleX,
    top: ROOM_HEADER.icon.top * scaleX,
  },
  roomBadgeStandard: {
    left: ROOM_HEADER.iconStandard.left * scaleX,
  },
  roomIcon: {
    width: ROOM_HEADER.icon.width * scaleX,
    height: ROOM_HEADER.icon.height * scaleX,
  },
  roomInfo: {
    position: 'absolute',
    left: ROOM_HEADER.roomNumber.left * scaleX,
    top: ROOM_HEADER.roomNumber.top * scaleX,
  },
  roomInfoStandard: {
    left: ROOM_HEADER.roomNumberStandard.left * scaleX,
  },
  roomNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8 * scaleX,
  },
  roomNumber: {
    fontSize: ROOM_HEADER.roomNumber.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_HEADER.roomNumber.color,
    lineHeight: ROOM_HEADER.roomNumber.lineHeight * scaleX,
  },
  roomType: {
    fontSize: ROOM_HEADER.roomType.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_HEADER.roomType.color,
    lineHeight: ROOM_HEADER.roomType.lineHeight * scaleX,
    marginTop: (ROOM_HEADER.roomType.top - ROOM_HEADER.roomNumber.top) * scaleX,
  },
  roomTypeStandard: {
    marginLeft: (ROOM_HEADER.roomTypeStandard.left - ROOM_HEADER.roomNumberStandard.left) * scaleX,
  },
  priorityTextHeader: {
    fontSize: ROOM_HEADER.priorityBadge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_HEADER.priorityBadge.color,
    lineHeight: ROOM_HEADER.roomType.lineHeight * scaleX,
  },
  categoryLabel: {
    position: 'absolute',
    fontSize: ROOM_HEADER.category.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_HEADER.category.color,
    left: ROOM_HEADER.category.left * scaleX,
    top: ROOM_HEADER.category.top * scaleX,
    lineHeight: ROOM_HEADER.category.lineHeight * scaleX,
  },
  categoryLabelStandard: {
    left: ROOM_HEADER.categoryStandard.left * scaleX,
  },
  chevronContainer: {
    position: 'absolute',
    right: (CARD_DIMENSIONS.width - 401 - ROOM_HEADER.chevron.width) * scaleX, // 401px from left in Figma = 25px from right, minus icon width
    top: ROOM_HEADER.chevron.top * scaleX,
  },
  chevronIcon: {
    width: ROOM_HEADER.chevron.width * scaleX,
    height: ROOM_HEADER.chevron.height * scaleX,
  },
  guestContainer: {
    position: 'relative',
    paddingHorizontal: 0,
    paddingLeft: 0,
    marginTop: 0,
  },
  guestContainerBg: {
    position: 'absolute',
    left: GUEST_CONTAINER_BG.left * scaleX,
    top: GUEST_CONTAINER_BG.top * scaleX,
    width: GUEST_CONTAINER_BG.width * scaleX,
    height: GUEST_CONTAINER_BG.height * scaleX,
    borderRadius: GUEST_CONTAINER_BG.borderRadius * scaleX,
    backgroundColor: GUEST_CONTAINER_BG.background,
  },
  staffStatusContainer: {
    flexDirection: 'row',
    position: 'relative',
    height: 82 * scaleX,
    marginTop: 0,
  },
  dividerVertical: {
    position: 'absolute',
    left: STAFF_SECTION.divider.left * scaleX,
    top: STAFF_SECTION.divider.top * scaleX,
    width: STAFF_SECTION.divider.width,
    height: STAFF_SECTION.divider.height * scaleX,
    backgroundColor: STAFF_SECTION.divider.color,
  },
  dividerVerticalStandard: {
    left: STAFF_SECTION.dividerStandard.left * scaleX,
  },
  dividerHorizontal: {
    height: DIVIDERS.horizontal.height,
    backgroundColor: DIVIDERS.horizontal.color,
    marginVertical: DIVIDERS.horizontal.marginVertical * scaleX,
  },
  guestDividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#e3e3e3',
  },
});

