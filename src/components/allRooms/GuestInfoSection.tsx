import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';
import { GuestInfo } from '../../types/allRooms.types';
import { scaleX, GUEST_INFO } from '../../constants/allRoomsStyles';

interface GuestInfoSectionProps {
  guest: GuestInfo;
  priorityCount?: number;
  isPriority?: boolean;
  isFirstGuest?: boolean;
  isSecondGuest?: boolean;
}

export default function GuestInfoSection({ 
  guest, 
  priorityCount, 
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
}: GuestInfoSectionProps) {
  const containerLeft = isPriority ? GUEST_INFO.container.left : GUEST_INFO.containerStandard.left;
  const nameTop = isSecondGuest 
    ? GUEST_INFO.nameSecond.top 
    : (isPriority ? GUEST_INFO.name.top : GUEST_INFO.nameStandard.top);
  const dateTop = isSecondGuest 
    ? GUEST_INFO.dateRangeSecond.top 
    : (isPriority ? GUEST_INFO.dateRange.top : GUEST_INFO.dateRangeStandard.top);
  const timeLeft = isPriority ? GUEST_INFO.time.left : GUEST_INFO.timeStandard.left;
  const timeTop = isSecondGuest 
    ? GUEST_INFO.timeSecond.top 
    : (isPriority ? GUEST_INFO.time.top : GUEST_INFO.timeStandard.top);
  const countIconLeft = isPriority ? GUEST_INFO.guestCount.iconLeft : GUEST_INFO.guestCountStandard.iconLeft;
  const countTextLeft = isPriority ? GUEST_INFO.guestCount.textLeft : GUEST_INFO.guestCountStandard.textLeft;
  const countTop = isSecondGuest 
    ? GUEST_INFO.guestCountSecond.top 
    : (isPriority ? GUEST_INFO.guestCount.top : GUEST_INFO.guestCountStandard.top);

  // Priority badge positioning from Figma
  const priorityBadgeLeft = isPriority 
    ? (isSecondGuest ? 152 : 182) // Room 201: first guest 182px, second guest 152px
    : 185; // Room 203: 185px relative to card
  const priorityBadgeTop = isPriority
    ? (isSecondGuest ? 164 : 89) // Room 201: first guest 89px, second guest 164px
    : 82; // Room 203: 853-771=82px relative to card

  return (
    <View style={[styles.container, { left: containerLeft * scaleX }]}>
      {/* Guest Icon and Name */}
      <View style={[styles.guestRow, { top: nameTop * scaleX }]}>
        <Image
          source={require('../../../assets/icons/rooms/guest-icon.png')}
          style={styles.guestIcon}
          resizeMode="contain"
        />
        <Text style={styles.guestName}>{guest.name}</Text>
      </View>
      
      {/* Priority Badge - positioned absolutely */}
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
        {guest.timeLabel && guest.time && (
          <Text style={[styles.time, { left: timeLeft * scaleX }]}>
            {guest.timeLabel}: {guest.time}
          </Text>
        )}
      </View>

      {/* Guest Count */}
      <View style={[styles.countRow, { top: countTop * scaleX }]}>
        <Image
          source={require('../../../assets/icons/rooms/guest-icon.png')}
          style={[styles.countIcon, { left: countIconLeft * scaleX }]}
          resizeMode="contain"
        />
        <Text style={[styles.countText, { left: countTextLeft * scaleX }]}>{guest.guestCount}</Text>
      </View>
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
  },
  guestIcon: {
    width: GUEST_INFO.icon.width * scaleX,
    height: GUEST_INFO.icon.height * scaleX,
    marginRight: 4 * scaleX,
    tintColor: '#334866',
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
    gap: 8 * scaleX,
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
    top: 0,
  },
  countRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
  },
  countIcon: {
    position: 'absolute',
    width: GUEST_INFO.icon.width * scaleX,
    height: GUEST_INFO.icon.height * scaleX,
    top: 0,
    tintColor: '#334866',
  },
  countText: {
    position: 'absolute',
    fontSize: GUEST_INFO.guestCount.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: GUEST_INFO.guestCount.color,
    lineHeight: GUEST_INFO.guestCount.lineHeight * scaleX,
    top: 0,
    marginLeft: 4 * scaleX,
  },
});

