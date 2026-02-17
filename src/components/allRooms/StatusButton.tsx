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

const StatusButton = forwardRef<any, StatusButtonProps>(({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
}, ref) => {
  // Safety check: ensure status is valid and config exists
  if (!status || !STATUS_CONFIGS[status]) {
    return null; // Return null if status is invalid or config doesn't exist
  }
  
  const config = STATUS_CONFIGS[status];
  
  // Determine button position based on card type
  // Status button should be right-aligned with consistent right margin
  const CARD_WIDTH = 426;
  const RIGHT_MARGIN = 15; // Consistent margin from right edge
  let buttonRight: number;
  let buttonTop: number;
  
  if (isArrivalDeparture) {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.arrivalDeparture.top;
  } else if (hasNotes) {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.arrivalWithNotes.top;
  } else if (status === 'Dirty') {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.departure.top;
  } else {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.standard.top;
  }

  // Safety check: ensure config exists before rendering
  if (!config) {
    return null;
  }

  // Icon-only status button - always displays houseKeepingStatus (Dirty, In Progress, Cleaned, Inspected)
  if (!config.icon) {
    return null;
  }

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.containerIconOnly, 
        { 
          right: buttonRight * scaleX,
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
  },
  containerFlagged: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  flagIcon: {
    width: STATUS_BUTTON.flagged.flagIcon.width * scaleX,
    height: STATUS_BUTTON.flagged.flagIcon.height * scaleX,
  },
  dropdownIcon: {
    width: STATUS_BUTTON.icon.width * scaleX,
    height: STATUS_BUTTON.icon.height * scaleX,
  },
  icon: {
    width: STATUS_BUTTON.icon.width * scaleX,
    height: STATUS_BUTTON.icon.height * scaleX,
  },
  iconLarge: {
    width: STATUS_BUTTON.iconInProgress.width * scaleX,
    height: STATUS_BUTTON.iconInProgress.height * scaleX,
  },
});

