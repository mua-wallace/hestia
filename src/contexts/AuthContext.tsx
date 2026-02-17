/**
 * Auth context for managing authentication state across the app
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { authService } from '../services/auth';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session (returns null immediately if Supabase not configured)
    authService.getSession().then((session) => {
      setSession(session);
      setIsLoading(false);
    }).catch(() => {
      setSession(null);
      setIsLoading(false);
    });

    if (!isSupabaseConfigured) return;

    // Listen for auth changes only when Supabase is configured
    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await authService.signIn({ email, password });
      if (error) console.error('[Auth] signIn failed:', error.message, error);
      return { error: error as Error | null };
    } catch (err) {
      console.error('[Auth] signIn unexpected error:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await authService.signOut();
      if (error) console.error('[Auth] signOut failed:', error);
      return { error: error as Error | null };
    } catch (err) {
      console.error('[Auth] signOut unexpected error:', err);
      return { error: err as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await authService.resetPassword(email);
      if (error) console.error('[Auth] resetPassword failed:', error);
      return { error: error as Error | null };
    } catch (err) {
      console.error('[Auth] resetPassword unexpected error:', err);
      return { error: err as Error };
    }
  };

  const value: AuthContextType = {
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
