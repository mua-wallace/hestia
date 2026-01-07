/**
 * Design tokens extracted from Figma for Lost and Found screen
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=733-662
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Header Styles
export const LOST_AND_FOUND_HEADER = {
  height: 133,
  background: {
    height: 133,
    backgroundColor: '#e4eefe', // Light blue background
  },
  backButton: {
    left: 27,
    top: 69,
    width: 32,
    height: 32,
  },
  title: {
    left: 69, // From Figma: x=69 (centered with back button)
    top: 69,
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  registerButton: {
    right: 44, // From Figma: x=315, screen width=440, so right = 440-315-81 = 44px
    top: 67,
    plusFontSize: 24, // "+" symbol
    plusFontWeight: 'bold' as const,
    textFontSize: 20, // "Register" text
    textFontWeight: 'light' as const,
    color: '#ff46a3', // Pink color
  },
} as const;

// Tab Navigation Styles
export const LOST_AND_FOUND_TABS = {
  container: {
    top: 158,
    height: 39, // Tab height + indicator + spacing
  },
  tab: {
    fontSize: 16,
    fontWeight: 'light' as const,
    activeFontWeight: 'bold' as const,
    color: '#5a759d',
    inactiveColor: 'rgba(90,117,157,0.55)',
  },
  tabs: {
    created: {
      left: 32, // From Figma: left-[32px]
      top: 158,
      width: 68, // Approximate text width
      indicatorWidth: 68, // From Figma: w-[68px] for indicator
      indicatorLeft: 32, // From Figma: left-[32px] for indicator
    },
    stored: {
      left: 118, // From Figma: left-[118px]
      top: 158,
      width: 54, // Approximate text width
      indicatorWidth: 54,
      indicatorLeft: 118,
    },
    returned: {
      left: 186, // From Figma: left-[186px]
      top: 158,
      width: 68, // Approximate text width
      indicatorWidth: 68,
      indicatorLeft: 186,
    },
    discarded: {
      left: 272, // From Figma: left-[272px]
      top: 158,
      width: 76, // Approximate text width
      indicatorWidth: 76,
      indicatorLeft: 272,
    },
  },
  indicator: {
    height: 4, // From Figma: h-[4px]
    backgroundColor: '#5a759d', // From Figma: bg-[#5a759d]
    borderRadius: 2,
    top: 192, // From Figma: top-[192px] (34px from container top: 192-158=34)
  },
  searchIcon: {
    right: 32, // From Figma: approximately right side
    top: 158, // Same as tabs
    width: 19, // From Figma design
    height: 19,
  },
} as const;

// Item Card Styles
export const LOST_AND_FOUND_CARD = {
  width: 409,
  height: 271,
  marginHorizontal: 16, // From Figma: card starts at x=16
  marginBottom: 16, // Spacing between cards
  borderRadius: 9,
  backgroundColor: '#f9fafc',
  borderWidth: 1,
  borderColor: '#e3e3e3',
  paddingHorizontal: 21, // From Figma: content starts at x=37, card starts at x=16, so 37-16=21px
  paddingTop: 15, // From Figma: title at y=228, card starts at y=213, so 228-213=15px
} as const;

// Item Content Styles
export const LOST_AND_FOUND_CONTENT = {
  itemName: {
    left: 21, // From Figma: x=37, card x=16, so 37-16=21px
    top: 15, // From Figma: y=228, card y=213, so 228-213=15px
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  itemId: {
    left: 149, // From Figma: x=165, card x=16, so 165-16=149px
    top: 17, // From Figma: y=230, card y=213, so 230-213=17px
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  copyIcon: {
    left: 214, // From Figma: x=230, card x=16, so 230-16=214px
    top: 18, // From Figma: y=231, card y=213, so 231-213=18px
    width: 13, // From Figma: width=13
    height: 13, // From Figma: height=13
  },
  location: {
    left: 21, // Same as itemName
    top: 53, // From Figma: y=266, card y=213, so 266-213=53px
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  guestName: {
    left: 21, // Same as itemName
    top: 80, // From Figma: y=293, card y=213, so 293-213=80px
    fontSize: 17,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  roomBadge: {
    left: 168, // From Figma: x=184, card x=16, so 184-16=168px
    top: 80, // Same as guestName
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
  },
  roomBadgeText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#f9fafc',
  },
} as const;

// Stored Location Section
export const LOST_AND_FOUND_STORED_LOCATION = {
  icon: {
    left: 21, // From Figma: x=33, card x=16, so 33-16=21px (adjusted to match padding)
    top: 129, // From Figma: y=342, card y=213, so 342-213=129px
    size: 33,
    backgroundColor: '#f0be1b', // Yellow
  },
  pinIcon: {
    width: 14,
    height: 20.2,
  },
  label: {
    left: 57, // From Figma: x=73, card x=16, so 73-16=57px
    top: 130, // From Figma: y=343, card y=213, so 343-213=130px
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  name: {
    left: 57, // Same as label
    top: 146, // From Figma: y=359, card y=213, so 359-213=146px
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
} as const;

// Registered/Stored By Section
export const LOST_AND_FOUND_REGISTERED_BY = {
  avatar: {
    left: 21, // From Figma: x=37, card x=16, so 37-16=21px
    top: 220, // From Figma: y=433, card y=213, so 433-213=220px
    size: 28,
  },
  label: {
    left: 21, // From Figma: x=35, card x=16, so 35-16=19px, but using 21 for consistency
    top: 194, // From Figma: y=407, card y=213, so 407-213=194px
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  name: {
    left: 55, // From Figma: x=72, card x=16, so 72-16=56px
    top: 219, // From Figma: y=432, card y=213, so 432-213=219px
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  timestamp: {
    left: 55, // Same as name
    top: 235, // From Figma: y=448, card y=213, so 448-213=235px
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#000000',
  },
} as const;

// Item Image
export const LOST_AND_FOUND_IMAGE = {
  left: 250, // From Figma: x=266, card x=16, so 266-16=250px
  top: 13, // From Figma: y=226, card y=213, so 226-213=13px
  width: 146, // First card
  height: 153, // First card
  borderRadius: 10, // First card
  // Second card variations:
  // width: 144, height: 158, borderRadius: 16
} as const;

// Status Button Styles
export const LOST_AND_FOUND_STATUS = {
  button: {
    height: 54,
    borderRadius: 75, // Pill shape
    position: 'absolute',
  },
  stored: {
    left: 278, // From Figma: x=294, card x=16, so 294-16=278px
    top: 199, // From Figma: y=412, card y=213, so 412-213=199px
    backgroundColor: '#f0be1b', // Yellow
    width: 118,
    textColor: '#ffffff',
    textLeft: 301, // From Figma: text x=317, card x=16, so 317-16=301px
    textTop: 217, // From Figma: text y=430, card y=213, so 430-213=217px
    textHeight: 18, // From Figma: text height=18px
    iconLeft: 359.6, // From Figma: icon x=375.6, card x=16, so 375.6-16=359.6px
    // Align icon center with text center: text center at 217 + 9 = 226, icon height 8, so icon top = 226 - 4 = 222
    iconTop: 222, // Aligned with text center
    iconWidth: 17, // From Figma: icon width=17px
    iconHeight: 8, // From Figma: icon height=8px
  },
  shipped: {
    left: 278, // From Figma: button x=294, card x=16, so 294-16=278px
    top: 199, // From Figma: button y=708, second card y=509, so 708-509=199px
    backgroundColor: '#41d541', // Green
    width: 118,
    textColor: '#ffffff',
    // Center text and icon in button with equal padding
    // Button width: 118px, center at 59px
    // Text width: 64px, Icon width: 14px, spacing: 6px
    // Total content width: 64 + 6 + 14 = 84px
    // To center: (118 - 84) / 2 = 17px padding on each side
    // Text left: 17px from button left
    // Icon left: 17 + 64 + 6 = 87px from button left
    textLeft: 295, // 278 (button left) + 17 (centered padding) = 295px relative to card
    textTop: 217, // From Figma: text y=726, second card y=509, so 726-509=217px (centered: 199 + 27 - 9 = 217)
    textHeight: 18, // From Figma: text height=18px
    iconLeft: 365, // 278 (button left) + 87 (centered icon position) = 365px relative to card
    iconTop: 221, // From Figma: icon y=730, second card y=509, so 730-509=221px (centered: 199 + 27 - 5 = 221)
    iconWidth: 14, // From Figma: icon width=14px
    iconHeight: 10, // From Figma: icon height=10px
  },
  text: {
    fontSize: 16, // From Figma: font-size: 16px
    fontWeight: 'bold' as const, // From Figma: font-weight: bold
    lineHeight: 18, // From Figma: text height=18px
  },
} as const;

// Divider Styles
export const LOST_AND_FOUND_DIVIDER = {
  left: 16, // From Figma: x=16, card x=16, so relative to card: 0, but using 16 for padding
  top: 184, // From Figma: y=397, card y=213, so 397-213=184px
  width: 377, // From Figma: width=408, but accounting for padding: 409-32=377px
  height: 1,
  color: '#e3e3e3',
} as const;

// Spacing
export const LOST_AND_FOUND_SPACING = {
  contentPaddingTop: 197, // Header (133) + tabs (39) + spacing (25) = 197px
  contentPaddingBottom: 152, // Bottom nav height
  cardSpacing: 16, // Space between cards
} as const;

// Colors
export const LOST_AND_FOUND_COLORS = {
  background: '#ffffff',
  headerBackground: '#e4eefe',
  cardBackground: '#f9fafc',
  cardBorder: '#e3e3e3',
  textPrimary: '#000000',
  textSecondary: '#1e1e1e',
  tabActive: '#5a759d',
  tabInactive: 'rgba(90,117,157,0.55)',
  statusStored: '#f0be1b',
  statusShipped: '#41d541',
  locationPin: '#f0be1b', // Yellow
  registerButton: '#ff46a3', // Pink
} as const;

// Typography
export const LOST_AND_FOUND_TYPOGRAPHY = {
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  registerButton: {
    plusFontSize: 24,
    plusFontWeight: 'bold' as const,
    textFontSize: 20,
    textFontWeight: 'light' as const,
    color: '#ff46a3',
  },
  tab: {
    fontSize: 16,
    fontWeight: 'light' as const,
    activeFontWeight: 'bold' as const,
    color: '#5a759d',
    inactiveColor: 'rgba(90,117,157,0.55)',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  itemId: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  guestName: {
    fontSize: 17,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  storedLocationLabel: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  storedLocationName: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  registeredByLabel: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  staffName: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  statusButton: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
} as const;

