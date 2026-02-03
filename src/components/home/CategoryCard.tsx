import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { CategorySection, ShiftType, RoomStatus } from '../../types/home.types';
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
  /** When a status badge with count >= 1 is tapped (e.g. cleaned[2] under Flagged). */
  onStatusPress?: (category: CategorySection, status: keyof RoomStatus) => void;
  selectedShift?: ShiftType;
}

// Status configuration
const STATUS_CONFIG: Record<
  keyof RoomStatus,
  {
    color: string;
    icon: any;
    label: string;
    rightLabelIcon?: any;
  }
> = {
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

const LEFT_BORDER_WIDTH = 5 * scaleX;
const CARD_RADIUS = 12 * scaleX;

export default function CategoryCard({ category, onPress, onStatusPress, selectedShift }: CategoryCardProps) {
  const statusKeys: (keyof RoomStatus)[] = ['dirty', 'inProgress', 'cleaned', 'inspected'];
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selectedShift === 'PM' && styles.containerPM,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Colored left border accent - separate View so it always shows with borderRadius */}
      <View
        style={[
          styles.leftBorder,
          {
            width: LEFT_BORDER_WIDTH,
            backgroundColor: category.borderColor,
            borderTopLeftRadius: CARD_RADIUS,
            borderBottomLeftRadius: CARD_RADIUS,
          },
        ]}
      />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[
            styles.totalCount,
            selectedShift === 'PM' && styles.totalCountPM
          ]}>
            {category.total}{' '}
          </Text>
          <Text style={[
            styles.categoryName,
            selectedShift === 'PM' && styles.categoryNamePM
          ]}>
            {category.name}
          </Text>
        </View>
        {category.priority !== undefined && category.priority > 0 && (
          <PriorityBadge count={category.priority} />
        )}
      </View>

      {/* Divider */}
      <View style={[
        styles.divider,
        selectedShift === 'PM' && styles.dividerPM
      ]} />

      {/* Status Indicators - tappable when count >= 1 to filter by category + status */}
      <View style={styles.statusGrid}>
        {statusKeys.map((statusKey) => (
          <StatusIndicator
            key={statusKey}
            color={STATUS_CONFIG[statusKey].color}
            icon={STATUS_CONFIG[statusKey].icon}
            count={category.status[statusKey]}
            label={STATUS_CONFIG[statusKey].label}
            iconWidth={29.478}
            iconHeight={30.769}
            rightLabelIcon={STATUS_CONFIG[statusKey].rightLabelIcon}
            isPM={selectedShift === 'PM'}
            onPress={category.status[statusKey] >= 1 && onStatusPress ? () => onStatusPress(category, statusKey) : undefined}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(238,240,246,0.35)',
    borderRadius: 12 * scaleX,
    borderWidth: 1,
    borderColor: '#e3e3e3', // Light grey border color
    height: 223 * scaleX,
    marginHorizontal: 10 * scaleX,
    marginVertical: 13 * scaleX,
    position: 'relative',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 21 * scaleX,
    paddingTop: 17 * scaleX,
    paddingBottom: 20 * scaleX,
    minHeight: 67 * scaleX, // Fixed height so all cards (Flagged, Arrivals, StayOvers) leave same space for status row
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
  categoryNamePM: {
    color: colors.text.white,
  },
  totalCount: {
    fontSize: 24 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: '#000000',
  },
  totalCountPM: {
    color: colors.text.white,
  },
  divider: {
    position: 'absolute',
    left: 0, // Touch left border
    right: 0, // Touch right border
    top: (17 + 30 + 20 + 10) * scaleX, // paddingTop (17) + content height (~30px for 24px font with line height) + paddingBottom (20) + extra spacing (10) = 77px
    height: 1,
    backgroundColor: '#e3e3e3', // Light grey divider color (same as other cards)
  },
  dividerPM: {
    backgroundColor: '#4A4D59', // Darker divider for PM mode
  },
  statusGrid: {
    flex: 1,
    minHeight: 90 * scaleX, // Reserve space for icon + label so labels always visible (Flagged, Arrivals, StayOvers)
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 21 * scaleX,
    paddingRight: 21 * scaleX,
    paddingTop: 30 * normalizedScaleX,
    flexWrap: 'nowrap',
  },
});

