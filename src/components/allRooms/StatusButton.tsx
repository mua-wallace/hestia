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
  frontOfficeStatus?: string; // To identify Arrival vs Departure vs Stayover etc.
}

const StatusButton = forwardRef<any, StatusButtonProps>(({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
  frontOfficeStatus = '',
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
  
  const isArrival = frontOfficeStatus === 'Arrival';
  const isDeparture = frontOfficeStatus === 'Departure';
  
  if (isArrivalDeparture) {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.arrivalDeparture.top;
  } else if (hasNotes) {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.arrivalWithNotes.top;
  } else if (isDeparture || status === 'Dirty') {
    buttonRight = RIGHT_MARGIN;
    buttonTop = STATUS_BUTTON.positions.departure.top;
  } else if (isArrival) {
    // For Arrival cards, vertically center status button with guest image
    // Guest image: top: 87px, height: 65px, so center is at 87 + 32.5 = 119.5px
    // Status button height: 70px, so to center it with image: top = 119.5 - 35 = 84.5px ≈ 85px
    buttonRight = RIGHT_MARGIN;
    buttonTop = 85; // Vertically centered with guest image (image center at 119.5px, button center at 119.5px)
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
          width: STATUS_BUTTON.width * scaleX,
          height: STATUS_BUTTON.height * scaleX,
          borderRadius: STATUS_BUTTON.borderRadius * scaleX,
          backgroundColor: config.color,
          right: buttonRight * scaleX,
          top: buttonTop * scaleX,
        },
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

