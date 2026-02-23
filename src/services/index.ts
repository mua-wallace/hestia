/**
 * Services – all data from Supabase
 * auth: Supabase Auth
 * user: profile, avatar, list users (Supabase users table)
 * rooms: rooms + reservations + guests (Supabase)
 * dashboard: screen data aggregation (rooms from Supabase, rest mock until migrated)
 */

export * from './auth';
export * from './user';
export * from './rooms';
export * from './guests';
export * from './dashboard';
export * from './chat';
export * from './chat';
