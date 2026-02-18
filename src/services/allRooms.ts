/**
 * All Rooms data from Supabase.
 * Fetches rooms with reservations and guests, maps to RoomCardData / AllRoomsScreenData.
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
  notes: string | null;
  house_keeping_status: string | null;
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
  promised_time?: string | null; // from migration 20250617000000
};

type GuestRow = {
  id: string;
  full_name: string;
  vip_code: string | null;
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

function safeStatus<T extends string>(value: string | null | undefined, allowed: readonly T[]): T {
  if (value && allowed.includes(value as T)) return value as T;
  return allowed[0] as T;
}

function mapToGuestInfo(
  res: ReservationRow,
  guest: GuestRow | null,
  index: number,
  roomId: string
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
    imageUrl: `https://i.pravatar.cc/96?u=${encodeURIComponent(roomId)}-${index}`,
  };
}

function mapRoomToCard(
  room: RoomRow,
  reservations: Array<{ res: ReservationRow; guest: GuestRow | null }>,
  attendant: StaffInfo
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
    roomNotes: room.notes ?? null,
    noteMadeBy: null,
  };
}

/**
 * Fetch all rooms with reservations and guests for the current operational view.
 * Uses room + first reservation for front_office_status/reservation_status when not on room.
 */
export async function fetchAllRoomsFromSupabase(shift: 'AM' | 'PM'): Promise<AllRoomsScreenData> {
  const { data: roomsData, error: roomsError } = await supabase
    .from('rooms')
    .select('id, room_number, category, credit, linen_status, priority, flagged, special_instructions, notes, house_keeping_status')
    .order('room_number', { ascending: true });

  if (roomsError) throw roomsError;
  const rooms = (roomsData ?? []) as RoomRow[];

  if (rooms.length === 0) {
    return { selectedShift: shift, rooms: [], roomsPM: [] };
  }

  const roomIds = rooms.map((r) => r.id);
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
        guests (id, full_name, vip_code)
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
    return mapRoomToCard(room, resList, DEFAULT_STAFF);
  });

  return {
    selectedShift: shift,
    rooms: cards,
    roomsPM: cards,
  };
}
