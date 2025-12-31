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
  room?: RoomCardData; // Room data
  buttonPosition?: { x: number; y: number; width: number; height: number } | null; // Status button position on screen
}

export default function StatusChangeModal({
  visible,
  onClose,
  onStatusSelect,
  currentStatus,
  room,
  buttonPosition,
}: StatusChangeModalProps) {
  const handleStatusSelect = (option: StatusChangeOption) => {
    onStatusSelect(option);
    onClose();
  };

  if (!room || !buttonPosition) return null;

  // Calculate modal position: below the status button with margin
  // buttonPosition.y is the top of the button, buttonPosition.height is the button height
  // So buttonPosition.y + buttonPosition.height gives us the bottom of the button
  const spacing = 20 * scaleX; // Margin between button and modal (increased for better triangle visibility)
  const modalTopPosition = buttonPosition.y + buttonPosition.height + spacing;
  
  // Debug: log positions to verify
  console.log('Button position:', buttonPosition);
  console.log('Modal top position:', modalTopPosition);
  console.log('Button center X:', buttonPosition.x + buttonPosition.width / 2);

  // Status button center X position on screen (already in screen pixels, scaled)
  const buttonCenterX = buttonPosition.x + buttonPosition.width / 2;
  
  // Modal width (scaled) - full card width
  const modalWidth = CARD_DIMENSIONS.width * scaleX; // 426px scaled (full card width)
  
  // Triangle base width (12px on each side = 24px total)
  const triangleBaseWidth = 24 * scaleX;
  const triangleHalfWidth = 12 * scaleX; // Half of triangle base
  
  // Calculate modal left position to align triangle center with button center
  // We want: modalLeft + triangleLeft + triangleHalfWidth = buttonCenterX
  // So: modalLeft = buttonCenterX - triangleLeft - triangleHalfWidth
  // For optimal centering, we want triangleLeft to be at a reasonable position
  // Let's try to center the modal's triangle on the button center
  // Start with modal centered on button, then adjust
  let modalLeft = buttonCenterX - (modalWidth / 2);
  
  // Ensure modal doesn't go off screen and add margin
  const screenMargin = 7 * scaleX; // Match card margin
  const modalMargin = 7 * scaleX; // Margin for modal (same as card margin)
  
  // Ensure modal doesn't go off screen (accounting for margin)
  if (modalLeft < screenMargin + modalMargin) {
    modalLeft = screenMargin + modalMargin;
  } else if (modalLeft + modalWidth > SCREEN_WIDTH - screenMargin - modalMargin) {
    modalLeft = SCREEN_WIDTH - modalWidth - screenMargin - modalMargin;
  }
  
  // Triangle position relative to modal container
  // Triangle should be centered on the button center
  // triangleLeft (in design pixels, will be scaled in style) = (buttonCenterX - modalLeft - triangleHalfWidth) / scaleX
  const triangleLeft = (buttonCenterX - modalLeft - triangleHalfWidth) / scaleX;
  
  // Triangle points upward (from modal to button), positioned at top of modal
  // Position it at the very top of the modal container (0) so it's visible
  const triangleTopOffset = -10 * scaleX; // Position triangle above modal top to point upward to button

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
        {/* Modal Container - positioned below the status button */}
        <View style={[styles.modalWrapper, { top: modalTopPosition, left: modalLeft }]} pointerEvents="box-none">
          {/* Triangle Pointer - pointing up to status button */}
          <View
            style={[
              styles.trianglePointer,
              { 
                left: triangleLeft * scaleX, // triangleLeft is in design pixels, scale it
                top: triangleTopOffset,
              },
            ]}
            pointerEvents="none"
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
    width: CARD_DIMENSIONS.width * scaleX, // Full card width (426px) - matches card width
    marginHorizontal: 7 * scaleX, // Margin on left and right (same as card margin)
    // Top and left positions are set dynamically based on button position
    zIndex: 1000,
    overflow: 'visible', // Allow triangle to be visible outside container bounds
  },
  trianglePointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12 * scaleX,
    borderRightWidth: 12 * scaleX,
    borderBottomWidth: 10 * scaleX, // Points upward (from modal to button above)
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ffffff',
    marginBottom: -1, // Overlap slightly to remove any gap
    position: 'absolute',
    zIndex: 1001, // Ensure triangle is above modal container
    // Add shadow to match modal shadow
    shadowColor: 'rgba(100, 131, 176, 0.4)',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    // Left and top positions are set dynamically via inline style
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
