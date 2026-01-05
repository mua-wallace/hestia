import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { RETURN_LATER_MODAL, scaleX } from '../../constants/returnLaterModalStyles';

interface TimeSuggestionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function TimeSuggestionButton({
  label,
  isSelected,
  onPress,
}: TimeSuggestionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.buttonSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          isSelected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: RETURN_LATER_MODAL.suggestions.borderRadius * scaleX,
    paddingHorizontal: RETURN_LATER_MODAL.suggestions.buttonPaddingH * scaleX,
    paddingVertical: RETURN_LATER_MODAL.suggestions.buttonPaddingV * scaleX,
    minWidth: RETURN_LATER_MODAL.suggestions.buttonMinWidth * scaleX,
    height: RETURN_LATER_MODAL.suggestions.buttonHeight * scaleX,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  buttonSelected: {
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: RETURN_LATER_MODAL.suggestions.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: '#000000',
  },
  textSelected: {
    fontWeight: typography.fontWeights.bold as any,
  },
});

