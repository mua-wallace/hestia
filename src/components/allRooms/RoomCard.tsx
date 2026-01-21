import React, { forwardRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { scaleX } from '../../constants/allRoomsStyles';
import type { RoomCardData } from '../../types/allRooms.types';
import { CATEGORY_ICONS, STATUS_CONFIGS } from '../../types/allRooms.types';
import type { ShiftType } from '../../types/home.types';
import {
  CARD_DIMENSIONS,
  CARD_COLORS,
  ROOM_HEADER,
  GUEST_INFO,
  GUEST_CONTAINER_BG,
  STAFF_SECTION,
  DIVIDERS,
  STATUS_BUTTON,
} from '../../constants/allRoomsStyles';
import GuestInfoSection from './GuestInfoSection';
import StaffSection from './StaffSection';
import StatusButton from './StatusButton';
import NotesSection from './NotesSection';

/**
 * RoomCard Component
 * 
 * A reusable card component for displaying room information in the All Rooms screen.
 * Supports all room categories:
 * - Arrival/Departure: Shows two guests with divider (292px height)
 * - Departure: Single guest, no ETA (177px height)
 * - Arrival: Single guest with ETA (185px height)
 * - Stayover: Single guest with ETA (185px height)
 * - Turndown: Single guest with ETA (185px height)
 * 
 * Cards with notes have a height of 222px.
 * All positioning and styling matches Figma design specifications.
 */
interface RoomCardProps {
  room: RoomCardData;
  onPress: () => void;
  onStatusPress: () => void;
  onLayout?: (event: any) => void; // Optional layout handler for position tracking
  statusButtonRef?: (ref: any) => void; // Ref callback for status button
  selectedShift?: ShiftType;
}

const RoomCard = forwardRef<TouchableOpacity, RoomCardProps>(({ room, onPress, onStatusPress, onLayout, statusButtonRef, selectedShift }, ref) => {
  // Card type detection
  const isArrivalDeparture = room.category === 'Arrival/Departure';
  const isDeparture = room.category === 'Departure';
  const isArrival = room.category === 'Arrival';
  const isStayover = room.category === 'Stayover';
  const isTurndown = room.category === 'Turndown';
  const isVacant = room.guests?.[0]?.isVacant === true;
  const isVacantTurndown = isTurndown && isVacant;
  const hasNotes = !!room.notes;
  const isPM = selectedShift === 'PM';

  // Calculate card height based on type - matching Figma exactly
  const getCardHeight = (): number => {
    if (isArrivalDeparture) {
      return CARD_DIMENSIONS.heights.arrivalDeparture * scaleX; // 292px
    }
    if (hasNotes) {
      return CARD_DIMENSIONS.heights.withNotes * scaleX; // 222px
    }
    if (isDeparture) {
      return CARD_DIMENSIONS.heights.standard * scaleX; // 177px
    }
    // Arrival, Stayover, Turndown use 185px
    return CARD_DIMENSIONS.heights.withGuestInfo * scaleX; // 185px
  };

  // Determine card background and border - based on status and PM mode
  const getCardStyles = () => {
    const isInProgress = room.status === 'InProgress';
    const isPM = selectedShift === 'PM';
    
    if (isPM) {
      return {
        backgroundColor: isInProgress 
          ? '#4A4D59' // Darker gray for PM priority
          : '#3A3D49', // Dark gray for PM mode
        borderColor: '#4A4D59', // Darker border for PM mode
        borderWidth: 1,
      };
    }
    
    return {
      backgroundColor: isInProgress 
        ? CARD_COLORS.priorityBackground 
        : CARD_COLORS.background,
      borderColor: isInProgress 
        ? CARD_COLORS.priorityBorder 
        : CARD_COLORS.border,
      borderWidth: 1,
    };
  };

  // Determine guest container background style
  // Note: Arrival, Stayover, and Turndown all use the same positioning (height: 100, top: 74)
  // Departure uses different positioning (height: 101, top: 70)
  const getGuestContainerBgStyle = () => {
    if (isArrivalDeparture || hasNotes) {
      return null; // No background for Arrival/Departure or cards with notes
    }
    if (isDeparture) {
      return styles.guestContainerBgDeparture;
    }
    // Arrival, Stayover, Turndown all use the same positioning from constants
    return styles.guestContainerBgArrival;
  };

  const cardStyles = getCardStyles();
  const guestContainerBgStyle = getGuestContainerBgStyle();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.container,
        {
          height: getCardHeight(),
          ...cardStyles,
        },
      ]}
      onPress={onPress}
      onLayout={onLayout}
      activeOpacity={0.7}
    >
      {/* Room Header Section */}
      <View style={styles.roomHeader}>
        {/* Category Icon Badge */}
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
        
        {/* Room Number */}
        <View style={[
          styles.roomInfo,
          !room.isPriority && styles.roomInfoStandard
        ]}>
          <Text style={[
            styles.roomNumber,
            selectedShift === 'PM' && styles.roomNumberPM
          ]}>
            {room.roomNumber}
          </Text>
        </View>
        
        {/* Room Type (e.g., "ST2K - 1.4") */}
        <Text style={[
          styles.roomType,
          !room.isPriority && styles.roomTypeStandard,
          selectedShift === 'PM' && styles.roomTypePM
        ]}>
          {room.roomType}
        </Text>
        
        {/* Category Label (e.g., "Arrival", "Departure", etc.) */}
        <Text style={[
          styles.categoryLabel,
          !room.isPriority && styles.categoryLabelStandard,
          selectedShift === 'PM' && styles.categoryLabelPM
        ]}>
          {room.category}
        </Text>
      </View>

      {/* Guest Container Background - for standard cards without notes */}
      {guestContainerBgStyle && (
        <View style={[styles.guestContainerBg, guestContainerBgStyle]} />
      )}

      {/* Horizontal divider between guests for Arrival/Departure cards - render FIRST so it's below guest names */}
      {isArrivalDeparture && (
        <View style={styles.guestDividerLine} />
      )}

      {/* Guest Information Sections or Vacant row */}
      {isVacantTurndown ? (
        <View
          style={[
            styles.vacantRowContainer,
            {
              top: GUEST_CONTAINER_BG.positions.turndown.top * scaleX,
              left: GUEST_CONTAINER_BG.left * scaleX,
              width: GUEST_CONTAINER_BG.width * scaleX,
              height: GUEST_CONTAINER_BG.positions.turndown.height * scaleX,
            },
          ]}
        >
          <View style={styles.vacantLeft}>
            <Image
              source={require('../../../assets/icons/vacant-chair.png')}
              style={[
                styles.vacantIcon,
                isPM && styles.vacantIconPM,
              ]}
              resizeMode="contain"
            />
            <Text
              style={styles.vacantText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Vacant
            </Text>
          </View>
          {STATUS_CONFIGS[room.status]?.icon && (
            <TouchableOpacity
              onPress={onStatusPress}
              activeOpacity={0.8}
              style={styles.vacantStatusButton}
            >
              <Image
                source={STATUS_CONFIGS[room.status].icon}
                style={styles.vacantStatusIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        room.guests.map((guest, index) => {
          const isFirstGuest = index === 0;
          const isSecondGuest = index === 1;
          
          // Determine priority count for each guest
          const guestPriorityCount = isArrivalDeparture
            ? (isFirstGuest ? room.priorityCount : room.secondGuestPriorityCount)
            : (isFirstGuest ? room.priorityCount : undefined);
          
          return (
            <GuestInfoSection 
              key={`guest-${index}`}
              guest={guest} 
              priorityCount={guestPriorityCount}
              isPriority={room.isPriority}
              isFirstGuest={isFirstGuest}
              isSecondGuest={isSecondGuest}
              hasNotes={hasNotes}
              category={room.category}
              isArrivalDeparture={isArrivalDeparture}
              selectedShift={selectedShift}
            />
          );
        })
      )}

      {/* Vertical Divider - separates room info from staff section */}
      <View style={[
        styles.dividerVertical,
        !room.isPriority && styles.dividerVerticalStandard
      ]} />

      {/* Staff Section */}
      <StaffSection 
        staff={room.staff} 
        isPriority={room.isPriority} 
        category={room.category}
        selectedShift={selectedShift}
      />

      {/* Status Button */}
      {!isVacantTurndown && (
        <StatusButton 
          ref={statusButtonRef}
          status={room.status} 
          onPress={onStatusPress}
          isPriority={room.isPriority}
          isArrivalDeparture={isArrivalDeparture}
          hasNotes={hasNotes}
        />
      )}

      {/* Notes Section - shown for cards with notes */}
      {hasNotes && (
        <NotesSection 
          notes={room.notes} 
          isArrivalDeparture={isArrivalDeparture} 
        />
      )}
    </TouchableOpacity>
  );
});

export default RoomCard;

const styles = StyleSheet.create({
  container: {
    // backgroundColor is set dynamically based on status
    borderRadius: CARD_DIMENSIONS.borderRadius * scaleX,
    // borderWidth and borderColor are set dynamically based on status
    marginHorizontal: CARD_DIMENSIONS.marginHorizontal * scaleX,
    marginBottom: CARD_DIMENSIONS.marginBottom * scaleX,
    position: 'relative',
    width: CARD_DIMENSIONS.width * scaleX,
    overflow: 'visible', // Changed to visible to prevent clipping guest names
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
  roomNumberPM: {
    color: colors.text.white,
  },
  roomTypePM: {
    color: colors.text.white,
  },
  categoryLabelPM: {
    color: colors.text.white,
  },
  guestDividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 75 * scaleX, // Room 201: divider between two guests at top-[75px]
    height: DIVIDERS.horizontal.height,
    backgroundColor: DIVIDERS.horizontal.color,
    zIndex: 1, // Lowest z-index - below all guest info elements
    elevation: 1, // Android elevation - lowest
  },
  vacantRowContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16 * scaleX,
    width: '100%',
  },
  vacantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  vacantIcon: {
    width: GUEST_INFO.icon.width * scaleX,
    height: GUEST_INFO.icon.height * scaleX,
    tintColor: undefined,
  },
  vacantIconPM: {
    tintColor: '#ffffff',
  },
  vacantText: {
    marginLeft: 6 * scaleX,
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: '700',
    color: '#FFF',
    lineHeight: undefined, // normal line height
    flexShrink: 1,
  },
  vacantStatusButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacantStatusIcon: {
    width: STATUS_BUTTON.iconInProgress.width * scaleX,
    height: STATUS_BUTTON.iconInProgress.height * scaleX,
  },
});

