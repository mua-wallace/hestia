import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { GUEST_INFO } from '../../constants/allRoomsStyles';
import { normalizedScaleX } from '../../utils/responsive';
import type { GuestInfo } from '../../types/allRooms.types';

interface GuestInfoDisplayProps {
  guest: GuestInfo;
  priorityCount?: number;
  numberBadge?: string; // Alternative to priorityCount (for room detail screen)
  isPriority?: boolean;
  isFirstGuest?: boolean;
  isSecondGuest?: boolean;
  hasNotes?: boolean;
  category?: string; // To determine if it's Arrival vs Departure
  isArrivalDeparture?: boolean; // To know if this is an Arrival/Departure card
  // Positioning props for flexible usage
  containerLeft?: number; // Override container left position
  nameTop?: number; // Override name top position
  dateTop?: number; // Override date top position
  // Custom positioning overrides for room detail screen
  iconLeft?: number; // Override icon left position (relative to container)
  iconTop?: number; // Override icon top position (relative to container)
  nameLeft?: number; // Override name left position (relative to container)
  badgeLeft?: number; // Override badge left position (relative to container)
  badgeTop?: number; // Override badge top position (relative to container)
  dateLeft?: number; // Override date left position (relative to container)
  timeLeft?: number; // Override time left position (relative to container)
  timeTop?: number; // Override time top position
  countIconLeft?: number; // Override count icon left position (relative to container)
  countTextLeft?: number; // Override count text left position (relative to container)
  countTop?: number; // Override count top position
  // For absolute positioning contexts (like room detail)
  absolutePositioning?: boolean;
  absoluteTop?: number; // Absolute top position from parent
}

/**
 * Reusable Guest Info Display Component
 * Matches the styling and alignment from All Rooms cards
 * Can be used in Room Detail screen, All Rooms cards, and anywhere else
 */
export default function GuestInfoDisplay({ 
  guest, 
  priorityCount,
  numberBadge,
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
  hasNotes = false,
  category = '',
  isArrivalDeparture = false,
  containerLeft,
  nameTop,
  dateTop,
  iconLeft,
  iconTop,
  nameLeft,
  badgeLeft,
  badgeTop,
  dateLeft,
  timeLeft,
  timeTop,
  countIconLeft,
  countTextLeft,
  countTop,
  absolutePositioning = false,
  absoluteTop,
}: GuestInfoDisplayProps) {
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
  } else if (isStayover) {
    guestIconSource = require('../../../assets/icons/stayover-guest-icon.png');
  } else if (isTurndown) {
    guestIconSource = require('../../../assets/icons/turndown-guest-icon.png');
  } else if (isArrival) {
    guestIconSource = require('../../../assets/icons/guest-arrival-icon.png');
  } else if (isDeparture) {
    guestIconSource = require('../../../assets/icons/guest-departure-icon.png');
  } else {
    guestIconSource = require('../../../assets/icons/guest-icon.png');
  }
  
  // Determine container left position - use override if provided, otherwise calculate
  const calculatedContainerLeft = containerLeft !== undefined
    ? containerLeft
    : isPriority 
      ? GUEST_INFO.container.left 
      : hasNotes || isTurndown || isStayover
        ? GUEST_INFO.containerWithNotes.left 
        : GUEST_INFO.containerStandard.left;

  // Determine name top position - use override if provided, otherwise calculate
  const calculatedNameTop = nameTop !== undefined
    ? nameTop
    : isPriority
      ? (isSecondGuest ? GUEST_INFO.nameSecond.top : GUEST_INFO.name.top)
      : hasNotes || isTurndown || isStayover
        ? GUEST_INFO.nameWithNotes.top
        : isArrival
          ? GUEST_INFO.nameStandardArrival.top
          : GUEST_INFO.nameStandard.top;

  // Determine date range top position - use override if provided, otherwise calculate
  const calculatedDateTop = dateTop !== undefined
    ? dateTop
    : isPriority
      ? (isSecondGuest ? GUEST_INFO.dateRangeSecond.top : GUEST_INFO.dateRange.top)
      : hasNotes || isTurndown || isStayover
        ? GUEST_INFO.dateRangeWithNotes.top
        : isArrival
          ? GUEST_INFO.dateRangeStandardArrival.top
          : GUEST_INFO.dateRangeStandard.top;

  // Determine time (ETA/EDT) position - use override if provided
  const timePos: { left: number; top: number } | null = timeLeft !== undefined && timeTop !== undefined
    ? { left: timeLeft, top: timeTop }
    : isPriority
      ? (isSecondGuest ? GUEST_INFO.time.positions.prioritySecond : GUEST_INFO.time.positions.priorityFirst)
      : hasNotes || isTurndown || isStayover
        ? GUEST_INFO.time.positions.withNotes
        : isArrival
          ? GUEST_INFO.time.positions.standardArrival
          : null; // Departure cards don't show time

  // Determine guest count position - use override if provided
  const countPos: { iconLeft: number; textLeft: number; top?: number; iconTop?: number; textTop?: number } | null = 
    countIconLeft !== undefined && countTextLeft !== undefined
      ? { 
          iconLeft: countIconLeft, 
          textLeft: countTextLeft, 
          top: countTop,
          iconTop: countTop,
          textTop: countTop 
        }
      : isPriority
        ? (isSecondGuest ? GUEST_INFO.guestCount.positions.prioritySecond : GUEST_INFO.guestCount.positions.priorityFirst)
        : hasNotes || isTurndown || isStayover
          ? GUEST_INFO.guestCount.positions.withNotes
          : isArrival
            ? GUEST_INFO.guestCount.positions.standardArrival
            : GUEST_INFO.guestCount.positions.standardDeparture;

  // Priority badge positioning - use override if provided
  const priorityBadgeLeft = badgeLeft !== undefined
    ? badgeLeft
    : isPriority 
      ? (isSecondGuest ? GUEST_INFO.priorityBadge.positions.secondGuest.left : GUEST_INFO.priorityBadge.positions.firstGuest.left)
      : GUEST_INFO.priorityBadge.positions.standard.left;
  const priorityBadgeTop = badgeTop !== undefined
    ? badgeTop
    : isPriority
      ? (isSecondGuest ? GUEST_INFO.priorityBadge.positions.secondGuest.top : GUEST_INFO.priorityBadge.positions.firstGuest.top)
      : GUEST_INFO.priorityBadge.positions.standard.top;

  // Determine guest icon absolute positioning
  // If iconLeft is provided, use it for absolute positioning
  let guestIconPos: { left: number; top: number } | null = null;
  if (iconLeft !== undefined) {
    // Use custom iconLeft and iconTop for room detail screen
    guestIconPos = {
      left: iconLeft,
      top: iconTop !== undefined ? iconTop : calculatedNameTop, // Use iconTop if provided, otherwise same as name
    };
  } else if (isArrivalDeparture && isPriority) {
    guestIconPos = isSecondGuest
      ? GUEST_INFO.iconArrivalDeparture.positions.secondGuest
      : GUEST_INFO.iconArrivalDeparture.positions.firstGuest;
  } else if (isDeparture && !isPriority && !hasNotes) {
    guestIconPos = {
      left: GUEST_INFO.iconStandardDeparture.left,
      top: GUEST_INFO.iconStandardDeparture.top,
    };
  } else if (hasNotes || isTurndown || isStayover) {
    guestIconPos = {
      left: GUEST_INFO.iconWithNotes.left,
      top: GUEST_INFO.iconWithNotes.top,
    };
  }

  // Determine icon tint color
  const iconTintColor: string | undefined = (isArrivalDeparture || isArrival || isDeparture || isStayover || isTurndown)
    ? undefined // Preserve original icon colors
    : '#334866'; // Default color for other icons

  // Use numberBadge if provided, otherwise use priorityCount
  const displayBadge = numberBadge || (priorityCount ? priorityCount.toString() : undefined);

  // Calculate positions for absolute positioning mode
  const containerStyle = absolutePositioning && absoluteTop !== undefined
    ? { top: absoluteTop * normalizedScaleX }
    : {};

  return (
    <View style={[styles.container, { left: calculatedContainerLeft * normalizedScaleX }, containerStyle]}>
      {/* Guest Icon - positioned absolutely when needed */}
      {guestIconPos !== null ? (
        <Image
          source={guestIconSource}
          style={[
            styles.guestIconAbsolute,
            { 
              left: (guestIconPos.left - calculatedContainerLeft) * normalizedScaleX,
              top: guestIconPos.top * normalizedScaleX,
              tintColor: iconTintColor,
            },
          ]}
          resizeMode="contain"
        />
      ) : null}
      
      {/* Guest Name Row */}
      <View style={[
        styles.guestRow, 
        { 
          top: calculatedNameTop * normalizedScaleX,
          left: nameLeft !== undefined ? nameLeft * normalizedScaleX : 0,
        }
      ]}>
        {guestIconPos === null && (
          <Image
            source={guestIconSource}
            style={[
              styles.guestIcon,
              (isArrival || isDeparture || isStayover || isTurndown) && styles.guestIconNoTint,
            ]}
            resizeMode="contain"
          />
        )}
        <View style={[styles.guestNameContainer, guestIconPos !== null && styles.guestNameContainerNoIcon]}>
          <Text 
            style={styles.guestName} 
            numberOfLines={1} 
            ellipsizeMode="tail"
            onLayout={(event) => {
              // Store name width for dynamic badge positioning if needed
              // This can be used for truly dynamic positioning
            }}
          >
            {guest.name}
          </Text>
        </View>
        {/* Priority/Number Badge - positioned in the same row for dynamic spacing */}
        {displayBadge && guestIconPos === null && (
          <Text style={[
            styles.priorityCountInline,
            isSecondGuest && styles.priorityCountSmall, // Smaller size for second guest
            { 
              marginLeft: 8 * normalizedScaleX, // Dynamic spacing after name
            }
          ]}>
            {displayBadge}
          </Text>
        )}
      </View>
      
      {/* Priority/Number Badge - absolute positioning when icon is positioned separately */}
      {displayBadge && guestIconPos !== null && (
        <Text style={[
          styles.priorityCount, 
          isSecondGuest && styles.priorityCountSmall, // Smaller size for second guest
          { 
            left: (priorityBadgeLeft - calculatedContainerLeft) * normalizedScaleX,
            top: priorityBadgeTop * normalizedScaleX,
            zIndex: 10, // Ensure badge is visible above other elements
          }
        ]}>
          {displayBadge}
        </Text>
      )}

      {/* Date Range */}
      <View style={[
        styles.detailsRow, 
        { 
          top: calculatedDateTop * normalizedScaleX,
          left: dateLeft !== undefined ? dateLeft * normalizedScaleX : 0,
        }
      ]}>
        <Text style={styles.dateRange}>{guest.dateRange}</Text>
      </View>

      {/* Time (ETA/EDT) */}
      {guest.timeLabel && guest.time && timePos && (
        <Text style={[
          styles.time, 
          { 
            left: ((timePos.left ?? 0) - calculatedContainerLeft) * normalizedScaleX,
            top: (timePos.top ?? 0) * normalizedScaleX,
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
                left: ((countPos.iconLeft ?? 0) - calculatedContainerLeft) * normalizedScaleX,
                top: ((countPos.iconTop ?? countPos.top ?? 0)) * normalizedScaleX,
              }
            ]}
            resizeMode="contain"
          />
          <Text style={[
            styles.countText, 
            { 
              left: ((countPos.textLeft ?? 0) - calculatedContainerLeft) * normalizedScaleX,
              top: ((countPos.textTop ?? countPos.top ?? 0)) * normalizedScaleX,
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
    alignItems: 'center',
    left: 0,
    width: 200 * normalizedScaleX,
  },
  guestIcon: {
    width: GUEST_INFO.icon.width * normalizedScaleX,
    height: GUEST_INFO.icon.height * normalizedScaleX,
    marginRight: 4 * normalizedScaleX,
    tintColor: '#334866',
  },
  guestIconAbsolute: {
    position: 'absolute',
    width: GUEST_INFO.iconArrivalDeparture.width * normalizedScaleX,
    height: GUEST_INFO.iconArrivalDeparture.height * normalizedScaleX,
    tintColor: '#334866',
  },
  guestIconNoTint: {
    tintColor: undefined,
  },
  guestNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  guestNameContainerNoIcon: {
    marginLeft: 0,
  },
  guestName: {
    fontSize: GUEST_INFO.name.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: typography.fontWeights.bold as any,
    color: GUEST_INFO.name.color,
    lineHeight: GUEST_INFO.name.lineHeight * normalizedScaleX,
    flex: 1,
  },
  priorityCount: {
    position: 'absolute',
    fontSize: GUEST_INFO.priorityBadge.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.priorityBadge.color,
    lineHeight: GUEST_INFO.priorityBadge.lineHeight * normalizedScaleX,
  },
  priorityCountInline: {
    fontSize: GUEST_INFO.priorityBadge.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.priorityBadge.color,
    lineHeight: GUEST_INFO.priorityBadge.lineHeight * normalizedScaleX,
  },
  priorityCountSmall: {
    fontSize: (GUEST_INFO.priorityBadge.fontSize * 0.85) * normalizedScaleX, // 85% of original size (12 * 0.85 = 10.2px)
    lineHeight: (GUEST_INFO.priorityBadge.lineHeight * 0.85) * normalizedScaleX, // Proportionally smaller line height
  },
  detailsRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
  },
  dateRange: {
    fontSize: GUEST_INFO.dateRange.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.dateRange.color,
    lineHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX,
  },
  time: {
    position: 'absolute',
    fontSize: GUEST_INFO.time.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: GUEST_INFO.time.color,
    lineHeight: GUEST_INFO.time.lineHeight * normalizedScaleX,
  },
  countIcon: {
    position: 'absolute',
    width: GUEST_INFO.guestCount.icon.width * normalizedScaleX,
    height: GUEST_INFO.guestCount.icon.height * normalizedScaleX,
    tintColor: '#334866',
  },
  countText: {
    position: 'absolute',
    fontSize: GUEST_INFO.guestCount.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.guestCount.color,
    lineHeight: GUEST_INFO.guestCount.lineHeight * normalizedScaleX,
  },
});

