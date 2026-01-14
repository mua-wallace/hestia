import type { RoomCardData, RoomStatus } from './allRooms.types';

export interface Note {
  id: string;
  text: string;
  staff: {
    name: string;
    avatar?: any;
  };
  createdAt: string;
}

export interface RoomDetailData extends RoomCardData {
  specialInstructions?: string; // Special instructions for arrival guest
  notes: Note[];
  assignedTo?: {
    id: string;
    name: string;
    avatar?: any;
    initials?: string;
    avatarColor?: string;
    department?: string; // Department/role (e.g., "HSK")
  };
  isUrgent?: boolean;
}

export type DetailTab = 'Overview' | 'Tickets' | 'Checklist' | 'History';




