import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../Common/Toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProfile = useCallback(async (authUser) => {
    if (!authUser) return null;
    const { data: profData, error: profErr } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    if (profErr || !profData) { setProfile(null); throw new Error("प्रोफ़ाइल नहीं मिली"); }
    if (profData.section_id) {
      const { data: secData } = await supabase.from('sections').select('section_name').eq('id', profData.section_id).maybeSingle();
      profData.section_name = secData?.section_name || `Section ${profData.section_id}`;
    } else { profData.section_name = "सभी अनुभाग"; }
    setProfile(profData);
    return profData;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user).catch(() => {}).finally(() => setLoading(false)); }
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user).catch(() => {}); }
      else { setUser(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await fetchProfile(data.user);
    addToast?.("लॉगिन सफल!", "success");
  };
  const signOut = () => { supabase.auth.signOut(); addToast?.("लॉगआउट", "success"); };
  return <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, supabase }}>{children}</AuthContext.Provider>;
};