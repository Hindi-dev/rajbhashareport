import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useToast } from '../Common/Toast';

export const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  deo: {
    email: 'deo@railway.gov.in',
    password: 'password123',
    role: 'DEO',
    user: { id: 'demo-deo-001', email: 'deo@railway.gov.in' },
    profile: {
      id: 'demo-deo-001',
      email: 'deo@railway.gov.in',
      full_name: 'श्री राजेश कुमार (डाटा एंट्री ऑपरेटर)',
      role: 'DEO',
      section_name: 'प्रशासन अनुभाग',
      mapped_section: 'प्रशासन अनुभाग',
      designation: 'वरिष्ठ लिपिक / DEO',
      phone: '022-22001122'
    }
  },
  aao: {
    email: 'aao@railway.gov.in',
    password: 'password123',
    role: 'AAO',
    user: { id: 'demo-aao-002', email: 'aao@railway.gov.in' },
    profile: {
      id: 'demo-aao-002',
      email: 'aao@railway.gov.in',
      full_name: 'श्री सुनील शर्मा (AAO)',
      role: 'AAO',
      section_name: 'प्रशासन अनुभाग',
      mapped_section: 'प्रशासन अनुभाग',
      designation: 'सहायक लेखापरीक्षा अधिकारी (AAO)',
      phone: '022-22003344'
    }
  },
  sao: {
    email: 'sao@railway.gov.in',
    password: 'password123',
    role: 'SAO',
    user: { id: 'demo-sao-003', email: 'sao@railway.gov.in' },
    profile: {
      id: 'demo-sao-003',
      email: 'sao@railway.gov.in',
      full_name: 'श्री अनिल मेहता (SAO)',
      role: 'SAO',
      section_name: 'प्रशासन अनुभाग',
      mapped_section: 'प्रशासन अनुभाग',
      designation: 'वरिष्ठ लेखापरीक्षा अधिकारी (SAO)',
      phone: '022-22005566'
    }
  },
  hindi_cell: {
    email: 'hindi@railway.gov.in',
    password: 'password123',
    role: 'HINDI_CELL',
    user: { id: 'demo-hindi-004', email: 'hindi@railway.gov.in' },
    profile: {
      id: 'demo-hindi-004',
      email: 'hindi@railway.gov.in',
      full_name: 'श्री भारत भूषण (वरिष्ठ अनुवाद अधिकारी)',
      role: 'HINDI_CELL',
      section_name: 'हिंदी प्रकोष्ठ / राजभाषा विभाग',
      mapped_section: 'सभी अनुभाग',
      designation: 'वरिष्ठ अनुवाद अधिकारी (STO)',
      phone: '022-22007788'
    }
  }
};

const STORAGE_KEY = 'rajbhasha_active_auth';

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
      profData.mapped_section = profData.section_name;
    } else {
      profData.section_name = "सभी अनुभाग";
      profData.mapped_section = "सभी अनुभाग";
    }
    setProfile(profData);
    return profData;
  }, []);

  useEffect(() => {
    // 1. Check local demo session first
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.user && parsed.profile) {
          setUser(parsed.user);
          setProfile(parsed.profile);
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // 2. Check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user).catch(() => {}).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user).catch(() => {});
      } else if (!localStorage.getItem(STORAGE_KEY)) {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check if matching demo accounts
    const matchDemoKey = Object.keys(DEMO_ACCOUNTS).find(
      k => DEMO_ACCOUNTS[k].email.toLowerCase() === trimmedEmail
    );

    if (matchDemoKey) {
      const demo = DEMO_ACCOUNTS[matchDemoKey];
      setUser(demo.user);
      setProfile(demo.profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: demo.user, profile: demo.profile }));
      addToast?.(`लॉगिन सफल (${demo.profile.role}: ${demo.profile.full_name})`, "success");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await fetchProfile(data.user);
      addToast?.("लॉगिन सफल!", "success");
    } catch (err) {
      throw new Error(err.message || "ईमेल या पासवर्ड गलत है।");
    }
  };

  const loginAsDemoRole = (roleKey) => {
    const demo = DEMO_ACCOUNTS[roleKey];
    if (!demo) return;
    setUser(demo.user);
    setProfile(demo.profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: demo.user, profile: demo.profile }));
    addToast?.(`लॉगिन सफल (${demo.profile.role}: ${demo.profile.full_name})`, "success");
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
    addToast?.("सफलतापूर्वक लॉगआउट किया गया", "success");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, loginAsDemoRole, DEMO_ACCOUNTS, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};
