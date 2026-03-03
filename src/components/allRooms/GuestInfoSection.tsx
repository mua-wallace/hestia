import React from 'react';
import GuestInfoDisplay from '../shared/GuestInfoDisplay';
import type { GuestInfo } from '../../types/allRooms.types';
import type { ShiftType } from '../../types/home.types';
import type { GuestImageAnchorLayout } from '../shared/GuestProfileImageModal';

interface GuestInfoSectionProps {
  guest: GuestInfo;
  vipCode?: number;
  isPriority?: boolean;
  isFirstGuest?: boolean;
  isSecondGuest?: boolean;
  hasNotes?: boolean;
  frontOfficeStatus?: string; // To determine if it's Arrival vs Departure
  isArrivalDeparture?: boolean; // To know if this is an Arrival/Departure card
  selectedShift?: ShiftType;
  /** When provided, tapping the guest image opens the profile modal with layout for positioning */
  onGuestImagePress?: (guest: GuestInfo, anchorLayout?: GuestImageAnchorLayout) => void;
}

export default function GuestInfoSection({ 
  guest, 
  vipCode, 
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
  hasNotes = false,
  frontOfficeStatus = '',
  isArrivalDeparture = false,
  selectedShift,
  onGuestImagePress,
}: GuestInfoSectionProps) {
  // Use the reusable GuestInfoDisplay component
  return (
    <GuestInfoDisplay
      guest={guest}
      vipCode={vipCode}
      isPriority={isPriority}
      isFirstGuest={isFirstGuest}
      isSecondGuest={isSecondGuest}
      hasNotes={hasNotes}
      category={frontOfficeStatus}
      isArrivalDeparture={isArrivalDeparture}
      themeVariant={selectedShift === 'PM' ? 'pm' : 'am'}
      onGuestImagePress={onGuestImagePress}
    />
  );
}

