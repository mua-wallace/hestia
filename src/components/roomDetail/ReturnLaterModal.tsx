import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { typography } from '../../theme';
import { scaleX } from '../../constants/roomDetailStyles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DESIGN_WIDTH = 440;

interface ReturnLaterModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (returnTime: string, period: 'AM' | 'PM') => void;
  roomNumber?: string;
}

const TIME_SUGGESTIONS = ['10 mins', '20 mins', '30 mins', '1 Hour'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export default function ReturnLaterModal({
  visible,
  onClose,
  onConfirm,
  roomNumber,
}: ReturnLaterModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  const handleSuggestionPress = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    // Parse suggestion and set time
    if (suggestion === '1 Hour') {
      setSelectedHour(1);
      setSelectedMinute(0);
    } else {
      const minutes = parseInt(suggestion.replace(' mins', ''));
      setSelectedHour(Math.floor(minutes / 60));
      setSelectedMinute(minutes % 60);
    }
  };

  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onConfirm(timeString, selectedPeriod);
    // Reset state
    setSelectedSuggestion(null);
    setSelectedHour(12);
    setSelectedMinute(0);
    setSelectedPeriod('AM');
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Modal Overlay */}
        <View style={styles.modalOverlay}>
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
            {TIME_SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={[
                  styles.suggestionButton,
                  selectedSuggestion === suggestion && styles.suggestionButtonSelected,
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    selectedSuggestion === suggestion && styles.suggestionTextSelected,
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AM/PM Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleBackground}>
              <View
                style={[
                  styles.toggleSlider,
                  selectedPeriod === 'PM' && styles.toggleSliderPM,
                ]}
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setSelectedPeriod('AM')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.toggleText,
                    selectedPeriod === 'AM' && styles.toggleTextActive,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setSelectedPeriod('PM')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.toggleText,
                    selectedPeriod === 'PM' && styles.toggleTextActive,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Picker */}
          <View style={styles.timePickerContainer}>
            {/* Hours Column */}
            <ScrollView
              style={styles.timeColumn}
              showsVerticalScrollIndicator={false}
              snapToInterval={40 * scaleX}
              decelerationRate="fast"
            >
              {HOURS.map((hour) => {
                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                const isSelected = hour === selectedHour;
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[styles.timeItem, isSelected && styles.timeItemSelected]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isSelected && styles.timeTextSelected,
                      ]}
                    >
                      {displayHour.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Minutes Column */}
            <ScrollView
              style={styles.timeColumn}
              showsVerticalScrollIndicator={false}
              snapToInterval={40 * scaleX}
              decelerationRate="fast"
            >
              {MINUTES.map((minute) => {
                const isSelected = parseInt(minute) === selectedMinute;
                return (
                  <TouchableOpacity
                    key={minute}
                    style={[styles.timeItem, isSelected && styles.timeItemSelected]}
                    onPress={() => setSelectedMinute(parseInt(minute))}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        isSelected && styles.timeTextSelected,
                      ]}
                    >
                      {minute}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
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
    top: 232 * scaleX, // Header height (232px) - no margin
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20 * scaleX,
    paddingTop: 20 * scaleX,
  },
  title: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#607aa1',
    marginBottom: 7 * scaleX,
  },
  instruction: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#1e1e1e',
    marginBottom: 24 * scaleX,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 24 * scaleX,
  },
  suggestionsLabel: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#1e1e1e',
    marginBottom: 19 * scaleX,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 56 * scaleX,
    gap: 12 * scaleX,
  },
  suggestionButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 41 * scaleX,
    paddingHorizontal: 16 * scaleX,
    paddingVertical: 11 * scaleX,
    minWidth: 74 * scaleX,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  suggestionButtonSelected: {
    backgroundColor: '#f5f5f5',
  },
  suggestionText: {
    fontSize: 14 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#000000',
  },
  suggestionTextSelected: {
    fontWeight: typography.fontWeights.bold as any,
  },
  toggleContainer: {
    alignItems: 'center',
    marginBottom: 55 * scaleX,
  },
  toggleBackground: {
    width: 121 * scaleX,
    height: 35.243 * scaleX,
    backgroundColor: 'rgba(100, 131, 176, 0.07)',
    borderRadius: 68 * scaleX,
    flexDirection: 'row',
    position: 'relative',
    padding: 2 * scaleX,
  },
  toggleSlider: {
    position: 'absolute',
    width: 64.612 * scaleX,
    height: 30.544 * scaleX,
    backgroundColor: '#5a759d',
    borderRadius: 68 * scaleX,
    left: 2.936 * scaleX,
    top: 2.35 * scaleX,
  },
  toggleSliderPM: {
    left: 56.364 * scaleX, // Move to PM position
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  toggleText: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#b1afaf',
  },
  toggleTextActive: {
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 226 * scaleX,
    marginBottom: 62 * scaleX,
    gap: 15 * scaleX, // Space between hour and minute columns (reduced to half)
  },
  timeColumn: {
    width: 50 * scaleX,
  },
  timeItem: {
    height: 40 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8 * scaleX,
  },
  timeItemSelected: {
    // Selected item styling
  },
  timeText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: '#999999',
  },
  timeTextSelected: {
    fontSize: 24 * scaleX,
    fontWeight: typography.fontWeights.bold as any,
    color: '#5a759d',
  },
  confirmButton: {
    backgroundColor: '#5a759d',
    height: 107 * scaleX,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -20 * scaleX, // Extend to edges
    marginBottom: -20 * scaleX, // Extend to bottom
  },
  confirmButtonText: {
    fontSize: 18 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: '#ffffff',
  },
});
