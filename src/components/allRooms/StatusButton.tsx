import React, { forwardRef } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RoomStatus, STATUS_CONFIGS } from '../../types/allRooms.types';
import { scaleX, STATUS_BUTTON, CARD_DIMENSIONS, STAFF_SECTION } from '../../constants/allRoomsStyles';

interface StatusButtonProps {
  status: RoomStatus;
  onPress: () => void;
  isPriority?: boolean;
  isArrivalDeparture?: boolean;
  hasNotes?: boolean;
  frontOfficeStatus?: string; // To identify Arrival vs Departure vs Stayover etc.
  /** Card height in px. When set, button is vertically and horizontally centered in the right column. */
  cardHeight?: number;
}

const StatusButton = forwardRef<any, StatusButtonProps>(({ 
  status, 
  onPress,
  isPriority = false,
  isArrivalDeparture = false,
  hasNotes = false,
  frontOfficeStatus = '',
  cardHeight,
}, ref) => {
  // Safety check: ensure status is valid and config exists
  if (!status || !STATUS_CONFIGS[status]) {
    return null; // Return null if status is invalid or config doesn't exist
  }
  
  const config = STATUS_CONFIGS[status];
  const buttonWidth = STATUS_BUTTON.width * scaleX;
  const buttonHeight = STATUS_BUTTON.height * scaleX;
  
  // Center horizontally in the right column (from divider to card right edge)
  const rightColumnLeft = STAFF_SECTION.dividerStandard.left * scaleX;
  const cardWidthScaled = CARD_DIMENSIONS.width * scaleX;
  const rightColumnWidth = cardWidthScaled - rightColumnLeft;
  const buttonLeft = rightColumnLeft + (rightColumnWidth - buttonWidth) / 2;
  
  // Center vertically in the card when cardHeight is provided
  const buttonTop = cardHeight != null && cardHeight > 0
    ? (cardHeight - buttonHeight) / 2
    : null;

  // Safety check: ensure config exists before rendering
  if (!config) {
    return null;
  }

  // Icon-only status button - always displays houseKeepingStatus (Dirty, In Progress, Cleaned, Inspected)
  if (!config.icon) {
    return null;
  }

  // When cardHeight is set, use centered position; otherwise fall back to legacy top (for callers that don't pass cardHeight)
  const legacyTop = isArrivalDeparture
    ? STATUS_BUTTON.positions.arrivalDeparture.top
    : hasNotes
      ? STATUS_BUTTON.positions.arrivalWithNotes.top
      : STATUS_BUTTON.positions.standard.top;
  const top = buttonTop ?? legacyTop * scaleX;

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.containerIconOnly,
        {
          width: buttonWidth,
          height: buttonHeight,
          borderRadius: STATUS_BUTTON.borderRadius * scaleX,
          backgroundColor: config.color,
          left: buttonLeft,
          top,
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

