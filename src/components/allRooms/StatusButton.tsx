import React, { forwardRef } from 'react';
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

const StatusButton = forwardRef<TouchableOpacity, StatusButtonProps>(({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
}, ref) => {
  const config = STATUS_CONFIGS[status];
  const isInProgress = status === 'InProgress';
  const isDirty = status === 'Dirty';
  const isCleaned = status === 'Cleaned';
  const isInspected = status === 'Inspected';
  const showIconOnly = isInProgress || isDirty || isCleaned || isInspected; // All statuses show icon only
  
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
      ref={ref}
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
});

export default StatusButton;

const styles = StyleSheet.create({
  containerIconOnly: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // No background, no border, no shadow for icon-only statuses (InProgress, Dirty, Cleaned, Inspected)
  },
  icon: {
    width: STATUS_BUTTON.icon.width * scaleX,
    height: STATUS_BUTTON.icon.height * scaleX,
  },
  iconLarge: {
    // Larger icon size for icon-only statuses (InProgress, Dirty, Cleaned, Inspected) to match Figma design
    width: STATUS_BUTTON.iconInProgress.width * scaleX,
    height: STATUS_BUTTON.iconInProgress.height * scaleX,
  },
});

