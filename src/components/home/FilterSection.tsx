import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, typography } from '../../theme';
import FilterRow from './FilterRow';
import { FilterOption } from '../../types/filter.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  onToggle: (id: string) => void;
  isRoomState?: boolean; // Indicates if this is room state section (circular icons)
}

export default function FilterSection({
  title,
  options,
  onToggle,
  isRoomState = false,
}: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          // Room state options (except priority) and turnDown/stayOver should be circular
          // Priority should show just the icon without circular background
          const shouldBeCircular = (isRoomState && option.id !== 'priority') || option.id === 'turnDown' || option.id === 'stayOver';
          // Priority should always show icon, not circular
          const isPriority = option.id === 'priority';
          return (
            <FilterRow
              key={option.id}
              label={option.label}
              icon={option.icon}
              iconColor={option.iconColor}
              count={option.count}
              selected={option.selected}
              onToggle={() => onToggle(option.id)}
              showCount={option.count > 0}
              isCircular={shouldBeCircular}
              isPriority={isPriority}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32 * scaleX,
  },
  sectionTitle: {
    fontSize: 18 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semiBold as any,
    color: colors.text.primary,
    marginBottom: 16 * scaleX,
  },
  optionsContainer: {
    // No additional styling needed, rows handle their own spacing
  },
});
