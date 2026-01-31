/**
 * Dynamic Position Calculator for Room Detail Screen
 * Calculates all element positions based on room type configuration
 * 
 * This utility ensures pixel-perfect layouts for different room types
 * by calculating positions dynamically based on:
 * - Number of guests (single vs dual)
 * - Presence of special instructions
 * - Card height variations
 */

import { RoomTypeConfig } from '../types/roomDetail.types';
import { CONTENT_AREA } from '../constants/roomDetailStyles';

export interface CalculatedPositions {
  // Guest Info Section
  guestInfoTitle: number;
  firstGuestTop: number;
  firstGuestDateTop: number;
  specialInstructionsTitle?: number;
  specialInstructionsText?: number;
  divider1: number;
  
  // Second Guest (if applicable)
  secondGuestTop?: number;
  secondGuestDateTop?: number;
  divider2: number;
  
  // Assigned To & Card Section
  assignedToTitle: number;
  cardTop: number;
  cardHeight: number;
  
  // Lost & Found Section
  lostAndFoundTitle: number;
  lostAndFoundBox: number;
  
  // Notes Section
  notesIconTop: number;
  notesTitleTop: number;
  notesDividerTop: number;
}

/**
 * Calculate all positions for a given room type
 * All positions are absolute from the top of the screen
 */
export function calculatePositions(config: RoomTypeConfig): CalculatedPositions {
  const { guestInfoStartTop, hasSpecialInstructions, numberOfGuests, cardHeight } = config;
  
  // Guest Info Section
  const guestInfoTitle = guestInfoStartTop;
  // Gap from title to guest name varies by room type:
  // - Arrival: 46px (303 -> 349)
  // - Departure: 66px (303 -> 369)
  // - Stayover/Turndown: 50px (318 -> 368)
  const gapToGuest = config.type === 'Departure' ? 66 : config.type === 'Stayover' || config.type === 'Turndown' ? 50 : 46;
  const firstGuestTop = guestInfoTitle + gapToGuest;
  const firstGuestDateTop = firstGuestTop + 28; // Dates appear 28px below name
  
  let currentTop = firstGuestDateTop;
  
  const positions: CalculatedPositions = {
    guestInfoTitle,
    firstGuestTop,
    firstGuestDateTop,
    divider1: 0,
    divider2: 0,
    assignedToTitle: 0,
    cardTop: 0,
    cardHeight,
    lostAndFoundTitle: 0,
    lostAndFoundBox: 0,
    notesIconTop: 0,
    notesTitleTop: 0,
    notesDividerTop: 0,
  };
  
  // Special Instructions (if applicable)
  if (hasSpecialInstructions) {
    // For Stayover/Turndown: dates at 396, special title at 441, text at 466, divider at 536
    // For Arrival: dates at 377, special title at 417, text at 442, divider at 510
    const isStayoverOrTurndown = config.type === 'Stayover' || config.type === 'Turndown';
    const gapToTitle = isStayoverOrTurndown ? 45 : 40; // 45px for Stayover/Turndown, 40px for Arrival
    
    positions.specialInstructionsTitle = currentTop + gapToTitle;
    positions.specialInstructionsText = positions.specialInstructionsTitle + 25; // 25px below title
    
    // Calculate divider position based on special instructions text
    const gapFromTextToDivider = isStayoverOrTurndown ? 70 : 68;
    positions.divider1 = positions.specialInstructionsText + gapFromTextToDivider;
  } else {
    // No special instructions (Departure only)
    // For Departure: dates at 397, divider at 436 (39px gap)
    positions.divider1 = currentTop + 39;
  }
  
  // Second Guest (if dual guest - ArrivalDeparture only)
  if (numberOfGuests === 2) {
    positions.secondGuestTop = positions.divider1 + 32; // 32px gap from divider to second guest
    positions.secondGuestDateTop = positions.secondGuestTop + 26; // 26px from name to dates for departure
    positions.divider2 = positions.secondGuestDateTop + 57; // 57px from dates to divider2
  } else {
    // Single guest - divider2 is same as divider1
    positions.divider2 = positions.divider1;
  }
  
  // Assigned To Section
  // Gap from divider to "Assigned to" title varies by room type:
  // - Departure: 26px (436 -> 462)
  // - Others: 19px
  const gapToAssignedTitle = config.type === 'Departure' ? 26 : 19;
  positions.assignedToTitle = positions.divider2 + gapToAssignedTitle;
  
  // Card Section
  positions.cardTop = positions.assignedToTitle + 30; // 30px gap from title to card
  
  const cardEnd = positions.cardTop + cardHeight;
  
  // Lost & Found Section
  // Gaps vary by room type:
  // - Stayover/Turndown: 44px to title, 32px to box (768 -> 812 -> 844)
  // - Others: 26px to title, 34px to box
  const isStayoverOrTurndown = config.type === 'Stayover' || config.type === 'Turndown';
  const gapToLostFoundTitle = isStayoverOrTurndown ? 44 : 26;
  const gapToLostFoundBox = isStayoverOrTurndown ? 32 : 34;
  
  positions.lostAndFoundTitle = cardEnd + gapToLostFoundTitle;
  positions.lostAndFoundBox = positions.lostAndFoundTitle + gapToLostFoundBox;
  
  const lostAndFoundBoxEnd = positions.lostAndFoundBox + 97; // Box height is 97px
  
  // Notes Section
  positions.notesDividerTop = lostAndFoundBoxEnd + 38; // 38px gap from box end to divider
  positions.notesIconTop = positions.notesDividerTop + 30; // 30px gap from divider to icon
  positions.notesTitleTop = positions.notesIconTop + 5; // 5px from icon to title (vertically aligned)
  
  return positions;
}

/**
 * Calculate relative position from absolute position
 * Used to convert Figma absolute positions to component-relative positions
 */
export function getRelativePosition(absoluteTop: number, referenceTop: number): number {
  return absoluteTop - referenceTop;
}

/**
 * Calculate card spacer height for ScrollView
 * This ensures proper spacing between guest info and the card
 */
export function calculateCardSpacerHeight(positions: CalculatedPositions): number {
  return (positions.cardTop - CONTENT_AREA.top) + positions.cardHeight;
}
