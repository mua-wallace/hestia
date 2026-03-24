import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { TicketsScreenData, TicketData, TicketStatus } from '../types/tickets.types';
import { DEPARTMENT_NAME_TO_ICON } from '../constants/createTicketStyles';
import { getDepartmentIdByName } from './user';

type TicketsRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  room_id: string | null;
  type: string | null;
  assigned_to_id: string | null;
  created_by_id: string;
  created_at: string;
  rooms?: {
    room_number: string;
  } | null;
  created_by?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  departments?: {
    name: string | null;
  } | null;
};

function mapRowToTicketData(row: TicketsRow, nowMs = Date.now()): TicketData {
  const formatElapsed = (elapsedMinutes: number) => {
    if (!Number.isFinite(elapsedMinutes)) return undefined;
    const totalMins = Math.max(0, Math.floor(elapsedMinutes));
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours <= 0) return mins === 1 ? '1 min' : `${mins} mins`;
    return `${hours} hrs ${mins} mins`;
  };

  const status = mapStatus(row.status);
  const departmentName = row.departments?.name ?? row.type ?? undefined;
  const iconConfig = departmentName ? DEPARTMENT_NAME_TO_ICON[departmentName] : undefined;
  const createdAtMs = new Date(row.created_at).getTime();

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    roomNumber: row.rooms?.room_number ?? '—',
    category: departmentName,
    categoryIcon: iconConfig?.icon,
    status,
    createdAt: row.created_at,
    locationText: row.room_id ? `Room ${row.rooms?.room_number ?? '—'}` : (row.type ?? 'Public Area'),
    dueTime:
      status === 'unsolved' && Number.isFinite(createdAtMs)
        ? formatElapsed((nowMs - createdAtMs) / 60000)
        : undefined,
    createdBy: {
      name: row.created_by?.full_name ?? 'Staff',
      avatar: row.created_by?.avatar_url ?? undefined,
    },
    assignedToId: row.assigned_to_id,
    createdById: row.created_by_id,
  };
}

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
        'type',
        'assigned_to_id',
        'created_by_id',
        'created_at',
        'departments(name)',
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
  const nowMs = Date.now();
  const tickets: TicketData[] = rows.map((row) => mapRowToTicketData(row, nowMs));

  return {
    selectedTab: 'myTickets',
    tickets,
  };
}

export async function getLatestTicketForRoom(roomId: string): Promise<TicketData | null> {
  if (!isSupabaseConfigured || !roomId) return null;

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
        'type',
        'assigned_to_id',
        'created_by_id',
        'created_at',
        'departments(name)',
        'rooms (room_number)',
        'created_by:users!tickets_created_by_id_fkey (full_name, avatar_url)',
      ].join(', ')
    )
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToTicketData(data as TicketsRow, Date.now());
}

export type CreateTicketInput = {
  title: string;
  description?: string | null;
  roomId?: string | null;
  locationType?: 'room' | 'publicArea';
  publicAreaName?: string | null;
  departmentName?: string | null;
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
    room_id: input.locationType === 'publicArea' ? null : (input.roomId ?? null),
    created_by_id: userId,
    assigned_to_id: input.assignedToId ?? null,
    type:
      input.locationType === 'publicArea'
        ? (input.publicAreaName ?? null)
        : null,
    department_id: input.departmentName ? await getDepartmentIdByName(input.departmentName) : null,
  };

  const { error } = await supabase.from('tickets').insert(payload);
  if (error) {
    throw error;
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId);

  if (error) {
    throw error;
  }
}

