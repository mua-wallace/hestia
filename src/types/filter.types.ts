/**
 * Filter Type Definitions
 */

export type RoomStateFilter = 'dirty' | 'inProgress' | 'cleaned' | 'inspected' | 'priority';
export type GuestFilter = 'arrivals' | 'departures' | 'turnDown' | 'stayOver';

export interface FilterState {
  roomStates: {
    dirty: boolean;
    inProgress: boolean;
    cleaned: boolean;
    inspected: boolean;
    priority: boolean;
  };
  guests: {
    arrivals: boolean;
    departures: boolean;
    turnDown: boolean;
    stayOver: boolean;
  };
}

export interface FilterCounts {
  roomStates: {
    dirty: number;
    inProgress: number;
    cleaned: number;
    inspected: number;
    priority: number;
  };
  guests: {
    arrivals: number;
    departures: number;
    turnDown: number;
    stayOver: number;
  };
}

export interface FilterOption {
  id: string;
  label: string;
  icon: any; // require() path to icon
  iconColor?: string;
  count: number;
  selected: boolean;
  type: RoomStateFilter | GuestFilter;
}

export interface RoomStateFilterOption extends FilterOption {
  type: RoomStateFilter;
}

export interface GuestFilterOption extends FilterOption {
  type: GuestFilter;
}
