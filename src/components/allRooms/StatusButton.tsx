import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { RoomStatus, STATUS_CONFIGS } from '../../types/allRooms.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface StatusButtonProps {
  status: RoomStatus;
  onPress: () => void;
}

export default function StatusButton({ status, onPress }: StatusButtonProps) {
  const config = STATUS_CONFIGS[status];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: config.color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={config.icon}
        style={styles.icon}
        resizeMode="contain"
      />
      
      {/* Chevron arrow */}
      <Image
        source={require('../../../assets/icons/home/menu-icon.png')}
        style={styles.chevron}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 14 * scaleX,
    top: 50 * scaleX,
    width: 134 * scaleX,
    height: 70 * scaleX,
    borderRadius: 35 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(100, 131, 176, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: 30 * scaleX,
    height: 30 * scaleX,
  },
  chevron: {
    position: 'absolute',
    right: 12 * scaleX,
    width: 7 * scaleX,
    height: 14 * scaleX,
  },
});

