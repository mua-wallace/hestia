/**
 * Supabase client configuration
 * Uses AsyncStorage for session persistence in React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

export const ENV_KEYS = {
  SUPABASE_URL: 'EXPO_PUBLIC_SUPABASE_URL',
  SUPABASE_PUBLISHABLE_KEY: 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
} as const;

const supabaseUrl = process.env[ENV_KEYS.SUPABASE_URL] ?? '';
const supabasePublishableKey = process.env[ENV_KEYS.SUPABASE_PUBLISHABLE_KEY] ?? '';

export const isSupabaseConfigured = !!(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured) {
  console.warn(
    `Supabase not configured. Add ${ENV_KEYS.SUPABASE_URL} and ${ENV_KEYS.SUPABASE_PUBLISHABLE_KEY} to .env. App will show Login.`
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
