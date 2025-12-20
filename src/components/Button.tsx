import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'status';
  statusColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  statusColor,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary.main,
          height: 70,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary.main,
        };
      case 'status':
        return {
          backgroundColor: statusColor || colors.status.cleaned,
          height: 70,
          width: 134,
          borderRadius: parseInt(borderRadius['7xl']),
        };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return {
          color: colors.text.white,
          fontSize: parseInt(typography.fontSizes['3xl']),
          fontWeight: typography.fontWeights.regular,
        };
      case 'secondary':
        return {
          color: colors.primary.main,
        };
      case 'status':
        return {
          color: colors.text.white,
        };
      default:
        return {};
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  text: {
    fontFamily: 'Helvetica',
  },
  disabled: {
    opacity: 0.5,
  },
});

