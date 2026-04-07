/**
 * Auth state (Zustand) – single source of truth for session and auth actions.
 * Synced with Supabase; AuthContext can subscribe to this store for useAuth().
 */

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { registerAndSyncPushToken } from '../services/notifications';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  isLoading: true,
  error: null,

  setSession: (session) => set({ session }),
  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (email: string, password: string) => {
    set({ error: null });
    try {
      const { error } = await authService.signIn({ email, password });
      if (error) {
        set({ error: error.message });
        return { error: error as Error };
      }
      return { error: null };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      set({ error: e.message });
      return { error: e };
    }
  },

  signOut: async () => {
    set({ error: null });
    try {
      const { error } = await authService.signOut();
      if (error) {
        set({ error: error.message });
        return { error: error as Error };
      }
      set({ session: null });
      return { error: null };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      return { error: e };
    }
  },

  resetPassword: async (email: string) => {
    set({ error: null });
    try {
      const { error } = await authService.resetPassword(email);
      if (error) {
        set({ error: error.message });
        return { error: error as Error };
      }
      return { error: null };
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      return { error: e };
    }
  },

  init: () => {
    authService.getSession().then((session) => {
      set({ session, isLoading: false });
      if (session) {
        registerAndSyncPushToken().catch(() => {});
      }
    }).catch(() => {
      set({ session: null, isLoading: false });
    });

    if (!isSupabaseConfigured) return () => {};

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      set({ session });
      if (session) {
        registerAndSyncPushToken().catch(() => {});
      }
    });
    return () => subscription.unsubscribe();
  },
}));
