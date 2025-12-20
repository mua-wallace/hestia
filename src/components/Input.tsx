import React from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle, TextInputProps } from 'react-native';
import { colors, typography } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  containerStyle,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style, error && styles.inputError]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: parseInt(typography.fontSizes['2xl']),
    fontFamily: 'Helvetica',
    fontWeight: typography.fontWeights.regular,
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    height: 70,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 0,
    paddingHorizontal: 20,
    fontSize: parseInt(typography.fontSizes['2xl']),
    fontFamily: 'Helvetica',
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.status.dirty,
  },
  error: {
    fontSize: parseInt(typography.fontSizes.sm),
    color: colors.status.dirty,
    marginTop: 4,
  },
});

