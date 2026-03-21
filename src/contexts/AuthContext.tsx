/**
 * Auth context – reads from Zustand auth store for useAuth() compatibility
 */
import React, { createContext, useContext, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useAuthStore } from '../store/useAuthStore';

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
  const { session, isLoading, signIn, signOut, resetPassword, init } = useAuthStore();

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

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
