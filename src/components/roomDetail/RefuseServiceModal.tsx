import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { typography } from '../../theme';
import { scaleX, ASSIGNED_TO } from '../../constants/roomDetailStyles';
import { REFUSE_SERVICE_MODAL, REFUSE_SERVICE_REASONS } from '../../constants/refuseServiceModalStyles';

interface RefuseServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedReasons: string[], customReason?: string) => void;
  roomNumber?: string;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
  };
  onReassignPress?: () => void;
}

export default function RefuseServiceModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
  assignedTo,
  onReassignPress,
}: RefuseServiceModalProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedReasons([]);
      setCustomReason('');
      // Scroll to top when modal opens
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 100);
    }
  }, [visible]);

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) => {
      if (prev.includes(reason)) {
        return prev.filter((r) => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedReasons, customReason.trim() || undefined);
    // Reset state
    setSelectedReasons([]);
    setCustomReason('');
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
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Text style={styles.title}>Refuse Service</Text>

            {/* Question */}
            <Text style={styles.question}>
              Why did the guest refuse service?
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Reason Options */}
            <View style={styles.optionsContainer}>
              {REFUSE_SERVICE_REASONS.map((reason, index) => {
                const isSelected = selectedReasons.includes(reason);
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[styles.optionRow, index === 0 && { marginTop: 0 }]}
                    onPress={() => toggleReason(reason)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.checkboxContainer}>
                      {isSelected ? (
                        <View style={styles.checkboxChecked}>
                          <View style={styles.checkmarkContainer}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.checkboxUnchecked} />
                      )}
                    </View>
                    <Text style={styles.optionText}>{reason}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Input */}
            <Text style={styles.customLabel}>Custom</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Enter custom reason..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              value={customReason}
              onChangeText={setCustomReason}
              textAlignVertical="top"
            />

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
                      console.log('Reassign button pressed in RefuseServiceModal');
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
    top: REFUSE_SERVICE_MODAL.overlay.top * scaleX,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // Start from top
    paddingBottom: 100 * scaleX, // Extra padding at bottom for scrolling
  },
  title: {
    marginTop: (REFUSE_SERVICE_MODAL.title.top - REFUSE_SERVICE_MODAL.overlay.top) * scaleX,
    marginLeft: REFUSE_SERVICE_MODAL.title.left * scaleX,
    marginBottom: ((REFUSE_SERVICE_MODAL.question.top - REFUSE_SERVICE_MODAL.title.top - 20) * 0.7) * scaleX, // Reduced spacing
    fontSize: REFUSE_SERVICE_MODAL.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: REFUSE_SERVICE_MODAL.title.color,
    zIndex: 1, // Ensure it's visible
  },
  question: {
    marginLeft: REFUSE_SERVICE_MODAL.question.left * scaleX,
    marginBottom: ((REFUSE_SERVICE_MODAL.divider.top - REFUSE_SERVICE_MODAL.question.top - 14) * 0.7) * scaleX, // Reduced spacing
    fontSize: REFUSE_SERVICE_MODAL.question.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: REFUSE_SERVICE_MODAL.question.color,
    width: REFUSE_SERVICE_MODAL.question.width * scaleX,
  },
  divider: {
    marginLeft: REFUSE_SERVICE_MODAL.divider.left * scaleX,
    marginBottom: (REFUSE_SERVICE_MODAL.option.firstTop - REFUSE_SERVICE_MODAL.divider.top - 1) * scaleX, // Direct calculation from Figma
    width: REFUSE_SERVICE_MODAL.divider.width * scaleX,
    height: REFUSE_SERVICE_MODAL.divider.height,
    backgroundColor: REFUSE_SERVICE_MODAL.divider.color,
  },
  optionsContainer: {
    marginLeft: 34 * scaleX, // Checkbox starts at x=34-35
    marginTop: 0, // No extra margin, divider marginBottom handles spacing
    marginBottom: ((REFUSE_SERVICE_MODAL.customLabel.top - (REFUSE_SERVICE_MODAL.option.firstTop + REFUSE_SERVICE_MODAL.option.spacing * 4)) * 0.5) * scaleX, // Reduced spacing
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: REFUSE_SERVICE_MODAL.option.spacing * scaleX, // Spacing between options
  },
  checkboxContainer: {
    width: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    height: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12 * scaleX,
  },
  checkboxChecked: {
    width: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    height: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    borderWidth: REFUSE_SERVICE_MODAL.checkbox.borderWidth,
    borderColor: REFUSE_SERVICE_MODAL.checkbox.borderColor,
    borderRadius: 4 * scaleX,
    backgroundColor: '#5a759d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 18 * scaleX,
    fontWeight: 'bold' as any,
  },
  checkboxUnchecked: {
    width: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    height: REFUSE_SERVICE_MODAL.checkbox.size * scaleX,
    borderWidth: REFUSE_SERVICE_MODAL.checkbox.borderWidth,
    borderColor: REFUSE_SERVICE_MODAL.checkbox.borderColor,
    borderRadius: 4 * scaleX,
  },
  optionText: {
    flex: 1,
    fontSize: REFUSE_SERVICE_MODAL.option.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: REFUSE_SERVICE_MODAL.option.color,
  },
  customLabel: {
    marginLeft: REFUSE_SERVICE_MODAL.customLabel.left * scaleX,
    marginBottom: ((REFUSE_SERVICE_MODAL.customInput.top - REFUSE_SERVICE_MODAL.customLabel.top - 16) * 0.5) * scaleX, // Reduced spacing
    fontSize: REFUSE_SERVICE_MODAL.customLabel.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: REFUSE_SERVICE_MODAL.customLabel.color,
  },
  customInput: {
    marginLeft: REFUSE_SERVICE_MODAL.customInput.left * scaleX,
    marginBottom: ((REFUSE_SERVICE_MODAL.confirmButton.top - REFUSE_SERVICE_MODAL.customInput.top - REFUSE_SERVICE_MODAL.customInput.height) * 0.5) * scaleX, // Reduced spacing
    width: REFUSE_SERVICE_MODAL.customInput.width * scaleX,
    height: REFUSE_SERVICE_MODAL.customInput.height * scaleX,
    borderRadius: REFUSE_SERVICE_MODAL.customInput.borderRadius * scaleX,
    borderWidth: REFUSE_SERVICE_MODAL.customInput.borderWidth,
    borderColor: REFUSE_SERVICE_MODAL.customInput.borderColor,
    padding: REFUSE_SERVICE_MODAL.customInput.padding * scaleX,
    fontSize: REFUSE_SERVICE_MODAL.customInput.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    color: '#000000',
  },
  confirmButtonContainer: {
    marginLeft: REFUSE_SERVICE_MODAL.confirmButton.left * scaleX,
    marginRight: -REFUSE_SERVICE_MODAL.confirmButton.left * scaleX,
    marginBottom: ((REFUSE_SERVICE_MODAL.assignedTo.top - REFUSE_SERVICE_MODAL.confirmButton.top - REFUSE_SERVICE_MODAL.confirmButton.height) * 0.5) * scaleX, // Reduced spacing
    width: REFUSE_SERVICE_MODAL.confirmButton.width * scaleX,
    height: REFUSE_SERVICE_MODAL.confirmButton.height * scaleX,
  },
  confirmButton: {
    width: '100%',
    height: '100%',
    backgroundColor: REFUSE_SERVICE_MODAL.confirmButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: REFUSE_SERVICE_MODAL.confirmButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: REFUSE_SERVICE_MODAL.confirmButton.color,
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
    left: (REFUSE_SERVICE_MODAL.assignedTo.titleLeft - 20) * scaleX,
    top: 0,
    fontSize: REFUSE_SERVICE_MODAL.assignedTo.titleFontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  assignedToAvatar: {
    position: 'absolute',
    left: (ASSIGNED_TO.profilePicture.left - 20) * scaleX,
    top: (ASSIGNED_TO.profilePicture.top - REFUSE_SERVICE_MODAL.assignedTo.top) * scaleX,
    width: ASSIGNED_TO.profilePicture.width * scaleX,
    height: ASSIGNED_TO.profilePicture.height * scaleX,
    borderRadius: (ASSIGNED_TO.profilePicture.width / 2) * scaleX,
  },
  assignedToName: {
    position: 'absolute',
    left: (ASSIGNED_TO.staffName.left - 20) * scaleX,
    top: (ASSIGNED_TO.staffName.top - REFUSE_SERVICE_MODAL.assignedTo.top) * scaleX,
    fontSize: ASSIGNED_TO.staffName.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: ASSIGNED_TO.staffName.color,
  },
  reassignButton: {
    position: 'absolute',
    left: (ASSIGNED_TO.reassignButton.left - 20) * scaleX,
    top: (ASSIGNED_TO.reassignButton.top - REFUSE_SERVICE_MODAL.assignedTo.top) * scaleX,
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

