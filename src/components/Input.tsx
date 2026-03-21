import React from 'react';
import { TextInput, StyleSheet, View, Text, ViewStyle, TextStyle, TextInputProps } from 'react-native';
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
      {label != null && label !== '' ? (
        <Text style={styles.label}>{typeof label === 'string' ? label : String(label)}</Text>
      ) : null}
      <TextInput
        style={[styles.input, style, error ? styles.inputError : null]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error != null && error !== '' ? (
        <Text style={styles.error}>{typeof error === 'string' ? error : String(error)}</Text>
      ) : null}
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
    fontWeight: typography.fontWeights.regular as TextStyle['fontWeight'],
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

