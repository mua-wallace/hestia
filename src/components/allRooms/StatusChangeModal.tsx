import React from 'react';
import { Modal, TouchableOpacity, StyleSheet, Dimensions, View, Text } from 'react-native';
import { RoomStatus, StatusChangeOption, STATUS_OPTIONS, RoomCardData } from '../../types/allRooms.types';
import { STATUS_BUTTON, CARD_DIMENSIONS, scaleX } from '../../constants/allRoomsStyles';
import { typography } from '../../theme';
import StatusOptionItem from './StatusOptionItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;

interface StatusChangeModalProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: StatusChangeOption) => void;
  currentStatus: RoomStatus;
  room?: RoomCardData; // Room data to calculate position
  cardTop?: number; // Card top position for modal placement
}

export default function StatusChangeModal({
  visible,
  onClose,
  onStatusSelect,
  currentStatus,
  room,
  cardTop = 0,
}: StatusChangeModalProps) {
  const handleStatusSelect = (option: StatusChangeOption) => {
    onStatusSelect(option);
    onClose();
  };

  if (!room) return null;

  // Calculate card height based on card type
  const isArrivalDeparture = room.category === 'Arrival/Departure';
  let cardHeight: number;
  if (isArrivalDeparture) {
    cardHeight = CARD_DIMENSIONS.heights.arrivalDeparture; // 292px
  } else if (room.notes) {
    cardHeight = CARD_DIMENSIONS.heights.withNotes; // 222px
  } else if (room.category === 'Departure') {
    cardHeight = CARD_DIMENSIONS.heights.standard; // 177px
  } else {
    cardHeight = CARD_DIMENSIONS.heights.withGuestInfo; // 185px
  }

  // Calculate status button position based on card type
  let buttonLeft: number;
  let buttonTop: number;

  if (isArrivalDeparture) {
    buttonLeft = STATUS_BUTTON.positions.arrivalDeparture.left;
    buttonTop = STATUS_BUTTON.positions.arrivalDeparture.top;
  } else if (room.notes) {
    buttonLeft = STATUS_BUTTON.positions.arrivalWithNotes.left;
    buttonTop = STATUS_BUTTON.positions.arrivalWithNotes.top;
  } else if (room.category === 'Departure') {
    buttonLeft = STATUS_BUTTON.positions.departure.left;
    buttonTop = STATUS_BUTTON.positions.departure.top;
  } else {
    buttonLeft = STATUS_BUTTON.positions.standard.left;
    buttonTop = STATUS_BUTTON.positions.standard.top;
  }

  // Calculate modal position: card top + card height + margin (modal appears below card)
  // cardTop is already in screen coordinates (from measureInWindow)
  // The modal should appear with spacing below the card to keep the In Progress button visible
  // Based on Figma: modal appears below the card with spacing
  const spacing = 20 * scaleX; // Increased spacing from card bottom to keep button visible
  const modalTopPosition = cardTop + cardHeight * scaleX + spacing;

  // Status button center relative to card (button is 134px wide, so center is at left + 67px)
  const statusButtonCenterRelativeToCard = buttonLeft + 67;
  
  // Triangle position relative to modal container
  // Triangle should be centered on the status button center
  // Triangle base is 24px (12px + 12px), so left position = buttonCenter - 12
  const triangleLeft = statusButtonCenterRelativeToCard - 12;
  
  // Calculate triangle vertical position to point to the status button
  // Triangle should point upward to the status button
  // Using a simpler approach: position triangle at top of modal (negative top value)
  // Adjust the offset to move it down (less negative) to better point to button
  const triangleTopOffset = -10 * scaleX; // Start with -10px above modal, adjust as needed

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop - transparent, just for closing modal */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Modal Container - positioned below the card, full width with small margins */}
        <View style={[styles.modalWrapper, { top: modalTopPosition }]} pointerEvents="box-none">
          {/* Triangle Pointer - pointing up to status button */}
          <View
            style={[
              styles.trianglePointer,
              { 
                left: triangleLeft * scaleX,
                top: triangleTopOffset,
              },
            ]}
          />
          
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Change Status Header Text */}
            <Text style={styles.headerText}>Change status</Text>
            
            <View style={styles.optionsGrid}>
              {STATUS_OPTIONS.map((option) => (
                <StatusOptionItem
                  key={option.id}
                  icon={option.icon}
                  label={option.label}
                  onPress={() => handleStatusSelect(option.id)}
                />
              ))}
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    position: 'absolute',
    left: CARD_DIMENSIONS.marginHorizontal * scaleX, // Small margin from left (7px)
    width: CARD_DIMENSIONS.width * scaleX, // Full card width (426px) - matches card width
    // Position will be set dynamically based on card position
    zIndex: 1000,
  },
  trianglePointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12 * scaleX,
    borderRightWidth: 12 * scaleX,
    borderBottomWidth: 10 * scaleX,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    marginBottom: -1, // Overlap slightly to remove any gap
    position: 'absolute',
    // Top position is set dynamically via inline style (triangleTopOffset)
  },
  modalContainer: {
    width: '100%', // Full width of modalWrapper
    backgroundColor: '#ffffff',
    borderRadius: 12 * scaleX,
    padding: 20 * scaleX,
    paddingBottom: 16 * scaleX,
    shadowColor: 'rgba(100, 131, 176, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 35 * scaleX,
    elevation: 10,
  },
  headerText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#1e1e1e',
    marginBottom: 16 * scaleX,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
