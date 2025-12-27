import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { scaleX } from '../../constants/allRoomsStyles';
import type { GuestInfo } from '../../types/allRooms.types';
import { GUEST_INFO } from '../../constants/allRoomsStyles';

interface GuestInfoSectionProps {
  guest: GuestInfo;
  priorityCount?: number;
  isPriority?: boolean;
  isFirstGuest?: boolean;
  isSecondGuest?: boolean;
  hasNotes?: boolean;
  category?: string; // To determine if it's Arrival vs Departure
  isArrivalDeparture?: boolean; // To know if this is an Arrival/Departure card
}

export default function GuestInfoSection({ 
  guest, 
  priorityCount, 
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
  hasNotes = false,
  category = '',
  isArrivalDeparture = false,
}: GuestInfoSectionProps) {
  const isArrival = category === 'Arrival';
  const isDeparture = category === 'Departure';
  
  // Determine which guest icon to use
  // For Arrival/Departure cards: use guest-arrival-icon for ETA guests, guest-departure-icon for EDT guests
  // For regular Arrival cards: use guest-arrival-icon
  // For regular Departure cards: use guest-departure-icon
  // For other cards: use guest-icon (fallback)
  let guestIconSource;
  if (isArrivalDeparture) {
    guestIconSource = guest.timeLabel === 'ETA' 
      ? require('../../../assets/icons/guest-arrival-icon.png')
      : require('../../../assets/icons/guest-departure-icon.png');
  } else if (isArrival) {
    guestIconSource = require('../../../assets/icons/guest-arrival-icon.png');
  } else if (isDeparture) {
    guestIconSource = require('../../../assets/icons/guest-departure-icon.png');
  } else {
    guestIconSource = require('../../../assets/icons/guest-icon.png');
  }
  
  // Determine container left position
  // For Arrival/Departure cards, both guests should use the same left position
  let containerLeft: number;
  if (isPriority) {
    containerLeft = GUEST_INFO.container.left; // 73px - same for both guests in Arrival/Departure
  } else if (hasNotes) {
    containerLeft = GUEST_INFO.containerWithNotes.left; // 70px
  } else {
    containerLeft = GUEST_INFO.containerStandard.left; // 73px
  }

  // Determine name top position
  let nameTop: number;
  if (isPriority) {
    nameTop = isSecondGuest ? GUEST_INFO.nameSecond.top : GUEST_INFO.name.top;
  } else if (hasNotes) {
    nameTop = GUEST_INFO.nameWithNotes.top;
  } else if (isArrival) {
    nameTop = GUEST_INFO.nameStandardArrival.top; // 87px for Arrival cards
  } else {
    nameTop = GUEST_INFO.nameStandard.top; // 92px for Departure cards
  }

  // Determine date range top position
  let dateTop: number;
  if (isPriority) {
    dateTop = isSecondGuest ? GUEST_INFO.dateRangeSecond.top : GUEST_INFO.dateRange.top;
  } else if (hasNotes) {
    dateTop = GUEST_INFO.dateRangeWithNotes.top;
  } else if (isArrival) {
    dateTop = GUEST_INFO.dateRangeStandardArrival.top; // 109px for Arrival cards
  } else {
    dateTop = GUEST_INFO.dateRangeStandard.top; // 114px for Departure cards
  }

  // Determine time (ETA/EDT) position - exact from Figma
  // For Departure cards, only show time if it's EDT (not ETA)
  let timePos: { left: number; top: number } | null = null;
  if (isPriority) {
    timePos = isSecondGuest 
      ? GUEST_INFO.time.positions.prioritySecond 
      : GUEST_INFO.time.positions.priorityFirst;
  } else if (hasNotes) {
    timePos = GUEST_INFO.time.positions.withNotes; // Room 203: left-[158px] top-[103px]
  } else if (isArrival) {
    timePos = GUEST_INFO.time.positions.standardArrival; // Room 204/205: left-[161px] top-[110px]
  } else if (isDeparture) {
    // Departure cards: don't show EDT time
    timePos = null;
  }

  // Determine guest count position
  let countPos: { iconLeft: number; textLeft: number; top?: number; iconTop?: number; textTop?: number };
  if (isPriority) {
    countPos = isSecondGuest 
      ? GUEST_INFO.guestCount.positions.prioritySecond 
      : GUEST_INFO.guestCount.positions.priorityFirst;
  } else if (hasNotes) {
    countPos = GUEST_INFO.guestCount.positions.withNotes;
  } else if (isArrival) {
    countPos = GUEST_INFO.guestCount.positions.standardArrival; // For Arrival cards
  } else {
    countPos = GUEST_INFO.guestCount.positions.standardDeparture; // For Departure cards
  }

  // Priority badge positioning from Figma
  const priorityBadgeLeft = isPriority 
    ? (isSecondGuest ? 152 : 182) // Room 201: first guest 182px, second guest 152px
    : 185; // Room 203: 185px relative to card
  const priorityBadgeTop = isPriority
    ? (isSecondGuest ? 164 : 89) // Room 201: first guest 89px, second guest 164px
    : 82; // Room 203: 853-771=82px relative to card

  // For Arrival/Departure priority cards and standard Departure cards, guest icons are positioned absolutely
  // Get exact positions from Figma
  let guestIconPos: { left: number; top: number } | null = null;
  if (isArrivalDeparture && isPriority) {
    guestIconPos = isSecondGuest
      ? GUEST_INFO.iconArrivalDeparture.positions.secondGuest
      : GUEST_INFO.iconArrivalDeparture.positions.firstGuest;
  } else if (isDeparture && !isPriority && !hasNotes) {
    // Standard Departure cards: icon positioned absolutely
    guestIconPos = {
      left: GUEST_INFO.iconStandardDeparture.left,
      top: GUEST_INFO.iconStandardDeparture.top,
    };
  }
  
  return (
    <View style={[styles.container, { left: containerLeft * scaleX }]}>
      {/* Guest Icon - positioned absolutely for Arrival/Departure priority cards and standard Departure cards */}
      {guestIconPos !== null ? (
        <Image
          source={guestIconSource}
          style={[
            // Use larger icon size (same as Arrival/Departure) for departure cards
            styles.guestIconAbsolute,
            { 
              // Position relative to container: icon position relative to card - containerLeft
              // Arrival/Departure: First guest: left=17-73=-56px, top=88px; Second guest: left=18-73=-55px, top=173px
              // Standard Departure: left=17-73=-56px, top=93px
              left: (guestIconPos.left - containerLeft) * scaleX,
              top: guestIconPos.top * scaleX,
            },
            // Remove tintColor for arrival/departure icons to preserve their original colors
            styles.guestIconNoTint
          ]}
          resizeMode="contain"
        />
      ) : null}
      
      {/* Guest Name - for Arrival/Departure, name starts at left: 0 (which is containerLeft = 73px relative to card) */}
      {/* For other cards, icon is in the guestRow with the name */}
      <View style={[styles.guestRow, { top: nameTop * scaleX }]}>
        {guestIconPos === null && (
          <Image
            source={guestIconSource}
            style={[
              styles.guestIcon,
              // Remove tintColor for arrival/departure icons to preserve their original colors
              (isArrival || isDeparture) && styles.guestIconNoTint
            ]}
            resizeMode="contain"
          />
        )}
        <View style={[styles.guestNameContainer, guestIconPos !== null && styles.guestNameContainerNoIcon]}>
          <Text style={styles.guestName} numberOfLines={1} ellipsizeMode="tail">
            {guest.name}
          </Text>
        </View>
      </View>
      
      {/* Priority Badge - positioned absolutely relative to card */}
      {priorityCount ? (
        <Text style={[
          styles.priorityCount, 
          { 
            left: (priorityBadgeLeft - containerLeft) * scaleX,
            top: priorityBadgeTop * scaleX,
          }
        ]}>
          {priorityCount}
        </Text>
      ) : null}

      {/* Date Range */}
      <View style={[styles.detailsRow, { top: dateTop * scaleX }]}>
        <Text style={styles.dateRange}>{guest.dateRange}</Text>
      </View>

      {/* Time (ETA/EDT) - positioned using exact Figma values */}
      {guest.timeLabel && guest.time && timePos && (
        <Text style={[
          styles.time, 
          { 
            // Time positions in constants are relative to card
            // Container has left offset, so subtract containerLeft to position relative to container
            // Room 204: ETA at left-[161px] relative to card, container at left-[80px]
            // So ETA relative to container: 161 - 80 = 81px
            left: ((timePos.left ?? 0) - containerLeft) * scaleX,
            // Use exact top position from Figma (relative to card)
            // Room 204: ETA at top-[1134px] relative to card (1134-1024=110px)
            // Room 203: ETA at top-[874px] relative to card (874-771=103px)
            top: (timePos.top ?? 0) * scaleX,
          }
        ]}>
          {guest.timeLabel}: {guest.time}
        </Text>
      )}

      {/* Guest Count */}
      {countPos && (
        <>
          <Image
            source={require('../../../assets/icons/people-icon.png')}
            style={[
              styles.countIcon, 
              { 
                left: ((countPos.iconLeft ?? 0) - containerLeft) * scaleX,
                top: ((countPos.iconTop ?? countPos.top ?? 0)) * scaleX,
              }
            ]}
            resizeMode="contain"
          />
          <Text style={[
            styles.countText, 
            { 
              left: ((countPos.textLeft ?? 0) - containerLeft) * scaleX,
              top: ((countPos.textTop ?? countPos.top ?? 0)) * scaleX,
            }
          ]}>
            {guest.guestCount || ''}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
  },
  guestRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top for vertical alignment with header icon
    left: 0,
    width: 200 * scaleX, // Fixed width to prevent text overflow
  },
  guestIcon: {
    width: GUEST_INFO.icon.width * scaleX,
    height: GUEST_INFO.icon.height * scaleX,
    marginRight: 8 * scaleX, // Proper spacing between icon and text
    marginTop: 0, // Align icon top with text baseline
    tintColor: '#334866',
  },
  guestIconAbsolute: {
    position: 'absolute',
    width: GUEST_INFO.iconArrivalDeparture.width * scaleX,
    height: GUEST_INFO.iconArrivalDeparture.height * scaleX,
    tintColor: '#334866',
  },
  guestIconNoTint: {
    tintColor: undefined, // Remove tint to preserve original icon colors (green/red arrows)
  },
  guestNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  guestNameContainerNoIcon: {
    marginLeft: 0, // No margin when icon is positioned separately
  },
  guestName: {
    fontSize: GUEST_INFO.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: GUEST_INFO.name.color,
    lineHeight: GUEST_INFO.name.lineHeight * scaleX,
  },
  priorityCount: {
    position: 'absolute',
    fontSize: GUEST_INFO.priorityBadge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.priorityBadge.color,
    lineHeight: GUEST_INFO.priorityBadge.lineHeight * scaleX,
  },
  detailsRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
  },
  dateRange: {
    fontSize: GUEST_INFO.dateRange.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.dateRange.color,
    lineHeight: GUEST_INFO.dateRange.lineHeight * scaleX,
  },
  time: {
    position: 'absolute',
    fontSize: GUEST_INFO.time.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: GUEST_INFO.time.color,
    lineHeight: GUEST_INFO.time.lineHeight * scaleX,
  },
  countIcon: {
    position: 'absolute',
    width: GUEST_INFO.guestCount.icon.width * scaleX,
    height: GUEST_INFO.guestCount.icon.height * scaleX,
    // top is set inline
    tintColor: '#334866',
  },
  countText: {
    position: 'absolute',
    fontSize: GUEST_INFO.guestCount.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.guestCount.color,
    lineHeight: GUEST_INFO.guestCount.lineHeight * scaleX,
    // top is set inline
  },
});

