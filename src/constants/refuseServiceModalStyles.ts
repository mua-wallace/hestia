/**
 * Refuse Service Modal Styles - Exact values from Figma
 * Based on design: https://www.figma.com/design/q59hfVJCVzzUixq1HFRGEh/HESTIA-APP-AND-DASHBOARD?node-id=1121-1052
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 440;
export const scaleX = SCREEN_WIDTH / DESIGN_WIDTH;

// All positions are relative to the top of the screen (0px)
// The modal itself starts at 213px (overlaps header slightly)

export const REFUSE_SERVICE_MODAL = {
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
  question: {
    top: 282, // Absolute position from screen top
    left: 32, // From Figma
    fontSize: 14,
    color: '#000000',
    width: 358, // From Figma
  },
  divider: {
    top: 312, // Absolute position from screen top
    left: 12, // From Figma
    width: 416, // From Figma
    height: 1,
    color: '#c6c5c5',
  },
  checkbox: {
    size: 28, // From Figma: size="28"
    borderWidth: 2,
    borderColor: '#5a759d',
    checkedIconSize: 28, // Size of the checkmark icon
  },
  option: {
    firstTop: 348, // "Guest Requested Privacy" (first checked)
    spacing: 56, // Gap between options (404-348=56, 460-404=56, etc.)
    left: 75, // Text starts at x=75 (checkbox at x=34-35, text offset)
    fontSize: 15,
    color: '#000000',
  },
  customLabel: {
    top: 661, // Absolute position from screen top
    left: 32, // From Figma
    fontSize: 16,
    color: '#000000',
  },
  customInput: {
    top: 690, // Absolute position from screen top
    left: 32, // From Figma
    width: 382, // From Figma: width="382"
    height: 152, // From Figma: height="152"
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    padding: 12,
    fontSize: 14,
  },
  confirmButton: {
    top: 866, // Absolute position from screen top
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

// Refuse service reasons
export const REFUSE_SERVICE_REASONS = [
  'Guest Requested Privacy',
  'Guest Already Cleaned/Organized the Room',
  'Guest Has a Do Not Disturb Sign',
  'Guest Is Resting or Sleeping',
] as const;

