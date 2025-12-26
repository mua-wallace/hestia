import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RoomStatus, STATUS_CONFIGS } from '../../types/allRooms.types';
import { scaleX, STATUS_BUTTON } from '../../constants/allRoomsStyles';

interface StatusButtonProps {
  status: RoomStatus;
  onPress: () => void;
  isPriority?: boolean;
  isArrivalDeparture?: boolean;
  hasNotes?: boolean;
}

export default function StatusButton({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
}: StatusButtonProps) {
  const config = STATUS_CONFIGS[status];
  
  // Determine button position based on card type
  let buttonLeft: number;
  let buttonTop: number;
  
  if (isArrivalDeparture) {
    buttonLeft = STATUS_BUTTON.positions.arrivalDeparture.left;
    buttonTop = STATUS_BUTTON.positions.arrivalDeparture.top;
  } else if (hasNotes) {
    buttonLeft = STATUS_BUTTON.positions.arrivalWithNotes.left;
    buttonTop = STATUS_BUTTON.positions.arrivalWithNotes.top;
  } else if (status === 'Dirty') {
    buttonLeft = STATUS_BUTTON.positions.departure.left;
    buttonTop = STATUS_BUTTON.positions.departure.top;
  } else {
    buttonLeft = STATUS_BUTTON.positions.standard.left;
    buttonTop = STATUS_BUTTON.positions.standard.top;
  }

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: config.color,
          left: buttonLeft * scaleX,
          top: buttonTop * scaleX,
        }
      ]}
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
        source={require('../../../assets/icons/menu-icon.png')}
        style={styles.chevron}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: STATUS_BUTTON.width * scaleX,
    height: STATUS_BUTTON.height * scaleX,
    borderRadius: STATUS_BUTTON.borderRadius * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(100, 131, 176, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    width: STATUS_BUTTON.icon.width * scaleX,
    height: STATUS_BUTTON.icon.height * scaleX,
  },
  chevron: {
    position: 'absolute',
    right: STATUS_BUTTON.chevron.right * scaleX,
    width: STATUS_BUTTON.chevron.width * scaleX,
    height: STATUS_BUTTON.chevron.height * scaleX,
  },
});

