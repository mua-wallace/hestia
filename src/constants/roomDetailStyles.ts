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
    left: 20, // From Figma: left: calc(50%-205px) = 220-205 = 15px, but actual visual shows ~20px
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
        left: 20, // From Figma: left: calc(50%-200px) = 20px (consistent with Guest Info)
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
    left: 32, // From Figma: icon left position (Group464)
    top: 1105, // From Figma: icon top position (inset calculation)
    width: 31.974,
    height: 31.974,
  },
  badge: {
    left: 59, // From Figma: left: 59px (absolute position) - overlays on icon
    top: 1109, // From Figma: top: 1109px (absolute position)
    fontSize: 15,
    fontWeight: 'light' as any,
    color: '#ffffff',
    backgroundColor: '#f92424', // Red badge (Ellipse7 in Figma)
    width: 20.455,
    height: 20.455,
    borderRadius: 10.2275,
  },
  badgeText: {
    left: 65.55, // From Figma: left: 65.55px (centered in badge)
    top: 1110.45, // From Figma: top: 1110.45px (centered in badge)
  },
  title: {
    left: 90, // From Figma: left: calc(50%-130px) = 220 - 130 = 90px (not 32px!)
    top: 1110, // From Figma: top: 1110px (absolute position)
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 335, // From Figma: left: 335px (absolute position)
    top: 1098, // From Figma: top: 1098px (absolute position)
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
    top: 1075.09, // From Figma: divider after Lost & Found box (940 + 97 = 1037, but Figma shows no visible divider)
    width: 448,
    height: 1,
    color: '#c6c5c5',
  },
  note: {
    text: {
      left: 27, // From Figma: calc(50%-185px) = 220-185 = 35px, but visually ~27px for left padding
      top: 1169, // From Figma: first note text at top: 1169px (absolute position)
      fontSize: 13,
      fontWeight: 'light' as const,
      color: '#000000',
      width: 353,
    },
    profilePicture: {
      left: 36, // From Figma: left: 36px (absolute position for profile picture)
      top: 1230, // From Figma: top: 1230px (absolute position for first profile picture)
      width: 25,
      height: 25,
    },
    staffName: {
      left: 70, // From Figma: left: 70px (absolute position for staff name)
      top: 1235, // From Figma: top: 1235px (absolute position for first staff name)
      fontSize: 11,
      fontWeight: 'regular' as const,
      color: '#000000',
    },
    note2: {
      textTop: 1265, // Second note text (if any - from visual spacing)
      profileTop: 1326, // Second profile picture (if any)
      staffNameTop: 1331, // Second staff name (if any)
    },
  },
} as const;

// Lost and Found Section - Positioned after Assigned/Task card
export const LOST_AND_FOUND = {
  title: {
    left: 32,
    top: 906, // From Figma: top: 906px (updated from 856.09px to match Figma exactly)
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  box: {
    left: 20, // From Figma: left: 20px (updated from 25px)
    top: 940, // From Figma: top: 940px (updated from 895.09px)
    width: 390,
    height: 97,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(90, 117, 157, 0.23)', // rgba(90, 117, 157, 0.23)
    borderStyle: 'solid' as const, // Changed from dashed to solid
    backgroundColor: '#F9FAFC',
  },
  icon: {
    left: 42, // From Figma absolute position (updated for correct horizontal centering)
    top: 960, // From Figma: absolute top: 960px (icon starts here)
    width: 53.176,
    height: 58.008,
  },
  plusIcon: {
    left: 95, // From Figma: left: 95px (absolute position)
    top: 952, // From Figma: absolute top position
    fontSize: 42,
    fontWeight: 'light' as const,
    color: '#5a759d',
  },
  addPhotosText: {
    left: 51, // From Figma: calc(50%-51px) centered position for text
    top: 970, // From Figma: absolute top position
    fontSize: 19,
    fontWeight: 'bold' as const,
    color: '#5a759d',
  },
} as const;

// Card container for Assigned to and Task sections
export const ASSIGNED_TASK_CARD = {
  left: 20, // From Figma: left: 20px (updated from 25px to match Figma exactly)
  top: 674, // From Figma: top: 674px (updated from 650px to match Figma exactly)
  width: 390, // Card width from Figma
  height: 206.09, // From Figma: height: 206.09px (reverted to original Figma value)
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
    top: 80, // Reduced from 90px to bring divider closer to Assigned to section
    width: 358, // Full width minus padding (390 - 16*2 = 358) - ensures equal left and right padding
    height: 1,
    backgroundColor: '#e3e3e3', // Same as card border color
  },
} as const;

// Assigned to Section - Title is outside card, content is inside card
export const ASSIGNED_TO = {
  title: {
    left: 32, // From Figma: left: calc(50%-193px) = 32px (absolute position from screen left)
    top: 644, // From Figma: top: 644px (updated from 630px to match Figma exactly)
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
    left: 36, // From Figma: absolute left: 36px (will be used as relative to card)
    top: 777, // From Figma: absolute top: 777px (will be converted to relative to card)
    fontSize: 14, // From Figma: text-[14px] (updated from 15px)
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  addButton: {
    left: 335, // From Figma: absolute left: 335px (will be converted to relative to card)
    top: 1098, // From Figma: absolute top: 1098px (note: this is for Notes section, Task button at 761px)
    width: 74,
    height: 39,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: '#000000',
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  // Add button for Task section specifically
  taskAddButton: {
    left: 311, // From Figma: left: 311px (absolute position)
    top: 761, // From Figma: top: 761px (absolute position for Task Add button)
    width: 74,
    height: 39,
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

