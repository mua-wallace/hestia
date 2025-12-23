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
  },
  backButton: {
    left: 27,
    top: 63, // From Figma: y=63 (adjusted from -6px offset)
    width: 32, // Same size as other headers
    height: 32,
  },
  title: {
    left: 69, // From Figma: x=69
    top: 63, // From Figma: y=63 (adjusted from -6px offset)
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
} as const;

// Main Content Styles
export const CREATE_TICKET_CONTENT = {
  heading: {
    left: 24, // From Figma: x=24
    top: 153, // From Figma: y=153
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  selectDepartmentLabel: {
    left: 24, // From Figma: x=24
    top: 186, // From Figma: y=186
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
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
    fontWeight: 'light' as const,
    color: '#000000',
    marginTop: 8, // Spacing between icon and label
    textAlign: 'center' as const,
    width: 84, // Approximate width for centering
  },
  // Department positions (absolute positions from screen)
  departments: {
    engineering: {
      left: 50, // From Figma: x=50
      top: 238, // From Figma: y=238
      labelLeft: 36, // From Figma: label x=36
      labelTop: 306, // From Figma: label y=306
    },
    hskPortier: {
      left: 184, // From Figma: x=184
      top: 241.26, // From Figma: y=241.26
      labelLeft: 172, // From Figma: label x=172
      labelTop: 309, // From Figma: label y=309
    },
    inRoomDining: {
      left: 332, // From Figma: x=332
      top: 241.35, // From Figma: y=241.35
      labelLeft: 300, // From Figma: label x=300
      labelTop: 309, // From Figma: label y=309
    },
    laundry: {
      left: 50, // From Figma: x=50
      top: 353.91, // From Figma: y=353.91
      labelLeft: 47, // From Figma: label x=47
      labelTop: 422, // From Figma: label y=422
    },
    concierge: {
      left: 184, // From Figma: x=184
      top: 353.91, // From Figma: y=353.91
      labelLeft: 174, // From Figma: label x=174
      labelTop: 422, // From Figma: label y=422
    },
    reception: {
      left: 332, // From Figma: x=332
      top: 353.91, // From Figma: y=353.91
      labelLeft: 322, // From Figma: label x=322
      labelTop: 422, // From Figma: label y=422
    },
    it: {
      left: 50, // From Figma: x=50
      top: 468.68, // From Figma: y=468.68
      labelLeft: 71, // From Figma: label x=71
      labelTop: 529, // From Figma: label y=529
    },
  },
} as const;

// AI Button Styles
export const CREATE_TICKET_AI_BUTTON = {
  container: {
    left: 144, // From Figma: x=144 (centered: (440-152)/2 = 144px)
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
    color: '#5a759d',
    width: 104, // From Figma: width=104
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
    width: 15, // From Figma: width=15
    // Gradient colors: from #ff46a3 to #4a91fc
    color: '#ff46a3', // Using pink as primary color (gradient would need LinearGradient component)
  },
  betaLabel: {
    left: 206, // From Figma: x=206 (centered: (440-28)/2 = 206px)
    top: 686, // From Figma: y=686
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: '#ff4dd8', // Pink color
    width: 28, // From Figma: width=28
  },
  description: {
    left: 61, // From Figma: x=61
    top: 722, // From Figma: y=722
    width: 318, // From Figma: width=318
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
    textAlign: 'center' as const,
    lineHeight: 16, // Approximate line height
  },
} as const;

// Divider Styles
export const CREATE_TICKET_DIVIDER = {
  left: 0, // From Figma: x=0 (centered with calc)
  top: 586, // From Figma: y=586
  width: 448, // From Figma: width=448
  height: 1,
  color: '#e3e3e3', // Light grey (assuming same as ticket divider)
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
    color: '#607aa1',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  selectDepartmentLabel: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  departmentLabel: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  aiButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#5a759d',
  },
  aiBadgeText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#ff46a3', // Gradient start color
  },
  betaLabel: {
    fontSize: 9,
    fontWeight: 'bold' as const,
    color: '#ff4dd8',
  },
  description: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
    lineHeight: 16,
  },
} as const;

