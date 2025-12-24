/**
 * Design tokens extracted from Figma for Create Ticket screen
 * This screen appears when user clicks the "+ Create" button in Tickets screen
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1085-2628
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Header Styles
export const CREATE_TICKET_HEADER = {
  height: 133,
  background: {
    height: 133,
    backgroundColor: '#e4eefe', // Light blue background
    top: -6, // Extends above screen
  },
  backButton: {
    left: 27,
    top: 63, // From Figma design specs: top=63px (relative to screen, accounting for -6px header offset)
    width: 32, // Match Tickets screen: 32px × 32px (for consistency)
    height: 32, // Match Tickets screen: 32px × 32px (for consistency)
    rotation: 270, // Rotated 270 degrees (pointing left)
  },
  title: {
    // From Figma: left-[calc(50%-151px)] - centered with offset
    left: '50%', // Will use transform or marginLeft for centering
    leftOffset: -151, // Offset for centering calculation
    top: 63, // From Figma design specs: top=63px
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#607aa1',
    text: 'Create Ticket',
  },
} as const;

// Main Content Styles
export const CREATE_TICKET_CONTENT = {
  heading: {
    // From Figma: left-[calc(50%-196px)] - centered with offset
    left: '50%', // Will use transform or marginLeft for centering
    leftOffset: -196, // Offset for centering calculation
    top: 153, // From Figma: y=153
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#607aa1',
    text: 'Create a ticket',
  },
  selectDepartmentLabel: {
    left: 24, // From Figma: x=24
    top: 186, // From Figma: y=186
    fontSize: 14,
    fontWeight: '300' as const, // Inter:Light (300)
    fontFamily: 'Inter', // Inter:Light
    color: '#000000',
    text: 'Select Department',
  },
} as const;

// Department Grid Styles
export const DEPARTMENT_GRID = {
  container: {
    top: 238, // From Figma: first department icon at y=238
    left: 50, // From Figma: first icon at x=50
  },
  item: {
    size: 55.482, // From Figma: size=55.482px
    borderRadius: 37, // From Figma: rounded-[37px]
    backgroundColor: '#ffebeb', // Light pink/red background
  },
  label: {
    fontSize: 14,
    fontWeight: '300' as const, // Inter:Light (300)
    fontFamily: 'Inter', // Inter:Light
    color: '#000000',
    textAlign: 'center' as const, // Labels are centered under icons
    lineHeight: 'normal' as const,
  },
  // Department positions (absolute positions from screen)
  // Labels are centered under icons: labelLeft = iconLeft + (iconSize/2) - (labelWidth/2)
  departments: {
    engineering: {
      left: 50, // From Figma: x=50
      top: 238, // From Figma: y=238
      labelLeft: 50 + (55.482 / 2) - (84 / 2), // Centered: icon center - half label width
      labelTop: 306, // From Figma: label y=306
      labelText: 'Engineering',
      labelWidth: 84, // From Figma: w-[84px]
    },
    hskPortier: {
      left: 184, // From Figma: x=184
      top: 241.26, // From Figma: y=241.26
      labelLeft: 184 + (55.482 / 2) - (79 / 2), // Centered under icon
      labelTop: 309, // From Figma: label y=309
      labelText: 'HSK Portier',
      labelWidth: 79, // From Figma: w-[79px]
    },
    inRoomDining: {
      left: 332, // From Figma: x=332
      top: 241.35, // From Figma: y=241.35
      labelLeft: 332 + (55.482 / 2) - (119.651 / 2), // Centered under icon
      labelTop: 309, // From Figma: label y=309
      labelText: 'In Room Dining',
      labelWidth: 119.651, // From Figma: w-[119.651px]
    },
    laundry: {
      left: 50, // From Figma: x=50
      top: 353.91, // From Figma: y=353.91
      labelLeft: 50 + (55.482 / 2) - (63 / 2), // Centered under icon
      labelTop: 422, // From Figma: label y=422
      labelText: 'Laundry',
      labelWidth: 63, // From Figma: w-[63px]
    },
    concierge: {
      left: 184, // From Figma: x=184
      top: 353.91, // From Figma: y=353.91
      labelLeft: 184 + (55.482 / 2) - (75 / 2), // Centered under icon
      labelTop: 422, // From Figma: label y=422
      labelText: 'Concierge',
      labelWidth: 75, // From Figma: w-[75px]
    },
    reception: {
      left: 332, // From Figma: x=332
      top: 353.91, // From Figma: y=353.91
      labelLeft: 332 + (55.482 / 2) - (76 / 2), // Centered under icon
      labelTop: 422, // From Figma: label y=422
      labelText: 'Reception',
      labelWidth: 76, // From Figma: w-[76px]
    },
    it: {
      left: 50, // From Figma: x=50
      top: 468.68, // From Figma: y=468.68
      labelLeft: 50 + (55.482 / 2) - (15 / 2), // Centered under icon
      labelTop: 529, // From Figma: label y=529
      labelText: 'IT',
      labelWidth: 15, // From Figma: w-[15px]
    },
  },
} as const;

// AI Button Styles
export const CREATE_TICKET_AI_BUTTON = {
  container: {
    // From Figma: left-1/2 top-[618px] translate-x-[-50%] - centered
    left: '50%', // Centered
    top: 618, // From Figma: y=618
    width: 152,
    height: 74,
  },
  button: {
    left: 0, // Relative to container
    top: 0, // Relative to container
    width: 152,
    height: 60,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#ff4dd8', // Pink border
    backgroundColor: 'transparent',
  },
  text: {
    left: 24, // From Figma: text x=24 relative to button
    top: 22, // From Figma: text y=22 relative to button
    fontSize: 16,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#5a759d',
    width: 104, // From Figma: width=104
    text: 'Create Ticket',
  },
  aiBadge: {
    left: 99, // From Figma: badge x=99 relative to button
    top: 44, // From Figma: badge y=44 relative to button
    width: 29, // From Figma: width=29
    height: 30, // From Figma: height=30
    borderRadius: 14.5, // Circular
    backgroundColor: '#ffffff', // White background for badge
  },
  aiText: {
    left: 106, // From Figma: text x=106 relative to button
    top: 51, // From Figma: text y=51 relative to button
    fontSize: 12,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    width: 15, // From Figma: width=15
    text: 'AI',
    // Gradient colors: from #ff46a3 to #4a91fc
    gradientStart: '#ff46a3', // Pink
    gradientEnd: '#4a91fc', // Blue
    // Note: Requires LinearGradient component for implementation
  },
  betaLabel: {
    // From Figma: left-[calc(50%-14px)] - centered
    left: '50%', // Centered
    leftOffset: -14, // Offset for centering
    top: 686, // From Figma: y=686
    fontSize: 9,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#ff4dd8', // Pink color
    width: 28, // From Figma: width=28
    text: 'BETA',
  },
  description: {
    // From Figma: left-[220px] translate-x-[-50%] - centered
    left: 220, // From Figma: x=220
    top: 722, // From Figma: y=722
    width: 318, // From Figma: width=318
    fontSize: 14,
    fontWeight: '300' as const, // Helvetica:Light (300)
    fontFamily: 'Helvetica', // Helvetica:Light
    color: '#000000',
    textAlign: 'center' as const,
    lineHeight: 'normal' as const,
    text: 'AI detects issues and auto-creates tickets for the right department no manual reporting needed.',
  },
} as const;

// Divider Styles
export const CREATE_TICKET_DIVIDER = {
  // From Figma: left-[calc(50%+4px)] - centered with offset
  left: '50%', // Centered
  leftOffset: 4, // Offset for centering
  top: 586, // From Figma: y=586
  width: 448, // From Figma: width=448
  height: 1, // 0.5px stroke in Figma, rendered as 1px
  color: '#e3e3e3', // Light grey
} as const;

// Spacing
export const CREATE_TICKET_SPACING = {
  contentPaddingTop: 133, // Header height
  contentPaddingBottom: 0,
} as const;

// Colors
export const CREATE_TICKET_COLORS = {
  background: '#ffffff',
  headerBackground: '#e4eefe',
  textPrimary: '#000000',
  textSecondary: '#607aa1',
  headingColor: '#607aa1',
  departmentIconBg: '#ffebeb', // Light pink/red
  aiButtonBorder: '#ff4dd8', // Pink
  aiButtonText: '#5a759d',
  aiBadgeBg: '#ffffff',
  aiGradientStart: '#ff46a3', // Pink
  aiGradientEnd: '#4a91fc', // Blue
  betaLabel: '#ff4dd8', // Pink
  divider: '#e3e3e3',
} as const;

// Typography
export const CREATE_TICKET_TYPOGRAPHY = {
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#607aa1',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#607aa1',
  },
  selectDepartmentLabel: {
    fontSize: 14,
    fontWeight: '300' as const, // Inter:Light (300)
    fontFamily: 'Inter', // Inter:Light
    color: '#000000',
  },
  departmentLabel: {
    fontSize: 14,
    fontWeight: '300' as const, // Inter:Light (300)
    fontFamily: 'Inter', // Inter:Light
    color: '#000000',
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#5a759d',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    // Gradient: from #ff46a3 to #4a91fc
    gradientStart: '#ff46a3', // Pink
    gradientEnd: '#4a91fc', // Blue
  },
  betaLabel: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    fontFamily: 'Helvetica', // Helvetica:Bold
    color: '#ff4dd8',
  },
  description: {
    fontSize: 14,
    fontWeight: '300' as const, // Helvetica:Light (300)
    fontFamily: 'Helvetica', // Helvetica:Light
    color: '#000000',
    lineHeight: 'normal' as const,
  },
} as const;

