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
      // Pill-shaped badge positioned after number badge
      left: 209, // Positioned after number badge (189) with ~20px spacing
      top: 349, // Same as name
      backgroundColor: '#41d541', // Green for Arrival
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 6,
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
      // Pill-shaped badge positioned after number badge
      left: 177, // Positioned after number badge (157) with ~20px spacing
      top: 542, // Same as name
      backgroundColor: '#f92424', // Red for Departure
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 6,
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
    // Badge center: 1086.09 + 20.455/2 = 1086.09 + 10.2275 = 1096.3175
    // Icon center should be: 1096.3175
    // Icon top: 1096.3175 - 31.974/2 = 1096.3175 - 15.987 = 1080.33
    left: 25, // From Figma visual inspection
    top: 1080.33, // Center-aligned with badge (updated position)
    width: 31.974,
    height: 31.974,
  },
  badge: {
    left: 52, // Figma: left-[52px]
    top: 1086.09, // Positioned after Lost and Found section (which ends around 1075.09px, so 1075.09 + 11 spacing = 1086.09)
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
    top: 1087.54, // Updated position
  },
  title: {
    left: 83, // Figma: calc(50%-137px) = 220-137 = 83px (title starts after badge)
    top: 1087.09, // Updated position
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 331,
    top: 1086.09,
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
    top: 1075.09, // Positioned after Lost and Found box ends (856.09 + 39 + 180 = 1075.09)
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  note: {
    text: {
      left: 29, // calc(50%-192px) = 220-192 = 28px, rounded to 29px
      top: 1146.09, // First note text (updated: 1086.09 + 60 spacing = 1146.09)
      fontSize: 13,
      fontWeight: 'light' as const,
      color: '#000000',
      width: 353,
    },
    profilePicture: {
      left: 29,
      top: 1207.09, // First profile picture (updated: 1146.09 + 61 spacing)
      width: 25,
      height: 25,
    },
    staffName: {
      left: 63,
      top: 1212.09, // First staff name (updated: 1207.09 + 5 spacing)
      fontSize: 11,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
    note2: {
      textTop: 1248.09, // Second note text (updated: 1146.09 + 102 spacing)
      profileTop: 1309.09, // Second profile picture (updated)
      staffNameTop: 1314.09, // Second staff name (updated)
    },
  },
} as const;

// Lost and Found Section - Positioned after Assigned/Task card
export const LOST_AND_FOUND = {
  title: {
    left: 32,
    top: 856.09, // Positioned immediately after Assigned/Task card (card ends at 650 + 206.09 = 856.09px, 0px margin)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  box: {
    left: 32,
    top: 895.09, // 856.09 + 39 (relative to title)
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

// Card container for Assigned to and Task sections
export const ASSIGNED_TASK_CARD = {
  left: 25, // Card left position (centered: (440 - 390) / 2 = 25px)
  top: 650, // Positioned after Guest Info section (which ends around 625px)
  width: 390, // Card width from Figma
  height: 206.09, // Card height from Figma
  borderRadius: 9,
  backgroundColor: '#f9fafc',
  borderWidth: 1,
  borderColor: '#e3e3e3',
  paddingHorizontal: 16, // Padding inside card
  paddingVertical: 16, // Padding inside card
  divider: {
    // Divider between Assigned to and Task sections
    // Positioned with equal left and right padding matching card padding
    left: 0, // Relative to card content area (starts at content area edge)
    top: 90, // Position between sections - moved to 90px as requested
    width: 358, // Full width minus padding (390 - 16*2 = 358) - ensures equal left and right padding
    height: 1,
    backgroundColor: '#e3e3e3', // Same as card border color
  },
} as const;

// Assigned to Section - Title is outside card, content is inside card
export const ASSIGNED_TO = {
  title: {
    left: 32, // Absolute position from screen left (same as Lost & Found title)
    top: 630, // Positioned above card (card starts at 650px, so 630px is 20px above) - matches Figma
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  profilePicture: {
    left: 15, // Relative to card content area (31 - 16 = 15)
    top: 17, // Relative to card content area top (33 - 16 padding = 17px)
    width: 35,
    height: 35,
  },
  staffName: {
    left: 69, // Relative to card content area (85 - 16 = 69)
    top: 18, // Relative to card content area top (aligned with profile picture top)
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  department: {
    left: 69, // Same as staffName
    top: 34, // Below staff name (18 + 13 + 3 spacing = 34)
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#5a759d', // Lighter grey color
  },
  reassignButton: {
    left: 236, // Relative to card content area (390 - 16 - 122 - 16 = 236px from content area left)
    top: 9, // Relative to card content area top (25 - 16 padding = 9px)
    width: 122,
    height: 49,
    borderRadius: 41,
    backgroundColor: '#f1f6fc',
    fontSize: 18,
    fontWeight: 'regular' as const,
    color: '#5a759d',
  },
} as const;

// Task Section - Inside card container, positioned below Assigned to
// Based on Figma design: Task text and Add button are horizontally aligned within the card
export const TASK_SECTION = {
  title: {
    left: 16, // Same as Assigned to section (relative to card content area)
    top: 101, // Positioned below divider with minimal spacing (divider at 90px + 1px + 10px spacing = 101px)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 284, // Relative to card content area (positioned on right: 390 - 16 - 74 - 16 = 284px)
    top: 90, // 0px margin from divider - aligned with divider top edge (divider at 90px)
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

