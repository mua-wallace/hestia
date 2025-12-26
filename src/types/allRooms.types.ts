export type RoomCategory = 'Arrival' | 'Departure' | 'Stayover' | 'Turndown' | 'Arrival/Departure';

export type RoomStatus = 'Dirty' | 'InProgress' | 'Cleaned' | 'Inspected';

export interface GuestInfo {
  name: string;
  dateRange: string;
  time: string; // ETA: 17:00 or EDT: 12:00
  guestCount: string; // "2/2"
  timeLabel: 'ETA' | 'EDT'; // To know if it's arrival or departure
}

export interface StaffInfo {
  avatar?: string; // URL to avatar image, or undefined for initials
  initials?: string; // If no avatar, show initials (e.g., "Z")
  name: string;
  statusText: string; // "Not Started", "Started: 40 mins", "Finished: 60 mins", etc.
  statusColor: string; // Color for the status text
  promiseTime?: string; // Optional, for departure rooms: "Promise time: 18:00"
}

export interface NotesInfo {
  count: number;
  hasRushed?: boolean; // If true, show "Rushed and notes"
}

export interface RoomCardData {
  id: string;
  roomNumber: string; // "201", "202", etc.
  roomType: string; // "ST2K - 1.4"
  category: RoomCategory;
  status: RoomStatus;
  guests: GuestInfo[]; // Array to support Arrival/Departure rooms with 2 guests
  staff: StaffInfo;
  isPriority: boolean; // Red border for priority rooms
  notes?: NotesInfo;
  priorityCount?: number; // Number badge for priority (e.g., 11 for first guest)
  secondGuestPriorityCount?: number; // For Arrival/Departure rooms with 2 guests (e.g., 22)
}

export interface AllRoomsScreenData {
  rooms: RoomCardData[];
  selectedShift: 'AM' | 'PM';
}

export interface StatusConfig {
  color: string; // Background color of the status button
  icon: any; // Icon for the status
  label: string;
}

export const STATUS_CONFIGS: Record<RoomStatus, StatusConfig> = {
  Dirty: {
    color: '#f92424',
    icon: require('../../assets/icons/dirty-status-icon.png'),
    label: 'Dirty',
  },
  InProgress: {
    color: '#ffc107',
    icon: require('../../assets/icons/inprogress-status-icon.png'),
    label: 'In Progress',
  },
  Cleaned: {
    color: '#5a759d',
    icon: require('../../assets/icons/cleaned-status-icon.png'),
    label: 'Cleaned',
  },
  Inspected: {
    color: '#41d541',
    icon: require('../../assets/icons/inspected-status-icon.png'),
    label: 'Inspected',
  },
};

export const CATEGORY_ICONS: Record<RoomCategory, any> = {
  'Arrival': require('../../assets/icons/arrival-icon.png'),
  'Departure': require('../../assets/icons/departure-icon.png'),
  'Stayover': require('../../assets/icons/stayover-icon.png'),
  'Turndown': require('../../assets/icons/turndown-icon.png'),
  'Arrival/Departure': require('../../assets/icons/arrival-departure-icon.png'),
};

