import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX, FILTER_OPTION } from '../../constants/filterStyles';

interface FilterOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
  indicatorType: 'circle' | 'icon';
  indicatorColor?: string;
  indicatorIcon?: any;
  count?: number;
  top: number;
  checkboxHeight?: number;
  indicatorSize?: number;
  isGuestCategory?: boolean;
}

export default function FilterOption({
  id,
  label,
  checked,
  onToggle,
  indicatorType,
  indicatorColor,
  indicatorIcon,
  count,
  top,
  checkboxHeight = 24,
  indicatorSize = 19,
  isGuestCategory = false,
}: FilterOptionProps) {
  const countLeft = isGuestCategory ? FILTER_OPTION.count.leftGuest : FILTER_OPTION.count.left;

  // All positions are relative to screen (0,0)
  return (
    <TouchableOpacity
      style={[styles.container, { top: top * scaleX }]}
      onPress={() => onToggle(id)}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View style={[
        styles.checkbox,
        { 
          height: checkboxHeight * scaleX,
          borderColor: checked ? '#5a759d' : FILTER_OPTION.checkbox.borderColor,
          backgroundColor: checked ? '#5a759d' : 'transparent',
        }
      ]}>
        {checked && (
          <Text style={styles.checkmarkText}>✓</Text>
        )}
      </View>

      {/* Indicator (Circle or Icon) */}
      <View style={[
        styles.indicator,
        { 
          width: indicatorSize * scaleX,
          height: indicatorSize * scaleX,
          backgroundColor: indicatorType === 'circle' ? indicatorColor : 'transparent',
        }
      ]}>
        {indicatorType === 'icon' && indicatorIcon && (
          <Image
            source={indicatorIcon}
            style={[
              styles.indicatorIcon,
              { 
                width: indicatorSize * scaleX,
                height: indicatorSize * scaleX,
              }
            ]}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Count (optional) */}
      {count !== undefined && (
        <Text style={[styles.count, { left: countLeft * scaleX }]}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 0,
    right: 0,
    height: 30 * scaleX, // Approximate height for touch target
  },
  checkbox: {
    position: 'absolute',
    width: FILTER_OPTION.checkbox.width * scaleX,
    left: FILTER_OPTION.checkbox.left * scaleX,
    borderWidth: FILTER_OPTION.checkbox.borderWidth,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14 * scaleX,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    left: FILTER_OPTION.indicator.left * scaleX,
    borderRadius: FILTER_OPTION.indicator.borderRadius * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorIcon: {
    tintColor: undefined, // Use original icon colors
  },
  label: {
    position: 'absolute',
    fontSize: FILTER_OPTION.label.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: FILTER_OPTION.label.color,
    left: FILTER_OPTION.label.left * scaleX,
  },
  count: {
    position: 'absolute',
    fontSize: FILTER_OPTION.count.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: FILTER_OPTION.count.color,
  },
});

