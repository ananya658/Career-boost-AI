import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  isConfigured: boolean;
  signOut: () => Promise<void>;
  signInWithDemo: (email?: string, name?: string) => void;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  token: null,
  loading: true,
  isConfigured: false,
  signOut: async () => {},
  signInWithDemo: () => {},
  signInWithGoogle: async () => ({ error: null }),
});

const DEMO_STORAGE_KEY = 'careerboost_active_demo_user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedDemo = localStorage.getItem(DEMO_STORAGE_KEY);
      if (storedDemo) {
        try {
          return JSON.parse(storedDemo) as User;
        } catch {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => isSupabaseConfigured);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setSession(session);
          setUser(session.user);
          localStorage.removeItem(DEMO_STORAGE_KEY);
        } else if (!localStorage.getItem(DEMO_STORAGE_KEY)) {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const signInWithDemo = (email = 'alex.developer@careerboost.ai', name = 'Alex Developer') => {
    const demoUser = {
      id: 'demo-user-1',
      app_metadata: { provider: 'demo' },
      user_metadata: { full_name: name, avatar_url: '' },
      aud: 'authenticated',
      confirmation_sent_at: '',
      recovery_sent_at: '',
      email_change_sent_at: '',
      new_email: '',
      invited_at: '',
      action_link: '',
      email,
      phone: '',
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: '',
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString(),
      identities: [],
      is_anonymous: false,
    } as unknown as User;

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setSession(null);
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error(
          'Supabase is not yet connected to a Google OAuth Client ID. Configure Supabase Auth in your dashboard.'
        ),
      };
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { error };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('OAuth failed') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setUser(null);
    setSession(null);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Safe fallback
      }
    }
  };

  const token = session?.access_token ?? (user ? 'demo-session-token-valid' : null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        token,
        loading,
        isConfigured: isSupabaseConfigured,
        signOut,
        signInWithDemo,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
