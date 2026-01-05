import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ROOM_DETAIL_HEADER, ASSIGNED_TO } from '../../constants/roomDetailStyles';
import { RETURN_LATER_MODAL } from '../../constants/returnLaterModalStyles';
import { ShiftType } from '../../types/home.types';
import TimeSuggestionsContainer from './TimeSuggestionsContainer';
import AMPMToggle from '../home/AMPMToggle';
import TimePickerContainer from './TimePickerContainer';
import ReturnLaterConfirmButton from './ReturnLaterConfirmButton';

const TIME_SUGGESTIONS = ['10 mins', '20 mins', '30 mins', '1 Hour'];

interface ReturnLaterModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (returnTime: string, period: 'AM' | 'PM') => void;
  roomNumber?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
  };
  onReassignPress?: () => void;
}

export default function ReturnLaterModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
  assignedTo,
  onReassignPress,
}: ReturnLaterModalProps) {
  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    const hour24 = now.getHours();
    const minute = now.getMinutes();
    const period: ShiftType = hour24 >= 12 ? 'PM' : 'AM';
    return { hour24, minute, period };
  };

  const currentTime = getCurrentTime();
  
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState(currentTime.hour24);
  const [selectedMinute, setSelectedMinute] = useState(currentTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<ShiftType>(currentTime.period);

  // Update to current time when modal opens
  useEffect(() => {
    if (visible) {
      const { hour24, minute, period } = getCurrentTime();
      setSelectedHour(hour24);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
      setSelectedSuggestion(null); // Clear any selected suggestion
    }
  }, [visible]);

  const handleSuggestionPress = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    // Parse suggestion and add to current time
    const now = new Date();
    if (suggestion === '1 Hour') {
      const newTime = new Date(now.getTime() + 60 * 60 * 1000); // Add 1 hour
      const hour24 = newTime.getHours();
      const minute = newTime.getMinutes();
      const period: ShiftType = hour24 >= 12 ? 'PM' : 'AM';
      setSelectedHour(hour24);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    } else {
      const minutesToAdd = parseInt(suggestion.replace(' mins', ''));
      const newTime = new Date(now.getTime() + minutesToAdd * 60 * 1000); // Add minutes
      const hour24 = newTime.getHours();
      const minute = newTime.getMinutes();
      const period: ShiftType = hour24 >= 12 ? 'PM' : 'AM';
      setSelectedHour(hour24);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    }
  };

  const handleConfirm = () => {
    const hour12 = selectedHour === 0 ? 12 : selectedHour > 12 ? selectedHour - 12 : selectedHour;
    const timeString = `${hour12.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onConfirm(timeString, selectedPeriod);
    
    // Reset state to current time
    const { hour24, minute, period } = getCurrentTime();
    setSelectedSuggestion(null);
    setSelectedHour(hour24);
    setSelectedMinute(minute);
    setSelectedPeriod(period);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Modal Overlay - Full screen white background starting after header */}
        <View style={styles.modalOverlay}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Return Later</Text>

            {/* Instruction */}
            <Text style={styles.instruction}>
              Add time slot for when the Guest wants you to return
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Suggestions Label */}
            <Text style={styles.suggestionsLabel}>Suggestions</Text>

            {/* Time Suggestions */}
            <View style={styles.suggestionsContainer}>
              <TimeSuggestionsContainer
                suggestions={TIME_SUGGESTIONS}
                selectedSuggestion={selectedSuggestion}
                onSuggestionSelect={handleSuggestionPress}
              />
            </View>

            {/* AM/PM Toggle */}
            <View style={styles.toggleContainer}>
              <AMPMToggle
                selected={selectedPeriod}
                onToggle={(period: ShiftType) => setSelectedPeriod(period)}
              />
            </View>

            {/* Time Picker */}
            <View style={styles.timePickerContainer}>
              <TimePickerContainer
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                selectedPeriod={selectedPeriod}
                onHourChange={setSelectedHour}
                onMinuteChange={setSelectedMinute}
              />
            </View>

            {/* Confirm Button */}
            <View style={styles.confirmButtonContainer}>
              <ReturnLaterConfirmButton onPress={handleConfirm} />
            </View>

            {/* Assigned to Section - At the bottom */}
            {assignedTo && (
              <View style={styles.assignedToSection}>
                <Text style={styles.assignedToTitle}>Assigned to</Text>
                <Image
                  source={assignedTo.avatar || require('../../../assets/icons/profile-avatar.png')}
                  style={styles.assignedToAvatar}
                  resizeMode="cover"
                />
                <Text style={styles.assignedToName}>{assignedTo.name}</Text>
                  {onReassignPress && (
                    <TouchableOpacity
                      style={styles.reassignButton}
                      onPress={() => {
                        console.log('Reassign button pressed in ReturnLaterModal');
                        onClose(); // Close this modal first
                        // Use requestAnimationFrame to ensure state update happens after render
                        requestAnimationFrame(() => {
                          setTimeout(() => {
                            console.log('Calling onReassignPress');
                            onReassignPress();
                          }, 100);
                        });
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.reassignButtonText}>Reassign</Text>
                    </TouchableOpacity>
                  )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    position: 'absolute',
    top: RETURN_LATER_MODAL.overlay.top * scaleX, // Start at 213px to match Figma
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100 * scaleX, // Extra padding at bottom for scrolling
  },
  title: {
    marginTop: (RETURN_LATER_MODAL.title.top - RETURN_LATER_MODAL.overlay.top) * scaleX,
    marginLeft: RETURN_LATER_MODAL.title.left * scaleX,
    marginBottom: (RETURN_LATER_MODAL.instruction.top - RETURN_LATER_MODAL.title.top - 20) * scaleX, // Space to instruction
    fontSize: RETURN_LATER_MODAL.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: RETURN_LATER_MODAL.title.color,
  },
  instruction: {
    marginLeft: RETURN_LATER_MODAL.instruction.left * scaleX,
    marginBottom: (RETURN_LATER_MODAL.divider.top - RETURN_LATER_MODAL.instruction.top - 14) * scaleX, // Space to divider
    fontSize: RETURN_LATER_MODAL.instruction.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: RETURN_LATER_MODAL.instruction.color,
    width: RETURN_LATER_MODAL.instruction.width * scaleX,
  },
  divider: {
    marginLeft: RETURN_LATER_MODAL.divider.left * scaleX,
    marginBottom: (RETURN_LATER_MODAL.suggestions.labelTop - RETURN_LATER_MODAL.divider.top - 1) * scaleX, // Space to suggestions label
    width: RETURN_LATER_MODAL.divider.width * scaleX,
    height: RETURN_LATER_MODAL.divider.height,
    backgroundColor: RETURN_LATER_MODAL.divider.color,
  },
  suggestionsLabel: {
    marginLeft: RETURN_LATER_MODAL.suggestions.labelLeft * scaleX,
    marginBottom: (RETURN_LATER_MODAL.suggestions.buttonsTop - RETURN_LATER_MODAL.suggestions.labelTop - 14) * scaleX, // Space to buttons
    fontSize: RETURN_LATER_MODAL.suggestions.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#1e1e1e',
  },
  suggestionsContainer: {
    marginLeft: RETURN_LATER_MODAL.suggestions.buttonsLeft * scaleX,
    marginBottom: (RETURN_LATER_MODAL.toggle.top - RETURN_LATER_MODAL.suggestions.buttonsTop - 39) * scaleX, // Space to toggle
  },
  toggleContainer: {
    marginLeft: RETURN_LATER_MODAL.toggle.left * scaleX,
    marginBottom: (RETURN_LATER_MODAL.timePicker.top - RETURN_LATER_MODAL.toggle.top - 35.243) * scaleX, // Space to time picker
    alignItems: 'flex-start',
  },
  timePickerContainer: {
    marginBottom: (RETURN_LATER_MODAL.confirmButton.top - RETURN_LATER_MODAL.timePicker.top - RETURN_LATER_MODAL.timePicker.height) * scaleX, // Space to confirm button
    alignItems: 'center',
  },
  confirmButtonContainer: {
    marginLeft: RETURN_LATER_MODAL.confirmButton.left * scaleX, // -1px scaled (extends to left edge)
    marginRight: RETURN_LATER_MODAL.confirmButton.left * scaleX, // Extend to right edge
    marginBottom: (RETURN_LATER_MODAL.assignedTo.top - RETURN_LATER_MODAL.confirmButton.top - RETURN_LATER_MODAL.confirmButton.height) * scaleX, // Space to assigned to
    width: RETURN_LATER_MODAL.confirmButton.width * scaleX,
    height: RETURN_LATER_MODAL.confirmButton.height * scaleX,
    alignSelf: 'stretch', // Ensure it stretches
  },
  assignedToSection: {
    width: '100%',
    minHeight: 100 * scaleX,
    paddingHorizontal: 20 * scaleX,
    marginBottom: 50 * scaleX, // Extra margin at bottom
    position: 'relative',
  },
  assignedToTitle: {
    position: 'absolute',
    left: (RETURN_LATER_MODAL.assignedTo.titleLeft - 20) * scaleX, // Adjust for padding
    top: 0,
    fontSize: RETURN_LATER_MODAL.assignedTo.titleFontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  assignedToAvatar: {
    position: 'absolute',
    left: (ASSIGNED_TO.profilePicture.left - 20) * scaleX, // Adjust for padding
    top: (ASSIGNED_TO.profilePicture.top - RETURN_LATER_MODAL.assignedTo.top) * scaleX, // Relative to section start
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
  },
  assignedToName: {
    position: 'absolute',
    left: (ASSIGNED_TO.staffName.left - 20) * scaleX, // Adjust for padding
    top: (ASSIGNED_TO.staffName.top - RETURN_LATER_MODAL.assignedTo.top) * scaleX, // Relative to section start
    fontSize: ASSIGNED_TO.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.staffName.color,
  },
  reassignButton: {
    position: 'absolute',
    left: (ASSIGNED_TO.reassignButton.left - 20) * scaleX, // Adjust for padding
    top: (ASSIGNED_TO.reassignButton.top - RETURN_LATER_MODAL.assignedTo.top) * scaleX, // Relative to section start
    width: ASSIGNED_TO.reassignButton.width * scaleX,
    height: ASSIGNED_TO.reassignButton.height * scaleX,
    borderRadius: ASSIGNED_TO.reassignButton.borderRadius * scaleX,
    backgroundColor: ASSIGNED_TO.reassignButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reassignButtonText: {
    fontSize: ASSIGNED_TO.reassignButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: ASSIGNED_TO.reassignButton.color,
  },
});

