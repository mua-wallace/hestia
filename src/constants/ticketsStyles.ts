/**
 * Design tokens extracted from Figma for Tickets screen
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=667-3068
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Header Styles
export const TICKETS_HEADER = {
  height: 133,
  background: {
    height: 133,
    backgroundColor: '#e4eefe', // Light blue background
  },
  backButton: {
    left: 27,
    top: 69,
    width: 32, // Same size as Chat/AllRooms headers
    height: 32,
  },
  title: {
    left: 69, // From Figma: x=69
    top: 69,
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  createButton: {
    right: 44, // From Figma: x=315, screen width=440, so right = 440-315-81 = 44px
    top: 69,
    fontSize: 24, // "+" symbol
    fontWeight: 'bold' as const,
    createTextFontSize: 20, // "Create" text
    createTextFontWeight: 'light' as const,
    color: '#607aa1',
  },
} as const;

// Tab Navigation Styles
export const TICKETS_TABS = {
  container: {
    top: 158,
    height: 31, // Tab height + indicator
  },
  tab: {
    fontSize: 16,
    fontWeight: 'light' as const,
    color: '#5a759d',
    activeFontWeight: 'bold' as const,
    spacing: 53, // Spacing between tabs (All: x=170, My Tickets ends at ~117, so ~53px spacing)
  },
  tabs: {
    myTickets: {
      left: 25,
      top: 158,
    },
    all: {
      left: 170,
      top: 158,
    },
    open: {
      left: 223,
      top: 158,
    },
    closed: {
      left: 287,
      top: 158,
    },
  },
  indicator: {
    height: 4,
    backgroundColor: '#5a759d',
    borderRadius: 2,
    top: 189, // Below tabs
    left: 19, // Aligned with "My Tickets" tab
    width: 92, // Width of "My Tickets" text + padding
  },
} as const;

// Ticket Card Styles
export const TICKET_CARD = {
  width: 409,
  height: 216,
  marginHorizontal: 16, // From Figma: card starts at x=16, screen width=440, so (440-409)/2 = 15.5px, rounded to 16px
  marginBottom: 16, // Spacing between cards
  borderRadius: 9,
  backgroundColor: '#f9fafc',
  borderWidth: 1,
  borderColor: '#e3e3e3',
  paddingHorizontal: 22, // From Figma: content starts at x=38, card starts at x=16, so 38-16=22px
  paddingTop: 24, // From Figma: title at y=237, card starts at y=213, so 237-213=24px
  paddingBottom: 19, // From Figma: button at y=602, card ends at y=629, so 629-602-8=19px
} as const;

// Ticket Content Styles
export const TICKET_CONTENT = {
  title: {
    left: 22, // From Figma: x=38, card x=16, so 38-16=22px
    top: 24, // From Figma: y=237, card y=213, so 237-213=24px
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  description: {
    left: 22, // From Figma: x=38, card x=16, so 38-16=22px
    top: 47, // From Figma: y=260, card y=213, so 260-213=47px
    fontSize: 13,
    fontWeight: 'light' as const,
    color: '#000000',
    lineHeight: 15,
    maxWidth: 190, // From Figma: description width
  },
  dueDateBadge: {
    backgroundColor: '#ffebeb', // Light pink/red
    borderRadius: 44,
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
    position: 'absolute',
    top: 87, // From Figma: Frame y=300, card y=213, so 300-213=87px (same for both cards)
    left: 18, // From Figma: Frame x=34, card x=16, so 34-16=18px
    width: 91, // From Figma: Frame width
    height: 21, // From Figma: Frame height
  },
  category: {
    iconSize: 21,
    iconWidth: 21, // From Figma: Group width
    iconHeight: 19.4, // From Figma: Group height
    iconLeft: 22, // From Figma: icon x=38, card x=16, so 38-16=22px
    iconTop: 78, // From Figma: icon y=523, card y=445, so 523-445=78px (for second card, but same relative position)
    textLeft: 56, // From Figma: text x=72, card x=16, so 72-16=56px
    textTop: 79, // From Figma: text y=524, card y=445, so 524-445=79px
    fontSize: 16,
    fontWeight: 'regular' as const,
    color: '#a0a0a0',
  },
} as const;

// Location Section Styles
export const TICKET_LOCATION = {
  icon: {
    left: 258, // From Figma: x=274, card x=16, so 274-16=258px
    top: 41, // From Figma: y=254, card y=213, so 254-213=41px
    size: 33,
    backgroundColor: '#ffc107', // Yellow pin color (approximate)
  },
  pinIcon: {
    left: 268, // From Figma: Group x=284, card x=16, so 284-16=268px
    top: 47.5, // From Figma: Group y=260.5, card y=213, so 260.5-213=47.5px
    width: 14,
    height: 20.2, // From Figma: exact height
  },
  label: {
    left: 305, // From Figma: x=321, card x=16, so 321-16=305px
    top: 40, // From Figma: y=253, card y=213, so 253-213=40px
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  roomNumber: {
    left: 305, // From Figma: x=321, card x=16, so 321-16=305px
    top: 56, // From Figma: y=269, card y=213, so 269-213=56px
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
} as const;

// Creator Section Styles
export const TICKET_CREATOR = {
  avatar: {
    left: 22, // From Figma: x=38, card x=16, so 38-16=22px
    top: 164, // From Figma: y=377, card y=213, so 377-213=164px
    size: 25,
  },
  label: {
    left: 60, // From Figma: x=76, card x=16, so 76-16=60px
    top: 163, // From Figma: y=376, card y=213, so 376-213=163px
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  name: {
    left: 60, // From Figma: x=76, card x=16, so 76-16=60px
    top: 177, // From Figma: y=390, card y=213, so 390-213=177px
    fontSize: 11,
    fontWeight: 'regular' as const,
    color: '#000000',
  },
} as const;

// Status Button Styles
export const TICKET_STATUS = {
  button: {
    height: 37,
    borderRadius: 41,
    position: 'absolute',
  },
  done: {
    left: 258, // From Figma: x=274, card x=16, so 274-16=258px
    top: 157, // From Figma: y=602, card y=445, so 602-445=157px
    backgroundColor: '#41d541', // Green
    width: 122,
    textColor: '#ffffff',
    textLeft: 304, // From Figma: text x=320, card x=16, so 320-16=304px absolute (for second card)
    textTop: 166, // From Figma: text y=611, card y=445, so 611-445=166px absolute (for second card)
    iconLeft: 275, // From Figma: icon Group x=291, card x=16, so 291-16=275px absolute (for second card)
    iconTop: 165, // From Figma: icon Group y=610, card y=445, so 610-445=165px absolute (for second card)
    iconWidth: 20.9,
    iconHeight: 18.5,
  },
  unsolved: {
    left: 243, // From Figma: x=259, card x=16, so 259-16=243px
    top: 157, // From Figma: y=370, card y=213, so 370-213=157px
    backgroundColor: 'rgba(249, 36, 36, 0.06)', // Light red background
    width: 137,
    textColor: '#f92424', // Red text
    textLeft: 288, // From Figma: text x=304, card x=16, so 304-16=288px absolute
    textTop: 165, // From Figma: text y=378, card y=213, so 378-213=165px absolute
    iconLeft: 282.9, // From Figma: icon Group x=298.9, card x=16, so 298.9-16=282.9px absolute
    iconTop: 185.5, // From Figma: icon Group y=398.5, card y=213, so 398.5-213=185.5px absolute
    iconWidth: 20.9,
    iconHeight: 18.5,
    iconRotate: 180, // Rotated 180 degrees
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
} as const;

// Divider Styles
export const TICKET_DIVIDER = {
  left: 0, // From Figma: x=16, card x=16, so relative to card: 0
  top: 135, // From Figma: y=348, card y=213, so 348-213=135px
  width: 409, // Same as card width
  height: 1,
  color: '#e3e3e3', // Light grey
} as const;

// Spacing
export const TICKETS_SPACING = {
  contentPaddingTop: 220, // Header (133) + tabs (31) + spacing (56) = 220px
  contentPaddingBottom: 152, // Bottom nav height
  cardSpacing: 16, // Space between cards
} as const;

// Colors
export const TICKETS_COLORS = {
  background: '#ffffff',
  headerBackground: '#e4eefe',
  cardBackground: '#f9fafc',
  cardBorder: '#e3e3e3',
  textPrimary: '#000000',
  textSecondary: '#5a759d',
  textTertiary: '#a0a0a0',
  tabActive: '#5a759d',
  tabInactive: '#5a759d', // Same color but different weight
  dueDateBadge: '#ffebeb',
  statusDone: '#41d541',
  statusUnsolved: '#f92424',
  statusUnsolvedBg: 'rgba(249, 36, 36, 0.06)',
  locationPin: '#ffc107', // Yellow (approximate)
} as const;

// Typography
export const TICKETS_TYPOGRAPHY = {
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#607aa1',
  },
  createButton: {
    plusFontSize: 24,
    plusFontWeight: 'bold' as const,
    textFontSize: 20,
    textFontWeight: 'light' as const,
    color: '#607aa1',
  },
  tab: {
    fontSize: 16,
    fontWeight: 'light' as const,
    activeFontWeight: 'bold' as const,
    color: '#5a759d',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  ticketDescription: {
    fontSize: 13,
    fontWeight: 'light' as const,
    color: '#000000',
    lineHeight: 15,
  },
  dueDate: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  category: {
    fontSize: 16,
    fontWeight: 'regular' as const,
    color: '#a0a0a0',
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  locationRoom: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#000000',
  },
  creatorLabel: {
    fontSize: 11,
    fontWeight: 'light' as const,
    color: '#000000',
  },
  creatorName: {
    fontSize: 11,
    fontWeight: 'regular' as const,
    color: '#000000',
  },
  statusButton: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
} as const;

