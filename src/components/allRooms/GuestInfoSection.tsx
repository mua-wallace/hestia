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
  hasNotes?: boolean;
  category?: string; // To determine if it's Arrival vs Departure
}

export default function GuestInfoSection({ 
  guest, 
  priorityCount, 
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
  hasNotes = false,
  category = '',
}: GuestInfoSectionProps) {
  const isArrival = category === 'Arrival';
  const isDeparture = category === 'Departure';
  
  // Determine container left position
  let containerLeft: number;
  if (isPriority) {
    containerLeft = GUEST_INFO.container.left; // 73px
  } else if (hasNotes) {
    containerLeft = GUEST_INFO.containerWithNotes.left; // 77px
  } else {
    containerLeft = GUEST_INFO.containerStandard.left; // 80px
  }

  // Determine name top position
  let nameTop: number;
  if (isPriority) {
    nameTop = isSecondGuest ? GUEST_INFO.nameSecond.top : GUEST_INFO.name.top;
  } else if (hasNotes) {
    nameTop = GUEST_INFO.nameWithNotes.top;
  } else if (isArrival) {
    nameTop = GUEST_INFO.nameStandardArrival.top; // 87px for Arrival cards
  } else {
    nameTop = GUEST_INFO.nameStandard.top; // 92px for Departure cards
  }

  // Determine date range top position
  let dateTop: number;
  if (isPriority) {
    dateTop = isSecondGuest ? GUEST_INFO.dateRangeSecond.top : GUEST_INFO.dateRange.top;
  } else if (hasNotes) {
    dateTop = GUEST_INFO.dateRangeWithNotes.top;
  } else if (isArrival) {
    dateTop = GUEST_INFO.dateRangeStandardArrival.top; // 109px for Arrival cards
  } else {
    dateTop = GUEST_INFO.dateRangeStandard.top; // 114px for Departure cards
  }

  // Determine time (ETA/EDT) position - exact from Figma
  let timePos: { left: number; top: number };
  if (isPriority) {
    timePos = isSecondGuest 
      ? GUEST_INFO.time.positions.prioritySecond 
      : GUEST_INFO.time.positions.priorityFirst;
  } else if (hasNotes) {
    timePos = GUEST_INFO.time.positions.withNotes; // Room 203: left-[158px] top-[103px]
  } else if (isArrival) {
    timePos = GUEST_INFO.time.positions.standardArrival; // Room 204/205: left-[161px] top-[110px]
  } else {
    timePos = GUEST_INFO.time.positions.standardDeparture; // Room 202: left-[161px] top-[114px] (no ETA shown)
  }

  // Determine guest count position
  let countPos: { iconLeft: number; textLeft: number; top: number };
  if (isPriority) {
    countPos = isSecondGuest 
      ? GUEST_INFO.guestCount.positions.prioritySecond 
      : GUEST_INFO.guestCount.positions.priorityFirst;
  } else if (hasNotes) {
    countPos = GUEST_INFO.guestCount.positions.withNotes;
  } else if (isArrival) {
    countPos = GUEST_INFO.guestCount.positions.standardArrival; // For Arrival cards
  } else {
    countPos = GUEST_INFO.guestCount.positions.standardDeparture; // For Departure cards
  }

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
      
      {/* Priority Badge - positioned absolutely relative to card */}
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
      </View>

      {/* Time (ETA/EDT) - positioned using exact Figma values */}
      {guest.timeLabel && guest.time && timePos && (
        <Text style={[
          styles.time, 
          { 
            // Time positions in constants are relative to card
            // Container has left offset, so subtract containerLeft to position relative to container
            // Room 204: ETA at left-[161px] relative to card, container at left-[80px]
            // So ETA relative to container: 161 - 80 = 81px
            left: ((timePos.left ?? 0) - containerLeft) * scaleX,
            // Use exact top position from Figma (relative to card)
            // Room 204: ETA at top-[1134px] relative to card (1134-1024=110px)
            // Room 203: ETA at top-[874px] relative to card (874-771=103px)
            top: (timePos.top ?? 0) * scaleX,
          }
        ]}>
          {guest.timeLabel}: {guest.time}
        </Text>
      )}

      {/* Guest Count */}
      {countPos && (
        <View style={[styles.countRow, { top: (countPos.top ?? 0) * scaleX }]}>
          <Image
            source={require('../../../assets/icons/rooms/guest-icon.png')}
            style={[styles.countIcon, { left: ((countPos.iconLeft ?? 0) - containerLeft) * scaleX }]}
            resizeMode="contain"
          />
          <Text style={[styles.countText, { left: ((countPos.textLeft ?? 0) - containerLeft) * scaleX }]}>
            {guest.guestCount || ''}
          </Text>
        </View>
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
  },
});

