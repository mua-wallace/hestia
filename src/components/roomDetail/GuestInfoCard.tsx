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
  
  // From Figma: All positions are absolute, convert to relative to container
  // Container is at absoluteTop, so relative = absolute - absoluteTop
  const nameTopRelative = 0; // Name at absoluteTop (349 or 542), container at absoluteTop, so relative = 0
  // From Figma: dates at 377px for arrival, 568px for departure
  // Relative to name: 377 - 349 = 28px (arrival), 568 - 542 = 26px (departure)
  const dateTopRelative = config.dates.top - absoluteTop; // 28px for arrival, 26px for departure
  // From Figma: ETA at 377px (arrival), EDT at 567px (departure)
  const timeTopRelative = (isArrival ? config.eta.top : config.edt.top) - absoluteTop;
  // From Figma: occupancy at 378px (arrival), 566px (departure)
  const countTopRelative = config.occupancy.top - absoluteTop;
  
  // All left positions are absolute from screen edge
  const containerLeft = 0;
  const iconLeftRelative = config.icon.left; // 21
  const iconTopRelative = 0; // Icon at same top as name (absoluteTop), so relative = 0
  const nameLeftRelative = config.name.left; // 77
  // Badge position from Figma: exact left position (189 for arrival, 157 for departure)
  const badgeLeftRelative = config.numberBadge.left; // Exact Figma position
  const badgeTopRelative = config.numberBadge.top - absoluteTop; // Position relative to name (350 - 349 = 1px for arrival)
  const dateLeftRelative = config.dates.left; // 79 or 78
  const timeLeftRelative = isArrival ? config.eta.left : config.edt.left; // 215 or 222
  // Person icon should be horizontally and vertically aligned with ETA/EDT
  // Use original horizontal positions from roomDetailStyles to avoid overlapping with date
  // Keep icon at original left (164) but align top with ETA/EDT (23px)
  const countIconLeftRelative = config.occupancy.iconLeft; // 164 - original position to avoid date overlap
  const countTextLeftRelative = config.occupancy.textLeft; // 183 - original position
  
  // Calculate badge vertical alignment: position badge higher up
  // Use the absolute position from constants and convert to relative, then adjust upward
  // Category badge absolute top from constants: 349 for arrival, 542 for departure
  // Convert to relative: config.categoryBadge.top - absoluteTop
  // Then move it higher by subtracting additional pixels
  const badgeAbsoluteTop = config.categoryBadge.top; // 349 for arrival, 542 for departure
  const badgeTopFromConstants = badgeAbsoluteTop - absoluteTop; // Relative position from constants
  // Move badge significantly higher - align with name top or above
  const categoryBadgeTopRelative = badgeTopFromConstants - 8; // Move badge 8px higher than constants position

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

      {/* Arrival/Departure Pill Badge - positioned after number badge */}
      <View
        style={[
          styles.categoryBadge,
          {
            left: ROOM_DETAIL_GUEST_INFO[isArrival ? 'arrival' : 'departure'].categoryBadge.left * normalizedScaleX,
            top: categoryBadgeTopRelative * normalizedScaleX,
            backgroundColor: isArrival 
              ? ROOM_DETAIL_GUEST_INFO.arrival.categoryBadge.backgroundColor 
              : ROOM_DETAIL_GUEST_INFO.departure.categoryBadge.backgroundColor,
            paddingHorizontal: ROOM_DETAIL_GUEST_INFO.arrival.categoryBadge.paddingHorizontal * normalizedScaleX,
            paddingVertical: ROOM_DETAIL_GUEST_INFO.arrival.categoryBadge.paddingVertical * normalizedScaleX,
            borderRadius: ROOM_DETAIL_GUEST_INFO.arrival.categoryBadge.borderRadius * normalizedScaleX,
          },
        ]}
      >
        <Text
          style={[
            styles.categoryBadgeText,
            {
              fontSize: ROOM_DETAIL_GUEST_INFO.arrival.categoryBadge.fontSize * normalizedScaleX,
            },
          ]}
        >
          {isArrival ? 'Arrival' : 'Departure'}
        </Text>
      </View>

      {/* Special Instructions - show for all guests if available */}
      {specialInstructions && (
        <>
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
        </>
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
    zIndex: 1, // Ensure guest info is above dividers
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
  categoryBadge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadgeText: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold' as any,
    color: '#ffffff',
  },
});

