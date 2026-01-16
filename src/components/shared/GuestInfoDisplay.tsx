import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { GUEST_INFO, CARD_DIMENSIONS } from '../../constants/allRoomsStyles';
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
  hideNameRow?: boolean; // Hide the name row (used when parent renders it)
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
  hideNameRow = false,
}: GuestInfoDisplayProps) {
  // Determine card type characteristics
  const isArrival = category === 'Arrival';
  const isDeparture = category === 'Departure';
  const isStayover = category === 'Stayover';
  const isTurndown = category === 'Turndown';
  
  // Determine which guest icon to use based on card category
  // For individual guests in ArrivalDeparture rooms, check timeLabel to determine icon
  let guestIconSource;
  if (isArrivalDeparture || category === 'ArrivalDeparture') {
    guestIconSource = guest.timeLabel === 'ETA' 
      ? require('../../../assets/icons/guest-arrival-icon.png')
      : require('../../../assets/icons/guest-departure-icon.png');
  } else if (isStayover) {
    guestIconSource = require('../../../assets/icons/stayover-guest-icon.png');
  } else if (isTurndown) {
    guestIconSource = require('../../../assets/icons/turndown-guest-icon.png');
  } else if (isArrival || guest.timeLabel === 'ETA') {
    // Use arrival icon if category is Arrival OR guest has ETA timeLabel
    guestIconSource = require('../../../assets/icons/guest-arrival-icon.png');
  } else if (isDeparture || guest.timeLabel === 'EDT') {
    // Use departure icon if category is Departure OR guest has EDT timeLabel
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
  // For Arrival/Stayover/Turndown cards, align time with date range row
  const timePos: { left: number; top: number } | null = timeLeft !== undefined && timeTop !== undefined
    ? { left: timeLeft, top: timeTop }
    : isPriority
      ? (isSecondGuest ? GUEST_INFO.time.positions.prioritySecond : GUEST_INFO.time.positions.priorityFirst)
      : hasNotes || isTurndown || isStayover
        ? GUEST_INFO.time.positions.withNotes
        : isArrival || isStayover || isTurndown
          ? {
              // Align time with date range row (top 109px) for proper alignment
              left: GUEST_INFO.time.positions.standardArrival.left,
              top: calculatedDateTop, // Use same top as date range for alignment
            }
          : null; // Departure cards don't show time

  // Determine guest count position - use override if provided
  // Note: For Arrival/Departure cards, guest count should align with date range (same top position)
  const countPos: { iconLeft: number; textLeft: number; top?: number; iconTop?: number; textTop?: number } | null = 
    countIconLeft !== undefined && countTextLeft !== undefined
      ? { 
          iconLeft: countIconLeft, 
          textLeft: countTextLeft, 
          top: countTop,
          iconTop: countTop,
          textTop: countTop 
        }
      : isPriority && isArrivalDeparture
        ? {
            // For Arrival/Departure cards, align guest count with date range row
            iconLeft: isSecondGuest ? GUEST_INFO.guestCount.positions.prioritySecond.iconLeft : GUEST_INFO.guestCount.positions.priorityFirst.iconLeft,
            textLeft: isSecondGuest ? GUEST_INFO.guestCount.positions.prioritySecond.textLeft : GUEST_INFO.guestCount.positions.priorityFirst.textLeft,
            iconTop: calculatedDateTop, // Align with date range
            textTop: calculatedDateTop, // Align with date range
          }
        : isPriority
          ? (isSecondGuest ? GUEST_INFO.guestCount.positions.prioritySecond : GUEST_INFO.guestCount.positions.priorityFirst)
          : hasNotes || isTurndown || isStayover
            ? GUEST_INFO.guestCount.positions.withNotes
            : isArrival || isStayover || isTurndown
              ? GUEST_INFO.guestCount.positions.standardArrival // Use constants directly - already positioned correctly at top 109px
              : GUEST_INFO.guestCount.positions.standardDeparture;

  // Priority badge positioning - use override if provided
  // Note: For Arrival/Departure cards, badge is now inline with name using flexbox, so absolute positioning is not used
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

  // Calculate guest count positions for Arrival, Stayover, Turndown (separate row below date)
  // Also show separately for Departure when custom positioning is provided (Room Detail screen)
  const shouldShowGuestCountBelow = countPos && ((isArrival || isStayover || isTurndown) || (isDeparture && countIconLeft !== undefined && countTextLeft !== undefined)) && !(isArrivalDeparture && isPriority);
  const guestCountTop = shouldShowGuestCountBelow
    ? (countTop !== undefined
        ? countTop * normalizedScaleX // Use custom position if provided (Room Detail screen)
        : hasNotes
          ? ((GUEST_INFO.guestCount.positions.withNotes.iconTop ?? 0)) * normalizedScaleX
          : (calculatedDateTop + GUEST_INFO.dateRange.lineHeight + 2) * normalizedScaleX)
    : 0;
  const iconVerticalOffset = shouldShowGuestCountBelow
    ? (GUEST_INFO.guestCount.lineHeight * normalizedScaleX - GUEST_INFO.guestCount.icon.height * normalizedScaleX) / 2
    : 0;
  const guestCountIconLeft = shouldShowGuestCountBelow
    ? (countIconLeft !== undefined
        ? countIconLeft * normalizedScaleX // Use custom position if provided (Room Detail screen)
        : hasNotes 
          ? ((GUEST_INFO.guestCount.positions.withNotes.iconLeft) - calculatedContainerLeft) * normalizedScaleX
          : ((GUEST_INFO.guestCount.positions.standardArrival.iconLeft) - calculatedContainerLeft) * normalizedScaleX)
    : 0;
  const guestCountTextLeft = shouldShowGuestCountBelow
    ? (countTextLeft !== undefined
        ? countTextLeft * normalizedScaleX // Use custom position if provided (Room Detail screen)
        : hasNotes
          ? ((GUEST_INFO.guestCount.positions.withNotes.textLeft) - calculatedContainerLeft) * normalizedScaleX
          : ((GUEST_INFO.guestCount.positions.standardArrival.textLeft) - calculatedContainerLeft) * normalizedScaleX)
    : 0;

  // Calculate container width: card width minus container left position to ensure content is visible
  const containerWidth = (CARD_DIMENSIONS.width - calculatedContainerLeft) * normalizedScaleX;

  return (
    <View 
      style={[
        styles.container, 
        { 
          left: calculatedContainerLeft * normalizedScaleX,
          width: containerWidth, // Set explicit width to ensure content is visible
        }, 
        containerStyle
      ]}
    >
      {/* Guest Icon - positioned absolutely when needed */}
      {!hideNameRow && guestIconPos !== null ? (
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
      {!hideNameRow && (
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
            >
              {guest.name}
            </Text>
            {/* Priority/Number Badge - positioned immediately after name text with consistent spacing */}
            {displayBadge && (
              <Text 
                style={styles.priorityCountInline}
                numberOfLines={1}
              >
                {displayBadge}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Date Range Row */}
      {/* For Arrival/Departure and Departure: date, icon, text on same row */}
      {/* For Arrival, Stayover, Turndown: date and ETA on same row, icon+text on separate row below */}
      {/* Exception: If custom time positioning is provided (Room Detail screen), render time separately */}
      {(isArrivalDeparture && isPriority) || (isDeparture && !hasNotes && !(timeLeft !== undefined && timeTop !== undefined)) ? (
        <View style={[
          styles.detailsRowWithCount, 
          { 
            top: calculatedDateTop * normalizedScaleX,
            left: dateLeft !== undefined ? dateLeft * normalizedScaleX : 0,
            zIndex: 10, // Lower z-index so time can appear above
          }
        ]}>
          <Text style={styles.dateRange}>{guest.dateRange}</Text>
          {countPos && (
            <>
              <Image
                source={require('../../../assets/icons/people-icon.png')}
                style={styles.countIconInline}
                resizeMode="contain"
              />
              <Text style={styles.countTextInline}>
                {guest.guestCount || ''}
              </Text>
            </>
          )}
        </View>
      ) : (isArrival || isStayover || isTurndown) && guest.timeLabel && guest.time && !(timeLeft !== undefined && timeTop !== undefined) ? (
        // For Arrival, Stayover, Turndown: date and ETA on same row
        <View style={[
          styles.detailsRowWithTime, 
          { 
            top: calculatedDateTop * normalizedScaleX,
            left: dateLeft !== undefined ? dateLeft * normalizedScaleX : 0,
            zIndex: 10, // Lower z-index so time can appear above
          }
        ]}>
          <Text style={styles.dateRange}>{guest.dateRange}</Text>
          <Text style={styles.timeInline}>
            {guest.timeLabel}: {guest.time}
          </Text>
        </View>
      ) : (
        <View style={[
          styles.detailsRow, 
          { 
            top: calculatedDateTop * normalizedScaleX,
            left: dateLeft !== undefined ? dateLeft * normalizedScaleX : 0,
            zIndex: 10, // Lower z-index so time can appear above
          }
        ]}>
          <Text style={styles.dateRange}>{guest.dateRange}</Text>
        </View>
      )}

      {/* Guest Count - separate row below date for Arrival, Stayover, Turndown */}
      {/* Use exact positions from constants, positioned below date range with proper vertical alignment */}
      {shouldShowGuestCountBelow && (
        <>
          <Image
            source={require('../../../assets/icons/people-icon.png')}
            style={[
              styles.countIcon,
              {
                left: guestCountIconLeft,
                top: guestCountTop + iconVerticalOffset, // Center icon vertically with text
              }
            ]}
            resizeMode="contain"
          />
          <Text style={[
            styles.countText,
            {
              left: guestCountTextLeft,
              top: guestCountTop, // Text top position
            }
          ]}>
            {guest.guestCount || ''}
          </Text>
        </>
      )}

      {/* Time (ETA/EDT) - render separately when custom positioning is provided (Room Detail screen) or for Departure cards */}
      {/* Render LAST to ensure it's on top */}
      {guest.timeLabel && guest.time && timePos && (timeLeft !== undefined && timeTop !== undefined || !(isArrival || isStayover || isTurndown)) && (
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    overflow: 'visible', // Ensure content is not clipped
    zIndex: 10, // Ensure container and its children are above dividers
    pointerEvents: 'box-none', // Allow pointer events to pass through to children on iOS
    // Width is set dynamically in component to ensure content is visible
  },
  guestRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to prevent text clipping
    left: 0,
    width: 300 * normalizedScaleX, // Fixed width - card is 426px, container starts at 73px, so 426-73=353px available, use 300px to leave space
    overflow: 'visible', // Ensure text is not clipped
    zIndex: 30, // Highest z-index to ensure guest name is above divider and all other elements on iOS
    elevation: 30, // Android elevation for proper layering
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
    flexDirection: 'row', // Horizontal layout for name and badge
    alignItems: 'baseline', // Align name and badge by baseline so name is fully visible
    flexShrink: 1, // Allow shrinking but prefer to show full name
    flexGrow: 0, // Don't grow - let badge follow immediately after
    minWidth: 120 * normalizedScaleX, // Minimum width to ensure name starts showing
    overflow: 'visible', // Ensure text is not clipped
  },
  guestNameContainerNoIcon: {
    marginLeft: 0,
  },
  guestNameContainerWithSpacing: {
    marginRight: 8 * normalizedScaleX, // Add spacing after name for Arrival/Departure cards (matches Figma)
  },
  guestName: {
    fontSize: GUEST_INFO.name.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: typography.fontWeights.bold as any,
    color: GUEST_INFO.name.color,
    lineHeight: GUEST_INFO.name.lineHeight * normalizedScaleX,
    backgroundColor: 'transparent', // Ensure no background covers text
    includeFontPadding: false, // Remove extra padding that clips text
    textAlignVertical: 'top', // Align to top so bottom part is visible
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
    marginLeft: 4 * normalizedScaleX, // Consistent spacing after name text - matches Figma (4px)
    flexShrink: 0, // Prevent badge from shrinking
    includeFontPadding: false, // Remove extra padding
    textAlignVertical: 'top', // Align to top for consistent baseline
  },
  priorityCountSmall: {
    fontSize: (GUEST_INFO.priorityBadge.fontSize * 0.85) * normalizedScaleX, // 85% of original size (12 * 0.85 = 10.2px)
    lineHeight: (GUEST_INFO.priorityBadge.lineHeight * 0.85) * normalizedScaleX, // Proportionally smaller line height
  },
  detailsRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to prevent clipping
    left: 0,
    minHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX, // Changed from fixed height to minHeight
    zIndex: 5, // Very low z-index so time appears above
    overflow: 'visible', // Ensure content is not clipped
  },
  detailsRowWithCount: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center', // Keep 'center' for this row to align icon and count text properly on same line
    left: 0,
    minHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX, // Changed from fixed height to minHeight
    zIndex: 5, // Very low z-index so time appears above
    overflow: 'visible', // Ensure content is not clipped
  },
  detailsRowWithTime: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to prevent clipping
    left: 0,
    minHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX, // Changed from fixed height to minHeight
    zIndex: 5, // Very low z-index so time appears above
    overflow: 'visible', // Ensure content is not clipped
  },
  guestCountRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    height: GUEST_INFO.guestCount.lineHeight * normalizedScaleX,
  },
  dateRange: {
    fontSize: GUEST_INFO.dateRange.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.dateRange.color,
    lineHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX,
    includeFontPadding: false, // Remove extra padding for better alignment
    textAlignVertical: 'center', // Center text vertically
    backgroundColor: 'transparent', // Ensure no background covers time
  },
  countIconInline: {
    width: GUEST_INFO.guestCount.icon.width * normalizedScaleX,
    height: GUEST_INFO.guestCount.icon.height * normalizedScaleX,
    tintColor: '#334866',
    marginLeft: 8 * normalizedScaleX, // Spacing after date
    alignSelf: 'center', // Vertically center icon with text on same row
  },
  countTextInline: {
    fontSize: GUEST_INFO.guestCount.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.guestCount.color,
    lineHeight: GUEST_INFO.guestCount.lineHeight * normalizedScaleX,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 4 * normalizedScaleX, // Spacing after icon
    marginTop: 0, // Ensure no extra top margin
    paddingTop: 0, // Ensure no extra top padding
  },
  time: {
    position: 'absolute',
    fontSize: GUEST_INFO.time.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: GUEST_INFO.time.color,
    lineHeight: GUEST_INFO.time.lineHeight * normalizedScaleX,
    includeFontPadding: false, // Remove extra padding for better alignment
    textAlignVertical: 'center', // Center text vertically
    zIndex: 30, // Highest z-index to ensure ETA/EDT are always visible above date
    elevation: 30, // Android elevation for proper layering
    backgroundColor: 'transparent', // Ensure no background
  },
  timeInline: {
    fontSize: GUEST_INFO.time.fontSize * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: GUEST_INFO.time.color,
    lineHeight: GUEST_INFO.dateRange.lineHeight * normalizedScaleX, // Match date range line height for vertical alignment
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 8 * normalizedScaleX, // Spacing after date (matches Figma spacing)
    zIndex: 25, // Highest z-index to ensure ETA/EDT are always visible above date
    elevation: 25, // Android elevation for proper layering
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
    includeFontPadding: false, // Remove extra padding for better alignment
    textAlignVertical: 'center', // Center text vertically
  },
});

