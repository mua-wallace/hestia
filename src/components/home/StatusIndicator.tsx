import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { typography } from '../../theme';
import { normalizedScaleX } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Calculate responsive dimensions - ensure minimum sizes for badge space
const iconContainerWidth = (50.017 + 16) * normalizedScaleX;
const iconContainerHeight = (50.017 + 4) * normalizedScaleX;

interface StatusIndicatorProps {
  color: string;
  icon: any;
  count: number;
  label: string;
  iconWidth?: number;
  iconHeight?: number;
  leftLabelIcon?: any;
  rightLabelIcon?: any;
}

export default function StatusIndicator({ color, icon, count, label, iconWidth, iconHeight, leftLabelIcon, rightLabelIcon }: StatusIndicatorProps) {
  const iconStyle = [
    styles.icon,
    iconWidth && { width: iconWidth * normalizedScaleX },
    iconHeight && { height: iconHeight * normalizedScaleX },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={[styles.circle, { backgroundColor: color }]}>
          <Image
            source={icon}
            style={iconStyle}
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
      <View style={styles.labelContainer}>
        {leftLabelIcon && (
          <Image
            source={leftLabelIcon}
            style={styles.leftLabelIcon}
            resizeMode="contain"
          />
        )}
        <Text style={styles.label}>{label}</Text>
        {rightLabelIcon && (
          <Image
            source={rightLabelIcon}
            style={[styles.rightLabelIcon, { transform: [{ rotate: '90deg' }] }]}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1, // Equal spacing between icons
    minWidth: 0, // Allow flex to work properly
    maxWidth: '100%', // Prevent overflow on small screens
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8 * normalizedScaleX,
    width: iconContainerWidth,
    height: iconContainerHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 50.017 * normalizedScaleX,
    height: 50.017 * normalizedScaleX,
    borderRadius: 37 * normalizedScaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18 * normalizedScaleX,
    height: 18 * normalizedScaleX,
    tintColor: '#ffffff',
  },
  badgeContainer: {
    position: 'absolute',
    // Position badge at bottom-right corner, moved further right to avoid covering icon
    // Use percentage-based positioning relative to container for better responsiveness
    bottom: -4 * normalizedScaleX,
    right: -16 * normalizedScaleX, // Moved further right to reduce icon coverage
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#ffffff',
    borderRadius: 17 * normalizedScaleX,
    width: 34 * normalizedScaleX,
    height: 34 * normalizedScaleX,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 * normalizedScaleX },
    shadowOpacity: 0.1,
    shadowRadius: 4 * normalizedScaleX,
    elevation: 3,
  },
  badgeText: {
    fontSize: 20 * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  label: {
    fontSize: 14 * normalizedScaleX,
    fontFamily: 'Inter',
    fontWeight: '300' as any,
    color: '#000000',
  },
  leftLabelIcon: {
    width: 18 * normalizedScaleX,
    height: 18 * normalizedScaleX,
    marginRight: 4 * normalizedScaleX,
  },
  rightLabelIcon: {
    width: 18 * normalizedScaleX,
    height: 18 * normalizedScaleX,
    marginLeft: 4 * normalizedScaleX,
  },
});

