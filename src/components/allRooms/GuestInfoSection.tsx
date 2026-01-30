import React from 'react';
import GuestInfoDisplay from '../shared/GuestInfoDisplay';
import type { GuestInfo } from '../../types/allRooms.types';
import type { ShiftType } from '../../types/home.types';

interface GuestInfoSectionProps {
  guest: GuestInfo;
  priorityCount?: number;
  isPriority?: boolean;
  isFirstGuest?: boolean;
  isSecondGuest?: boolean;
  hasNotes?: boolean;
  frontOfficeStatus?: string; // To determine if it's Arrival vs Departure
  isArrivalDeparture?: boolean; // To know if this is an Arrival/Departure card
  selectedShift?: ShiftType;
}

export default function GuestInfoSection({ 
  guest, 
  priorityCount, 
  isPriority = false,
  isFirstGuest = true,
  isSecondGuest = false,
  hasNotes = false,
  frontOfficeStatus = '',
  isArrivalDeparture = false,
  selectedShift,
}: GuestInfoSectionProps) {
  // Use the reusable GuestInfoDisplay component
  return (
    <GuestInfoDisplay
      guest={guest}
      priorityCount={priorityCount}
      isPriority={isPriority}
      isFirstGuest={isFirstGuest}
      isSecondGuest={isSecondGuest}
      hasNotes={hasNotes}
      category={frontOfficeStatus}
      isArrivalDeparture={isArrivalDeparture}
      themeVariant={selectedShift === 'PM' ? 'pm' : 'am'}
    />
  );
}

