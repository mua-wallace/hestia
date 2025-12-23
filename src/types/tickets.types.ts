export type TicketTab = 'myTickets' | 'all' | 'open' | 'closed';

export type TicketStatus = 'done' | 'unsolved';

export interface TicketData {
  id: string;
  title: string;
  description: string;
  roomNumber: string;
  category?: string;
  categoryIcon?: any;
  dueTime?: string; // e.g., "10 mins"
  createdBy: {
    name: string;
    avatar?: any;
  };
  status: TicketStatus;
  locationIcon?: any; // Map pin icon
}

export interface TicketsScreenData {
  selectedTab: TicketTab;
  tickets: TicketData[];
}

