import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../../theme';
import { scaleX } from '../../constants/filterStyles';
import FilterOption from './FilterOption';
import type { FilterOptionConfig } from '../../types/filter.types';

interface FilterCategorySectionProps {
  title: string;
  titleTop: number;
  options: FilterOptionConfig[];
  checkedOptions: Set<string>;
  onToggle: (id: string) => void;
  isGuestCategory?: boolean;
}

export default function FilterCategorySection({
  title,
  titleTop,
  options,
  checkedOptions,
  onToggle,
  isGuestCategory = false,
}: FilterCategorySectionProps) {
  return (
    <View style={styles.container}>
      {/* Category Heading - Position relative to screen */}
      <Text style={[styles.heading, { top: titleTop * scaleX }]}>
        {title}
      </Text>

      {/* Filter Options */}
      {options.map((option) => (
        <FilterOption
          key={option.id}
          id={option.id}
          label={option.label}
          checked={checkedOptions.has(option.id)}
          onToggle={onToggle}
          indicatorType={option.indicatorType}
          indicatorColor={option.indicatorColor}
          indicatorIcon={option.indicatorIcon}
          count={option.count}
          top={option.top}
          checkboxHeight={(option as any).checkboxHeight}
          indicatorSize={(option as any).indicatorSize}
          isGuestCategory={isGuestCategory}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  heading: {
    position: 'absolute',
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#1e1e1e',
    left: 57 * scaleX,
  },
});

