/**
 * Promise Time Modal Styles - Exact values from Figma
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-825
 */

import { Dimensions } from 'react-native';
import { ROOM_DETAIL_HEADER } from './roomDetailStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// All positions are relative to the top of the screen (0px)
// The modal itself starts at ROOM_DETAIL_HEADER.height (232px)
// So, to get the 'top' relative to the modal's container, subtract ROOM_DETAIL_HEADER.height

export const PROMISE_TIME_MODAL = {
  overlay: {
    top: 213, // Modal content starts at 213px in Figma (overlaps header slightly)
    backgroundColor: '#ffffff',
  },
  title: {
    top: 253, // Absolute position from screen top
    left: 32, // From Figma
    fontSize: 20,
    color: '#607aa1',
  },
  instruction: {
    top: 280, // Absolute position from screen top
    left: 32, // From Figma
    fontSize: 14,
    color: '#1e1e1e',
    width: 358, // From Figma
  },
  divider: {
    top: 312, // Absolute position from screen top
    left: 12, // From Figma
    width: 416, // From Figma
    height: 1,
    color: '#c6c5c5',
  },
  dateLabel: {
    top: 335, // Absolute position from screen top
    left: 32, // From Figma
    fontSize: 16,
    color: '#000000',
  },
  timeLabel: {
    top: 341, // Absolute position from screen top
    left: 216, // From Figma (centered for "Time")
    fontSize: 16,
    color: '#000000',
  },
  toggleContainer: {
    top: 393, // Absolute position from screen top
    left: 154, // From Figma (centered)
    width: 121,
    height: 35.243,
  },
  datePicker: {
    top: 430, // Reduced by 50% - toggle ends at 393 + 35.243 = 428.243, so gap is now ~2px (was ~4px)
    left: 50, // Center of date range (40-60), dates are centered in their container
    height: 226, // Same as time picker
    itemHeight: 40,
    selectedFontSize: 25, // "Dec 20" is larger
    unselectedFontSize: 13, // "Dec 18", "Dec 22" are smaller
    mediumFontSize: 19, // "Dec 19", "Dec 21" are medium
    width: 100, // Approximate width for date strings
  },
  timePicker: {
    top: 430, // Aligned with date picker top
    height: 226,
    // Hours column: calc(50% - 43.7px) = 220 - 43.7 = 176.3px from screen left
    hoursColumnLeft: 176.3, // Calculated: 220 (center) - 43.7
    // Minutes column: calc(50% + 73.06px) = 220 + 73.06 = 293.06px from screen left
    minutesColumnLeft: 293.06, // Calculated: 220 (center) + 73.06
    gap: 116.76, // Gap between columns: 293.06 - 176.3
    columnWidth: 50,
    itemHeight: 40,
    selectedFontSize: 24,
    unselectedFontSize: 16,
  },
  confirmButton: {
    top: 848, // Absolute position from screen top
    left: -1, // From Figma: x="-1" (extends to edges)
    width: 441, // From Figma: width="441"
    height: 107,
    backgroundColor: '#5a759d',
    fontSize: 18,
    color: '#ffffff',
  },
  assignedTo: {
    top: 1185, // Absolute position from screen top
    titleLeft: 28, // From Figma: x="28"
    titleFontSize: 15,
  },
} as const;

