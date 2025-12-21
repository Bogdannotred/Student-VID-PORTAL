import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setProfile(data || null));
    } else {
      setProfile(null);
    }
  }, [user]);

  const value = {
    user,
    profile,
    isAdmin: profile?.role === 'admin',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
