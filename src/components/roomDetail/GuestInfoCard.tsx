import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { GUEST_INFO as ROOM_DETAIL_GUEST_INFO, CONTENT_AREA } from '../../constants/roomDetailStyles';
import { normalizedScaleX } from '../../utils/responsive';
import GuestInfoDisplay from '../shared/GuestInfoDisplay';
import type { GuestInfo } from '../../types/allRooms.types';

interface GuestInfoCardProps {
  guest: GuestInfo;
  isArrival: boolean;
  numberBadge?: string;
  specialInstructions?: string;
  absoluteTop: number; // Absolute position from top of screen
  contentAreaTop: number; // Content area start position
  isSecondGuest?: boolean; // Whether this is the second guest (for smaller badge size)
  specialInstructionsTitleTop?: number; // Absolute position for special instructions title
  specialInstructionsTextTop?: number; // Absolute position for special instructions text
  roomCategory?: string; // Room category (Arrival, Departure, Stayover, Turndown) for proper styling
}

export default function GuestInfoCard({
  guest,
  isArrival,
  numberBadge,
  specialInstructions,
  absoluteTop,
  contentAreaTop,
  isSecondGuest = false,
  specialInstructionsTitleTop,
  specialInstructionsTextTop,
  roomCategory,
}: GuestInfoCardProps) {
  // Calculate relative position from content area start
  const containerTop = absoluteTop - contentAreaTop;

  // Determine category for proper styling
  // Use roomCategory if provided, otherwise fallback to isArrival logic
  const category = roomCategory || (isArrival ? 'Arrival' : 'Departure');
  
  // Use room detail positions, but convert to relative positions within container
  // Container is positioned at containerTop relative to contentArea
  // All positions in room detail are absolute from screen top
  // To convert to relative: absolutePosition - (contentAreaTop + containerTop)
  // Since containerTop = absoluteTop - contentAreaTop:
  // relative = absolutePosition - (contentAreaTop + absoluteTop - contentAreaTop) = absolutePosition - absoluteTop
  
  // Select config based on roomCategory if provided, otherwise use isArrival
  // For Stayover/Turndown, use Arrival config since they have ETA and similar layout
  // For Departure, use Departure config
  const configKey = roomCategory === 'Departure' ? 'departure' : 'arrival';
  const config = ROOM_DETAIL_GUEST_INFO[configKey];
  
  // Convert room detail absolute positions to relative positions within container
  // Container is at containerTop relative to contentArea, which equals absoluteTop absolute
  // So relative positions = absolute - absoluteTop
  
  // IMPORTANT: The config constants are from the Arrival/Departure combined screen (node-id: 1-1506)
  // where Arrival guest is at 349px and Departure guest is at 542px.
  // But for single room type screens, the guest is always at the FIRST position (e.g., 369px for Departure-only).
  // So we need to use RELATIVE offsets, not absolute positions.
  
  // From Figma: All positions are absolute, convert to relative to container
  // Container is at absoluteTop, so relative = absolute - absoluteTop
  const nameTopRelative = 0; // Name at absoluteTop (349 or 542 in combined, or 369 in single), container at absoluteTop, so relative = 0
  
  // Use fixed relative offsets based on room type, not absolute positions from config
  // Arrival: date is 28px below name (377 - 349 = 28)
  // Departure: date is 26px below name (568 - 542 = 26)
  const dateTopRelative = configKey === 'departure' ? 26 : 28;
  
  // Time positions relative to name
  // Arrival: ETA at 28px (same as date, 377 - 349 = 28)
  // Departure: EDT at 25px (567 - 542 = 25)
  const timeTopRelative = configKey === 'departure' ? 25 : 28;
  
  // Occupancy positions relative to name
  // Arrival: 29px (378 - 349 = 29)
  // Departure: 24px (566 - 542 = 24)
  const countTopRelative = configKey === 'departure' ? 24 : 29;
  
  // All left positions are absolute from screen edge
  const containerLeft = 0;
  const iconLeftRelative = config.icon.left; // 21
  const iconTopRelative = 0; // Icon at same top as name (absoluteTop), so relative = 0
  const nameLeftRelative = config.name.left; // 77
  // Badge position from Figma: exact left position (189 for arrival, 157 for departure)
  const badgeLeftRelative = config.numberBadge.left; // Exact Figma position
  const badgeTopRelative = config.numberBadge.top - absoluteTop; // Position relative to name (350 - 349 = 1px for arrival)
  const dateLeftRelative = config.dates.left; // 79 or 78
  const timeLeftRelative = configKey === 'departure' ? config.edt.left : config.eta.left; // 222 or 215
  // Person icon should be horizontally and vertically aligned with ETA/EDT
  // Use original horizontal positions from roomDetailStyles to avoid overlapping with date
  // Keep icon at original left (164) but align top with ETA/EDT (23px)
  const countIconLeftRelative = config.occupancy.iconLeft; // 164 - original position to avoid date overlap
  const countTextLeftRelative = config.occupancy.textLeft; // 183 - original position
  
  // Calculate badge vertical alignment
  // The category badge should align with the name (same top position)
  // From Figma: badge top = name top (349 for arrival, 542 for departure in combined screen)
  // In relative terms: badge is at the same level as name, so top = 0
  const categoryBadgeTopRelative = 0; // Align with name (same baseline)
  
  return (
    <View style={[styles.container, { top: containerTop * normalizedScaleX }]}>
      {/* Guest Icon */}
      {iconLeftRelative !== undefined && (
        <Image
          source={
            category === 'Departure'
              ? require('../../../assets/icons/guest-departure-icon.png')
              : category === 'Stayover'
              ? require('../../../assets/icons/stayover-guest-icon.png')
              : category === 'Turndown'
              ? require('../../../assets/icons/turndown-guest-icon.png')
              : require('../../../assets/icons/guest-arrival-icon.png')
          }
          style={[
            styles.guestIcon,
            {
              left: iconLeftRelative * normalizedScaleX,
              top: iconTopRelative * normalizedScaleX,
            },
          ]}
          resizeMode="contain"
        />
      )}

      {/* Name and Badge Row - using flexbox for dynamic spacing */}
      <View
        style={[
          styles.nameAndBadgeRow,
          {
            left: nameLeftRelative * normalizedScaleX,
            top: nameTopRelative * normalizedScaleX,
          },
        ]}
      >
        <Text style={styles.guestName} numberOfLines={1}>
          {guest.name}
        </Text>
        
        {/* Number Badge (if provided) */}
        {numberBadge && (
          <Text style={styles.numberBadge}>{numberBadge}</Text>
        )}
        
        {/* Category Pill Badge - show for all room types */}
        {(category === 'Arrival' || category === 'Departure' || category === 'Stayover' || category === 'Turndown') && (
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: category === 'Arrival' 
                  ? '#41d541' // Green for Arrival
                  : category === 'Departure'
                  ? '#f92424' // Red for Departure
                  : category === 'Stayover'
                  ? '#3BC1F6' // Light blue for Stayover
                  : '#9b51e0', // Purple for Turndown
                paddingHorizontal: config.categoryBadge.paddingHorizontal * normalizedScaleX,
                paddingVertical: config.categoryBadge.paddingVertical * normalizedScaleX,
                borderRadius: config.categoryBadge.borderRadius * normalizedScaleX,
                marginLeft: 8 * normalizedScaleX, // Fixed spacing after name/number badge
              },
            ]}
          >
            <Text
              style={[
                styles.categoryBadgeText,
                {
                  fontSize: config.categoryBadge.fontSize * normalizedScaleX,
                },
              ]}
            >
              {category}
            </Text>
          </View>
        )}
      </View>

      {/* Date, Time, Occupancy - rendered by GuestInfoDisplay */}
      <GuestInfoDisplay
        guest={guest}
        numberBadge={undefined} // Don't render number badge here - we render it above
        category={category}
        isArrivalDeparture={false}
        isSecondGuest={isSecondGuest}
        containerLeft={containerLeft}
        nameTop={nameTopRelative}
        dateTop={dateTopRelative}
        iconLeft={undefined} // Don't render icon here - we render it above
        iconTop={undefined}
        nameLeft={nameLeftRelative}
        badgeLeft={badgeLeftRelative}
        badgeTop={badgeTopRelative}
        dateLeft={dateLeftRelative}
        timeLeft={timeLeftRelative}
        timeTop={timeTopRelative}
        countIconLeft={countIconLeftRelative}
        countTextLeft={countTextLeftRelative}
        countTop={countTopRelative}
        absolutePositioning={false}
        hideNameRow={true} // Don't render name/icon/badge - we render them above in flexbox
      />

      {/* Special Instructions - show for all guests if available */}
      {specialInstructions && config.specialInstructions && (
        <>
          <Text
            style={[
              styles.specialInstructionsTitle,
              {
                left: config.specialInstructions.title.left * normalizedScaleX,
                top: specialInstructionsTitleTop !== undefined 
                  ? (specialInstructionsTitleTop - absoluteTop) * normalizedScaleX
                  : (config.specialInstructions.title.top - absoluteTop) * normalizedScaleX,
              },
            ]}
          >
            Special Instructions
          </Text>
          <Text
            style={[
              styles.specialInstructionsText,
              {
                left: config.specialInstructions.text.left * normalizedScaleX,
                top: specialInstructionsTextTop !== undefined
                  ? (specialInstructionsTextTop - absoluteTop) * normalizedScaleX
                  : (config.specialInstructions.text.top - absoluteTop) * normalizedScaleX,
                width: config.specialInstructions.text.width * normalizedScaleX,
              },
            ]}
          >
            {specialInstructions}
          </Text>
        </>
      )}
      
      {/* Divider after Special Instructions - only show for Arrival, not for Departure/Stayover/Turndown */}
      {specialInstructions && config.specialInstructions && category === 'Arrival' && (
        <View
          style={[
            styles.dividerAfterSpecial,
            {
              top: (ROOM_DETAIL_GUEST_INFO.divider.top - absoluteTop) * normalizedScaleX,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1, // Ensure guest info is above dividers
  },
  guestIcon: {
    position: 'absolute',
    width: 21 * normalizedScaleX,
    height: 21 * normalizedScaleX,
  },
  nameAndBadgeRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 30, // Ensure name row is above other elements
  },
  guestName: {
    fontSize: 14 * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: '#000000',
    lineHeight: 21 * normalizedScaleX,
    flexShrink: 0, // Don't shrink the name - show it fully
  },
  numberBadge: {
    fontSize: 12 * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: '#334866',
    marginLeft: 8 * normalizedScaleX,
    flexShrink: 0, // Don't shrink the badge
  },
  categoryBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Don't shrink the badge
  },
  categoryBadgeText: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: '#ffffff',
  },
  specialInstructionsTitle: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.color,
    zIndex: 2, // Above divider
  },
  specialInstructionsText: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.color,
    lineHeight: 18 * normalizedScaleX,
    zIndex: 2, // Above divider
  },
  dividerAfterSpecial: {
    position: 'absolute',
    left: ROOM_DETAIL_GUEST_INFO.divider.left,
    width: ROOM_DETAIL_GUEST_INFO.divider.width * normalizedScaleX,
    height: ROOM_DETAIL_GUEST_INFO.divider.height,
    backgroundColor: ROOM_DETAIL_GUEST_INFO.divider.color,
    zIndex: 0, // Below content
  },
});

