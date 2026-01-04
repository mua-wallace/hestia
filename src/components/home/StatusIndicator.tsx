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
  iconWidth?: number;
  iconHeight?: number;
  leftLabelIcon?: any;
  rightLabelIcon?: any;
}

export default function StatusIndicator({ color, icon, count, label, iconWidth, iconHeight, leftLabelIcon, rightLabelIcon }: StatusIndicatorProps) {
  const iconStyle = [
    styles.icon,
    iconWidth && { width: iconWidth * scaleX },
    iconHeight && { height: iconHeight * scaleX },
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
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8 * scaleX,
    width: (50.017 + 16) * scaleX, // Circle width + space for badge moved further right
    height: (50.017 + 4) * scaleX, // Circle height + small space for badge
    justifyContent: 'center',
    alignItems: 'center',
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
    // Position badge at bottom-right corner, moved further right to avoid covering icon
    bottom: -4 * scaleX,
    right: -16 * scaleX, // Moved further right to reduce icon coverage
    zIndex: 10,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14 * scaleX,
    fontFamily: 'Inter',
    fontWeight: '300' as any,
    color: '#000000',
  },
  leftLabelIcon: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    marginRight: 4 * scaleX,
  },
  rightLabelIcon: {
    width: 18 * scaleX,
    height: 18 * scaleX,
    marginLeft: 4 * scaleX,
  },
});

