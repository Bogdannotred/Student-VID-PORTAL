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

  useEffect(() => {
    if (user?.user_metadata?.avatar_path) {
      const fetchAvatarUrl = async () => {
        const { data, error } = await supabase.storage
          .from('Documents')
          .createSignedUrl(user.user_metadata.avatar_path, 3600);
        if (data) {
          setUser(prevUser => ({
            ...prevUser,
            user_metadata: {
              ...prevUser.user_metadata,
              avatar_url: data.signedUrl,
            },
          }));
        }
      };
      fetchAvatarUrl();
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
