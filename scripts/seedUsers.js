/**
 * Seed users into Supabase Auth + public.users
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * Run: node scripts/seedUsers.js
 *
 * Creates auth users and links them to departments/roles in public.users.
 * Default password: "Hestia2025!" (change in production)
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
// Load .env from project root (dotenv is a dependency of expo)
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {
  // Fallback: manual load
  try {
    const fs = require('fs');
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      });
    }
  } catch (__) {}
}

const DEFAULT_PASSWORD = 'Hestia2025!';

const users = [
  { full_name: 'Wallace Mua', email: 'wallace@hestia.ch', role_key: 'general_manager', department_name: 'Management' },
  { full_name: 'Stella Kitou', email: 'stella@hestia.ch', role_key: 'hotel_manager', department_name: 'Management' },
  { full_name: 'Henry Tankeu', email: 'henry@hestia.ch', role_key: 'executive_housekeeper', department_name: 'Housekeeping' },
  { full_name: 'Giovanna Rossi', email: 'gio@hestia.ch', role_key: 'housekeeping_manager', department_name: 'Housekeeping' },
  { full_name: 'Leon Meyer', email: 'leon@hestia.ch', role_key: 'assistant_housekeeping_manager', department_name: 'Housekeeping' },
  { full_name: 'Etleva Kola', email: 'etleva@hestia.ch', role_key: 'housekeeping_senior_supervisor', department_name: 'Housekeeping' },
  { full_name: 'Alex Morin', email: 'alex@hestia.ch', role_key: 'housekeeping_supervisor', department_name: 'Housekeeping' },
  { full_name: 'Maria Lopez', email: 'maria@hestia.ch', role_key: 'housekeeping_coordinator', department_name: 'Housekeeping' },
  { full_name: 'Zoe Cakeri', email: 'zoe@hestia.ch', role_key: 'room_attendant', department_name: 'Housekeeping' },
  { full_name: 'Jordan Lee', email: 'jordan@hestia.ch', role_key: 'houseman', department_name: 'Housekeeping' },
  { full_name: 'Samantha Nguyen', email: 'sam@hestia.ch', role_key: 'laundry_attendant', department_name: 'Housekeeping' },
  { full_name: 'Taylor Robinson', email: 'taylor@hestia.ch', role_key: 'public_area_attendant', department_name: 'Housekeeping' },
  { full_name: 'Chris Johnson', email: 'chris@hestia.ch', role_key: 'director_of_rooms', department_name: 'Rooms Division' },
  { full_name: 'Morgan Patel', email: 'morgan@hestia.ch', role_key: 'assistant_director_of_rooms', department_name: 'Rooms Division' },
  { full_name: 'Chi Henry', email: 'chi@hestia.ch', role_key: 'front_office_director', department_name: 'Front Office' },
  { full_name: 'Alex Martinez', email: 'alexm@hestia.ch', role_key: 'front_office_manager', department_name: 'Front Office' },
  { full_name: 'Sofia Blanc', email: 'sofia@hestia.ch', role_key: 'front_office_supervisor', department_name: 'Front Office' },
  { full_name: 'Noah Weber', email: 'noah@hestia.ch', role_key: 'front_office_agent', department_name: 'Front Office' },
  { full_name: 'Emma Dubois', email: 'emma@hestia.ch', role_key: 'front_office_trainee', department_name: 'Front Office' },
  { full_name: 'Lucas Braun', email: 'lucas@hestia.ch', role_key: 'night_manager', department_name: 'Night Team' },
  { full_name: 'Nina Keller', email: 'nina@hestia.ch', role_key: 'night_auditor', department_name: 'Night Team' },
  { full_name: 'Paul Steiner', email: 'paul@hestia.ch', role_key: 'night_agent', department_name: 'Night Team' },
  { full_name: 'Felix Fuhrken', email: 'felix@hestia.ch', role_key: 'engineering_director', department_name: 'Engineering' },
  { full_name: 'Marco Rossi', email: 'marco@hestia.ch', role_key: 'engineering_supervisor', department_name: 'Engineering' },
  { full_name: 'Ivan Petrov', email: 'ivan@hestia.ch', role_key: 'shift_engineer', department_name: 'Engineering' },
  { full_name: 'Brian Osei', email: 'brian@hestia.ch', role_key: 'it_admin', department_name: 'Information Technology' },
];

async function main() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Missing EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    console.error('Add to .env: SUPABASE_SERVICE_ROLE_KEY=... (from Dashboard → Settings → API)');
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  // Fetch department and role ids + role display names
  const { data: departments } = await supabase.from('departments').select('id, name');
  const { data: roles } = await supabase.from('roles').select('id, key, name');
  const deptMap = Object.fromEntries((departments || []).map(d => [d.name, d.id]));
  const roleMap = Object.fromEntries((roles || []).map(r => [r.key, r.id]));
  const roleNameMap = Object.fromEntries((roles || []).map(r => [r.key, r.name]));

  for (const u of users) {
    try {
      const roleDisplayName = roleNameMap[u.role_key] || u.role_key;
      const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.full_name, role_name: roleDisplayName },
      });

      if (authErr) {
        if (authErr.message?.includes('already been registered')) {
          console.log(`Skip (exists): ${u.email}`);
          // Update existing user's department/role and metadata
          const { data: existing } = await supabase.auth.admin.listUsers();
          const user = existing?.users?.find(x => x.email === u.email);
          if (user) {
            await supabase.from('users').update({
              department_id: deptMap[u.department_name] || null,
              role_id: roleMap[u.role_key] || null,
              full_name: u.full_name,
            }).eq('id', user.id);
            await supabase.auth.admin.updateUserById(user.id, {
              user_metadata: { full_name: u.full_name, role_name: roleDisplayName },
            });
            console.log(`  Updated profile for ${u.email}`);
          }
          continue;
        }
        throw authErr;
      }

      // Trigger creates users row; update department and role
      await supabase.from('users').update({
        department_id: deptMap[u.department_name] || null,
        role_id: roleMap[u.role_key] || null,
      }).eq('id', authUser.user.id);

      console.log(`Created: ${u.email} (${u.role_key})`);
    } catch (err) {
      console.error(`Failed ${u.email}:`, err.message);
    }
  }

  console.log('\nDone. Default password for all: ' + DEFAULT_PASSWORD);
}

main();
