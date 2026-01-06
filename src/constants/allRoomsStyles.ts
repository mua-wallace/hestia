/**
 * Design tokens extracted from Figma for All Rooms screen
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1-1172
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// Card Dimensions
export const CARD_DIMENSIONS = {
  width: 426,
  heights: {
    standard: 177,        // Single guest, no notes
    withGuestInfo: 185,   // Standard with guest info
    withNotes: 222,       // With notes section
    arrivalDeparture: 292, // Arrival/Departure with 2 guests
  },
  marginHorizontal: 7,
  marginBottom: 16,
  borderRadius: 9,
} as const;

// Card Colors - Exact values from Figma design
export const CARD_COLORS = {
  background: '#f9fafc', // Default white/light gray for all non-priority cards
  border: '#e3e3e3',
  priorityBackground: 'rgba(249, 36, 36, 0.08)', // Light pink/reddish for priority cards (exact from Figma)
  priorityBorder: '#f92424', // Red border for priority cards
} as const;

// Room Header Styles - Exact values from Figma
export const ROOM_HEADER = {
  paddingTop: 17,
  paddingHorizontal: 14,
  icon: {
    width: 29.348,
    height: 22.581,
    left: 14, // Room 201: left-[14px], Room 202/203/204: left-[21px] (average: 17.5, using 14 for priority card)
    top: 24.59, // Exact from Figma
  },
  iconArrivalDeparture: {
    width: 45, // Updated size for Arrival/Departure icon
    height: 29.348,
  },
  iconStandard: {
    left: 21, // For non-priority cards
  },
  roomNumber: {
    fontSize: 21,
    fontWeight: 'bold' as const,
    color: '#334866',
    left: 72, // Room 201: left-[72px], Room 202/203/204: left-[79px] (using 72 for priority, 79 for standard)
    top: 17, // Exact from Figma
    lineHeight: 27,
  },
  roomNumberStandard: {
    left: 79, // For non-priority cards
  },
  roomType: {
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#334866',
    left: 111, // Room 201 (Priority): left-[111px] top-[22px]
    top: 22, // Exact from Figma - consistent across all cards
    lineHeight: 14,
  },
  roomTypeStandard: {
    left: 118, // Room 202/203/204/205: left-[118px] top-[22px] (all standard cards)
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#334866',
    left: 70, // Room 201: left-[70px], Room 202/203/204: left-[77px]
    top: 40, // Exact from Figma
    lineHeight: 19,
  },
  categoryStandard: {
    left: 77, // For non-priority cards
  },
  chevron: {
    width: 7,
    height: 14,
    right: 15, // 426 - 401 - 7 = 18, but Figma shows left-[401px] which is 426-401=25px from right, icon width 7px, so right: 18px
    top: 29, // Exact from Figma
  },
  priorityBadge: {
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#334866',
    positions: {
      standard: { left: 185, top: 82 }, // Room 203 badge "11" (relative to card top: 853-771=82px)
    },
  },
} as const;

// Guest Info Styles - Exact values from Figma
export const GUEST_INFO = {
  // Container positions
  container: {
    left: 73, // Room 201 (Priority): left-[73px]
  },
  containerStandard: {
    left: 73, // Room 204: name/date at x=80 absolute, card starts at x=7, so relative to card: 80-7=73px
  },
  containerWithNotes: {
    left: 70, // Room 203: name at x=77 absolute, card starts at x=7, so relative to card: 77-7=70px
  },
  icon: {
    width: 28.371,
    height: 29.919,
  },
  iconArrivalDeparture: {
    width: 28.371, // Larger icon size for Arrival/Departure guest icons
    height: 29.919,
    positions: {
      firstGuest: { left: 17, top: 88 }, // Room 201 first guest icon: x=17, y=88 (from Figma)
      secondGuest: { left: 18, top: 173 }, // Room 201 second guest icon: x=18, y=173 (from Figma)
    },
  },
  iconStandardDeparture: {
    left: 17, // Room 202 (Departure): icon at x=24 from screen, x=24-7=17px from card
    top: 93, // Room 202: icon at y=656 from screen, y=656-563=93px from card
  },
  iconWithNotes: {
    left: 14, // Room 203 (with notes): icon at x=21 from screen, card at x=7, so 21-7=14px from card
    top: 89, // Room 203: icon at y=860 from screen, card at y=771, so 860-771=89px from card
  },
  // Guest name styles and positions
  name: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#000000',
    lineHeight: 10, // Figma shows h-[10px]
    top: 87, // Room 201 first guest: top-[87px]
  },
  nameSecond: {
    top: 162, // Room 201 second guest: top-[162px]
  },
  nameStandard: {
    top: 92, // Room 202 (Departure, 177px height): top-[655px] relative (655-563=92px)
  },
  nameStandardArrival: {
    top: 87, // Room 204 (Arrival, 185px height): top-[1111px] relative (1111-1024=87px), Room 205: top-[1327px] relative (1327-1240=87px)
  },
  nameWithNotes: {
    top: 80, // Room 203: top-[851px] relative (851-771=80px)
  },
  // Date range styles and positions
  dateRange: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
    lineHeight: 17,
    top: 109, // Room 201 first: top-[109px]
  },
  dateRangeSecond: {
    top: 184, // Room 201 second: top-[184px]
  },
  dateRangeStandard: {
    top: 114, // Room 202 (Departure): top-[677px] relative (677-563=114px)
  },
  dateRangeStandardArrival: {
    top: 109, // Room 204 (Arrival): top-[1133px] relative (1133-1024=109px), Room 205: top-[1349px] relative (1349-1240=109px)
  },
  dateRangeWithNotes: {
    top: 102, // Room 203: top-[873px] relative (873-771=102px)
  },
  // Time (ETA/EDT) positions - Exact from Figma
  time: {
    fontSize: 14,
    fontWeight: 'regular' as const,
    color: '#000000',
    lineHeight: 11, // Figma shows h-[11px]
    positions: {
      priorityFirst: { left: 75, top: 130 }, // Room 201 first guest: left-[75px] top-[130px] ETA: 17:00 (exact from Figma)
      prioritySecond: { left: 73, top: 204 }, // Room 201 second guest: left-[73px] top-[204px] EDT: 12:00 (exact from Figma)
      standardDeparture: { left: 154, top: 115 }, // Room 202 (Departure): EDT positioned below date range, similar to arrival cards. Date at top-[677px]=114px, so EDT at 115px (1px below). Left matches arrival pattern at x=154px (161-7=154 from card)
      standardArrival: { left: 154, top: 110 }, // Room 204: ETA at x=161 absolute, card starts at x=7, so relative to card: 161-7=154px. Top: 1134-1024=110px
      withNotes: { left: 151, top: 103 }, // Room 203: ETA at x=158 absolute, card starts at x=7, so relative to card: 158-7=151px. Top: 874-771=103px
    },
  },
  // Guest count positions - Exact from Figma
  guestCount: {
    fontSize: 14,
    fontWeight: 'light' as const,
    color: '#000000',
    lineHeight: 13, // Figma shows h-[13px]
    icon: {
      width: 13, // Person icon size for guest count
      height: 12,
    },
    positions: {
      priorityFirst: { iconLeft: 151, textLeft: 170, iconTop: 109, textTop: 109 }, // Room 201 first: icon at left-[158px] absolute, card at left-[7px], so iconLeft=151px relative to card. Text at left-[177px] absolute, so textLeft=170px relative to card. Top: 109px (aligned with date range) relative to card
      prioritySecond: { iconLeft: 151, textLeft: 170, iconTop: 184, textTop: 184 }, // Room 201 second: icon at left-[158px] absolute, card at left-[7px], so iconLeft=151px relative to card. Text at left-[177px] absolute, so textLeft=170px relative to card. Top: 184px (aligned with date range) relative to card
      standardDeparture: { iconLeft: 151, textLeft: 177, iconTop: 116, textTop: 116 }, // Room 202 (Departure): count at left-[184px] absolute, card at left-[7px], so textLeft=177px relative to card. Icon at left-[158px] absolute, so iconLeft=151px relative to card. Top: 679-563=116px relative to card
      standardArrival: { iconLeft: 73, textLeft: 92, iconTop: 109, textTop: 109 }, // Room 204 (Arrival): icon at left-[80px] absolute, card at left-[7px], so iconLeft=73px relative to card. Text at left-[99px] absolute, so textLeft=92px relative to card. Positioned at top 109px (same as date range) to align with date range row
      withNotes: { iconLeft: 70, textLeft: 89, iconTop: 125, textTop: 124 }, // Room 203: icon at x=77, y=896 (screen) = x=70, y=125 (card). Text at x=96, y=895 (screen) = x=89, y=124 (card). Container at x=70, so icon at 70-70=0, text at 89-70=19 relative to container
    },
  },
  priorityBadge: {
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#334866',
    lineHeight: 11, // Figma shows h-[11px]
    positions: {
      firstGuest: { left: 165, top: 89 }, // Room 201 first guest badge "11" - moved closer to name (was 182)
      secondGuest: { left: 135, top: 164 }, // Room 201 second guest badge "22" - moved closer to name (was 152)
      standard: { left: 161, top: 82 }, // Room 203 badge "11" - moved closer to name (was 178)
    },
  },
} as const;

// Staff Section Styles - Exact values from Figma
export const STAFF_SECTION = {
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    left: 236, // Room 201: left-[236px]
    top: 22, // Room 201: top-[22px] - aligns with room type
  },
  avatarStandard: {
    left: 238, // Room 202 (Departure): x=245 from screen, card at x=7, so 245-7=238px relative to card. Room 202: avatar at y=583 from screen, card at y=563, so 583-563=20px
    top: 20, // Room 202: y=583 from screen, card at y=563, so 583-563=20px relative to card
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 279, // Room 201: left-[279px]
    top: 23, // Room 201: top-[23px] - aligns just below room number (17px)
    width: 104, // Width: 104px
    lineHeight: 21, // Height: 21px (lineHeight matches height)
  },
  nameStandard: {
    left: 281, // Room 203/204: x=288 from screen, card at x=7, so 288-7=281px relative to card
    top: 23, // Room 203: y=794 from screen, card at y=771, so 794-771=23px. Room 204: y=1047 from screen, card at y=1024, so 1047-1024=23px
  },
  nameStandardDeparture: {
    left: 281, // Room 202 (Departure): x=288 from screen, card at x=7, so 288-7=281px relative to card
    top: 12, // Room 202: y=575 from screen, card at y=563, so 575-563=12px relative to card (different from other cards)
  },
  status: {
    fontSize: 12,
    fontWeight: 'light' as const,
    left: 279, // Room 201: left-[279px]
    top: 40, // Room 201: top-[40px] - aligns with category
    lineHeight: 15, // Figma shows h-[15px]
    width: 101, // Room 201: w-[101px]
    colors: {
      default: '#1e1e1e',
      finished: '#41d541',
      error: '#f92424',
    },
  },
  statusStandard: {
    left: 281, // Room 202/203/204: x=288 from screen, card at x=7, so 288-7=281px relative to card
    top: 40, // Room 203: y=811 from screen, card at y=771, so 811-771=40px. Room 204: y=1064 from screen, card at y=1024, so 1064-1024=40px. Room 205 Stayover/Turndown: also 40px - aligns with category name
    width: 120, // Increased to accommodate "Finished: 65 mins" on one line (was 94px)
  },
  statusStandardDeparture: {
    left: 281, // Room 202 (Departure): x=288 from screen, card at x=7, so 288-7=281px relative to card
    top: 29, // Room 202: y=592 from screen, card at y=563, so 592-563=29px relative to card (different from other cards due to promiseTime)
    width: 92, // Room 202: w-[92px] from Figma
  },
  promiseTime: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 281, // Room 202 (Departure): x=288 from screen, card at x=7, so 288-7=281px relative to card
    top: 44, // Room 202: y=607 from screen, card at y=563, so 607-563=44px relative to card
    lineHeight: 15, // Figma shows h-[15px]
    width: 139, // Room 202: w-[139px]
  },
  forwardArrow: {
    width: 10, // Increased size for better visibility
    height: 18, // Increased size for better visibility
    left: 390, // Positioned to the right of staff name/status
    top: 29, // Aligned with staff section
  },
  forwardArrowStandard: {
    left: 399, // For non-priority cards
  },
  divider: {
    left: 227, // Room 201: left-[227px] relative to card
    top: 11.5, // Room 201: top-[11px], Room 202: top-[574.5px] from screen, card at y=563, so 574.5-563=11.5px relative to card
    width: 1,
    height: 50.5,
    color: '#e3e3e3',
  },
  dividerStandard: {
    left: 228, // Room 202 (Departure): x=235 from screen, card at x=7, so 235-7=228px relative to card
    top: 11.5, // Room 202: y=574.5 from screen, card at y=563, so 574.5-563=11.5px relative to card
  },
} as const;

// Status Button Styles - Exact values from Figma
export const STATUS_BUTTON = {
  width: 134,
  height: 70,
  borderRadius: 35,
  left: 255, // Room 201: left-[255px], Room 202: left-[262px], Room 203: left-[256px], Room 204/205: left-[270px]
  top: 114, // Room 201: top-[114px], Room 202: top-[644px] relative (644-563=81px), Room 203: top-[845px] relative (845-771=74px), Room 204: top-[1111px] relative (1111-1024=87px)
  icon: {
    width: 31,
    height: 31,
  },
  iconInProgress: {
    width: 134, // Same size as button container for InProgress icon
    height: 70,
  },
  chevron: {
    width: 7,
    height: 14,
    right: 12, // Relative to button
  },
  colors: {
    dirty: '#f92424',
    inProgress: '#ffc107',
    cleaned: '#5a759d',
    inspected: '#41d541',
  },
  // Different positions for different card types
  positions: {
    arrivalDeparture: { left: 255, top: 114 }, // Room 201
    departure: { left: 262, top: 81 }, // Room 202
    arrivalWithNotes: { left: 256, top: 74 }, // Room 203
    standard: { left: 270, top: 87 }, // Room 204/205
  },
} as const;

// Notes Section Styles - Exact values from Figma
export const NOTES_SECTION = {
  width: 416, // Increased from 414 to be more full width (card is 426px, so 5px margin on each side)
  height: 54,
  borderRadius: 10,
  background: '#ffffff', // Arrival/Departure cards
  backgroundWithNotes: 'rgba(223, 230, 240, 0.4)', // Cards with notes (Room 203)
  paddingHorizontal: 12,
  paddingVertical: 8,
  // Room 201 (Arrival/Departure): From Figma metadata
  // Container should span full width within card (card is 426px, container is 416px with 5px margin on each side)
  // Card height is 292px, container height is 54px
  // Container should have padding from bottom: 292 - 54 - bottomPadding = top position
  // Elements: rushed icon x=19 y=245, notes icon x=45.03 y=245, badge x=75 y=247, text x=112 y=252 (all relative to card)
  // For top: icons at y=245, so container top should be ~238 (245-7=238 where 7 accounts for visual alignment)
  // But we need padding from bottom: card height 292 - container height 54 - bottom padding 5 = 233px top
  positions: {
    arrivalDeparture: { left: 5, top: 233 }, // Container at x=5 (5px margin from card left), top=233 gives 5px padding from bottom (292-54-233=5)
    withNotes: { left: 5, top: 161 }, // Room 203: card height 222, container 54, so 222-54-7=161 (7px padding from bottom)
  },
  icon: {
    width: 31.974,
    height: 31.974,
    // Notes icon at x=45.03, y=245 (card coordinates) - this is the RIGHT icon
    // Container at x=5, so icon at 45.03-5=40.03 from container edge (absolute positioning, padding doesn't affect)
    // Container top is now 233 (was 238), so icon top relative to container: 245-233=12
    positions: {
      arrivalDeparture: { left: 40.03, top: 12 }, // 45.03-5=40.03 from container left, 245-233=12 from container top
      withNotes: { left: 4, top: 11 }, // Room 203: maintained relative positioning
    },
  },
  rushedIcon: {
    width: 33.974, // Increased by 2px from notes icon (31.974 + 2 = 33.974)
    height: 33.974, // Increased by 2px from notes icon (31.974 + 2 = 33.974)
    // Priority icon (rushed) should overlap with notes icon
    // Notes icon at x=45.03, priority icon at x=19 (card coordinates)
    // Container at x=5, so priority icon at 19-5=14 from container edge
    // To overlap: position priority icon so it overlaps with notes icon
    // Notes icon is at left: 40.03, so priority should be positioned to overlap
    // Container top is now 233 (was 238), so icon top relative to container: 245-233=12
    positions: {
      arrivalDeparture: { left: 14, top: 12 }, // 19-5=14 from container left, 245-233=12 from container top (overlaps with notes icon at 40.03)
      withNotes: { left: 14.03, top: 11 }, // Same horizontal, adjusted vertical
    },
  },
  badge: {
    width: 20.455,
    height: 20.455,
    borderRadius: 10.2275,
    backgroundColor: '#FF46A3',
    // Badge position: From Figma - badge at x=75, y=247 (card coordinates)
    // Container at x=5, so badge at 75-5=70 from container edge
    // Container top is now 233 (was 238), so badge top relative to container: 247-233=14
    positions: {
      arrivalDeparture: { left: 70, top: 14 }, // 75-5=70 from container left, 247-233=14 from container top
      withNotes: { left: 31, top: 15 }, // Room 203: 43-12=31, 15 maintained
    },
    fontSize: 15,
    fontWeight: 'light' as const,
    color: '#ffffff',
    lineHeight: 13.909, // Figma shows h-[13.909px]
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#5a759d',
    // Text at x=112, y=252 (card coordinates)
    // Container at x=5, so text at 112-5=107 from container edge
    // Container top is now 233 (was 238), so text top relative to container: 252-233=19
    positions: {
      arrivalDeparture: { left: 107, top: 19 }, // 112-5=107 from container left, 252-233=19 from container top
      withNotes: { left: 72, top: 17 }, // Room 203: 84-12=72, 17 maintained
    },
    lineHeight: 17,
  },
} as const;

// Guest Container Background - Exact values from Figma
export const GUEST_CONTAINER_BG = {
  width: 414,
  borderRadius: 10,
  background: 'rgba(223, 230, 240, 0.4)',
  left: 6, // Relative to card (centered: (426-414)/2 = 6px)
  // Different heights and positions for different card types
  positions: {
    departure: { height: 101, top: 70 }, // Room 202: h-[101px] top-[633px] relative (633-563=70px)
    arrival: { height: 100, top: 74 }, // Room 204: h-[100px] top-[1098px] relative (1098-1024=74px)
    stayover: { height: 100, top: 74 }, // Room 205: h-[100px] top-[1314px] relative (1314-1240=74px)
    turndown: { height: 100, top: 74 }, // Room 205 (Turndown): h-[100px] top-[1530px] relative (1530-1456=74px)
  },
  // Note: Room 201 (Arrival/Departure) and Room 203 (with notes) don't have this background
} as const;

// Divider Styles
export const DIVIDERS = {
  horizontal: {
    height: 1,
    color: '#e3e3e3',
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: 50.5,
    color: '#e3e3e3',
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: 'Helvetica',
  weights: {
    light: '300',
    regular: '400',
    semibold: '600',
    bold: '700',
  },
} as const;

