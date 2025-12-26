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
  const isInProgress = status === 'InProgress';
  const isDirty = status === 'Dirty';
  const showIconOnly = isInProgress || isDirty; // Both InProgress and Dirty show icon only
  
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
        showIconOnly ? styles.containerIconOnly : styles.container, 
        { 
          backgroundColor: showIconOnly ? 'transparent' : config.color,
          left: buttonLeft * scaleX,
          top: buttonTop * scaleX,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={config.icon}
        style={showIconOnly ? styles.iconLarge : styles.icon}
        resizeMode="contain"
      />
      
      {/* Chevron arrow - only show for statuses with background */}
      {!showIconOnly && (
        <Image
          source={require('../../../assets/icons/forward-arrow-icon.png')}
          style={styles.chevron}
          resizeMode="contain"
        />
      )}
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
  containerIconOnly: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // No background, no border, no shadow for icon-only statuses (InProgress, Dirty)
  },
  icon: {
    width: STATUS_BUTTON.icon.width * scaleX,
    height: STATUS_BUTTON.icon.height * scaleX,
  },
  iconLarge: {
    // Larger icon size for icon-only statuses (InProgress, Dirty) to match Figma design
    width: STATUS_BUTTON.iconInProgress.width * scaleX,
    height: STATUS_BUTTON.iconInProgress.height * scaleX,
  },
  chevron: {
    position: 'absolute',
    right: STATUS_BUTTON.chevron.right * scaleX,
    width: STATUS_BUTTON.chevron.width * scaleX,
    height: STATUS_BUTTON.chevron.height * scaleX,
    tintColor: '#1e1e1e', // Light black color for better visibility
  },
});

