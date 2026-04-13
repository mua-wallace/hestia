import { supabase, isSupabaseConfigured } from '../lib/supabase';

let cachedHotelId: string | null = null;
let inflight: Promise<string | null> | null = null;

export async function getMyHotelId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  if (cachedHotelId) return cachedHotelId;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id;
    if (!userId) return null;

    const { data: row, error } = await supabase.from('users').select('hotel_id').eq('id', userId).single();
    if (error || !row) return null;
    const hid = (row as { hotel_id?: string | null }).hotel_id ?? null;
    cachedHotelId = hid;
    return hid;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function clearCachedHotelId() {
  cachedHotelId = null;
  inflight = null;
}

