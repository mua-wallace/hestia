import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { StaffInfo } from '../../types/allRooms.types';
import { scaleX, STAFF_SECTION } from '../../constants/allRoomsStyles';

interface StaffSectionProps {
  staff: StaffInfo;
  isPriority?: boolean;
}

export default function StaffSection({ staff, isPriority = false }: StaffSectionProps) {
  if (!staff) {
    return null;
  }

  const avatarLeft = isPriority ? STAFF_SECTION.avatar.left : (STAFF_SECTION.avatarStandard?.left ?? STAFF_SECTION.avatar.left);
  const avatarTop = isPriority ? STAFF_SECTION.avatar.top : (STAFF_SECTION.avatarStandard?.top ?? STAFF_SECTION.avatar.top);
  const nameLeft = isPriority ? STAFF_SECTION.name.left : (STAFF_SECTION.nameStandard?.left ?? STAFF_SECTION.name.left);
  const nameTop = isPriority ? STAFF_SECTION.name.top : (STAFF_SECTION.nameStandard?.top ?? STAFF_SECTION.name.top);
  const statusLeft = isPriority ? STAFF_SECTION.status.left : (STAFF_SECTION.statusStandard?.left ?? STAFF_SECTION.status.left);
  const statusTop = isPriority ? STAFF_SECTION.status.top : (STAFF_SECTION.statusStandard?.top ?? STAFF_SECTION.status.top);

  return (
    <View style={styles.container}>
      {/* Staff Avatar or Initials */}
      <View style={[styles.avatarContainer, { left: avatarLeft * scaleX, top: avatarTop * scaleX }]}>
        {staff.avatar ? (
          <Image
            source={staff.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : staff.initials ? (
          <View style={styles.initialsCircle}>
            <Text style={styles.initialsText}>{String(staff.initials)}</Text>
          </View>
        ) : null}
      </View>

      {/* Staff Name */}
      <Text style={[styles.staffName, { left: nameLeft * scaleX, top: nameTop * scaleX }]}>
        {staff.name}
      </Text>

      {/* Status Text */}
      <Text style={[
        styles.statusText,
        !isPriority && styles.statusTextStandard,
        { 
          color: staff.statusColor,
          left: statusLeft * scaleX,
          top: statusTop * scaleX,
        }
      ]}>
        {staff.statusText}
      </Text>

      {/* Promise Time (if applicable) */}
      {staff.promiseTime && (
        <Text style={[styles.promiseTime, {
          left: STAFF_SECTION.promiseTime.left * scaleX,
          top: STAFF_SECTION.promiseTime.top * scaleX,
        }]}>
          {staff.promiseTime}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarContainer: {
    position: 'absolute',
    width: STAFF_SECTION.avatar.width * scaleX,
    height: STAFF_SECTION.avatar.height * scaleX,
  },
  avatar: {
    width: STAFF_SECTION.avatar.width * scaleX,
    height: STAFF_SECTION.avatar.height * scaleX,
    borderRadius: STAFF_SECTION.avatar.borderRadius * scaleX,
  },
  initialsCircle: {
    width: STAFF_SECTION.avatar.width * scaleX,
    height: STAFF_SECTION.avatar.height * scaleX,
    borderRadius: STAFF_SECTION.avatar.borderRadius * scaleX,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 17 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.white,
    lineHeight: 20 * scaleX,
  },
  staffName: {
    position: 'absolute',
    fontSize: STAFF_SECTION.name.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_SECTION.name.color,
    width: STAFF_SECTION.name.width * scaleX,
    lineHeight: STAFF_SECTION.name.lineHeight * scaleX,
  },
  statusText: {
    position: 'absolute',
    fontSize: STAFF_SECTION.status.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    lineHeight: STAFF_SECTION.status.lineHeight * scaleX,
    width: STAFF_SECTION.status.width * scaleX,
  },
  statusTextStandard: {
    width: STAFF_SECTION.statusStandard.width * scaleX,
  },
  promiseTime: {
    position: 'absolute',
    fontSize: STAFF_SECTION.promiseTime.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: STAFF_SECTION.promiseTime.color,
    lineHeight: STAFF_SECTION.promiseTime.lineHeight * scaleX,
    width: STAFF_SECTION.promiseTime.width * scaleX,
  },
});

