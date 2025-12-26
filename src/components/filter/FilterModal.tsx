import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { typography } from '../../theme';
import { scaleX, FILTER_MODAL, FILTER_HEADER, ROOM_STATE_CATEGORY, GUEST_CATEGORY, DIVIDER, FILTER_ACTIONS } from '../../constants/filterStyles';
import FilterCategorySection from './FilterCategorySection';
import type { FilterState } from '../../types/filter.types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onGoToResults: () => void;
  onAdvanceFilter: () => void;
  resultCount?: number;
  initialFilters?: FilterState;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FilterModal({
  visible,
  onClose,
  onApply,
  onGoToResults,
  onAdvanceFilter,
  resultCount = 0,
  initialFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      roomState: {
        dirty: false,
        inProgress: false,
        cleaned: false,
        inspected: false,
        priority: false,
      },
      guest: {
        arrivals: false,
        departures: false,
        turnDown: false,
        stayOver: false,
      },
    }
  );

  // Update filters when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleToggle = (category: 'roomState' | 'guest', filterId: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [filterId]: !prev[category][filterId as keyof typeof prev[category]],
      },
    }));
  };

  const handleGoToResults = () => {
    onApply(filters);
    onGoToResults();
    onClose();
  };

  // Build checked options set for Room State
  const roomStateChecked = new Set<string>();
  Object.entries(filters.roomState).forEach(([key, value]) => {
    if (value) roomStateChecked.add(key);
  });

  // Build checked options set for Guest
  const guestChecked = new Set<string>();
  Object.entries(filters.guest).forEach(([key, value]) => {
    if (value) guestChecked.add(key);
  });

  // Room State options configuration
  const roomStateOptions = [
    {
      id: 'dirty',
      label: 'Dirty',
      indicatorType: 'circle' as const,
      indicatorColor: ROOM_STATE_CATEGORY.options.dirty.indicatorColor,
      top: ROOM_STATE_CATEGORY.options.dirty.top,
      checkboxHeight: ROOM_STATE_CATEGORY.options.dirty.checkboxHeight,
      indicatorSize: ROOM_STATE_CATEGORY.options.dirty.indicatorSize,
      count: ROOM_STATE_CATEGORY.options.dirty.count,
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      indicatorType: 'circle' as const,
      indicatorColor: ROOM_STATE_CATEGORY.options.inProgress.indicatorColor,
      top: ROOM_STATE_CATEGORY.options.inProgress.top,
      checkboxHeight: ROOM_STATE_CATEGORY.options.inProgress.checkboxHeight,
      indicatorSize: ROOM_STATE_CATEGORY.options.inProgress.indicatorSize,
      count: ROOM_STATE_CATEGORY.options.inProgress.count,
    },
    {
      id: 'cleaned',
      label: 'Cleaned',
      indicatorType: 'circle' as const,
      indicatorColor: ROOM_STATE_CATEGORY.options.cleaned.indicatorColor,
      top: ROOM_STATE_CATEGORY.options.cleaned.top,
      checkboxHeight: ROOM_STATE_CATEGORY.options.cleaned.checkboxHeight,
      indicatorSize: ROOM_STATE_CATEGORY.options.cleaned.indicatorSize,
      count: ROOM_STATE_CATEGORY.options.cleaned.count,
    },
    {
      id: 'inspected',
      label: 'Inspected',
      indicatorType: 'circle' as const,
      indicatorColor: ROOM_STATE_CATEGORY.options.inspected.indicatorColor,
      top: ROOM_STATE_CATEGORY.options.inspected.top,
      checkboxHeight: ROOM_STATE_CATEGORY.options.inspected.checkboxHeight,
      indicatorSize: ROOM_STATE_CATEGORY.options.inspected.indicatorSize,
      count: ROOM_STATE_CATEGORY.options.inspected.count,
    },
    {
      id: 'priority',
      label: 'Priority',
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../../assets/icons/priority-icon.png'),
      top: ROOM_STATE_CATEGORY.options.priority.top,
      checkboxHeight: ROOM_STATE_CATEGORY.options.priority.checkboxHeight,
      indicatorSize: ROOM_STATE_CATEGORY.options.priority.indicatorSize,
      count: ROOM_STATE_CATEGORY.options.priority.count,
    },
  ];

  // Guest options configuration
  const guestOptions = [
    {
      id: 'arrivals',
      label: 'Arrivals',
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../../assets/icons/arrival-icon.png'),
      top: GUEST_CATEGORY.options.arrivals.top,
      checkboxHeight: GUEST_CATEGORY.options.arrivals.checkboxHeight,
      indicatorSize: GUEST_CATEGORY.options.arrivals.indicatorSize,
      count: GUEST_CATEGORY.options.arrivals.count,
    },
    {
      id: 'departures',
      label: 'Departures',
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../../assets/icons/departure-icon.png'),
      top: GUEST_CATEGORY.options.departures.top,
      checkboxHeight: GUEST_CATEGORY.options.departures.checkboxHeight,
      indicatorSize: GUEST_CATEGORY.options.departures.indicatorSize,
      count: GUEST_CATEGORY.options.departures.count,
    },
    {
      id: 'turnDown',
      label: 'Turn Down',
      indicatorType: 'circle' as const,
      indicatorColor: GUEST_CATEGORY.options.turnDown.indicatorColor,
      top: GUEST_CATEGORY.options.turnDown.top,
      checkboxHeight: GUEST_CATEGORY.options.turnDown.checkboxHeight,
      indicatorSize: GUEST_CATEGORY.options.turnDown.indicatorSize,
      // No count
    },
    {
      id: 'stayOver',
      label: 'StayOver',
      indicatorType: 'circle' as const,
      indicatorColor: GUEST_CATEGORY.options.stayOver.indicatorColor,
      top: GUEST_CATEGORY.options.stayOver.top,
      checkboxHeight: GUEST_CATEGORY.options.stayOver.checkboxHeight,
      indicatorSize: GUEST_CATEGORY.options.stayOver.indicatorSize,
      // No count
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Blurred Background Overlay */}
      <BlurView
        intensity={FILTER_MODAL.blurIntensity}
        style={styles.blurOverlay}
        tint="light"
      >
        <View style={styles.overlayDarkener} />
      </BlurView>

      {/* Modal Container - Full screen for absolute positioning */}
      <View style={styles.modalContainer}>
        {/* White background card starting at y=321 */}
        <View style={styles.modalCard} />
        
        {/* Header - Filter title and results badge */}
        <Text style={styles.title}>Filter</Text>
        <View style={styles.resultsBadge}>
          <Text style={styles.resultsBadgeText}>
            {resultCount} results
          </Text>
        </View>

        {/* Room State Category */}
        <FilterCategorySection
          title="Room State"
          titleTop={ROOM_STATE_CATEGORY.heading.top}
          options={roomStateOptions}
          checkedOptions={roomStateChecked}
          onToggle={(id) => handleToggle('roomState', id)}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Guest Category */}
        <FilterCategorySection
          title="Guest"
          titleTop={GUEST_CATEGORY.heading.top}
          options={guestOptions}
          checkedOptions={guestChecked}
          onToggle={(id) => handleToggle('guest', id)}
          isGuestCategory={true}
        />

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.goToResultsButton}
            onPress={handleGoToResults}
            activeOpacity={0.7}
          >
            <Text style={styles.goToResultsText}>Go to Results</Text>
            <Image
              source={require('../../../assets/icons/forward-arrow-icon.png')}
              style={styles.goToResultsArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.advanceFilterButton}
            onPress={onAdvanceFilter}
            activeOpacity={0.7}
          >
            <Text style={styles.advanceFilterText}>Advance Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlayDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: FILTER_MODAL.overlayBackground,
  },
  modalContainer: {
    position: 'absolute',
    // Full screen container - all positions are relative to screen (0,0)
    top: 0,
    left: 0,
    width: FILTER_MODAL.width * scaleX,
    height: SCREEN_HEIGHT,
    backgroundColor: 'transparent',
  },
  modalCard: {
    position: 'absolute',
    // White card background starting at y=321 (from Figma Rectangle 161)
    top: 321 * scaleX,
    left: 0,
    width: FILTER_MODAL.width * scaleX,
    height: FILTER_MODAL.height * scaleX,
    backgroundColor: FILTER_MODAL.background,
    borderTopLeftRadius: 12 * scaleX,
    borderTopRightRadius: 12 * scaleX,
    shadowColor: 'rgba(100, 131, 176, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 105.1 * scaleX,
    elevation: 10,
  },
  title: {
    position: 'absolute',
    fontSize: FILTER_HEADER.title.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: FILTER_HEADER.title.color,
    left: FILTER_HEADER.title.left * scaleX,
    // Figma: y=222 (screen position)
    top: FILTER_HEADER.title.top * scaleX,
  },
  resultsBadge: {
    position: 'absolute',
    width: FILTER_HEADER.resultsBadge.width * scaleX,
    height: FILTER_HEADER.resultsBadge.height * scaleX,
    borderRadius: FILTER_HEADER.resultsBadge.borderRadius * scaleX,
    backgroundColor: FILTER_HEADER.resultsBadge.backgroundColor,
    left: FILTER_HEADER.resultsBadge.left * scaleX,
    // Figma: y=216 (screen position)
    top: FILTER_HEADER.resultsBadge.top * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsBadgeText: {
    fontSize: FILTER_HEADER.resultsBadge.text.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: FILTER_HEADER.resultsBadge.text.color,
  },
  divider: {
    position: 'absolute',
    left: DIVIDER.left * scaleX,
    // Figma: y=517 (screen position)
    top: DIVIDER.top * scaleX,
    width: DIVIDER.width * scaleX,
    height: DIVIDER.height,
    backgroundColor: DIVIDER.color,
    zIndex: 1,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40 * scaleX,
  },
  goToResultsButton: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: FILTER_ACTIONS.goToResults.left * scaleX,
    // Figma: y=838 (screen position)
    top: FILTER_ACTIONS.goToResults.top * scaleX,
    paddingVertical: 8 * scaleX,
    paddingRight: 30 * scaleX,
  },
  goToResultsText: {
    fontSize: FILTER_ACTIONS.goToResults.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: FILTER_ACTIONS.goToResults.color,
  },
  goToResultsArrow: {
    width: FILTER_ACTIONS.goToResults.arrowIcon.width * scaleX,
    height: FILTER_ACTIONS.goToResults.arrowIcon.height * scaleX,
    marginLeft: 8 * scaleX,
    tintColor: FILTER_ACTIONS.goToResults.color,
  },
  advanceFilterButton: {
    position: 'absolute',
    left: FILTER_ACTIONS.advanceFilter.left * scaleX,
    // Figma: y=869 (screen position)
    top: FILTER_ACTIONS.advanceFilter.top * scaleX,
    paddingVertical: 4 * scaleX,
  },
  advanceFilterText: {
    fontSize: FILTER_ACTIONS.advanceFilter.fontSize * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.light as any,
    color: FILTER_ACTIONS.advanceFilter.color,
  },
});

