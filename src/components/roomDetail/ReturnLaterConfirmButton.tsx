import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { RETURN_LATER_MODAL, scaleX } from '../../constants/returnLaterModalStyles';

interface ReturnLaterConfirmButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function ReturnLaterConfirmButton({
  onPress,
  disabled = false,
}: ReturnLaterConfirmButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.text}>Confirm</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: RETURN_LATER_MODAL.confirmButton.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: RETURN_LATER_MODAL.confirmButton.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: '#ffffff',
  },
});

