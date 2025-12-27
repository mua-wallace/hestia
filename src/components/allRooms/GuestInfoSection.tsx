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
  // Determine card type characteristics
  const isArrival = category === 'Arrival';
  const isDeparture = category === 'Departure';
  const isStayover = category === 'Stayover';
  const isTurndown = category === 'Turndown';
  
  // Determine which guest icon to use based on card category
  let guestIconSource;
  if (isArrivalDeparture) {
    guestIconSource = guest.timeLabel === 'ETA' 
      ? require('../../../assets/icons/guest-arrival-icon.png')
      : require('../../../assets/icons/guest-departure-icon.png');
  } else if (isArrival || isStayover || isTurndown) {
    guestIconSource = require('../../../assets/icons/guest-arrival-icon.png');
  } else if (isDeparture) {
    guestIconSource = require('../../../assets/icons/guest-departure-icon.png');
  } else {
    guestIconSource = require('../../../assets/icons/guest-icon.png');
  }
  
  // Determine container left position - reusable logic
  // Turndown uses same as cards with notes, Stayover uses standard
  const containerLeft = isPriority 
    ? GUEST_INFO.container.left 
    : hasNotes || isTurndown
      ? GUEST_INFO.containerWithNotes.left 
      : GUEST_INFO.containerStandard.left;

  // Determine name top position - consolidated logic
  // Stayover: like Departure, Turndown: like Arrival with notes
  const nameTop = isPriority
    ? (isSecondGuest ? GUEST_INFO.nameSecond.top : GUEST_INFO.name.top)
    : hasNotes || isTurndown
      ? GUEST_INFO.nameWithNotes.top
      : isStayover
        ? GUEST_INFO.nameStandard.top // Stayover: like Departure
        : isArrival
          ? GUEST_INFO.nameStandardArrival.top // Arrival
          : GUEST_INFO.nameStandard.top; // Departure

  // Determine date range top position - consolidated logic
  // Stayover: like Departure, Turndown: like Arrival with notes
  const dateTop = isPriority
    ? (isSecondGuest ? GUEST_INFO.dateRangeSecond.top : GUEST_INFO.dateRange.top)
    : hasNotes || isTurndown
      ? GUEST_INFO.dateRangeWithNotes.top
      : isStayover
        ? GUEST_INFO.dateRangeStandard.top // Stayover: like Departure
        : isArrival
          ? GUEST_INFO.dateRangeStandardArrival.top // Arrival
          : GUEST_INFO.dateRangeStandard.top; // Departure

  // Determine time (ETA/EDT) position - consolidated logic
  // Stayover: like Departure (no time), Turndown: like Arrival with notes
  const timePos: { left: number; top: number } | null = isPriority
    ? (isSecondGuest ? GUEST_INFO.time.positions.prioritySecond : GUEST_INFO.time.positions.priorityFirst)
    : hasNotes || isTurndown
      ? GUEST_INFO.time.positions.withNotes
      : isStayover
        ? null // Stayover: like Departure (no time)
        : isArrival
          ? GUEST_INFO.time.positions.standardArrival // Arrival
          : null; // Departure cards don't show time

  // Determine guest count position - consolidated logic
  // Stayover: like Departure, Turndown: like Arrival with notes
  const countPos: { iconLeft: number; textLeft: number; top?: number; iconTop?: number; textTop?: number } = isPriority
    ? (isSecondGuest ? GUEST_INFO.guestCount.positions.prioritySecond : GUEST_INFO.guestCount.positions.priorityFirst)
    : hasNotes || isTurndown
      ? GUEST_INFO.guestCount.positions.withNotes
      : isStayover
        ? GUEST_INFO.guestCount.positions.standardDeparture // Stayover: like Departure
        : isArrival
          ? GUEST_INFO.guestCount.positions.standardArrival // Arrival
          : GUEST_INFO.guestCount.positions.standardDeparture; // Departure

  // Priority badge positioning - consolidated logic
  const priorityBadgeLeft = isPriority 
    ? (isSecondGuest ? 152 : 182)
    : GUEST_INFO.priorityBadge.positions.standard.left;
  const priorityBadgeTop = isPriority
    ? (isSecondGuest ? 164 : 89)
    : GUEST_INFO.priorityBadge.positions.standard.top;

  // Determine guest icon absolute positioning - consolidated logic
  // Stayover: like Departure, Turndown: like Arrival with notes
  let guestIconPos: { left: number; top: number } | null = null;
  if (isArrivalDeparture && isPriority) {
    guestIconPos = isSecondGuest
      ? GUEST_INFO.iconArrivalDeparture.positions.secondGuest
      : GUEST_INFO.iconArrivalDeparture.positions.firstGuest;
  } else if ((isDeparture || isStayover) && !isPriority && !hasNotes) {
    // Stayover: like Departure - icon positioned absolutely
    guestIconPos = {
      left: GUEST_INFO.iconStandardDeparture.left,
      top: GUEST_INFO.iconStandardDeparture.top,
    };
  } else if (hasNotes || isTurndown) {
    // Turndown: like Arrival with notes - icon positioned absolutely
    guestIconPos = {
      left: GUEST_INFO.iconWithNotes.left,
      top: GUEST_INFO.iconWithNotes.top,
    };
  }

  // Determine icon tint color - preserve original colors for arrival/departure icons
  const iconTintColor: string | undefined = (isArrivalDeparture || isArrival || isDeparture || isStayover || isTurndown)
    ? undefined // Preserve original icon colors
    : '#334866'; // Default color for other icons
  
  return (
    <View style={[styles.container, { left: containerLeft * scaleX }]}>
      {/* Guest Icon - positioned absolutely for Arrival/Departure priority cards, standard Departure cards, and cards with notes */}
      {guestIconPos !== null ? (
        <Image
          source={guestIconSource}
          style={[
            styles.guestIconAbsolute,
            { 
              // Position relative to container: icon position relative to card - containerLeft
              // Arrival/Departure: First guest: left=17-73=-56px, top=88px; Second guest: left=18-73=-55px, top=173px
              // Standard Departure: left=17-73=-56px, top=93px
              // With notes: left=14-70=-56px, top=89px
              left: (guestIconPos.left - containerLeft) * scaleX,
              top: guestIconPos.top * scaleX,
              tintColor: iconTintColor, // Apply tint color (green for arrival, red for departure, or undefined to preserve original)
            },
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
              // Remove tintColor for arrival/departure/stayover/turndown icons to preserve their original colors
              (isArrival || isDeparture || isStayover || isTurndown) && styles.guestIconNoTint
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

