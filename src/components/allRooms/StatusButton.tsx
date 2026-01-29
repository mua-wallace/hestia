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
  flagged?: boolean;
}

const StatusButton = forwardRef<any, StatusButtonProps>(({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
  flagged = false,
}, ref) => {
  // Safety check: ensure status is valid and config exists
  if (!status || !STATUS_CONFIGS[status]) {
    return null; // Return null if status is invalid or config doesn't exist
  }
  
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

  // Safety check: ensure config exists before rendering
  if (!config) {
    return null;
  }

  // Flagged: same position/size and edge spacing as in-progress/dropdown status button (chevron.right = 12px); only background, borderRadius and icons differ
  if (flagged) {
    return (
      <TouchableOpacity
        ref={ref}
        style={[
          styles.containerFlagged,
          {
            left: buttonLeft * scaleX,
            top: buttonTop * scaleX,
            width: STATUS_BUTTON.width * scaleX,
            height: STATUS_BUTTON.height * scaleX,
            borderRadius: STATUS_BUTTON.flagged.borderRadius * scaleX,
            backgroundColor: STATUS_BUTTON.flagged.background,
            paddingHorizontal: STATUS_BUTTON.chevron.right * scaleX,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../../assets/icons/flag.png')}
          style={styles.flagIcon}
          resizeMode="contain"
          tintColor={STATUS_BUTTON.flagged.iconTint}
        />
        <Image
          source={require('../../../assets/icons/dropdown-arrow.png')}
          style={styles.dropdownIcon}
          resizeMode="contain"
          tintColor={STATUS_BUTTON.flagged.iconTint}
        />
      </TouchableOpacity>
    );
  }

  // Default: icon-only status button
  if (!config.icon) {
    return null;
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

