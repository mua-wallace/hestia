/**
 * Generates Supabase seed SQL for rooms, guests, reservations, reservation_guests
 * from src/data/mockAllRoomsData.ts (AM rooms list).
 *
 * Run: node scripts/generateRoomsSeed.js > supabase/seed_rooms_guests_reservations.sql
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const mockPath = path.join(projectRoot, 'src', 'data', 'mockAllRoomsData.ts');

function escapeSql(str) {
  if (str == null || str === '') return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function loadMockData() {
  let content = fs.readFileSync(mockPath, 'utf8');
  content = content.replace(/require\([^)]+\)/g, 'null');
  const match = content.match(/const rawMockAllRoomsData[^=]*=\s*(\{[\s\S]*?\});\s*const _rooms/);
  if (!match) throw new Error('Could not extract rawMockAllRoomsData from mock file');
  return eval('(' + match[1] + ')');
}

function main() {
  const data = loadMockData();
  const rooms = data.rooms || [];
  const lines = [];

  lines.push('-- Seed: rooms, guests, reservations, reservation_guests from mockAllRoomsData (AM)');
  lines.push('-- Run after migrations and SEED_DATA.sql.');
  lines.push('');

  const guestSet = new Map();
  rooms.forEach((room) => {
    (room.guests || []).forEach((g) => {
      const name = (g && g.name) ? String(g.name).trim() : 'Guest';
      if (!guestSet.has(name)) guestSet.set(name, { name, vipCode: g && g.vipCode != null ? g.vipCode : null });
    });
  });
  const guestList = Array.from(guestSet.values());

  // 1. ROOMS
  lines.push('-- 1. ROOMS');
  rooms.forEach((room) => {
    const rn = room.roomNumber;
    const cat = room.roomCategory || '';
    const credit = room.credit != null ? room.credit : 0;
    const linen = room.withLinen ? 'with_linen' : 'no_linen';
    const priority = room.isPriority ? 'high' : 'normal';
    const flagged = !!room.flagged;
    const spec = room.specialInstructions;
    const notes = room.roomNotes;
    const hk = room.houseKeepingStatus || 'Dirty';
    const promised = room.promisedTime ? String(room.promisedTime) : null;
    lines.push(
      `INSERT INTO rooms (room_number, category, credit, linen_status, priority, flagged, special_instructions, notes, house_keeping_status) ` +
      `VALUES (${escapeSql(rn)}, ${escapeSql(cat)}, ${credit}, ${escapeSql(linen)}, ${escapeSql(priority)}, ${flagged}, ${escapeSql(spec)}, ${escapeSql(notes)}, ${escapeSql(hk)}) ` +
      `ON CONFLICT (room_number) DO UPDATE SET category = EXCLUDED.category, credit = EXCLUDED.credit, linen_status = EXCLUDED.linen_status, priority = EXCLUDED.priority, flagged = EXCLUDED.flagged, special_instructions = EXCLUDED.special_instructions, notes = EXCLUDED.notes, house_keeping_status = EXCLUDED.house_keeping_status;`
    );
  });
  lines.push('');

  // 2. GUESTS (insert only if not exists)
  lines.push('-- 2. GUESTS');
  guestList.forEach((g) => {
    lines.push(
      `INSERT INTO guests (full_name, vip_code) SELECT ${escapeSql(g.name)}, ${g.vipCode != null ? escapeSql(String(g.vipCode)) : 'NULL'} WHERE NOT EXISTS (SELECT 1 FROM guests WHERE full_name = ${escapeSql(g.name)});`
    );
  });
  lines.push('');

  // 3. RESERVATIONS (one per guest per room) and 4. RESERVATION_GUESTS
  lines.push('-- 3. RESERVATIONS (one per guest per room)');
  const resKeys = [];
  rooms.forEach((room) => {
    const rn = room.roomNumber;
    const frontOffice = room.frontOfficeStatus || '';
    const roomPromised = room.promisedTime ? String(room.promisedTime) : null;
    (room.guests || []).forEach((g, idx) => {
      const from = (g.datesOfStay && g.datesOfStay.from) ? g.datesOfStay.from : '';
      const to = (g.datesOfStay && g.datesOfStay.to) ? g.datesOfStay.to : '';
      const eta = (g.time && g.time !== 'N/A') ? g.time : null;
      const adults = (g.guestCount && g.guestCount.adults != null) ? g.guestCount.adults : 0;
      const kids = (g.guestCount && g.guestCount.kids != null) ? g.guestCount.kids : 0;
      const resStatus = room.reservationStatus || '';
      const promisedTime = roomPromised;
      if (!from || !to) return;
      lines.push(
        `INSERT INTO reservations (room_id, arrival_date, departure_date, eta, adults, kids, reservation_status, front_office_status, promised_time) ` +
        `SELECT r.id, ${escapeSql(from)}, ${escapeSql(to)}, ${eta ? escapeSql(eta) : 'NULL'}, ${adults}, ${kids}, ${escapeSql(resStatus)}, ${escapeSql(frontOffice)}, ${promisedTime ? escapeSql(promisedTime) : 'NULL'} ` +
        `FROM rooms r WHERE r.room_number = ${escapeSql(rn)} ` +
        `AND NOT EXISTS (SELECT 1 FROM reservations res WHERE res.room_id = r.id AND res.arrival_date = ${escapeSql(from)} AND res.departure_date = ${escapeSql(to)} AND res.adults = ${adults} AND res.kids = ${kids});`
      );
      resKeys.push({ roomNumber: rn, from, to, adults, kids, guestName: (g && g.name) ? String(g.name).trim() : 'Guest' });
    });
  });
  lines.push('');

  lines.push('-- 4. RESERVATION_GUESTS (link reservation to guest)');
  resKeys.forEach((k) => {
    lines.push(
      `INSERT INTO reservation_guests (reservation_id, guest_id) ` +
      `SELECT res.id, g.id FROM reservations res JOIN rooms r ON r.id = res.room_id AND r.room_number = ${escapeSql(k.roomNumber)} ` +
      `JOIN guests g ON g.full_name = ${escapeSql(k.guestName)} ` +
      `WHERE res.arrival_date = ${escapeSql(k.from)} AND res.departure_date = ${escapeSql(k.to)} AND res.adults = ${k.adults} AND res.kids = ${k.kids} ` +
      `AND NOT EXISTS (SELECT 1 FROM reservation_guests rg WHERE rg.reservation_id = res.id AND rg.guest_id = g.id);`
    );
  });

  return lines.join('\n');
}

console.log(main());
