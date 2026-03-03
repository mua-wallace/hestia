/**
 * Rooms service (Supabase)
 * Fetches rooms with reservations and guests; updates room state.
 */

import { supabase } from '../lib/supabase';
import type {
  AllRoomsScreenData,
  RoomCardData,
  GuestInfo,
  StaffInfo,
  FrontOfficeStatus,
  RoomStatus,
  ReservationStatus,
  PromisedTime,
  NoteMadeBy,
} from '../types/allRooms.types';

type RoomRow = {
  id: string;
  room_number: string;
  category: string | null;
  credit: number | null;
  linen_status: string | null;
  priority: string | null;
  flagged: boolean | null;
  special_instructions: string | null;
  house_keeping_status: string | null;
};

/** Aggregated note info per room (from room_notes table) */
type RoomNotesAggregate = {
  count: number;
  lastNoteBy: { name: string; avatar?: string } | null;
};

type ReservationRow = {
  id: string;
  room_id: string;
  arrival_date: string;
  departure_date: string;
  eta: string | null;
  adults: number | null;
  kids: number | null;
  reservation_status: string | null;
  front_office_status: string | null;
  promised_time?: string | null;
};

type GuestRow = {
  id: string;
  full_name: string;
  vip_code: string | null;
  image_url: string | null;
};

type ReservationGuestRow = {
  reservation_id: string;
  guest_id: string;
  reservations?: ReservationRow | null;
  guests?: GuestRow | null;
};

const DEFAULT_STAFF: StaffInfo = {
  initials: 'N/A',
  name: 'Not Assigned',
  statusText: 'Not Started',
  statusColor: '#1e1e1e',
};

/** Shift row from Supabase */
type ShiftRow = { id: string; name: string; start_time: string; end_time: string };
/** Room assignment row with user info */
type RoomAssignmentRow = {
  room_id: string;
  user_id: string;
  shift_id: string;
  work_status: string | null;
  users: { full_name: string; avatar_url: string | null } | null;
};

/**
 * Fetch shift id by name (e.g. 'AM', 'PM'). Returns first matching shift, or first shift in table as fallback, or null.
 */
async function getShiftIdByName(shiftName: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('shifts')
    .select('id')
    .ilike('name', shiftName)
    .limit(1)
    .maybeSingle();
  if (!error && data) return (data as { id: string }).id;
  // Fallback: use first available shift so assignment can still be saved
  const { data: first } = await supabase.from('shifts').select('id').limit(1).maybeSingle();
  return first ? (first as { id: string }).id : null;
}

/**
 * Fetch room assignments for a shift and map room_id -> StaffInfo.
 * Returns a Map; rooms not in the map have no assignment (null).
 */
async function fetchRoomAssignmentsForShift(shift: 'AM' | 'PM'): Promise<Map<string, StaffInfo>> {
  const map = new Map<string, StaffInfo>();
  const shiftId = await getShiftIdByName(shift);
  if (!shiftId) return map;

  const { data, error } = await supabase
    .from('room_assignments')
    .select('room_id, user_id, work_status, users(full_name, avatar_url)')
    .eq('shift_id', shiftId);

  if (error) return map;

  const rows = (data ?? []) as RoomAssignmentRow[];
  for (const row of rows) {
    const name = row.users?.full_name ?? 'Staff';
    const initials = name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?';
    const statusText = row.work_status === 'in_progress' ? 'In Progress' : row.work_status === 'completed' ? 'Finished' : 'Not Started';
    const statusColor = row.work_status === 'completed' ? '#41d541' : row.work_status === 'in_progress' ? '#F0BE1B' : '#1e1e1e';
    map.set(row.room_id, {
      name,
      initials,
      avatar: row.users?.avatar_url ?? undefined,
      statusText,
      statusColor,
    });
  }
  return map;
}

function safeStatus<T extends string>(value: string | null | undefined, allowed: readonly T[]): T {
  if (value && allowed.includes(value as T)) return value as T;
  return allowed[0] as T;
}

function mapToGuestInfo(
  res: ReservationRow,
  guest: GuestRow | null,
  _index: number,
  _roomId: string
): GuestInfo {
  const name = guest?.full_name ?? 'Guest';
  const from = res.arrival_date ?? '';
  const to = res.departure_date ?? '';
  const time = res.eta ?? 'N/A';
  const timeLabel = res.eta ? 'ETA' : (res.departure_date ? 'EDT' : 'N/A');
  return {
    name,
    datesOfStay: { from, to },
    time: time === 'N/A' || !time ? 'N/A' : time,
    timeLabel: timeLabel as 'ETA' | 'EDT' | 'N/A',
    guestCount: { adults: res.adults ?? 0, kids: res.kids ?? 0 },
    vipCode: guest?.vip_code != null ? parseInt(String(guest.vip_code), 10) : undefined,
    arrivalDate: res.arrival_date,
    imageUrl: guest?.image_url ?? undefined,
  };
}

function mapRoomToCard(
  room: RoomRow,
  reservations: Array<{ res: ReservationRow; guest: GuestRow | null }>,
  attendant: StaffInfo | null,
  notesAgg: RoomNotesAggregate | null
): RoomCardData {
  const firstRes = reservations[0]?.res;
  const frontOffice = firstRes?.front_office_status ?? 'Stayover';
  const reservationStatus = firstRes?.reservation_status ?? 'Occupied';
  const promisedTime = firstRes?.promised_time ?? null;

  const guests: GuestInfo[] = reservations.map(({ res, guest }, i) =>
    mapToGuestInfo(res, guest, i, room.id)
  );
  if (guests.length === 0) {
    guests.push({
      name: 'Guest',
      datesOfStay: { from: '', to: '' },
      time: 'N/A',
      timeLabel: 'N/A',
      guestCount: { adults: 0, kids: 0 },
    });
  }

  const noteCount = notesAgg?.count ?? 0;
  return {
    id: room.id,
    roomNumber: room.room_number,
    roomCategory: room.category ?? '',
    credit: room.credit ?? 0,
    frontOfficeStatus: safeStatus(frontOffice, [
      'Arrival/Departure', 'Arrival', 'Departure', 'Stayover', 'Turndown', 'No Task', 'Refresh',
    ] as const) as FrontOfficeStatus,
    withLinen: room.linen_status === 'with_linen',
    houseKeepingStatus: safeStatus(room.house_keeping_status, ['Dirty', 'InProgress', 'Cleaned', 'Inspected']) as RoomStatus,
    reservationStatus: reservationStatus as ReservationStatus,
    promisedTime: (promisedTime === '12:00' || promisedTime === '13:00' ? promisedTime : null) as PromisedTime,
    guests,
    roomAttendantAssigned: attendant,
    isPriority: room.priority === 'high',
    flagged: room.flagged ?? false,
    specialInstructions: room.special_instructions ?? null,
    roomNotes: noteCount > 0 ? undefined : null,
    noteMadeBy: notesAgg?.lastNoteBy ? ({ name: notesAgg.lastNoteBy.name, avatar: notesAgg.lastNoteBy.avatar } as NoteMadeBy) : null,
    notes: noteCount > 0 ? { count: noteCount, hasRushed: false } : undefined,
  };
}

/**
 * Fetch note count and last note author per room (for list/cards).
 * Defined before fetchAllRooms so it is always in scope when the module loads.
 */
const fetchRoomNotesAggregate = async (roomIds: string[]): Promise<Map<string, RoomNotesAggregate>> => {
  const map = new Map<string, RoomNotesAggregate>();
  if (roomIds.length === 0) return map;

  const { data, error } = await supabase
    .from('room_notes')
    .select('id, room_id, created_at, users(full_name, avatar_url)')
    .in('room_id', roomIds)
    .order('created_at', { ascending: false });

  if (error) return map;

  const rows = (data ?? []) as Array<{
    room_id: string;
    users: { full_name: string | null; avatar_url: string | null } | null;
  }>;
  for (const roomId of roomIds) {
    const roomRows = rows.filter((r) => r.room_id === roomId);
    const count = roomRows.length;
    const last = roomRows[0];
    map.set(roomId, {
      count,
      lastNoteBy:
        count && last?.users
          ? {
              name: last.users.full_name ?? 'Staff',
              avatar: last.users.avatar_url ?? undefined,
            }
          : null,
    });
  }
  return map;
};

/**
 * Fetch all rooms with reservations and guests (Supabase).
 */
export async function fetchAllRooms(shift: 'AM' | 'PM'): Promise<AllRoomsScreenData> {
  const { data, error } = await supabase
    .from('rooms')
    .select('id, room_number, category, credit, linen_status, priority, flagged, special_instructions, house_keeping_status')
    .order('room_number', { ascending: true });

  if (error) throw error;
  const rooms = (data ?? []) as RoomRow[];

  if (rooms.length === 0) {
    return { selectedShift: shift, rooms: [], roomsPM: [] };
  }

  const roomIds = rooms.map((r) => r.id);

  const notesByRoom = await fetchRoomNotesAggregate(roomIds);
  const assignmentByRoom = await fetchRoomAssignmentsForShift(shift);

  const { data: resData, error: resError } = await supabase
    .from('reservations')
    .select('id, room_id, arrival_date, departure_date, eta, adults, kids, reservation_status, front_office_status, promised_time')
    .in('room_id', roomIds)
    .order('arrival_date', { ascending: false });

  if (resError) throw resError;
  const reservations = (resData ?? []) as ReservationRow[];

  const resIds = reservations.map((r) => r.id);
  let reservationGuests: ReservationGuestRow[] = [];
  if (resIds.length > 0) {
    const { data: rgData, error: rgError } = await supabase
      .from('reservation_guests')
      .select(`
        reservation_id,
        guest_id,
        reservations (id, room_id, arrival_date, departure_date, eta, adults, kids, reservation_status, front_office_status, promised_time),
        guests (id, full_name, vip_code, image_url)
      `)
      .in('reservation_id', resIds);
    if (!rgError) reservationGuests = (rgData ?? []) as ReservationGuestRow[];
  }

  const resByRoom = new Map<string, Array<{ res: ReservationRow; guest: GuestRow | null }>>();
  for (const rg of reservationGuests) {
    const res = rg.reservations ?? (reservations.find((r) => r.id === rg.reservation_id) ?? null);
    const guest = rg.guests ?? null;
    if (!res) continue;
    const list = resByRoom.get(res.room_id) ?? [];
    list.push({ res: res as ReservationRow, guest: guest as GuestRow | null });
    resByRoom.set(res.room_id, list);
  }
  for (const res of reservations) {
    if (!resByRoom.has(res.room_id)) {
      resByRoom.set(res.room_id, [{ res, guest: null }]);
    }
  }

  const cards: RoomCardData[] = rooms.map((room) => {
    const resList = resByRoom.get(room.id) ?? [];
    const notesAgg = notesByRoom.get(room.id) ?? null;
    const attendant = assignmentByRoom.get(room.id) ?? null;
    return mapRoomToCard(room, resList, attendant, notesAgg);
  });

  return {
    selectedShift: shift,
    rooms: cards,
    roomsPM: cards,
  };
}

/** Fields that can be updated on a room (Supabase rooms table). Notes are in room_notes table. */
export type RoomStateUpdate = {
  house_keeping_status?: RoomStatus;
  priority?: 'high' | 'normal';
  flagged?: boolean;
  special_instructions?: string | null;
};

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/** Room note row from Supabase with author info */
type RoomNoteRow = {
  id: string;
  room_id: string;
  text: string;
  created_at: string;
  created_by_id: string | null;
  users: { full_name: string | null; avatar_url: string | null } | null;
};

/** Note shape for room detail (matches roomDetail.types.Note) */
export interface RoomNote {
  id: string;
  text: string;
  staff: { name: string; avatar?: unknown };
  createdAt: string;
}

/**
 * Fetch all notes for a room (for room detail screen), with author info.
 */
export async function getRoomNotes(roomId: string): Promise<RoomNote[]> {
  if (!isValidUUID(roomId)) return [];

  const { data, error } = await supabase
    .from('room_notes')
    .select('id, text, created_at, users(full_name, avatar_url)')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });

  if (error) return [];

  const rows = (data ?? []) as RoomNoteRow[];
  return rows.map((row) => ({
    id: row.id,
    text: row.text,
    staff: {
      name: row.users?.full_name ?? 'Staff',
      avatar: row.users?.avatar_url ?? undefined,
    },
    createdAt: row.created_at,
  }));
}

/**
 * Add a note to a room. Uses current authenticated user as author.
 * Returns the created note (with id, createdAt) or throws.
 */
export async function addRoomNote(roomId: string, text: string): Promise<RoomNote> {
  const { data } = await supabase.auth.getSession();
  const userId = data?.session?.user?.id ?? null;

  const { data: inserted, error: insertError } = await supabase
    .from('room_notes')
    .insert({
      room_id: roomId,
      text: text.trim(),
      created_by_id: userId,
    })
    .select('id')
    .single();

  if (insertError) throw insertError;
  if (!inserted?.id) throw new Error('Failed to create note');

  const { data: full, error: fetchError } = await supabase
    .from('room_notes')
    .select('id, text, created_at, users(full_name, avatar_url)')
    .eq('id', inserted.id)
    .single();

  if (fetchError || !full) throw fetchError ?? new Error('Failed to fetch created note');
  const row = full as RoomNoteRow;
  return {
    id: row.id,
    text: row.text,
    staff: {
      name: row.users?.full_name ?? 'Staff',
      avatar: row.users?.avatar_url ?? undefined,
    },
    createdAt: row.created_at,
  };
}

/**
 * Update room state in Supabase.
 * No-op if roomId is not a valid UUID (e.g. mock data). Throws on Supabase error.
 */
export async function updateRoom(roomId: string, updates: RoomStateUpdate): Promise<void> {
  if (!isValidUUID(roomId)) {
    return;
  }
  const payload: Record<string, unknown> = {};
  if (updates.house_keeping_status != null) payload.house_keeping_status = updates.house_keeping_status;
  if (updates.priority != null) payload.priority = updates.priority;
  if (updates.flagged != null) payload.flagged = updates.flagged;
  if (updates.special_instructions !== undefined) payload.special_instructions = updates.special_instructions;
  if (Object.keys(payload).length === 0) return;
  const { error } = await supabase.from('rooms').update(payload).eq('id', roomId);
  if (error) throw error;
}

/**
 * Assign a room to a staff member for the given shift.
 * Uses room_assignments table: upserts by (room_id, shift_id) so one assignee per room per shift.
 * Always returns StaffInfo for the user when both IDs are valid UUIDs (so the room card can update);
 * persists to DB only when shift_id exists.
 */
export async function assignRoomToStaff(
  roomId: string,
  userId: string,
  shift: 'AM' | 'PM'
): Promise<StaffInfo | null> {
  if (!isValidUUID(roomId) || !isValidUUID(userId)) return null;

  // Fetch user first so we can always return StaffInfo for the UI
  const { data: userData } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .single();

  const name = (userData as { full_name: string; avatar_url: string | null } | null)?.full_name ?? 'Staff';
  const avatarUrl = (userData as { full_name: string; avatar_url: string | null } | null)?.avatar_url ?? null;
  const initials = name.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?';
  const staffInfo: StaffInfo = {
    name,
    initials,
    avatar: avatarUrl ?? undefined,
    statusText: 'Not Started',
    statusColor: '#1e1e1e',
  };

  const shiftId = await getShiftIdByName(shift);
  if (!shiftId) {
    // No shift in DB – still return StaffInfo so the room card updates
    console.warn('[assignRoomToStaff] No shift found for', shift, '– assignment not persisted. Add shifts (e.g. AM, PM) in Supabase.');
    return staffInfo;
  }

  const { error } = await supabase
    .from('room_assignments')
    .upsert(
      { room_id: roomId, shift_id: shiftId, user_id: userId },
      { onConflict: 'room_id,shift_id' }
    );

  if (error) {
    const isNoConflictConstraint =
      error.code === '42P10' || (error.message != null && /unique|on conflict/i.test(error.message));
    if (isNoConflictConstraint) {
      // Fallback when unique constraint doesn't exist yet (run migration 20250628000000_room_assignments_upsert_and_anon.sql)
      const { data: existing } = await supabase
        .from('room_assignments')
        .select('id')
        .eq('room_id', roomId)
        .eq('shift_id', shiftId)
        .maybeSingle();
      if (existing) {
        const updateResult = await supabase
          .from('room_assignments')
          .update({ user_id: userId })
          .eq('room_id', roomId)
          .eq('shift_id', shiftId);
        if (updateResult.error) throw updateResult.error;
      } else {
        const insertResult = await supabase.from('room_assignments').insert({
          room_id: roomId,
          shift_id: shiftId,
          user_id: userId,
        });
        if (insertResult.error) throw insertResult.error;
      }
    } else {
      console.error('[assignRoomToStaff] Supabase error:', error.message, error.code);
      throw error;
    }
  }

  return staffInfo;
}
