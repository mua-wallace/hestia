/**
 * Design tokens extracted from Figma for Staff screen
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=843-7
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

export const STAFF_HEADER = {
  height: 133,
  background: {
    height: 133,
    backgroundColor: '#e4eefe',
  },
  backButton: {
    left: 27,
    top: 69,
    width: 14,
    height: 28,
  },
  title: {
    left: 69, // 27px (back button left) + 14px (back button width) + 28px (gap) = 69px
    top: 69,
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  searchIcon: {
    right: 32,
    top: 158, // Aligned with navigation tabs
    width: 19,
    height: 19,
  },
} as const;

export const STAFF_TABS = {
  container: {
    top: 158,
    height: 39,
  },
  tab: {
    fontSize: 16,
    fontWeight: 'light' as const,
    activeFontWeight: 'bold' as const,
    color: '#5a759d',
    inactiveColor: 'rgba(90,117,157,0.55)',
  },
  tabs: {
    onShift: {
      left: 32,
      top: 158,
      width: 68,
      indicatorWidth: 68,
      indicatorLeft: 32,
    },
    am: {
      left: 131,
      top: 158,
      width: 20, // Approximate
      indicatorWidth: 20,
      indicatorLeft: 131,
    },
    pm: {
      left: 198,
      top: 158,
      width: 20, // Approximate
      indicatorWidth: 20,
      indicatorLeft: 198,
    },
    departments: {
      left: 256,
      top: 158,
      width: 90, // Approximate
      indicatorWidth: 90,
      indicatorLeft: 256,
    },
  },
  indicator: {
    height: 4,
    backgroundColor: '#5a759d',
    borderRadius: 2,
    top: 192, // 34px from container top
  },
  divider: {
    top: 197,
    height: 1,
    width: 448,
    color: '#e3e3e3',
  },
} as const;

export const STAFF_DATE = {
  top: 218,
  left: 23,
  fontSize: 11,
  fontWeight: 'semiBold' as const,
  color: '#000000',
  fontFamily: 'Inter',
} as const;

export const STAFF_CARD = {
  width: 401,
  height: {
    standard: 156,
    compact: 131, // For cards without current task
  },
  borderRadius: 9,
  backgroundColor: '#f9fafc',
  borderColor: '#e3e3e3',
  borderWidth: 1,
  marginHorizontal: 17,
  marginBottom: 20,
  avatar: {
    left: 42,
    top: 16, // Relative to card top
    width: 29,
    height: 29,
    borderRadius: 14.5,
  },
  name: {
    left: 77,
    top: 16, // Relative to card top
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  progressRatio: {
    right: 34, // 367px from left, so right = 401 - 367 = 34
    top: 18, // Relative to card top
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  progressBar: {
    left: 42,
    top: 50, // Relative to card top
    height: 9,
    borderRadius: 27, // For rounded ends
    completedColor: '#ff4dd8',
    remainingColor: '#cdd3dd',
  },
  taskStats: {
    top: 65, // Relative to card top
    fontSize: 16,
    fontWeight: 'light' as const,
    color: '#000000',
    inProgress: {
      left: 42,
    },
    cleaned: {
      left: 168,
    },
    dirty: {
      left: 291,
    },
  },
  currentTask: {
    top: 106, // Relative to card top
    circle: {
      left: 44, // or 39 for some cards
      width: 34,
      height: 34,
      borderRadius: 37,
      backgroundColor: '#f7eecf',
    },
    bellIcon: {
      width: 20, // Approximate
      height: 20,
    },
    roomText: {
      left: 80, // Approximate, centered with circle
      fontSize: 13,
      fontWeight: 'bold' as const,
      color: '#f0be1b',
    },
    timer: {
      left: 80, // or 83 for some cards
      top: 17, // Relative to currentTask top
      fontSize: 13,
      fontWeight: 'regular' as const,
      activeColor: '#f92424',
      inactiveColor: '#1e1e1e',
    },
  },
} as const;


