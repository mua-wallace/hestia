import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import { GuestInfo } from '../../types/allRooms.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface GuestInfoSectionProps {
  guest: GuestInfo;
  priorityCount?: number;
}

export default function GuestInfoSection({ guest, priorityCount }: GuestInfoSectionProps) {
  return (
    <View style={styles.container}>
      {/* Guest Icon and Name */}
      <View style={styles.guestRow}>
        <Image
          source={require('../../../assets/icons/rooms/guest-icon.png')}
          style={styles.guestIcon}
          resizeMode="contain"
        />
        <Text style={styles.guestName}>{guest.name}</Text>
        {priorityCount && (
          <Text style={styles.priorityCount}>{priorityCount}</Text>
        )}
      </View>

      {/* Date Range and Time */}
      <View style={styles.detailsRow}>
        <Text style={styles.dateRange}>{guest.dateRange}</Text>
        <Text style={styles.time}>
          {guest.timeLabel}: {guest.time}
        </Text>
      </View>

      {/* Guest Count */}
      <View style={styles.countRow}>
        <Image
          source={require('../../../assets/icons/rooms/guest-icon.png')}
          style={styles.countIcon}
          resizeMode="contain"
        />
        <Text style={styles.countText}>{guest.guestCount}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12 * scaleX,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scaleX,
    marginLeft: 6 * scaleX,
  },
  guestIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    marginRight: 8 * scaleX,
  },
  guestName: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
  },
  priorityCount: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#334866',
    marginLeft: 6 * scaleX,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scaleX,
    marginLeft: 6 * scaleX,
  },
  dateRange: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.primary,
    marginRight: 12 * scaleX,
  },
  time: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.text.primary,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6 * scaleX,
  },
  countIcon: {
    width: 16 * scaleX,
    height: 16 * scaleX,
    marginRight: 6 * scaleX,
  },
  countText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: colors.text.primary,
  },
});

