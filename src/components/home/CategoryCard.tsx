import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CategorySection } from '../../types/home.types';
import { colors, typography } from '../../theme';
import StatusIndicator from './StatusIndicator';
import PriorityBadge from './PriorityBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

interface CategoryCardProps {
  category: CategorySection;
}

// Status configuration
const STATUS_CONFIG = {
  dirty: {
    color: '#f92424',
    icon: require('../../../assets/icons/home/dirty-icon.png'),
    label: 'Dirty',
  },
  inProgress: {
    color: '#f0be1b',
    icon: require('../../../assets/icons/home/in-progress-icon.png'),
    label: 'In Progress',
  },
  cleaned: {
    color: '#4a91fc',
    icon: require('../../../assets/icons/home/cleaned-icon.png'),
    label: 'Cleaned',
  },
  inspected: {
    color: '#41d541',
    icon: require('../../../assets/icons/home/inspected-icon.png'),
    label: 'Inspected',
  },
};

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <View style={styles.container}>
      {/* Left colored border */}
      <View style={[styles.leftBorder, { backgroundColor: category.borderColor }]} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.totalCount}>{category.total}</Text>
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
    </View>
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
    color: '#1e1e1e',
    marginRight: 10 * scaleX,
  },
  totalCount: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    marginTop: 30 * scaleX, // Increased from 20 to 30 for more space
  },
});

