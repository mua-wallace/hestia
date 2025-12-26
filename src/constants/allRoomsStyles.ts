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

// Card Colors
export const CARD_COLORS = {
  background: '#f9fafc',
  border: '#e3e3e3',
  priorityBackground: 'rgba(249, 36, 36, 0.08)',
  priorityBorder: '#f92424',
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
      firstGuest: { left: 182, top: 89 }, // Room 201 first guest badge "11"
      secondGuest: { left: 152, top: 164 }, // Room 201 second guest badge "22"
      standard: { left: 185, top: 853 }, // Room 203 badge "11" (relative to card top: 853-771=82px)
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
  // Guest name positions
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
  // Date range positions
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
      standardDeparture: { left: 161, top: 114 }, // Room 202 (Departure): Date at top-[677px] relative (677-563=114px) - no ETA shown in Figma
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
    positions: {
      priorityFirst: { iconLeft: 158, textLeft: 177, top: 110 }, // Room 201 first: icon left-[158px] text left-[177px] top-[110px]
      prioritySecond: { iconLeft: 158, textLeft: 177, top: 184 }, // Room 201 second: icon left-[158px] text left-[177px] top-[184px]
      standardDeparture: { iconLeft: 165, textLeft: 184, top: 116 }, // Room 202 (Departure): icon left-[165px] text left-[184px] top-[679px] relative (679-563=116px)
      standardArrival: { iconLeft: 165, textLeft: 184, top: 131 }, // Room 204 (Arrival): icon left-[165px] text left-[184px] top-[1155px] relative (1155-1024=131px), Room 205: top-[1371px] relative (1371-1240=131px)
      withNotes: { iconLeft: 77, textLeft: 96, top: 124 }, // Room 203: icon left-[77px] text left-[96px] top-[895px] relative (895-771=124px)
    },
  },
  priorityBadge: {
    fontSize: 12,
    fontWeight: 'light' as const,
    color: '#334866',
    lineHeight: 11, // Figma shows h-[11px]
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
    left: 245, // Room 202/203/204: left-[245px]
    top: 22, // Should align with room type at top-[22px] (Room 202: 583-563=20px, but should be 22px to match room type)
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 279, // Room 201: left-[279px]
    top: 23, // Room 201: top-[23px] - aligns just below room number (17px)
    width: 104,
    lineHeight: 21, // Figma shows h-[21px]
  },
  nameStandard: {
    left: 288, // Room 202/203/204: left-[288px]
    top: 23, // Should align with priority card (Room 202: 575-563=12px, but should be 23px to match priority)
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
    left: 288, // Room 202/203/204: left-[288px]
    top: 40, // Should align with category at top-[40px] (Room 202: 592-563=29px, but should be 40px to match category)
    width: 94, // Room 202/203/204: w-[94px] or w-[92px]
  },
  promiseTime: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    color: '#1e1e1e',
    left: 288, // Room 202: left-[288px]
    top: 44, // Room 202: top-[607px] relative (607-563=44px)
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
    left: 227, // Room 201: left-[227px], Room 202/203/204: left-[235px]
    top: 11, // Room 201: top-[11px], Room 202: top-[574.5px] relative (574.5-563=11.5px)
    width: 1,
    height: 50.5,
    color: '#e3e3e3',
  },
  dividerStandard: {
    left: 235, // For non-priority cards
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
  width: 414,
  height: 54,
  borderRadius: 10,
  background: 'rgba(223, 230, 240, 0.4)',
  // Room 201 (Arrival/Departure): left-[19px] top-[245px]
  // Room 203 (with notes): left-[calc(50%-2px)] top-[932px] relative (932-771=161px)
  positions: {
    arrivalDeparture: { left: 19, top: 245 }, // Room 201
    withNotes: { left: 7, top: 161 }, // Room 203 (centered: (426-414)/2 - 2 = 7px)
  },
  icon: {
    width: 31.974,
    height: 31.974,
    // Room 201: left-[19px] top-[245px], Room 203: left-[23px] top-[943px] relative (943-771=172px)
    positions: {
      arrivalDeparture: { left: 0, top: 0 }, // Relative to container
      withNotes: { left: 4, top: 11 }, // Room 203: 23-19=4px, 172-161=11px
    },
  },
  rushedIcon: {
    width: 31.974,
    height: 31.974,
    // Room 201: left-[45.03px] top-[245px] relative to card, so relative to container: 45.03-19=26.03px
    left: 26.03, // Relative to container
    top: 0,
  },
  badge: {
    width: 20.455,
    height: 20.455,
    borderRadius: 10.2275,
    backgroundColor: '#f92424',
    // Room 201: left-[75px] top-[247px] relative to card, so relative to container: 75-19=56px, 247-245=2px
    // Room 203: left-[50px] top-[947px] relative to card (947-771=176px), relative to container: 50-7=43px, 176-161=15px
    positions: {
      arrivalDeparture: { left: 56, top: 2 },
      withNotes: { left: 43, top: 15 },
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
    // Room 201: left-[112px] top-[252px] relative to card, so relative to container: 112-19=93px, 252-245=7px
    // Room 203: left-[91px] top-[949px] relative to card (949-771=178px), relative to container: 91-7=84px, 178-161=17px
    positions: {
      arrivalDeparture: { left: 93, top: 7 },
      withNotes: { left: 84, top: 17 },
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

