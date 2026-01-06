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

// Notes Section
export const NOTES_SECTION = {
  icon: {
    // Center-align icon with badge vertically
    // Badge center: 646 + 20.455/2 = 646 + 10.2275 = 656.2275
    // Icon center should be: 656.2275
    // Icon top: 656.2275 - 31.974/2 = 656.2275 - 15.987 = 640.24
    left: 25, // From Figma visual inspection
    top: 640.24, // Center-aligned with badge
    width: 31.974,
    height: 31.974,
  },
  badge: {
    left: 52, // Figma: left-[52px]
    top: 646, // Figma: top-[646px] - exact match
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
    top: 647.45, // Figma: top-[647.45px] - exact match
  },
  title: {
    left: 83, // Figma: calc(50%-137px) = 220-137 = 83px (title starts after badge)
    top: 647, // Updated from 652 to match Figma
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 331,
    top: 646,
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
    top: 1171,
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  note: {
    text: {
      left: 29, // calc(50%-192px) = 220-192 = 28px, rounded to 29px
      top: 706, // First note text from Figma
      fontSize: 13,
      fontWeight: 'light' as const,
      color: '#000000',
      width: 353,
    },
    profilePicture: {
      left: 29,
      top: 767, // First profile picture from Figma
      width: 25,
      height: 25,
    },
    staffName: {
      left: 63,
      top: 772, // First staff name from Figma
      fontSize: 11,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
    note2: {
      textTop: 808, // Second note text from Figma
      profileTop: 869, // Second profile picture from Figma
      staffNameTop: 874, // Second staff name from Figma
    },
  },
} as const;

// Lost and Found Section
export const LOST_AND_FOUND = {
  title: {
    left: 32,
    top: 934,
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  box: {
    left: 32,
    top: 973,
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

// Assigned to Section
export const ASSIGNED_TO = {
  title: {
    left: 32, // calc(50%-192px) ≈ 32px
    top: 1190,
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  profilePicture: {
    left: 31,
    top: 1239,
    width: 35,
    height: 35,
  },
  staffName: {
    left: 85,
    top: 1240,
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  reassignButton: {
    left: 291,
    top: 1231,
    width: 122,
    height: 49,
    borderRadius: 41,
    backgroundColor: '#f1f6fc',
    fontSize: 18,
    fontWeight: 'regular' as const,
    color: '#5a759d',
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

