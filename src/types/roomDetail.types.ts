import type { RoomCardData, RoomStatus } from './allRooms.types';
import type { LostAndFoundItem } from './lostAndFound.types';

// Room Type Definitions
export type RoomType = 'Arrival' | 'Departure' | 'ArrivalDeparture' | 'Stayover' | 'Turndown';

export interface RoomTypeConfig {
  type: RoomType;
  guestInfoStartTop: number;
  hasSpecialInstructions: boolean;
  numberOfGuests: 1 | 2;
  cardHeight: number;
  lostAndFoundType: 'empty' | 'withItems';
}

export interface Note {
  id: string;
  text: string;
  staff: {
    name: string;
    avatar?: any;
  };
  createdAt: string;
}

export interface Task {
  id: string;
  text: string;
  createdAt: string;
}

export interface RoomDetailData extends RoomCardData {
  roomType: RoomType; // NEW: Room type for dynamic layout
  specialInstructions?: string; // Special instructions for arrival guest
  notes: Note[];
  tasks?: Task[]; // Tasks for the room
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string; // Department/role (e.g., "HSK")
  };
  isUrgent?: boolean;
  lostAndFoundItems?: LostAndFoundItem[]; // NEW: For Stayover/Turndown rooms
}

export type DetailTab = 'Overview' | 'Tickets' | 'Checklist' | 'History';

export interface HistoryEvent {
  id: string;
  action: string; // e.g., "clicked on in progress", "changed status to cleaned", "added note", etc.
  staff: {
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
  };
  timestamp: Date; // Full date/time for sorting
  createdAt: string; // ISO string for storage
}

export interface HistoryGroup {
  dateLabel: string; // "Today", "Yesterday", or formatted date
  date: Date; // Actual date for comparison
  events: HistoryEvent[];
}




