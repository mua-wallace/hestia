import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface FilterCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
}

export default function FilterCheckbox({
  checked,
  onToggle,
  size = 20,
}: FilterCheckboxProps) {
  const checkboxSize = size * scaleX;
  const borderWidth = 2 * scaleX;

  return (
    <View
      style={[
        styles.checkbox,
        {
          width: checkboxSize,
          height: checkboxSize,
          borderWidth: borderWidth,
          backgroundColor: 'transparent', // No fill, just border
          borderColor: '#A9A9A9',
        },
      ]}
    >
      {checked && (
        <Text style={[styles.checkmark, { fontSize: checkboxSize * 0.8, lineHeight: checkboxSize * 0.8 }]}>✓</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    borderRadius: 4 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#1e1e1e', // Dark color for visibility (primary text color)
    fontWeight: '900', // Extra bold for better visibility
    includeFontPadding: false, // Remove extra padding
    textAlignVertical: 'center',
  },
});
