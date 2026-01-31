import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import { normalizedScaleX } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface TabBarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  badge?: number;
  onPress: () => void;
  iconWidth?: number;
  iconHeight?: number;
  iconOpacity?: number;
}

export default function TabBarItem({ icon, label, active = false, badge, onPress, iconWidth, iconHeight, iconOpacity }: TabBarItemProps) {
  // Use Math.round to ensure pixel-perfect rendering and prevent blurriness
  // Icons are used directly without tintColor to preserve original colors from Figma
  const finalOpacity = iconOpacity !== undefined ? iconOpacity : 1;
  const iconStyle = iconWidth && iconHeight 
    ? { 
        width: Math.round(iconWidth * normalizedScaleX), 
        height: Math.round(iconHeight * normalizedScaleX),
        opacity: finalOpacity,
      }
    : { ...styles.icon, opacity: finalOpacity };
    
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <Image
              source={icon}
              style={iconStyle}
              resizeMode="contain"
            />
            {badge !== undefined && badge > 0 && (
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // Fill parent container
    minWidth: Math.round(40 * normalizedScaleX), // Rounded for pixel-perfect rendering
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center', // Center icon wrapper horizontally
    justifyContent: 'center', // Center icon wrapper vertically
    alignSelf: 'center', // Ensure wrapper itself is centered
    marginBottom: Math.round(4 * normalizedScaleX), // Reduced gap between icon and text
  },
  iconContainer: {
    position: 'relative',
    width: Math.round(70 * normalizedScaleX), // Accommodate largest icon (70)
    height: Math.round(68 * normalizedScaleX), // Accommodate tallest icon (68)
    justifyContent: 'center', // Center icon vertically
    alignItems: 'center', // Center icon horizontally
    alignSelf: 'center', // Ensure container itself is centered
    overflow: 'visible', // Allow badge to overflow without affecting layout
  },
  icon: {
    width: '100%',
    height: '100%',
    // Icons are used directly without tintColor to preserve original colors
  },
  badgeContainer: {
    position: 'absolute',
    // Position badge at top-right of icon, overlapping the icon edge (as per Figma)
    // Chat icon is 56x56, centered in 70x68 container
    // Icon top edge: (68-56)/2 = 6px from container top
    // Icon right edge: (70-56)/2 = 7px from container right
    // Badge size: 20.455px (radius ~10.2275px)
    // Position badge center to overlap icon's top-right corner
    // Position badge center at icon's top-right area (8-9px) so badge clearly overlaps icon
    top: Math.round(8 * normalizedScaleX), // Badge center 8px from top (2px inside icon top edge at 6px)
    right: Math.round(8 * normalizedScaleX), // Badge center 8px from right (1px inside icon right edge at 7px)
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#FF46A3',
    borderRadius: Math.round(10.2275 * normalizedScaleX),
    minWidth: Math.round(20.455 * normalizedScaleX),
    height: Math.round(20.455 * normalizedScaleX),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.round(4 * normalizedScaleX),
    borderWidth: Math.round(2 * normalizedScaleX),
    borderColor: colors.background.primary,
  },
  badgeText: {
    color: colors.text.white,
    fontSize: Math.round(13 * normalizedScaleX),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    includeFontPadding: false,
  },
  label: {
    fontSize: Math.round(15 * normalizedScaleX),
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.primary.main, // Match icon color
    includeFontPadding: false, // Remove extra padding for consistent rendering
    textAlign: 'center',
  },
  labelActive: {
    fontWeight: '700' as any, // Extra bold for active tab
    color: colors.primary.light, // Light blue (#607aa1) for active tab
    includeFontPadding: false, // Remove extra padding for consistent rendering
  },
});

