import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { TicketsScreenData, TicketData, TicketStatus } from '../types/tickets.types';

type TicketsRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  room_id: string | null;
  assigned_to_id: string | null;
  created_by_id: string;
  rooms?: {
    room_number: string;
  } | null;
  created_by?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

function mapStatus(raw: string | null | undefined): TicketStatus {
  const value = (raw ?? '').toLowerCase();
  if (value === 'done' || value === 'closed' || value === 'resolved') {
    return 'done';
  }
  return 'unsolved';
}

export async function getTicketsData(): Promise<TicketsScreenData> {
  if (!isSupabaseConfigured) {
    return { selectedTab: 'myTickets', tickets: [] };
  }

  const { data, error } = await supabase
    .from('tickets')
    .select(
      [
        'id',
        'title',
        'description',
        'status',
        'priority',
        'room_id',
        'assigned_to_id',
        'created_by_id',
        'rooms (room_number)',
        'created_by:users!tickets_created_by_id_fkey (full_name, avatar_url)',
      ].join(', ')
    )
    .order('created_at', { ascending: false });

  if (error || !data) {
    // On failure, surface an empty, non-crashing state
    console.warn('[tickets.getTicketsData] Failed to fetch tickets from Supabase:', error);
    return { selectedTab: 'myTickets', tickets: [] };
  }

  const rows = data as unknown as TicketsRow[];

  const tickets: TicketData[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    roomNumber: row.rooms?.room_number ?? '—',
    status: mapStatus(row.status),
    createdBy: {
      name: row.created_by?.full_name ?? 'Staff',
      avatar: row.created_by?.avatar_url ?? undefined,
    },
    assignedToId: row.assigned_to_id,
    createdById: row.created_by_id,
  }));

  return {
    selectedTab: 'myTickets',
    tickets,
  };
}

export type CreateTicketInput = {
  title: string;
  description?: string | null;
  roomId?: string | null;
  priority?: string | null;
  assignedToId?: string | null;
};

export async function createTicket(input: CreateTicketInput): Promise<void> {
  const trimmedTitle = input.title.trim();
  if (!trimmedTitle) {
    throw new Error('Ticket title is required');
  }

  if (!isSupabaseConfigured) {
    console.warn('[tickets.createTicket] Supabase is not configured – skipping ticket creation.');
    return;
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw sessionError;
  }
  const userId = sessionData?.session?.user?.id;
  if (!userId) {
    throw new Error('You must be signed in to create a ticket');
  }

  const payload = {
    title: trimmedTitle,
    description: input.description?.trim() || null,
    status: 'unsolved',
    priority: input.priority ?? null,
    room_id: input.roomId ?? null,
    created_by_id: userId,
    assigned_to_id: input.assignedToId ?? null,
  };

  const { error } = await supabase.from('tickets').insert(payload);
  if (error) {
    throw error;
  }
}

