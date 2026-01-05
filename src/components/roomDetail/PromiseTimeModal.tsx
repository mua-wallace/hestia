import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ROOM_DETAIL_HEADER, ASSIGNED_TO } from '../../constants/roomDetailStyles';
import { PROMISE_TIME_MODAL } from '../../constants/promiseTimeModalStyles';
import { ShiftType } from '../../types/home.types';
import AMPMToggle from '../home/AMPMToggle';
import PromiseTimePickerContainer from './PromiseTimePickerContainer';
import DatePickerContainer from './DatePickerContainer';

interface PromiseTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date, time: string, period: 'AM' | 'PM') => void;
  roomNumber?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
  };
  onReassignPress?: () => void;
}

export default function PromiseTimeModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
  assignedTo,
  onReassignPress,
}: PromiseTimeModalProps) {
  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const hour24 = now.getHours();
    const minute = now.getMinutes();
    const period: ShiftType = hour24 >= 12 ? 'PM' : 'AM';
    return { date: now, hour24, minute, period };
  };

  const currentDateTime = getCurrentDateTime();
  
  const [selectedDate, setSelectedDate] = useState<Date>(currentDateTime.date);
  const [selectedHour, setSelectedHour] = useState(currentDateTime.hour24);
  const [selectedMinute, setSelectedMinute] = useState(currentDateTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<ShiftType>(currentDateTime.period);

  // Update to current date/time when modal opens
  useEffect(() => {
    if (visible) {
      const { date, hour24, minute, period } = getCurrentDateTime();
      setSelectedDate(date);
      setSelectedHour(hour24);
      setSelectedMinute(minute);
      setSelectedPeriod(period);
    }
  }, [visible]);

  const handleConfirm = () => {
    const hour12 = selectedHour === 0 ? 12 : selectedHour > 12 ? selectedHour - 12 : selectedHour;
    const timeString = `${hour12.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onConfirm(selectedDate, timeString, selectedPeriod);
    
    // Reset state to current date/time
    const { date, hour24, minute, period } = getCurrentDateTime();
    setSelectedDate(date);
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
            <Text style={styles.title}>Promise time</Text>

            {/* Instruction */}
            <Text style={styles.instruction}>
              Add time for when the room will be ready
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Date and Time Labels */}
            <View style={styles.labelsContainer}>
              <Text style={styles.dateLabel}>Date</Text>
              <Text style={styles.timeLabel}>Time</Text>
            </View>

            {/* AM/PM Toggle */}
            <View style={styles.toggleContainer}>
              <AMPMToggle
                selected={selectedPeriod}
                onToggle={(period: ShiftType) => setSelectedPeriod(period)}
              />
            </View>

            {/* Date and Time Pickers */}
            <View style={styles.pickersContainer}>
              {/* Date Picker */}
              <View style={styles.datePickerContainer}>
                <DatePickerContainer
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </View>

              {/* Time Picker */}
              <View style={styles.timePickerContainer}>
                <PromiseTimePickerContainer
                  selectedHour={selectedHour}
                  selectedMinute={selectedMinute}
                  selectedPeriod={selectedPeriod}
                  onHourChange={setSelectedHour}
                  onMinuteChange={setSelectedMinute}
                />
              </View>
            </View>

            {/* Confirm Button */}
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
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
                      console.log('Reassign button pressed in PromiseTimeModal');
                      onClose(); // Close this modal first
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
    top: PROMISE_TIME_MODAL.overlay.top * scaleX, // Start at 213px to match Figma
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
    marginTop: (PROMISE_TIME_MODAL.title.top - PROMISE_TIME_MODAL.overlay.top) * scaleX,
    marginLeft: PROMISE_TIME_MODAL.title.left * scaleX,
    marginBottom: (PROMISE_TIME_MODAL.instruction.top - PROMISE_TIME_MODAL.title.top - 20) * scaleX,
    fontSize: PROMISE_TIME_MODAL.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: PROMISE_TIME_MODAL.title.color,
  },
  instruction: {
    marginLeft: PROMISE_TIME_MODAL.instruction.left * scaleX,
    marginBottom: ((PROMISE_TIME_MODAL.divider.top - PROMISE_TIME_MODAL.instruction.top - 14) * 0.7) * scaleX, // Reduced spacing
    fontSize: PROMISE_TIME_MODAL.instruction.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: PROMISE_TIME_MODAL.instruction.color,
    width: PROMISE_TIME_MODAL.instruction.width * scaleX,
  },
  divider: {
    marginLeft: PROMISE_TIME_MODAL.divider.left * scaleX,
    marginBottom: ((PROMISE_TIME_MODAL.dateLabel.top - PROMISE_TIME_MODAL.divider.top - 1) * 0.7) * scaleX, // Reduced spacing
    width: PROMISE_TIME_MODAL.divider.width * scaleX,
    height: PROMISE_TIME_MODAL.divider.height,
    backgroundColor: PROMISE_TIME_MODAL.divider.color,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: PROMISE_TIME_MODAL.dateLabel.left * scaleX,
    marginRight: (440 - PROMISE_TIME_MODAL.timeLabel.left - 84) * scaleX,
    marginBottom: ((PROMISE_TIME_MODAL.toggleContainer.top - PROMISE_TIME_MODAL.dateLabel.top - 16) * 0.4) * scaleX, // Further reduced spacing
  },
  dateLabel: {
    fontSize: PROMISE_TIME_MODAL.dateLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: PROMISE_TIME_MODAL.dateLabel.color,
  },
  timeLabel: {
    fontSize: PROMISE_TIME_MODAL.timeLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: PROMISE_TIME_MODAL.timeLabel.color,
  },
  toggleContainer: {
    marginLeft: PROMISE_TIME_MODAL.toggleContainer.left * scaleX,
    marginBottom: (PROMISE_TIME_MODAL.datePicker.top - PROMISE_TIME_MODAL.toggleContainer.top - 35.243) * scaleX, // Direct calculation based on actual positions
    alignItems: 'flex-start',
  },
  pickersContainer: {
    position: 'relative',
    width: '100%',
    height: PROMISE_TIME_MODAL.datePicker.height * scaleX,
    marginTop: (PROMISE_TIME_MODAL.datePicker.top - PROMISE_TIME_MODAL.overlay.top) * scaleX,
    marginBottom: ((PROMISE_TIME_MODAL.confirmButton.top - PROMISE_TIME_MODAL.datePicker.top - PROMISE_TIME_MODAL.datePicker.height) * 0.5) * scaleX, // Further reduced spacing
  },
  datePickerContainer: {
    position: 'absolute',
    left: PROMISE_TIME_MODAL.datePicker.left * scaleX,
    top: 0,
    height: PROMISE_TIME_MODAL.datePicker.height * scaleX,
    width: PROMISE_TIME_MODAL.datePicker.width * scaleX,
  },
  timePickerContainer: {
    position: 'absolute',
    left: 0,
    top: 0, // Both pickers start at the same vertical position
    height: PROMISE_TIME_MODAL.timePicker.height * scaleX,
    width: '100%', // Full width to allow absolute positioning of columns
  },
  confirmButtonContainer: {
    marginLeft: PROMISE_TIME_MODAL.confirmButton.left * scaleX,
    marginRight: -PROMISE_TIME_MODAL.confirmButton.left * scaleX,
    marginBottom: ((PROMISE_TIME_MODAL.assignedTo.top - PROMISE_TIME_MODAL.confirmButton.top - PROMISE_TIME_MODAL.confirmButton.height) * 0.5) * scaleX, // Reduced spacing by 50%
    width: PROMISE_TIME_MODAL.confirmButton.width * scaleX,
    height: PROMISE_TIME_MODAL.confirmButton.height * scaleX,
  },
  confirmButton: {
    width: '100%',
    height: '100%',
    backgroundColor: PROMISE_TIME_MODAL.confirmButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: PROMISE_TIME_MODAL.confirmButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: PROMISE_TIME_MODAL.confirmButton.color,
  },
  assignedToSection: {
    width: '100%',
    minHeight: 100 * scaleX,
    paddingHorizontal: 20 * scaleX,
    marginBottom: 50 * scaleX,
    position: 'relative',
  },
  assignedToTitle: {
    position: 'absolute',
    left: (PROMISE_TIME_MODAL.assignedTo.titleLeft - 20) * scaleX,
    top: 0,
    fontSize: PROMISE_TIME_MODAL.assignedTo.titleFontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  assignedToAvatar: {
    position: 'absolute',
    left: (ASSIGNED_TO.profilePicture.left - 20) * scaleX,
    top: (ASSIGNED_TO.profilePicture.top - PROMISE_TIME_MODAL.assignedTo.top) * scaleX,
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
  },
  assignedToName: {
    position: 'absolute',
    left: (ASSIGNED_TO.staffName.left - 20) * scaleX,
    top: (ASSIGNED_TO.staffName.top - PROMISE_TIME_MODAL.assignedTo.top) * scaleX,
    fontSize: ASSIGNED_TO.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.staffName.color,
  },
  reassignButton: {
    position: 'absolute',
    left: (ASSIGNED_TO.reassignButton.left - 20) * scaleX,
    top: (ASSIGNED_TO.reassignButton.top - PROMISE_TIME_MODAL.assignedTo.top) * scaleX,
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

