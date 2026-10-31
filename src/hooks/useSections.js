import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabaseClient';

const STORAGE_SECTIONS_KEY = 'rajbhasha_sections_cache';

const DEFAULT_SECTIONS = [
  { id: 1, section_name: 'प्रशासन अनुभाग' },
  { id: 2, section_name: 'लेखा अनुभाग' },
  { id: 3, section_name: 'स्थापना अनुभाग' },
  { id: 4, section_name: 'यातायात लेखापरीक्षा अनुभाग' },
  { id: 5, section_name: 'सामान्य अनुभाग' },
  { id: 6, section_name: 'हिंदी अनुभाग' }
];

const getInitialSections = () => {
  try {
    const stored = localStorage.getItem(STORAGE_SECTIONS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    // ignore
  }
  localStorage.setItem(STORAGE_SECTIONS_KEY, JSON.stringify(DEFAULT_SECTIONS));
  return DEFAULT_SECTIONS;
};

export function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSections = useCallback(async () => {
    if (!user) {
      setSections([]);
      setLoading(false);
      return;
    }

    try {
      const QUERY_TIMEOUT = 3000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT)
      );
      const { data, error } = await Promise.race([
        supabase.from('sections').select('*').order('id'),
        timeoutPromise
      ]);

      if (!error && data && data.length > 0) {
        setSections(data);
        localStorage.setItem(STORAGE_SECTIONS_KEY, JSON.stringify(data));
      } else {
        const cached = getInitialSections();
        setSections(cached);
      }
    } catch (e) {
      const cached = getInitialSections();
      setSections(cached);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const addSection = async (sectionName) => {
    const trimmed = sectionName?.trim();
    if (!trimmed) {
      throw new Error("कृपया अनुभाग का नाम दर्ज करें।");
    }

    // Check duplicate
    if (sections.some(s => s.section_name.trim().toLowerCase() === trimmed.toLowerCase())) {
      throw new Error(`'${trimmed}' नाम का अनुभाग पहले से मौजूद है।`);
    }

    const nextId = sections.reduce((max, s) => Math.max(max, typeof s.id === 'number' ? s.id : 0), 0) + 1;
    const newSection = { id: nextId, section_name: trimmed };

    // Attempt remote save to Supabase
    try {
      const { data, error } = await supabase.from('sections').insert([{ section_name: trimmed }]).select();
      if (!error && data && data[0] && data[0].id) {
        newSection.id = data[0].id;
      }
    } catch (err) {
      console.warn("Supabase sections insert note:", err);
    }

    // Update local cache & state
    const updated = [...sections, newSection];
    setSections(updated);
    try {
      localStorage.setItem(STORAGE_SECTIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }

    return newSection;
  };

  const deleteSection = async (id) => {
    try {
      await supabase.from('sections').delete().eq('id', id);
    } catch (err) {
      console.warn("Supabase sections delete note:", err);
    }

    const updated = sections.filter(s => s.id !== id);
    setSections(updated);
    try {
      localStorage.setItem(STORAGE_SECTIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  return { sections, loading, addSection, deleteSection, refetch: fetchSections };
}
