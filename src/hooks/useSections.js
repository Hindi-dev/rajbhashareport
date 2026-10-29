import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabaseClient';

const DEFAULT_SECTIONS = [
  { id: 1, section_name: 'प्रशासन अनुभाग' },
  { id: 2, section_name: 'लेखा अनुभाग' },
  { id: 3, section_name: 'स्थापना अनुभाग' },
  { id: 4, section_name: 'यातायात लेखापरीक्षा अनुभाग' },
  { id: 5, section_name: 'सामान्य अनुभाग' },
  { id: 6, section_name: 'हिंदी अनुभाग' }
];

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
    // Race against a 3-second timeout to avoid hanging on unreachable Supabase
    const QUERY_TIMEOUT = 3000;
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT)
    );
    Promise.race([
      supabase.from('sections').select('*').order('id'),
      timeoutPromise
    ]).then(({ data, error }) => {
      if (cancelled) return;
      if (!error && data && data.length > 0) {
        setSections(data);
      } else {
        setSections(DEFAULT_SECTIONS);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setSections(DEFAULT_SECTIONS);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  return { sections, loading };
}
