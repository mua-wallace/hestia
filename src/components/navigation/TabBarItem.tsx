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
}

export default function TabBarItem({ icon, label, active = false, badge, onPress, iconWidth, iconHeight }: TabBarItemProps) {
  // Use Math.round to ensure pixel-perfect rendering and prevent blurriness
  // Icons are used directly without tintColor to preserve original colors from Figma
  const iconStyle = iconWidth && iconHeight 
    ? { 
        width: Math.round(iconWidth * normalizedScaleX), 
        height: Math.round(iconHeight * normalizedScaleX),
      }
    : styles.icon;
    
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image
          source={icon}
          style={iconStyle}
          resizeMode="contain"
          shouldRasterizeIOS={true}
          renderToHardwareTextureAndroid={true}
        />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          </View>
        )}
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Equal spacing for all tabs
    minWidth: Math.round(40 * normalizedScaleX), // Rounded for pixel-perfect rendering
  },
  iconContainer: {
    position: 'relative',
    width: Math.round((50 + 12) * normalizedScaleX), // Accommodate largest icon (50) + badge space (12) - rounded for pixel-perfect
    height: Math.round((36 + 12) * normalizedScaleX), // Accommodate tallest icon (36) + badge space (12) - rounded for pixel-perfect
    marginBottom: Math.round(8 * normalizedScaleX), // Increased spacing for better visual balance
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    // Icons are used directly without tintColor to preserve original colors
  },
  badgeContainer: {
    position: 'absolute',
    top: 0 * normalizedScaleX, // Position at very top of container
    right: 0 * normalizedScaleX, // Position at very right of container
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#f92424',
    borderRadius: 10.2275 * normalizedScaleX,
    minWidth: 20.455 * normalizedScaleX,
    height: 20.455 * normalizedScaleX,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4 * normalizedScaleX,
    borderWidth: 2 * normalizedScaleX,
    borderColor: colors.background.primary,
  },
  badgeText: {
    color: colors.text.white,
    fontSize: 13 * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
  },
  label: {
    fontSize: 15 * normalizedScaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.text.primary, // Dark gray/black for inactive tabs
  },
  labelActive: {
    fontWeight: typography.fontWeights.bold as any,
    color: colors.primary.main, // Blue for active tab
  },
});

