/**
 * User service (Supabase)
 * Profile, avatar, and user list. All user data from Supabase.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { base64ToArrayBuffer } from '../utils/encoding';
import type { UserProfile } from '../types/home.types';
import type { User } from '../types';

export type UserProfileRow = {
  full_name?: string;
  avatar_url?: string;
  roles?: { name: string } | null;
  departments?: { name: string } | null;
};

/**
 * Build UserProfile from session metadata (no Supabase call)
 */
export function userProfileFromSession(metadata: Record<string, unknown> | undefined, email: string | undefined, hasFlag = false): UserProfile {
  const name = (metadata?.full_name as string) || (metadata?.name as string) || email?.split('@')[0] || 'User';
  const role = (metadata?.role_name as string) || (metadata?.role as string) || 'Staff';
  const department = metadata?.department as string | undefined;
  const avatar = (metadata?.avatar_url as string) || undefined;
  return { name, role, department, avatar, hasFlag };
}

/**
 * Fetch full user profile from Supabase (users + roles/departments).
 * Falls back to session metadata when Supabase is not configured or query fails.
 */
export async function getProfile(userId: string, sessionFallback: UserProfile): Promise<UserProfile> {
  if (!isSupabaseConfigured) return sessionFallback;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('full_name, avatar_url, roles(name), departments(name)')
      .eq('id', userId)
      .single();

    if (error || !data) return sessionFallback;
    const row = data as UserProfileRow;
    return {
      name: row.full_name || sessionFallback.name,
      role: row.roles?.name || row.departments?.name || sessionFallback.role,
      department: row.departments?.name || sessionFallback.department,
      avatar: row.avatar_url ?? sessionFallback.avatar,
      hasFlag: sessionFallback.hasFlag,
    };
  } catch {
    return sessionFallback;
  }
}

export interface UpdateAvatarResult {
  avatarUrl: string;
}

/**
 * Upload avatar image and update user record and auth metadata.
 * @param userId - Supabase auth user id
 * @param imageBase64 - Base64-encoded image string
 * @param fileExtension - e.g. 'jpg', 'png'
 * @returns new public avatar URL
 */
export async function updateAvatar(
  userId: string,
  imageBase64: string,
  fileExtension: string
): Promise<UpdateAvatarResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Profile update requires Supabase to be configured.');
  }
  const normalizedExt = fileExtension.toLowerCase() === 'jpg' ? 'jpeg' : fileExtension.toLowerCase();
  const contentType = normalizedExt === 'png' ? 'image/png' : 'image/jpeg';
  // Use unique file names to avoid stale CDN/image cache showing old avatar.
  const fileName = `avatars/${userId}-${Date.now()}.${normalizedExt}`;
  const arrayBuffer = base64ToArrayBuffer(imageBase64);

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, { contentType, upsert: true });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
  const avatarUrl = urlData.publicUrl;

  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', userId);

  if (updateError) throw updateError;

  await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });

  return { avatarUrl };
}

/** Supabase users row shape (public.users – email lives in auth.users) */
type UserRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  roles?: { name: string } | null;
  departments?: { name: string } | null;
};

function mapUserRowToUser(row: UserRow, email = ''): User {
  return {
    id: row.id,
    name: row.full_name ?? 'User',
    email,
    role: row.roles?.name ?? row.departments?.name ?? 'Staff',
    department: row.departments?.name ?? undefined,
    avatar: row.avatar_url ?? undefined,
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  /** Filter users by department (UUID from departments.id). */
  departmentId?: string;
}

export interface GetUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * List users from Supabase (users table + roles/departments).
 */
export async function getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
  const page = params?.page ?? 1;
  const limit = Math.min(params?.limit ?? 20, 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('users')
    .select('id, full_name, avatar_url, roles(name), departments(name)', { count: 'exact' })
    .range(from, to)
    .order('full_name', { ascending: true });

  if (params?.search?.trim()) {
    query = query.ilike('full_name', `%${params.search.trim()}%`);
  }

  if (params?.departmentId) {
    query = query.eq('department_id', params.departmentId);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = (data ?? []) as UserRow[];
  const total = count ?? 0;
  return {
    data: rows.map((row) => mapUserRowToUser(row)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Get department UUID by name (for filtering users by department).
 */
export async function getDepartmentIdByName(departmentName: string): Promise<string | null> {
  if (!isSupabaseConfigured || !departmentName?.trim()) return null;
  const { data, error } = await supabase
    .from('departments')
    .select('id')
    .eq('name', departmentName.trim())
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

/**
 * List users in a given department (by department name).
 * Used when tagging staff on a ticket for that department.
 *
 * Fetches **all pages** — `getUsers` is paginated (max 100 per page), so we loop until every
 * staff member in that department is loaded.
 */
export async function getUsersByDepartment(departmentName: string, params?: Omit<GetUsersParams, 'departmentId'>): Promise<GetUsersResponse> {
  const departmentId = await getDepartmentIdByName(departmentName);
  if (!departmentId) return { data: [], total: 0, page: 1, limit: 0, totalPages: 0 };

  const { page: _ignoredPage, ...rest } = params ?? {};
  const pageSize = Math.min(rest.limit ?? 100, 100);
  const allUsers: User[] = [];
  let total = 0;
  let page = 1;
  let totalPages = 1;

  do {
    const res = await getUsers({
      ...rest,
      departmentId,
      page,
      limit: pageSize,
    });
    total = res.total;
    totalPages = res.totalPages;
    allUsers.push(...res.data);
    if (res.data.length === 0 || page >= totalPages) break;
    page += 1;
  } while (page <= totalPages);

  return {
    data: allUsers,
    total,
    page: 1,
    limit: allUsers.length,
    totalPages: 1,
  };
}

/**
 * Get one user by id from Supabase.
 */
export async function getUserById(id: string): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, avatar_url, roles(name), departments(name)')
    .eq('id', id)
    .single();

  if (error || !data) throw error ?? new Error('User not found');
  return mapUserRowToUser(data as UserRow);
}
