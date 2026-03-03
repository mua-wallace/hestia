import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StaffMember } from '../types/staff.types';

/**
 * Fetch staff members from Supabase `users` table and map them to StaffMember.
 * When Supabase is not configured or the query fails, returns an empty array.
 */
export async function fetchStaffFromSupabase(): Promise<StaffMember[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, departments(name), roles(name)');

  if (error || !data) {
    console.warn('Failed to fetch staff from Supabase', error);
    return [];
  }

  type UserRow = {
    id: string;
    full_name: string;
    avatar_url: string | null;
    departments: { name: string } | null;
    roles: { name: string } | null;
  };

  return (data as UserRow[]).map((row) => ({
    id: row.id,
    name: row.full_name,
    avatar: row.avatar_url ?? undefined,
    department: row.departments?.name ?? undefined,
    role: row.roles?.name ?? undefined,
    onShift: true,
    shift: 'AM',
  }));
}

