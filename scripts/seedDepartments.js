/**
 * Seed departments into Supabase
 * Requires: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * Run: node scripts/seedDepartments.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');

try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {
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

const DEPARTMENTS = [
  { name: 'Engineering', description: 'Maintenance, repairs, and facility operations' },
  { name: 'Executive Administration', description: 'Senior leadership and strategic hotel management' },
  { name: 'Food and Beverage', description: 'Restaurants, bars, banquets, and catering services' },
  { name: 'In Room Dining', description: 'Room service and in-suite guest dining' },
  { name: 'IT', description: 'Information technology systems and technical support' },
  { name: 'Concierge', description: 'Guest services, reservations, and local recommendations' },
  { name: 'Front Office', description: 'Guest check-in, check-out, and front desk operations' },
  { name: 'HSK Portier', description: 'Housekeeping porters and logistics support' },
  { name: 'Laundry', description: 'Linen and garment laundering services' },
  { name: 'Reception', description: 'Guest welcome, information, and lobby services' },
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

  console.log('Seeding departments...');
  const { error } = await supabase.from('departments').upsert(DEPARTMENTS, { onConflict: 'name' });
  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }
  console.log(`Done: ${DEPARTMENTS.length} departments`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
