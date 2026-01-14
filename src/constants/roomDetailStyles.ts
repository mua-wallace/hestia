/**
 * Room Detail Screen Styles - Exact values from Figma
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1-1506
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Header Section (Yellow Background)
export const ROOM_DETAIL_HEADER = {
  height: 232,
  backgroundColor: '#f0be1b', // Yellow
  backButton: {
    left: 26,
    top: 69,
    width: 35, // Increased from 28
    height: 18, // Increased from 14 (maintaining aspect ratio)
  },
  roomNumber: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#ffffff',
    top: 69,
    // Centered
  },
  roomCode: {
    fontSize: 17,
    fontWeight: 'light' as const,
    color: '#ffffff',
    top: 103,
    // Centered
  },
  statusIndicator: {
    left: 131,
    top: 176,
    width: 168,
    height: 30.769,
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#ffffff',
  },
  profilePicture: {
    left: 352,
    top: 56,
    width: 54,
    height: 54,
  },
} as const;

// Tab Navigation
export const DETAIL_TABS = {
  container: {
    top: 252,
    height: 29, // 252 to 281
  },
  tabs: {
    fontSize: 16,
    fontWeight: 'bold' as const, // Active tab
    fontWeightInactive: 'light' as const, // Inactive tabs
    color: '#5a759d',
    spacing: 122, // Space between tabs
  },
  overview: {
    left: 21,
    top: 252,
  },
  tickets: {
    left: 143,
    top: 252,
  },
  checklist: {
    left: 235,
    top: 252,
  },
  history: {
    left: 362,
    top: 252,
  },
  underline: {
    height: 4,
    backgroundColor: '#5a759d',
    left: 15,
    top: 281,
    width: 92,
  },
} as const;

// Content Area
export const CONTENT_AREA = {
  top: 285,
  backgroundColor: '#ffffff',
  backgroundTop: '#f1f3f8', // Light gray background at top
  backgroundTopHeight: 285,
} as const;

// Guest Info Section
export const GUEST_INFO = {
  title: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
    left: 15, // calc(50%-205px) = 220 - 205 = 15px (from Figma: left-[calc(50%-205px)])
    top: 303, // Absolute position from top of screen
  },
  divider: {
    left: 0,
    top: 510,
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  divider2: {
    left: 0,
    top: 625,
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  arrival: {
    icon: {
      left: 21,
      top: 349,
      width: 21,
      height: 21,
    },
    name: {
      left: 77,
      top: 349,
      fontSize: 14,
      fontWeight: 'bold' as const,
      color: '#000000',
    },
    numberBadge: {
      left: 189,
      top: 350,
      fontSize: 12,
      fontWeight: 'light' as const,
      color: '#334866',
    },
    categoryBadge: {
      // Pill-shaped badge on the right
      right: 32, // From right edge
      top: 349, // Same as name
      backgroundColor: '#41d541', // Green for Arrival
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold' as const,
      color: '#ffffff',
    },
    dates: {
      left: 79,
      top: 377,
      fontSize: 14,
      fontWeight: 'light' as const,
      color: '#000000',
    },
    occupancy: {
      iconLeft: 164,
      textLeft: 183,
      top: 378,
      fontSize: 14,
      fontWeight: 'light' as const,
      color: '#000000',
    },
    eta: {
      left: 215,
      top: 377,
      fontSize: 14,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
    specialInstructions: {
      title: {
        left: 20, // calc(50%-200px) = 220 - 200 = 20px
        top: 417,
        fontSize: 13,
        fontWeight: 'bold' as const,
        color: '#000000',
      },
      text: {
        left: 20,
        top: 442,
        fontSize: 13,
        fontWeight: 'light' as const,
        color: '#000000',
        width: 392,
      },
    },
  },
  departure: {
    icon: {
      left: 21,
      top: 542,
      width: 21,
      height: 21,
    },
    name: {
      left: 77,
      top: 542,
      fontSize: 14,
      fontWeight: 'bold' as const,
      color: '#000000',
    },
    numberBadge: {
      left: 157,
      top: 543,
      fontSize: 12,
      fontWeight: 'light' as const,
      color: '#334866',
    },
    categoryBadge: {
      // Pill-shaped badge on the right
      right: 32, // From right edge
      top: 542, // Same as name
      backgroundColor: '#f92424', // Red for Departure
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold' as const,
      color: '#ffffff',
    },
    dates: {
      left: 78,
      top: 568,
      fontSize: 14,
      fontWeight: 'light' as const,
      color: '#000000',
    },
    occupancy: {
      iconLeft: 163,
      textLeft: 182,
      top: 566,
      fontSize: 14,
      fontWeight: 'light' as const,
      color: '#000000',
    },
    edt: {
      left: 222,
      top: 567,
      fontSize: 14,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
  },
} as const;

// Notes Section - Positioned after Lost and Found section
export const NOTES_SECTION = {
  icon: {
    // Center-align icon with badge vertically
    // Badge center: 1040 + 20.455/2 = 1040 + 10.2275 = 1050.2275
    // Icon center should be: 1050.2275
    // Icon top: 1050.2275 - 31.974/2 = 1050.2275 - 15.987 = 1034.24
    left: 25, // From Figma visual inspection
    top: 1034.24, // Center-aligned with badge (updated position)
    width: 31.974,
    height: 31.974,
  },
  badge: {
    left: 52, // Figma: left-[52px]
    top: 1040, // Positioned after Lost and Found section (which ends around 1029px)
    fontSize: 15,
    fontWeight: 'light' as any,
    color: '#ffffff',
    backgroundColor: '#f92424', // Red badge
    width: 20.455,
    height: 20.455,
    borderRadius: 10.2275,
  },
  badgeText: {
    left: 58.55, // Figma: left-[58.55px]
    top: 1041.45, // Updated position
  },
  title: {
    left: 83, // Figma: calc(50%-137px) = 220-137 = 83px (title starts after badge)
    top: 1041, // Updated position
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 331,
    top: 1040,
    width: 74,
    height: 39,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  divider: {
    left: 0,
    top: 1029, // Positioned after Lost and Found box ends (810 + 39 + 180 = 1029)
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  note: {
    text: {
      left: 29, // calc(50%-192px) = 220-192 = 28px, rounded to 29px
      top: 1100, // First note text (updated: 1040 + 60 spacing = 1100)
      fontSize: 13,
      fontWeight: 'light' as const,
      color: '#000000',
      width: 353,
    },
    profilePicture: {
      left: 29,
      top: 1161, // First profile picture (updated: 1100 + 61 spacing)
      width: 25,
      height: 25,
    },
    staffName: {
      left: 63,
      top: 1166, // First staff name (updated: 1161 + 5 spacing)
      fontSize: 11,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
    note2: {
      textTop: 1202, // Second note text (updated: 1100 + 102 spacing)
      profileTop: 1263, // Second profile picture (updated)
      staffNameTop: 1268, // Second staff name (updated)
    },
  },
} as const;

// Lost and Found Section - Positioned after Task section
export const LOST_AND_FOUND = {
  title: {
    left: 32,
    top: 810, // Positioned after Task section (which ends around 800px)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  box: {
    left: 32,
    top: 849, // 810 + 39 (relative to title)
    width: 384,
    height: 180,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#cbc7c7',
    borderStyle: 'dashed' as const,
  },
  icon: {
    left: 160,
    top: 31.02, // Relative to box
    width: 53.176,
    height: 58.008,
  },
  plusIcon: {
    left: 213,
    top: 23, // Relative to box
    fontSize: 42,
    fontWeight: 'light' as const,
    color: '#5a759d',
  },
  addPhotosText: {
    left: 160, // Centered in box
    top: 99, // Relative to box
    fontSize: 19,
    fontWeight: 'bold' as const,
    color: '#5a759d',
  },
} as const;

// Assigned to Section - Now positioned right after Guest Info
export const ASSIGNED_TO = {
  title: {
    left: 32, // calc(50%-192px) ≈ 32px
    top: 650, // Positioned after Guest Info section (which ends around 625px)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  profilePicture: {
    left: 31,
    top: 699, // 650 + 49 (relative to title)
    width: 35,
    height: 35,
  },
  staffName: {
    left: 85,
    top: 700, // 650 + 50 (relative to title)
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  reassignButton: {
    left: 291,
    top: 691, // 650 + 41 (relative to title)
    width: 122,
    height: 49,
    borderRadius: 41,
    backgroundColor: '#f1f6fc',
    fontSize: 18,
    fontWeight: 'regular' as const,
    color: '#5a759d',
  },
} as const;

// Task Section - Positioned after Assigned to section
export const TASK_SECTION = {
  title: {
    left: 32, // Same as Assigned to section
    top: 750, // Positioned after Assigned to section (which ends around 740px)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 331, // Same as Notes section add button
    top: 746, // Aligned with title (4px above for visual alignment)
    width: 74,
    height: 39,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
} as const;

// Urgent Badge
export const URGENT_BADGE = {
  left: 376,
  top: 870,
  fontSize: 13,
  fontWeight: 'bold' as const,
  color: '#ffffff',
  backgroundColor: '#f92424', // Red
} as const;

