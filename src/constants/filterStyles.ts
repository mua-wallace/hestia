/**
 * Filter Modal Styles - Exact values from Figma
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1386-312
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Modal Dimensions
export const FILTER_MODAL = {
  width: 440,
  height: 855,
  borderRadius: 0, // Full screen
  background: '#ffffff',
  overlayBackground: 'rgba(228,228,228,0.1)',
  blurIntensity: 10.45,
} as const;

// Header Section
// All positions are relative to screen (0,0), modal starts at top: 321px
export const FILTER_HEADER = {
  title: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 59, // calc(50%-161px) ≈ 59px
    top: 222, // Screen position, adjust by -321 for modal container
    height: 21,
  },
  resultsBadge: {
    width: 115,
    height: 33,
    borderRadius: 40,
    backgroundColor: 'rgba(181,207,246,0.37)',
    left: 279,
    top: 216, // Screen position, adjust by -321 for modal container
    text: {
      fontSize: 14,
      fontWeight: 'light' as const,
      color: '#000000',
      left: 304,
      top: 223,
    },
  },
} as const;

// Filter Option Styles
export const FILTER_OPTION = {
  checkbox: {
    width: 25,
    height: 24, // Varies: 24, 25, 26
    borderWidth: 1,
    borderColor: '#c6c5c5',
    borderRadius: 0, // Square
    left: 59,
  },
  indicator: {
    size: 19, // Varies: 19, 20, 21
    left: 101,
    borderRadius: 46, // Circular
  },
  label: {
    fontSize: 16,
    fontWeight: 'light' as const,
    color: '#000000',
    left: 132,
  },
  count: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#a9a9a9',
    left: 329, // For Room State
    leftGuest: 365, // For Guest category
  },
} as const;

// Room State Category
// All positions are relative to screen (0,0), modal starts at top: 321px
export const ROOM_STATE_CATEGORY = {
  heading: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 57, // calc(50%-163px) ≈ 57px
    top: 278, // Screen position, adjust by -321 for modal container
    height: 21,
  },
  options: {
    dirty: {
      top: 318,
      checkboxHeight: 24,
      indicatorColor: '#f92424',
      indicatorSize: 19,
      count: '24 Rooms',
    },
    inProgress: {
      top: 363,
      checkboxHeight: 26,
      indicatorColor: '#f0be1b',
      indicatorSize: 19,
      count: '24 Rooms',
    },
    cleaned: {
      top: 413,
      checkboxHeight: 24,
      indicatorColor: '#4a91fc',
      indicatorSize: 20,
      count: '24 Rooms',
    },
    inspected: {
      top: 467,
      checkboxHeight: 25,
      indicatorColor: '#41d541',
      indicatorSize: 19,
      count: '24 Rooms',
    },
    priority: {
      top: 516,
      checkboxHeight: 25,
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../assets/icons/priority-icon.png'), // Need to verify icon
      indicatorSize: 19.412,
      count: '24 Rooms',
    },
  },
} as const;

// Guest Category
// All positions are relative to screen (0,0), modal starts at top: 321px
export const GUEST_CATEGORY = {
  heading: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 59, // calc(50%-161px) ≈ 59px
    top: 565, // Screen position, adjust by -321 for modal container
    height: 24,
  },
  options: {
    arrivals: {
      top: 603,
      checkboxHeight: 24,
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../assets/icons/arrival-icon.png'),
      indicatorSize: 21,
      count: '18',
    },
    departures: {
      top: 654,
      checkboxHeight: 25,
      indicatorType: 'icon' as const,
      indicatorIcon: require('../../assets/icons/departure-icon.png'),
      indicatorSize: 21,
      count: '18',
    },
    turnDown: {
      top: 707,
      checkboxHeight: 24,
      indicatorColor: '#5a759d',
      indicatorSize: 20,
    },
    stayOver: {
      top: 758,
      checkboxHeight: 25,
      indicatorColor: '#000000',
      indicatorSize: 19,
    },
  },
} as const;

// Divider
export const DIVIDER = {
  left: 22,
  top: 517,
  width: 399,
  height: 1,
  color: '#c6c5c5',
} as const;

// Action Buttons
export const FILTER_ACTIONS = {
  goToResults: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#5a759d',
    left: 62,
    top: 838,
    height: 21,
    arrowIcon: {
      width: 25,
      height: 12.765,
      left: 375, // Approximate, positioned right of text
    },
  },
  advanceFilter: {
    fontSize: 13,
    fontWeight: 'light' as const,
    color: '#000000',
    left: 62,
    top: 869,
    height: 19,
  },
} as const;

