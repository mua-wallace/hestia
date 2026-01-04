import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { typography } from '../../theme';
import { normalizedScaleX } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface PriorityBadgeProps {
  count: number;
}

export default function PriorityBadge({ count }: PriorityBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../../../assets/icons/prioirty-icon.png')}
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
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 58 * normalizedScaleX,
    height: 47 * normalizedScaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 58 * normalizedScaleX,
    height: 47 * normalizedScaleX,
  },
  badgeContainer: {
    position: 'absolute',
    top: -2 * normalizedScaleX,
    right: -5 * normalizedScaleX,
  },
  badge: {
    backgroundColor: '#f92424',
    borderRadius: 12 * normalizedScaleX,
    width: 24 * normalizedScaleX,
    height: 24 * normalizedScaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 15 * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#ffffff',
  },
});

