import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import { StaffInfo } from '../../types/allRooms.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface StaffSectionProps {
  staff: StaffInfo;
}

export default function StaffSection({ staff }: StaffSectionProps) {
  return (
    <View style={styles.container}>
      {/* Staff Avatar or Initials */}
      <View style={styles.avatarContainer}>
        {staff.avatar ? (
          <Image
            source={staff.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{staff.initials}</Text>
          </View>
        )}
      </View>

      {/* Staff Name */}
      <Text style={styles.staffName}>{staff.name}</Text>

      {/* Status Text */}
      <Text style={[styles.statusText, { color: staff.statusColor }]}>
        {staff.statusText}
      </Text>

      {/* Promise Time (if applicable) */}
      {staff.promiseTime && (
        <Text style={styles.promiseTime}>{staff.promiseTime}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 245 * scaleX,
    top: 22 * scaleX,
  },
  avatarContainer: {
    width: 35 * scaleX,
    height: 35 * scaleX,
    marginBottom: 6 * scaleX,
  },
  avatar: {
    width: 35 * scaleX,
    height: 35 * scaleX,
    borderRadius: 17.5 * scaleX,
  },
  initialsCircle: {
    width: 35 * scaleX,
    height: 35 * scaleX,
    borderRadius: 17.5 * scaleX,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.white,
  },
  staffName: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#1e1e1e',
    marginBottom: 4 * scaleX,
    width: 104 * scaleX,
  },
  statusText: {
    fontSize: 12 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    marginBottom: 2 * scaleX,
  },
  promiseTime: {
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#1e1e1e',
    marginTop: 6 * scaleX,
  },
});

