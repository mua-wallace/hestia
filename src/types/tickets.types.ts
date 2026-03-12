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
  /**
   * Supabase user id of the assignee (tickets.assigned_to_id).
   * Used to power the "My Tickets" tab.
   */
  assignedToId?: string | null;
  /**
   * Supabase user id of the creator (tickets.created_by_id).
   * Currently not used for filtering but kept for future extensions.
   */
  createdById?: string;
  status: TicketStatus;
  locationIcon?: any; // Map pin icon
}

export interface TicketsScreenData {
  selectedTab: TicketTab;
  tickets: TicketData[];
}

