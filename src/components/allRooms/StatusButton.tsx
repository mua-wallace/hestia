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
        styles.containerIconOnly, 
        { 
          left: buttonLeft * scaleX,
          top: buttonTop * scaleX,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={config.icon}
        style={styles.iconLarge}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerIconOnly: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // No background, no border, no shadow - all statuses show icon only
  },
  iconLarge: {
    // All status icons use 134x70 size to match Figma design
    width: STATUS_BUTTON.iconInProgress.width * scaleX,
    height: STATUS_BUTTON.iconInProgress.height * scaleX,
  },
});

