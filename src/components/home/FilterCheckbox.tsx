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
          backgroundColor: checked ? '#A9A9A9' : 'transparent',
          borderColor: '#A9A9A9',
        },
      ]}
    >
      {checked && (
        <Text style={[styles.checkmark, { fontSize: checkboxSize * 0.7 }]}>✓</Text>
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
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 0,
  },
});
