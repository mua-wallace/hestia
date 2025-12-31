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
  profilePicture?: any;
  onBackPress: () => void;
  onStatusPress?: () => void;
}

export default function RoomDetailHeader({
  roomNumber,
  roomCode,
  status,
  profilePicture,
  onBackPress,
  onStatusPress,
}: RoomDetailHeaderProps) {
  const statusConfig = STATUS_CONFIGS[status];

  return (
    <View style={styles.headerContainer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/icons/back-arrow.png')}
          style={styles.backArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Room Number */}
      <Text style={styles.roomNumber}>Room {roomNumber}</Text>

      {/* Room Code */}
      <Text style={styles.roomCode}>{roomCode}</Text>

      {/* Status Indicator */}
      <TouchableOpacity
        style={styles.statusIndicator}
        onPress={onStatusPress}
        activeOpacity={0.8}
      >
        <Image
          source={statusConfig.icon}
          style={styles.statusIcon}
          resizeMode="contain"
        />
        <Text style={styles.statusText}>{statusConfig.label}</Text>
        <Image
          source={require('../../../assets/icons/down-arrow.png')}
          style={styles.dropdownArrow}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Profile Picture */}
      {profilePicture && (
        <Image
          source={profilePicture}
          style={styles.profilePicture}
          resizeMode="cover"
        />
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
    backgroundColor: ROOM_DETAIL_HEADER.backgroundColor,
    zIndex: 10, // Above background
  },
  backButton: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.backButton.left * scaleX,
    top: ROOM_DETAIL_HEADER.backButton.top * scaleX,
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    width: ROOM_DETAIL_HEADER.backButton.width * scaleX,
    height: ROOM_DETAIL_HEADER.backButton.height * scaleX,
    transform: [{ rotate: '270deg' }], // Rotate to point left
  },
  roomNumber: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_HEADER.roomNumber.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_DETAIL_HEADER.roomNumber.color,
    top: ROOM_DETAIL_HEADER.roomNumber.top * scaleX,
    left: '50%',
    transform: [{ translateX: -59 * scaleX }], // Center: calc(50%-59px)
  },
  roomCode: {
    position: 'absolute',
    fontSize: ROOM_DETAIL_HEADER.roomCode.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: ROOM_DETAIL_HEADER.roomCode.color,
    top: ROOM_DETAIL_HEADER.roomCode.top * scaleX,
    left: '50%',
    transform: [{ translateX: -42 * scaleX }], // Center: calc(50%-42px)
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
    width: 20 * scaleX,
    height: 20 * scaleX,
    marginRight: 8 * scaleX,
  },
  statusText: {
    fontSize: ROOM_DETAIL_HEADER.statusIndicator.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ROOM_DETAIL_HEADER.statusIndicator.color,
  },
  dropdownArrow: {
    width: 11 * scaleX,
    height: 22 * scaleX,
    marginLeft: 8 * scaleX,
    tintColor: '#ffffff',
    transform: [{ rotate: '270deg' }], // Point down
  },
  profilePicture: {
    position: 'absolute',
    left: ROOM_DETAIL_HEADER.profilePicture.left * scaleX,
    top: ROOM_DETAIL_HEADER.profilePicture.top * scaleX,
    width: ROOM_DETAIL_HEADER.profilePicture.width * scaleX,
    height: ROOM_DETAIL_HEADER.profilePicture.height * scaleX,
    borderRadius: (ROOM_DETAIL_HEADER.profilePicture.width / 2) * scaleX,
  },
});

