import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography } from '../../theme';
import FilterSection from './FilterSection';
import { FilterState, FilterCounts, FilterOption } from '../../types/filter.types';
import { useHomeFilters } from '../../hooks/useHomeFilters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Default values for HomeScreen
const DEFAULT_HEADER_HEIGHT = 153 * scaleX;
const DEFAULT_HEADER_MARGIN = 14 * scaleX;
const DEFAULT_SEARCH_BAR_HEIGHT = 59 * scaleX;

interface HomeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToResults: (filters: FilterState) => void;
  onAdvanceFilter?: () => void;
  onApplyFilters?: (filters: FilterState) => void; // Optional callback for applying filters without navigation
  initialFilters?: FilterState;
  filterCounts: FilterCounts;
  headerHeight?: number; // Optional header height for positioning (defaults to HomeScreen height)
  searchBarHeight?: number; // Optional search bar height (defaults to HomeScreen height)
  searchBarTop?: number; // Optional search bar top position (for AllRoomsScreen where search is inside header)
  onFilterIconPress?: () => void; // Callback for filter icon press
}

export default function HomeFilterModal({
  visible,
  onClose,
  onGoToResults,
  onAdvanceFilter,
  onApplyFilters,
  initialFilters,
  filterCounts,
  headerHeight,
  searchBarHeight,
  searchBarTop,
  onFilterIconPress,
}: HomeFilterModalProps) {
  // Calculate position below filter button
  // Use provided heights or defaults for HomeScreen
  const HEADER_HEIGHT = headerHeight || DEFAULT_HEADER_HEIGHT;
  const HEADER_HEIGHT_MINUS_30 = HEADER_HEIGHT - 30 * scaleX; // Subtract 30 directly from HEADER_HEIGHT for responsive calculation
  const HEADER_MARGIN = DEFAULT_HEADER_MARGIN;
  const SEARCH_BAR_HEIGHT = searchBarHeight || DEFAULT_SEARCH_BAR_HEIGHT;
  
  // Calculate filter icon position (when modal is open)
  const FILTER_ICON_TOP = HEADER_HEIGHT_MINUS_30 + 5 * scaleX; // Just below header, on top of overlay
  const FILTER_ICON_HEIGHT = 40 * scaleX; // Filter icon container height
  const FILTER_ICON_BOTTOM = FILTER_ICON_TOP + FILTER_ICON_HEIGHT; // Bottom of filter icon
  const MODAL_MARGIN_FROM_ICON = 10 * scaleX; // Margin between icon and modal
  
  // If searchBarTop is provided (AllRoomsScreen), use it directly
  // Otherwise calculate from header height + margin (HomeScreen)
  // When filter modal is open, search bar is hidden, so filter button is at header bottom
  const FILTER_BUTTON_TOP = searchBarTop !== undefined 
    ? searchBarTop 
    : HEADER_HEIGHT + HEADER_MARGIN; // Top of search section (or filter button when modal open)
  const FILTER_BUTTON_BOTTOM = searchBarTop !== undefined
    ? FILTER_BUTTON_TOP + SEARCH_BAR_HEIGHT // AllRoomsScreen: search bar exists
    : HEADER_HEIGHT + HEADER_MARGIN + 12 * scaleX; // HomeScreen: filter button height when modal open (no search bar)
  const BLUR_TOP_OFFSET = HEADER_HEIGHT; // 0px margin from header - blur starts right at header bottom
  // When searchBarTop is undefined (modal open, search hidden), position modal with margin from filter icon
  const MODAL_TOP_OFFSET = searchBarTop !== undefined
    ? FILTER_BUTTON_BOTTOM + 10 * scaleX // Normal spacing when search bar exists
    : FILTER_ICON_BOTTOM + MODAL_MARGIN_FROM_ICON; // Position modal below filter icon with margin
  const {
    filters,
    setFilters,
    toggleRoomState,
    toggleGuest,
    calculateResultCount,
    hasActiveFilters,
    resetFilters,
  } = useHomeFilters(initialFilters);

  // Reset filters when modal closes
  useEffect(() => {
    if (!visible && initialFilters) {
      setFilters(initialFilters);
    }
  }, [visible, initialFilters, setFilters]);

  const resultCount = useMemo(() => {
    if (!filters) return 0;
    return calculateResultCount(filterCounts);
  }, [filters, filterCounts, calculateResultCount]);

  // Room State filter options
  const roomStateOptions: FilterOption[] = useMemo(
    () => {
      if (!filters || !filters.roomStates) return [];
      return [
        {
          id: 'dirty',
          label: 'Dirty',
          icon: require('../../../assets/icons/dirty-state-icon.png'),
          iconColor: '#f92424',
          count: filterCounts.roomStates.dirty,
          selected: filters.roomStates.dirty,
          type: 'dirty',
        },
        {
          id: 'inProgress',
          label: 'In Progress',
          icon: require('../../../assets/icons/in-progess-state-icon.png'),
          iconColor: '#f0be1b',
          count: filterCounts.roomStates.inProgress,
          selected: filters.roomStates.inProgress,
          type: 'inProgress',
        },
        {
          id: 'cleaned',
          label: 'Cleaned',
          icon: require('../../../assets/icons/cleaned-state-icon.png'),
          iconColor: '#4a91fc',
          count: filterCounts.roomStates.cleaned,
          selected: filters.roomStates.cleaned,
          type: 'cleaned',
        },
        {
          id: 'inspected',
          label: 'Inspected',
          icon: require('../../../assets/icons/inspected-state-icon.png'),
          iconColor: '#41d541',
          count: filterCounts.roomStates.inspected,
          selected: filters.roomStates.inspected,
          type: 'inspected',
        },
        {
          id: 'priority',
          label: 'Priority',
          icon: require('../../../assets/icons/priority-status.png'),
          iconColor: undefined, // No tint color - icon has its own colors
          count: filterCounts.roomStates.priority,
          selected: filters.roomStates.priority,
          type: 'priority',
        },
      ];
    },
    [filters?.roomStates, filterCounts.roomStates]
  );

  // Guest filter options
  const guestOptions: FilterOption[] = useMemo(
    () => {
      if (!filters || !filters.guests) return [];
      return [
        {
          id: 'arrivals',
          label: 'Arrivals',
          icon: require('../../../assets/icons/guest-arrival-icon.png'),
          iconColor: '#41d541',
          count: filterCounts.guests.arrivals,
          selected: filters.guests.arrivals,
          type: 'arrivals',
        },
        {
          id: 'departures',
          label: 'Departures',
          icon: require('../../../assets/icons/guest-departure-icon.png'),
          iconColor: '#f92424',
          count: filterCounts.guests.departures,
          selected: filters.guests.departures,
          type: 'departures',
        },
        {
          id: 'turnDown',
          label: 'Turn Down',
          icon: require('../../../assets/icons/turndown-icon.png'),
          iconColor: '#4a91fc',
          count: filterCounts.guests.turnDown,
          selected: filters.guests.turnDown,
          type: 'turnDown',
        },
        {
          id: 'stayOver',
          label: 'StayOver',
          icon: require('../../../assets/icons/stayover-icon.png'),
          iconColor: '#1e1e1e',
          count: filterCounts.guests.stayOver,
          selected: filters.guests.stayOver,
          type: 'stayOver',
        },
      ];
    },
    [filters?.guests, filterCounts.guests]
  );

  const handleToggleRoomState = (id: string) => {
    toggleRoomState(id as keyof FilterState['roomStates']);
  };

  const handleToggleGuest = (id: string) => {
    toggleGuest(id as keyof FilterState['guests']);
  };

  const handleGoToResults = () => {
    // Ensure filters is defined before using it
    if (!filters) {
      return;
    }
    
    // If onApplyFilters is provided, use it (for AllRoomsScreen)
    // Otherwise use onGoToResults (for HomeScreen navigation)
    if (onApplyFilters) {
      onApplyFilters(filters);
    } else {
      onGoToResults(filters);
    }
    onClose();
  };

  // Create dynamic styles based on calculated positions
  const dynamicStyles = {
    filterIconContainer: {
      position: 'absolute' as const,
      top: FILTER_ICON_TOP, // Position on top of overlay
      right: 15 * scaleX, // Position on the right side
      width: 40 * scaleX, // Match the increased size from HomeScreen
      height: FILTER_ICON_HEIGHT, // Match the increased size from HomeScreen
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 1002, // Higher than overlay (999) and modal (1000) to be on top
    },
    headerArea: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_HEIGHT, // Header area - no blur
      backgroundColor: 'transparent',
      zIndex: 1001,
    },
    blurOverlay: {
      position: 'absolute' as const,
      top: HEADER_HEIGHT_MINUS_30, // Responsive calculation: HEADER_HEIGHT - 30
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999, // Below modal and filter icon
    },
    modalContainer: {
      position: 'absolute' as const,
      top: MODAL_TOP_OFFSET,
      left: SCREEN_WIDTH * 0.05, // 5% of screen width
      width: SCREEN_WIDTH * 0.9, // 90% of screen width
      maxWidth: 400 * scaleX,
      bottom: 20 * scaleX, // Add margin bottom
      zIndex: 1000, // On top of overlay
    },
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Filter Icon - On top of overlay */}
        {onFilterIconPress && (
          <TouchableOpacity
            style={dynamicStyles.filterIconContainer}
            onPress={onFilterIconPress}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../../assets/icons/menu-icon.png')}
              style={styles.filterIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        
        {/* Header area - no blur, clickable to close */}
        <TouchableOpacity
          style={dynamicStyles.headerArea}
          activeOpacity={1}
          onPress={onClose}
        />
        
        {/* Blurred area - below header and search section */}
        <BlurView intensity={80} style={dynamicStyles.blurOverlay} tint="light">
          <View style={styles.blurDarkener} />
          {/* Backdrop - clickable to close */}
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </BlurView>

        <View
          style={dynamicStyles.modalContainer}
          pointerEvents="box-none"
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filter</Text>
              <TouchableOpacity
                style={styles.resultsButton}
                onPress={handleGoToResults}
                activeOpacity={0.7}
                disabled={!hasActiveFilters}
              >
                <Text
                  style={[
                    styles.resultsButtonText,
                    !hasActiveFilters && styles.resultsButtonTextDisabled,
                  ]}
                >
                  {resultCount} {resultCount === 1 ? 'result' : 'results'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content - Scrollable to ensure buttons are visible */}
            <ScrollView 
              style={styles.contentScrollView}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Room State Section */}
              <FilterSection
                title="Room State"
                options={roomStateOptions}
                onToggle={handleToggleRoomState}
                isRoomState={true}
              />

              {/* Guest Section */}
              <FilterSection
                title="Guest"
                options={guestOptions}
                onToggle={handleToggleGuest}
                isRoomState={false}
                reducedMargin={true}
              />

              {/* Action Buttons - Directly below Stayover */}
              <View style={styles.actionsInline}>
                <TouchableOpacity
                  style={styles.goToResultsButton}
                  onPress={handleGoToResults}
                  activeOpacity={0.7}
                  disabled={!hasActiveFilters}
                >
                  <Text style={[
                    styles.goToResultsButtonText,
                    !hasActiveFilters && styles.goToResultsButtonTextDisabled,
                  ]}>
                    Go to Results
                  </Text>
                  <Image
                    source={require('../../../assets/icons/spear-arrow.png')}
                    style={[
                      styles.arrowIcon,
                      !hasActiveFilters && styles.arrowIconDisabled,
                    ]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {onAdvanceFilter && (
                  <TouchableOpacity
                    style={styles.advanceFilterButton}
                    onPress={onAdvanceFilter}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.advanceFilterText}>Advance Filter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  blurDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 200, 200, 0.6)',
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12 * scaleX,
    shadowColor: 'rgba(100, 131, 176, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 35 * scaleX,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scaleX,
    paddingVertical: 20 * scaleX,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    minHeight: 60 * scaleX,
  },
  headerTitle: {
    fontSize: 20 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.bold as any,
    color: colors.text.primary,
  },
  resultsButton: {
    paddingHorizontal: 12 * scaleX,
    paddingVertical: 6 * scaleX,
  },
  resultsButtonText: {
    fontSize: 16 * scaleX,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.semibold as any,
    color: colors.primary.main,
  },
  resultsButtonTextDisabled: {
    color: colors.text.secondary,
    opacity: 0.5,
  },
  contentScrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20 * scaleX,
    paddingTop: 24 * scaleX,
    paddingBottom: 20 * scaleX, // Padding to ensure buttons are visible
  },
  actionsInline: {
    marginTop: 4 * scaleX, // Minimal spacing after Stayover
  },
  goToResultsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8 * scaleX, // Reduced padding
    marginBottom: 4 * scaleX, // Reduced spacing before Advance Filter
  },
  goToResultsButtonText: {
    fontSize: 18 * scaleX, // Increased from 16px for better visibility
    fontFamily: typography.fontFamily.primary, // Helvetica
    fontWeight: typography.fontWeights.bold as any, // 700
    color: '#5A759D', // Exact color from Figma
    lineHeight: typography.lineHeights.normal, // normal
  },
  goToResultsButtonTextDisabled: {
    color: colors.text.secondary,
    opacity: 0.5,
  },
  arrowIcon: {
    width: 20 * scaleX, // Increased from 16px for better visibility
    height: 20 * scaleX, // Increased from 16px for better visibility
    tintColor: colors.primary.main,
  },
  arrowIconDisabled: {
    tintColor: colors.text.secondary,
    opacity: 0.5,
  },
  advanceFilterButton: {
    paddingVertical: 4 * scaleX, // Reduced padding
    paddingLeft: 0, // Align with Go to Results text
  },
  advanceFilterText: {
    fontSize: 14 * scaleX, // Matches Figma - smaller than Go to Results
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeights.regular as any,
    color: colors.text.secondary, // Lighter grey color
  },
  filterIconContainer: {
    position: 'absolute' as const,
    width: 26 * scaleX,
    height: 12 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1002, // Higher than overlay (999) and modal (1000) to be on top
  },
  filterIconImage: {
    width: 32 * scaleX, // Match the increased size from HomeScreen
    height: 16 * scaleX, // Match the increased size from HomeScreen (maintaining aspect ratio)
    tintColor: colors.primary.main,
  },
});
