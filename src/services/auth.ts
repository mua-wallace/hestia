/**
 * Authentication service using Supabase Auth
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session, AuthError } from '@supabase/supabase-js';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn({ email, password }: SignInCredentials): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('[Auth] signIn error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        full: JSON.stringify(error),
      });
    }
    return { error };
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[Auth] signOut error:', {
        message: error.message,
        status: error.status,
        name: error.name,
      });
    }
    return { error };
  },

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) {
      return null;
    }
    try {
      const timeoutMs = 5000;
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('getSession timeout')), timeoutMs)
      );
      const {
        data: { session },
        error,
      } = await Promise.race([sessionPromise, timeoutPromise]);
      if (error) {
        console.error('[Auth] getSession error:', error.message);
        return null;
      }
      return session;
    } catch (err) {
      console.error('[Auth] getSession error:', err);
      return null;
    }
  },

  /**
   * Subscribe to auth state changes (e.g. session changes, token refresh)
   */
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ): { data: { subscription: { unsubscribe: () => void } } } {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] authStateChange:', event, session ? 'session' : 'null');
      callback(event, session);
    });
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: undefined, // Configure redirect URL in Supabase dashboard for web
    });
    if (error) {
      console.error('[Auth] resetPassword error:', {
        message: error.message,
        status: error.status,
        name: error.name,
      });
    }
    return { error };
  },
};
