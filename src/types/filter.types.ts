export interface FilterState {
  roomState: {
    dirty: boolean;
    inProgress: boolean;
    cleaned: boolean;
    inspected: boolean;
    priority: boolean;
  };
  guest: {
    arrivals: boolean;
    departures: boolean;
    turnDown: boolean;
    stayOver: boolean;
  };
}

export type FilterCategory = 'roomState' | 'guest';

export type RoomStateFilter = keyof FilterState['roomState'];
export type GuestFilter = keyof FilterState['guest'];

export interface FilterOptionConfig {
  id: string;
  label: string;
  indicatorType: 'circle' | 'icon';
  indicatorColor?: string;
  indicatorIcon?: any;
  count?: number;
  top: number;
}

