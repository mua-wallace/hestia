import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface StatusOptionItemProps {
  icon: any;
  label: string;
  onPress: () => void;
}

export default function StatusOptionItem({ icon, label, onPress }: StatusOptionItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '25%', // 4 columns: 100% / 4 = 25% each
    marginBottom: 16 * scaleX,
  },
  iconContainer: {
    width: 50 * scaleX,
    height: 50 * scaleX,
    marginBottom: 8 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50 * scaleX,
    height: 50 * scaleX,
  },
  label: {
    fontFamily: typography.fontFamily.primary,
    fontSize: 12 * scaleX,
    fontWeight: typography.fontWeights.light as any,
    color: '#1e1e1e',
    textAlign: 'center',
    lineHeight: 14 * scaleX,
  },
});

