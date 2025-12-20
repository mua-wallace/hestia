import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'status';
  statusColor?: string;
}

export default function Card({ children, style, variant = 'default', statusColor }: CardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.medium,
      borderRadius: parseInt(borderRadius.md),
      padding: 20,
    };

    if (variant === 'status' && statusColor) {
      return {
        ...baseStyle,
        borderLeftWidth: 5,
        borderLeftColor: statusColor,
      };
    }

    return baseStyle;
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
}

const styles = StyleSheet.create({});

