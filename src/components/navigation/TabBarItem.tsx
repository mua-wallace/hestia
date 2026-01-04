import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';

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
  const iconStyle = iconWidth && iconHeight 
    ? { width: iconWidth * scaleX, height: iconHeight * scaleX }
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
    minWidth: 40 * scaleX,
  },
  iconContainer: {
    position: 'relative',
    width: (50 + 12) * scaleX, // Accommodate largest icon (50) + badge space (12)
    height: (36 + 12) * scaleX, // Accommodate tallest icon (36) + badge space (12)
    marginBottom: 8 * scaleX, // Increased spacing for better visual balance
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.primary.main,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0 * scaleX, // Position at very top of container
    right: 0 * scaleX, // Position at very right of container
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#f92424',
    borderRadius: 10.2275 * scaleX,
    minWidth: 20.455 * scaleX,
    height: 20.455 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4 * scaleX,
    borderWidth: 2 * scaleX,
    borderColor: colors.background.primary,
  },
  badgeText: {
    color: colors.text.white,
    fontSize: 13 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
  },
  label: {
    fontSize: 15 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.primary.main,
  },
  labelActive: {
    fontWeight: typography.fontWeights.bold as any,
  },
});

