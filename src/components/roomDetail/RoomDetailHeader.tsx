import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ROOM_DETAIL_HEADER } from '../../constants/roomDetailStyles';
import { STATUS_CONFIGS } from '../../types/allRooms.types';
import type { RoomStatus } from '../../types/allRooms.types';

interface RoomDetailHeaderProps {
  roomNumber: string;
  roomCode: string;
  status: RoomStatus;
  onBackPress: () => void;
  onStatusPress?: () => void;
  statusButtonRef?: React.RefObject<any>;
  customStatusText?: string; // Custom status text to display (e.g., "Return Later", "Promise Time", "Refuse Service")
  pausedAt?: string; // Time when room was paused (e.g., "11:22")
}

export default function RoomDetailHeader({
  roomNumber,
  roomCode,
  status,
  onBackPress,
  onStatusPress,
  statusButtonRef,
  customStatusText,
  pausedAt,
}: RoomDetailHeaderProps) {
  const statusConfig = STATUS_CONFIGS[status];
  
  // Use custom status text if provided, otherwise use the status config label
  const displayStatusText = customStatusText || statusConfig.label;
  
  // Use #202A2F for specific status options, otherwise use the status color
  const specialStatusColors = ['Return Later', 'Refuse Service', 'Pause', 'Promise Time', 'Promised Time'];
  const headerBackgroundColor = customStatusText && specialStatusColors.includes(customStatusText)
    ? '#202A2F'
    : statusConfig.color;

  // Determine which icon to use based on customStatusText or status
  const getStatusIcon = () => {
    if (customStatusText === 'Pause') {
      return require('../../../assets/icons/pause.png');
    }
    if (customStatusText === 'Refuse Service') {
      return require('../../../assets/icons/refuse-service.png');
    }
    if (customStatusText === 'Return Later') {
      return require('../../../assets/icons/return-later.png');
    }
    // Default to status-based icons
    if (status === 'InProgress') {
      return require('../../../assets/icons/in-progress-icon.png');
    }
    if (status === 'Dirty') {
      return require('../../../assets/icons/dirty-icon.png');
    }
    if (status === 'Cleaned') {
      return require('../../../assets/icons/cleaned-icon.png');
    }
    if (status === 'Inspected') {
      return require('../../../assets/icons/inspected-status-icon.png');
    }
    return statusConfig.icon;
  };

  const statusIconSource = getStatusIcon();
  
  // These icons have colored backgrounds, so don't apply tintColor
  const iconsWithColor = ['Pause', 'Refuse Service', 'Return Later'];
  const shouldTintIcon = !customStatusText || !iconsWithColor.includes(customStatusText);

  return (
    <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={require('../../../assets/icons/back-arrow.png')}
          style={styles.backArrow}
          tintColor="#FFFFFF"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Room Number */}
      <Text style={styles.roomNumber}>Room {roomNumber}</Text>

      {/* Room Code */}
      <Text style={styles.roomCode}>{roomCode}</Text>

      {/* Status Indicator */}
      <TouchableOpacity
        ref={statusButtonRef}
        style={styles.statusIndicator}
        onPress={onStatusPress}
        activeOpacity={0.8}
      >
        <Image
          source={statusIconSource}
          style={styles.statusIcon}
          resizeMode="contain"
          tintColor={shouldTintIcon ? "#FFFFFF" : undefined}
        />
        <Text style={styles.statusText}>{displayStatusText}</Text>
        <Image
          source={require('../../../assets/icons/dropdown-arrow.png')}
          style={styles.dropdownArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Paused Time - show when paused */}
      {pausedAt && (
        <Text style={styles.pausedTime}>Paused at {pausedAt}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ROOM_DETAIL_HEADER.height * scaleX,
    // backgroundColor is set dynamically based on status
    zIndex: 100, // Above all other content
    elevation: 100, // For Android
  },
  backButton: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.backButton.left * scaleX,
    top: ROOM_DETAIL_HEADER.backButton.top * scaleX,
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure it's above other elements
  },
  backArrow: {
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    // No transform - use icon directly as is
  },
  roomNumber: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_HEADER.roomNumber.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_DETAIL_HEADER.roomNumber.color,
    top: ROOM_DETAIL_HEADER.roomNumber.top * scaleX,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  roomCode: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_HEADER.roomCode.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_DETAIL_HEADER.roomCode.color,
    top: ROOM_DETAIL_HEADER.roomCode.top * scaleX,
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.statusIndicator.left * scaleX,
    top: ROOM_DETAIL_HEADER.statusIndicator.top * scaleX,
    width: ROOM_DETAIL_HEADER.statusIndicator.width * scaleX,
    height: ROOM_DETAIL_HEADER.statusIndicator.height * scaleX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    width: 24.367 * scaleX,
    height: 25.434 * scaleX,
    marginRight: 8 * scaleX,
  },
  statusText: {
    fontSize: 19 * scaleX,
    fontFamily: 'Helvetica',
    fontStyle: 'normal',
    fontWeight: '300' as any,
    lineHeight: undefined,
    color: '#FFF',
  },
  dropdownArrow: {
    width: 24.367 * scaleX,
    height: 25.434 * scaleX,
    marginLeft: 8 * scaleX,
    tintColor: '#ffffff',
    // No rotation - use icon directly as is
  },
  pausedTime: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (ROOM_DETAIL_HEADER.statusIndicator.top + ROOM_DETAIL_HEADER.statusIndicator.height + 8) * scaleX, // Below status indicator with 8px spacing
    fontSize: 14 * scaleX,
    fontFamily: 'Helvetica',
    fontWeight: 'light' as any,
    color: '#ffffff',
    textAlign: 'center',
  },
});

