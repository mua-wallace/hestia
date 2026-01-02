import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, GUEST_INFO, CONTENT_AREA } from '../../constants/roomDetailStyles';
import type { GuestInfo } from '../../types/allRooms.types';

interface GuestInfoCardProps {
  guest: GuestInfo;
  isArrival: boolean;
  numberBadge?: string;
  specialInstructions?: string;
  absoluteTop: number; // Absolute position from top of screen
  contentAreaTop: number; // Content area start position
}

export default function GuestInfoCard({
  guest,
  isArrival,
  numberBadge,
  specialInstructions,
  absoluteTop,
  contentAreaTop,
}: GuestInfoCardProps) {
  const config = isArrival ? GUEST_INFO.arrival : GUEST_INFO.departure;

  // Calculate relative position from content area start
  const containerTop = absoluteTop - contentAreaTop;

  // Calculate positions relative to container
  const iconTop = config.icon.top - absoluteTop;
  const nameTop = config.name.top - absoluteTop;
  const badgeTop = config.numberBadge.top - absoluteTop;
  const datesTop = config.dates.top - absoluteTop;
  const occupancyTop = config.occupancy.top - absoluteTop;
  const timeTop = (isArrival ? config.eta.top : config.edt.top) - absoluteTop;
  const specialTitleTop = GUEST_INFO.arrival.specialInstructions.title.top - absoluteTop;
  const specialTextTop = GUEST_INFO.arrival.specialInstructions.text.top - absoluteTop;

  return (
    <View style={[styles.container, { top: containerTop * scaleX }]}>
      {/* Guest Icon */}
      <Image
        source={
          isArrival
            ? require('../../../assets/icons/guest-arrival-icon.png')
            : require('../../../assets/icons/guest-departure-icon.png')
        }
        style={[
          styles.icon,
          {
            left: config.icon.left * scaleX,
            top: iconTop * scaleX,
          },
        ]}
        resizeMode="contain"
      />

      {/* Guest Name */}
      <Text
        style={[
          styles.name,
          {
            left: config.name.left * scaleX,
            top: nameTop * scaleX,
          },
        ]}
      >
        {guest.name}
      </Text>

      {/* Number Badge */}
      {numberBadge && (
        <Text
          style={[
            styles.numberBadge,
            {
              left: config.numberBadge.left * scaleX,
              top: badgeTop * scaleX,
            },
          ]}
        >
          {numberBadge}
        </Text>
      )}

      {/* Dates */}
      <Text
        style={[
          styles.dates,
          {
            left: config.dates.left * scaleX,
            top: datesTop * scaleX,
          },
        ]}
      >
        {guest.dateRange}
      </Text>

      {/* Occupancy */}
      <View
        style={[
          styles.occupancyContainer,
          {
            left: config.occupancy.iconLeft * scaleX,
            top: occupancyTop * scaleX,
          },
        ]}
      >
        <Image
          source={require('../../../assets/icons/people-icon.png')}
          style={styles.occupancyIcon}
          resizeMode="contain"
        />
        <Text style={styles.occupancyText}>{guest.guestCount}</Text>
      </View>

      {/* ETA/EDT */}
      <Text
        style={[
          styles.time,
          {
            left: (isArrival ? config.eta.left : config.edt.left) * scaleX,
            top: timeTop * scaleX,
          },
        ]}
      >
        {guest.timeLabel}: {guest.time}
      </Text>

      {/* Special Instructions - show for all guests if available */}
      {specialInstructions && (
        <View style={styles.specialInstructionsContainer}>
          <Text
            style={[
              styles.specialInstructionsTitle,
              {
                left: GUEST_INFO.arrival.specialInstructions.title.left * scaleX,
                top: specialTitleTop * scaleX,
              },
            ]}
          >
            Special Instructions
          </Text>
          <Text
            style={[
              styles.specialInstructionsText,
              {
                left: GUEST_INFO.arrival.specialInstructions.text.left * scaleX,
                top: specialTextTop * scaleX,
                width: GUEST_INFO.arrival.specialInstructions.text.width * scaleX,
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
              top: (GUEST_INFO.divider.top - absoluteTop) * scaleX,
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
  icon: {
    position: 'absolute',
    width: 21 * scaleX,
    height: 21 * scaleX,
  },
  name: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: GUEST_INFO.arrival.name.color,
  },
  numberBadge: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.numberBadge.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.arrival.numberBadge.color,
  },
  dates: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.dates.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.arrival.dates.color,
  },
  occupancyContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  occupancyIcon: {
    width: 14 * scaleX,
    height: 14 * scaleX,
    marginRight: 5 * scaleX,
  },
  occupancyText: {
    fontSize: GUEST_INFO.arrival.occupancy.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.arrival.occupancy.color,
  },
  time: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.eta.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: GUEST_INFO.arrival.eta.color,
  },
  specialInstructionsContainer: {
    position: 'relative',
  },
  specialInstructionsTitle: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.specialInstructions.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: GUEST_INFO.arrival.specialInstructions.title.color,
  },
  specialInstructionsText: {
    position: 'absolute',
    fontSize: GUEST_INFO.arrival.specialInstructions.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.arrival.specialInstructions.text.color,
    lineHeight: 18 * scaleX,
  },
  dividerAfterSpecial: {
    position: 'absolute',
    left: GUEST_INFO.divider.left,
    width: GUEST_INFO.divider.width * scaleX,
    height: GUEST_INFO.divider.height,
    backgroundColor: GUEST_INFO.divider.color,
  },
});

