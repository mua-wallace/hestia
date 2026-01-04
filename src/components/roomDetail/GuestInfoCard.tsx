import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
}

export default function GuestInfoCard({
  guest,
  isArrival,
  numberBadge,
  specialInstructions,
  absoluteTop,
  contentAreaTop,
  isSecondGuest = false,
}: GuestInfoCardProps) {
  // Calculate relative position from content area start
  const containerTop = absoluteTop - contentAreaTop;

  // Determine category for proper styling
  const category = isArrival ? 'Arrival' : 'Departure';
  
  // Use room detail positions, but convert to relative positions within container
  // Container is positioned at containerTop relative to contentArea
  // All positions in room detail are absolute from screen top
  // To convert to relative: absolutePosition - (contentAreaTop + containerTop)
  // Since containerTop = absoluteTop - contentAreaTop:
  // relative = absolutePosition - (contentAreaTop + absoluteTop - contentAreaTop) = absolutePosition - absoluteTop
  
  const config = isArrival ? ROOM_DETAIL_GUEST_INFO.arrival : ROOM_DETAIL_GUEST_INFO.departure;
  
  // Convert room detail absolute positions to relative positions within container
  // Container is at containerTop relative to contentArea, which equals absoluteTop absolute
  // So relative positions = absolute - absoluteTop
  
  const nameTopRelative = 0; // Name at absoluteTop, container at absoluteTop, so relative = 0
  // Date should be positioned with same spacing as All Rooms cards
  // In All Rooms: name at top 87, date at top 109, so spacing = 22px below name
  // For room detail: name at top 0, so date at top 22px (relative to container)
  const dateTopRelative = 22; // Same spacing as All Rooms (22px below name)
  // Time (ETA/EDT) should be positioned with same spacing as All Rooms
  // In All Rooms: name at top 87, time at top 110, so spacing = 23px below name
  // For room detail: name at top 0, so time at top 23px (relative to container)
  const timeTopRelative = 23; // Same spacing as All Rooms (23px below name)
  // Count (person icon) should be below date and aligned with ETA/EDT
  // Position it at the same top as ETA/EDT (23px) to be vertically aligned
  const countTopRelative = 23; // Same top as ETA/EDT, below the date
  
  // All left positions are absolute from screen, container is at left: 0
  // So relative positions = absolute positions
  const containerLeft = 0;
  const iconLeftRelative = config.icon.left; // 21
  const iconTopRelative = 0; // Icon at same top as name (absoluteTop), so relative = 0
  const nameLeftRelative = config.name.left; // 77
  // Badge should be positioned with dynamic spacing after the name, matching All Rooms cards
  // In All Rooms: container at 73, name at 0 relative to container, badge at 165 relative to card = 92 relative to container
  // So spacing is approximately 92px from container start (or name start when name is at 0)
  // For room detail: name at 77, so badge at 77 + 92 = 169px (dynamic spacing matching All Rooms)
  const badgeSpacing = 92; // Same spacing as All Rooms Arrival/Departure cards
  const badgeLeftRelative = nameLeftRelative + badgeSpacing; // Dynamic position: name left + spacing
  const badgeTopRelative = config.numberBadge.top - absoluteTop; // Position relative to name (350 - 349 = 1px for arrival)
  const dateLeftRelative = config.dates.left; // 79 or 78
  const timeLeftRelative = isArrival ? config.eta.left : config.edt.left; // 215 or 222
  // Person icon should be horizontally and vertically aligned with ETA/EDT
  // Use original horizontal positions from roomDetailStyles to avoid overlapping with date
  // Keep icon at original left (164) but align top with ETA/EDT (23px)
  const countIconLeftRelative = config.occupancy.iconLeft; // 164 - original position to avoid date overlap
  const countTextLeftRelative = config.occupancy.textLeft; // 183 - original position

  return (
    <View style={[styles.container, { top: containerTop * normalizedScaleX }]}>
      {/* Use reusable GuestInfoDisplay component with All Rooms styling */}
      {/* Position using room detail layout positions */}
      <GuestInfoDisplay
        guest={guest}
        numberBadge={numberBadge}
        category={category}
        isArrivalDeparture={false}
        isSecondGuest={isSecondGuest}
        containerLeft={containerLeft}
        nameTop={nameTopRelative}
        dateTop={dateTopRelative}
        iconLeft={iconLeftRelative}
        iconTop={iconTopRelative}
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
      />

      {/* Special Instructions - show for all guests if available */}
      {specialInstructions && (
        <View style={styles.specialInstructionsContainer}>
          <Text
            style={[
              styles.specialInstructionsTitle,
              {
                left: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.left * normalizedScaleX,
                top: (ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.top - absoluteTop) * normalizedScaleX,
              },
            ]}
          >
            Special Instructions
          </Text>
          <Text
            style={[
              styles.specialInstructionsText,
              {
                left: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.left * normalizedScaleX,
                top: (ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.top - absoluteTop) * normalizedScaleX,
                width: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.width * normalizedScaleX,
              },
            ]}
          >
            {specialInstructions}
          </Text>
        </View>
      )}
      
      {/* Divider after Special Instructions - only show for arrival guests, not departure */}
      {specialInstructions && isArrival && (
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
  },
  specialInstructionsContainer: {
    position: 'relative',
  },
  specialInstructionsTitle: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.title.color,
  },
  specialInstructionsText: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.fontSize * normalizedScaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: ROOM_DETAIL_GUEST_INFO.arrival.specialInstructions.text.color,
    lineHeight: 18 * normalizedScaleX,
  },
  dividerAfterSpecial: {
    position: 'absolute',
    left: ROOM_DETAIL_GUEST_INFO.divider.left,
    width: ROOM_DETAIL_GUEST_INFO.divider.width * normalizedScaleX,
    height: ROOM_DETAIL_GUEST_INFO.divider.height,
    backgroundColor: ROOM_DETAIL_GUEST_INFO.divider.color,
  },
});

