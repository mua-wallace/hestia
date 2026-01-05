/**
 * Return Later Modal Styles - Exact values from Figma
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-328
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

export const RETURN_LATER_MODAL = {
  overlay: {
    top: 213, // Modal content starts at 213px in Figma (overlaps header slightly)
    backgroundColor: '#ffffff',
  },
  title: {
    top: 253, // Absolute position from screen top
    left: 32, // From Figma: x="31.999999999999943"
    fontSize: 20,
    color: '#607aa1',
  },
  instruction: {
    top: 280, // Absolute position from screen top
    left: 32, // From Figma: x="32"
    fontSize: 14,
    color: '#1e1e1e',
    width: 358, // From Figma: width="358"
  },
  divider: {
    top: 312, // Absolute position from screen top
    left: 12, // From Figma: x="12"
    width: 416, // From Figma: width="416"
    height: 1,
    color: '#c6c5c5',
  },
  suggestions: {
    labelTop: 336, // Absolute position from screen top
    labelLeft: 35, // From Figma: x="35"
    buttonsTop: 371, // Absolute position from screen top
    buttonsLeft: 32, // From Figma: first button at x="32"
    gap: 12,
    buttonHeight: 39,
    buttonMinWidth: 74,
    buttonPaddingH: 16,
    buttonPaddingV: 11,
    borderRadius: 41,
    fontSize: 14,
  },
  toggle: {
    top: 466, // Absolute position from screen top
    left: 154, // From Figma: x="154"
    width: 121,
    height: 35.243,
    sliderWidth: 64.612,
    sliderHeight: 30.544,
    fontSize: 15,
  },
  timePicker: {
    top: 556.39, // Absolute position from screen top (from Figma)
    height: 226,
    // Hours column: calc(50% - 63.7px) = 220 - 63.7 = 156.3px from screen left
    hoursColumnLeft: 156.3, // Calculated: 220 (center) - 63.7
    // Minutes column: calc(50% + 53.06px) = 220 + 53.06 = 273.06px from screen left
    minutesColumnLeft: 273.06, // Calculated: 220 (center) + 53.06
    gap: 116.76, // Gap between columns: 273.06 - 156.3
    columnWidth: 50,
    itemHeight: 40,
    selectedFontSize: 24,
    unselectedFontSize: 16,
    // Selected item dimensions from Figma
    selectedHeight: 32.619, // For "12"
    selectedWidth: 46.598, // For "12"
    selectedMinuteHeight: 33.784, // For "00"
    selectedMinuteWidth: 48.928, // For "00"
  },
  confirmButton: {
    top: 848, // Absolute position from screen top
    left: -1, // From Figma: x="-1" (extends to edges)
    width: 441, // From Figma: width="441"
    height: 107,
    backgroundColor: '#5a759d',
    fontSize: 18,
  },
  assignedTo: {
    top: 1185, // Absolute position from screen top
    titleLeft: 28, // From Figma: x="28"
    titleFontSize: 15,
  },
} as const;

