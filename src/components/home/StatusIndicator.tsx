import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { typography } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface StatusIndicatorProps {
  color: string;
  icon: any;
  count: number;
  label: string;
}

export default function StatusIndicator({ color, icon, count, label }: StatusIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={[styles.circle, { backgroundColor: color }]}>
          <Image
            source={icon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        {count > 0 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8 * scaleX,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8 * scaleX,
  },
  circle: {
    width: 50.017 * scaleX,
    height: 50.017 * scaleX,
    borderRadius: 37 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    tintColor: '#ffffff',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -5 * scaleX,
    right: -5 * scaleX,
  },
  badge: {
    backgroundColor: '#ffffff',
    borderRadius: 17 * scaleX,
    width: 34 * scaleX,
    height: 34 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  label: {
    fontSize: 14 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '300' as any,
    color: '#000000',
  },
});

