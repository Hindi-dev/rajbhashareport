import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabaseClient';

export function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSections([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    supabase.from('sections').select('*').order('id').then(({ data, error }) => {
      if (cancelled) return;
      if (!error) setSections(data || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  return { sections, loading };
}
