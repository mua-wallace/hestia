export type TicketTab = 'myTickets' | 'all' | 'open' | 'closed';

export type TicketStatus = 'done' | 'unsolved';

export interface TicketData {
  id: string;
  title: string;
  description: string;
  roomNumber: string;
  /** Optional image URLs attached to this ticket (if provided by backend). */
  images?: string[];
  /** Guest currently associated to the ticket's room (if any). */
  guest?: {
    name: string;
    /** Short range like `07/10-15/10` (DD/MM-DD/MM). */
    stayRange?: string;
    imageUrl?: string;
  };
  category?: string;
  categoryIcon?: any;
  locationText?: string; // e.g. "Room 201" or "Brasserie"
  dueTime?: string; // e.g., "10 mins"
  createdAt?: string; // ISO string from Supabase (used for "Due in" timer)
  createdBy: {
    name: string;
    avatar?: any;
    departmentName?: string;
  };
  /** Staff assigned to this ticket (when `assigned_to_id` is set). */
  assignedTo?: {
    name: string;
    avatar?: any;
    departmentName?: string;
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

