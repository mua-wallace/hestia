import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface MoreMenuItemProps {
  icon: any;
  label: string;
  onPress: () => void;
  iconWidth?: number;
  iconHeight?: number;
}

export default function MoreMenuItem({ 
  icon, 
  label, 
  onPress, 
  iconWidth = 40, 
  iconHeight = 40 
}: MoreMenuItemProps) {
  const iconStyle = {
    width: iconWidth * scaleX,
    height: iconHeight * scaleX,
    tintColor: colors.primary.main,
  };

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
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 96 * scaleX, // Consistent width for all items
  },
  iconContainer: {
    height: 48 * scaleX, // Fixed height to align all icons at top
    marginBottom: 6 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Helvetica',
    fontSize: 15 * scaleX,
    color: colors.primary.main,
    textAlign: 'center',
    lineHeight: 16 * scaleX,
  },
});

