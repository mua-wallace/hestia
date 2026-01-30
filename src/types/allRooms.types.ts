/** Front office status: Arrival/Departure, Arrival, Departure, Stayover, Turndown, No Task, Refresh */
export type FrontOfficeStatus = 'Arrival/Departure' | 'Arrival' | 'Departure' | 'Stayover' | 'Turndown' | 'No Task' | 'Refresh';
export type ReservationStatus = 'Vacant' | 'Occupied';

export type RoomStatus = 'Dirty' | 'InProgress' | 'Cleaned' | 'Inspected';

export type StatusChangeOption = 'Priority' | 'Dirty' | 'Cleaned' | 'Inspected' | 'Pause' | 'ReturnLater' | 'RefuseService' | 'PromisedTime';

export interface GuestInfo {
  name: string;
  dateRange: string;
  time: string; // ETA: 17:00 or EDT: 12:00
  guestCount: string; // "2/2"
  timeLabel: 'ETA' | 'EDT'; // To know if it's arrival or departure
  isVacant?: boolean; // For turndown vacant state
  /** ISO date string (YYYY-MM-DD) of guest arrival; used for Stayover linen calculation (every 2nd day = linen change) */
  arrivalDate?: string;
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
  /** Room category code e.g. ST2K, R01K, R01KY, RO2KT, ST3K, JS2KT, RO1Q, JS1KT, PS1K */
  roomCategory: string;
  credit: number; // Approximate time to clean room in minutes (45, 60, 90, etc.)
  frontOfficeStatus: FrontOfficeStatus; // Arrival/Departure, Arrival, Departure, Stayover, Turndown, No Task, Refresh
  /** When frontOfficeStatus is Stayover: true = Stayover with Linen (linen change day), false = Stayover no Linen. Computed from arrival date (every 2nd day of stay) if not set. */
  withLinen?: boolean;
  status: RoomStatus;
  reservationStatus?: ReservationStatus; // For distinguishing vacant turndown rooms
  guests: GuestInfo[]; // Array to support Arrival/Departure rooms with 2 guests
  staff: StaffInfo;
  isPriority: boolean; // Red border for priority rooms
  flagged?: boolean; // If true, room contributes to "Flagged" category on Home
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
    icon: require('../../assets/icons/dirty-state-icon.png'),
    label: 'Dirty',
  },
  InProgress: {
    color: '#ffc107',
    icon: require('../../assets/icons/in-progess-state-icon.png'),
    label: 'In Progress',
  },
  Cleaned: {
    color: '#4a91fc',
    icon: require('../../assets/icons/cleaned-state-icon.png'),
    label: 'Cleaned',
  },
  Inspected: {
    color: '#41d541',
    icon: require('../../assets/icons/inspected-state-icon.png'),
    label: 'Inspected',
  },
};

export const FRONT_OFFICE_STATUS_ICONS: Record<FrontOfficeStatus, any> = {
  'Arrival': require('../../assets/icons/arrival-icon.png'),
  'Departure': require('../../assets/icons/departure-icon.png'),
  'Stayover': require('../../assets/icons/stayover-icon.png'),
  'Turndown': require('../../assets/icons/turndown-icon.png'),
  'Arrival/Departure': require('../../assets/icons/arrival-departure-icon.png'),
  'No Task': require('../../assets/icons/stayover-icon.png'), // fallback
  'Refresh': require('../../assets/icons/done.png'), // fallback
};

export interface StatusOptionConfig {
  id: StatusChangeOption;
  label: string;
  icon: any;
}

export const STATUS_OPTIONS: StatusOptionConfig[] = [
  {
    id: 'Priority',
    label: 'Priority',
    icon: require('../../assets/icons/priority-status.png'),
  },
  {
    id: 'Dirty',
    label: 'Dirty',
    icon: require('../../assets/icons/dirty-status.png'),
  },
  {
    id: 'Cleaned',
    label: 'Cleaned',
    icon: require('../../assets/icons/cleaned-status.png'),
  },
  {
    id: 'Inspected',
    label: 'Inspected',
    icon: require('../../assets/icons/inspected-status.png'),
  },
  {
    id: 'Pause',
    label: 'Pause',
    icon: require('../../assets/icons/pause-status.png'),
  },
  {
    id: 'ReturnLater',
    label: 'Return Later',
    icon: require('../../assets/icons/return-later-status.png'),
  },
  {
    id: 'RefuseService',
    label: 'Refuse Service',
    icon: require('../../assets/icons/refuse-service-status.png'),
  },
  {
    id: 'PromisedTime',
    label: 'Promised Time',
    icon: require('../../assets/icons/promised-time-status.png'),
  },
];

