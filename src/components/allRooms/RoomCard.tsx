import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { scaleX } from '../../constants/allRoomsStyles';
import type { RoomCardData } from '../../types/allRooms.types';
import { CATEGORY_ICONS } from '../../types/allRooms.types';
import {
  CARD_DIMENSIONS,
  CARD_COLORS,
  ROOM_HEADER,
  GUEST_INFO,
  GUEST_CONTAINER_BG,
  STAFF_SECTION,
  DIVIDERS,
} from '../../constants/allRoomsStyles';
import GuestInfoSection from './GuestInfoSection';
import StaffSection from './StaffSection';
import StatusButton from './StatusButton';
import NotesSection from './NotesSection';

interface RoomCardProps {
  room: RoomCardData;
  onPress: () => void;
  onStatusPress: () => void;
  onLayout?: (event: any) => void; // Optional layout handler for position tracking
}

const RoomCard = forwardRef<TouchableOpacity, RoomCardProps>(({ room, onPress, onStatusPress, onLayout }, ref) => {
  const isArrivalDeparture = room.category === 'Arrival/Departure';
  // Calculate height based on card type and notes - matching Figma exactly
  let cardHeight: number;
  if (isArrivalDeparture) {
    cardHeight = CARD_DIMENSIONS.heights.arrivalDeparture * scaleX; // 292px
  } else if (room.notes) {
    cardHeight = CARD_DIMENSIONS.heights.withNotes * scaleX; // 222px
  } else {
    // Standard cards: Arrival, Stayover, Turndown use 185px, Departure uses 177px
    cardHeight = room.category === 'Departure' 
      ? CARD_DIMENSIONS.heights.standard * scaleX // 177px
      : CARD_DIMENSIONS.heights.withGuestInfo * scaleX; // 185px
  }

  // Determine card background color - exact match to Figma design
  const getCardBackgroundColor = (): string => {
    // Priority cards use light pink/reddish background (rgba(249,36,36,0.08))
    if (room.isPriority) {
      return CARD_COLORS.priorityBackground;
    }
    // All other cards use default white/light gray background (#f9fafc)
    return CARD_COLORS.background;
  };

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.container,
        { 
          height: cardHeight,
          backgroundColor: getCardBackgroundColor(),
        },
        room.isPriority && styles.priorityBorder,
      ]}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.7}
    >
      {/* Room Header */}
      <View style={styles.roomHeader}>
        {/* Room number badge with icon */}
        <View style={[
          styles.roomBadge,
          !room.isPriority && styles.roomBadgeStandard,
          isArrivalDeparture && styles.roomBadgeArrivalDeparture
        ]}>
          <Image
            source={CATEGORY_ICONS[room.category]}
            style={[
              styles.roomIcon,
              isArrivalDeparture && styles.roomIconArrivalDeparture
            ]}
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
        </View>
        
        {/* Room Type - positioned absolutely */}
        <Text style={[
          styles.roomType,
          !room.isPriority && styles.roomTypeStandard
        ]}>{room.roomType}</Text>
        
        <Text style={[
          styles.categoryLabel,
          !room.isPriority && styles.categoryLabelStandard
        ]}>{room.category}</Text>
      </View>

      {/* Guest Container Background - only for standard cards without notes, not Arrival/Departure */}
      {!isArrivalDeparture && !room.notes && (
        <View style={[
          styles.guestContainerBg,
          room.category === 'Departure' ? styles.guestContainerBgDeparture : styles.guestContainerBgArrival,
        ]} />
      )}

      {/* Guest Information Sections - positioned absolutely */}
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
              hasNotes={!!room.notes}
              category={room.category}
              isArrivalDeparture={isArrivalDeparture}
            />
            {/* Horizontal divider for Arrival/Departure between guests */}
            {isArrivalDeparture && index === 0 && (
              <View style={styles.guestDividerLine} />
            )}
          </React.Fragment>
        );
      })}

      {/* Vertical Divider */}
      <View style={[
        styles.dividerVertical,
        !room.isPriority && styles.dividerVerticalStandard
      ]} />

      {/* Staff Section - positioned absolutely */}
      <StaffSection staff={room.staff} isPriority={room.isPriority} category={room.category} />

      {/* Status Button - positioned absolutely */}
      <StatusButton 
        status={room.status} 
        onPress={onStatusPress}
        isPriority={room.isPriority}
        isArrivalDeparture={isArrivalDeparture}
        hasNotes={!!room.notes}
      />

      {/* Notes Section (if applicable) - positioned absolutely */}
      {room.notes && (
        <NotesSection notes={room.notes} isArrivalDeparture={isArrivalDeparture} />
      )}
    </TouchableOpacity>
  );
});

export default RoomCard;

const styles = StyleSheet.create({
  container: {
    // backgroundColor is set dynamically based on status
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
  roomBadgeArrivalDeparture: {
    width: ROOM_HEADER.iconArrivalDeparture.width * scaleX,
    height: ROOM_HEADER.iconArrivalDeparture.height * scaleX,
  },
  roomBadgeStandard: {
    left: ROOM_HEADER.iconStandard.left * scaleX,
  },
  roomIcon: {
    width: ROOM_HEADER.icon.width * scaleX,
    height: ROOM_HEADER.icon.height * scaleX,
  },
  roomIconArrivalDeparture: {
    width: ROOM_HEADER.iconArrivalDeparture.width * scaleX,
    height: ROOM_HEADER.iconArrivalDeparture.height * scaleX,
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
    position: 'absolute',
    fontSize: ROOM_HEADER.roomType.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_HEADER.roomType.color,
    lineHeight: ROOM_HEADER.roomType.lineHeight * scaleX,
    left: ROOM_HEADER.roomType.left * scaleX, // 111px for priority
    top: ROOM_HEADER.roomType.top * scaleX, // 22px
  },
  roomTypeStandard: {
    left: ROOM_HEADER.roomTypeStandard.left * scaleX, // 118px for standard
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
  guestContainerBg: {
    position: 'absolute',
    left: GUEST_CONTAINER_BG.left * scaleX,
    width: GUEST_CONTAINER_BG.width * scaleX,
    borderRadius: GUEST_CONTAINER_BG.borderRadius * scaleX,
    backgroundColor: GUEST_CONTAINER_BG.background,
  },
  guestContainerBgDeparture: {
    height: GUEST_CONTAINER_BG.positions.departure.height * scaleX,
    top: GUEST_CONTAINER_BG.positions.departure.top * scaleX,
  },
  guestContainerBgArrival: {
    height: GUEST_CONTAINER_BG.positions.arrival.height * scaleX,
    top: GUEST_CONTAINER_BG.positions.arrival.top * scaleX,
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
    top: (STAFF_SECTION.dividerStandard.top ?? STAFF_SECTION.divider.top) * scaleX,
  },
  guestDividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 75 * scaleX, // Room 201: divider between two guests at top-[75px]
    height: DIVIDERS.horizontal.height,
    backgroundColor: DIVIDERS.horizontal.color,
  },
});

