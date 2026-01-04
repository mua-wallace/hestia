import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { CategorySection } from '../../types/home.types';
import { colors, typography } from '../../theme';
import { Dimensions } from 'react-native';
import { normalizedScaleX, scaleX } from '../../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
import StatusIndicator from './StatusIndicator';
import PriorityBadge from './PriorityBadge';

interface CategoryCardProps {
  category: CategorySection;
  onPress?: () => void;
}

// Status configuration
const STATUS_CONFIG = {
  dirty: {
    color: '#f92424',
    icon: require('../../../assets/icons/dirty-icon.png'),
    label: 'Dirty',
  },
  inProgress: {
    color: '#f0be1b',
    icon: require('../../../assets/icons/in-progress-icon.png'),
    label: 'In Progress',
  },
  cleaned: {
    color: '#4a91fc',
    icon: require('../../../assets/icons/cleaned-icon.png'),
    label: 'Cleaned',
  },
  inspected: {
    color: '#41d541',
    icon: require('../../../assets/icons/inspected-icon.png'),
    label: 'Inspected',
  },
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Left colored border */}
      <View style={[styles.leftBorder, { backgroundColor: category.borderColor }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.totalCount}>{category.total} </Text>
          <Text style={styles.categoryName}>{category.name}</Text>
        </View>
        {category.priority !== undefined && category.priority > 0 && (
          <PriorityBadge count={category.priority} />
        )}
      </View>

      {/* Status Indicators */}
      <View style={styles.statusGrid}>
        <StatusIndicator
          color={STATUS_CONFIG.dirty.color}
          icon={STATUS_CONFIG.dirty.icon}
          count={category.status.dirty}
          label={STATUS_CONFIG.dirty.label}
        />
        <StatusIndicator
          color={STATUS_CONFIG.inProgress.color}
          icon={STATUS_CONFIG.inProgress.icon}
          count={category.status.inProgress}
          label={STATUS_CONFIG.inProgress.label}
          iconWidth={29.478}
          iconHeight={30.769}
          leftLabelIcon={require('../../../assets/icons/in-progress-icon.png')}
          rightLabelIcon={require('../../../assets/icons/down-arrow.png')}
        />
        <StatusIndicator
          color={STATUS_CONFIG.cleaned.color}
          icon={STATUS_CONFIG.cleaned.icon}
          count={category.status.cleaned}
          label={STATUS_CONFIG.cleaned.label}
        />
        <StatusIndicator
          color={STATUS_CONFIG.inspected.color}
          icon={STATUS_CONFIG.inspected.icon}
          count={category.status.inspected}
          label={STATUS_CONFIG.inspected.label}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(238,240,246,0.35)',
    borderRadius: 12 * scaleX,
    height: 223 * scaleX,
    marginHorizontal: 10 * scaleX,
    marginVertical: 13 * scaleX,
    position: 'relative',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5 * scaleX,
    borderTopLeftRadius: 12 * scaleX,
    borderBottomLeftRadius: 12 * scaleX,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21 * scaleX,
    paddingTop: 17 * scaleX,
    paddingBottom: 20 * scaleX,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: 'rgba(30, 30, 30, 0.7)',
  },
  totalCount: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Use space-around for even distribution
    alignItems: 'flex-start', // Align all items at the top for consistent vertical alignment
    paddingHorizontal: 20 * normalizedScaleX,
    marginTop: 30 * normalizedScaleX,
    flexWrap: 'nowrap', // Prevent wrapping on small screens
  },
});

