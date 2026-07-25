import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '../components/Common/Toast';
import { supabase } from '../supabaseClient';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { addToast } = useToast();

  const fetchReports = useCallback(async () => {
    if (!user || !profile) return;
    let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
    if (profile.role !== 'HINDI_CELL') {
      query = query.eq('section_name', profile.section_name);
    }
    const { data, error } = await query;
    if (error) { addToast?.(error.message, 'error'); setLoading(false); return; }
    setReports(data || []);
    setLoading(false);
  }, [user, profile, addToast]);

  useEffect(() => {
    fetchReports();
    const channel = supabase.channel('db-reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => { fetchReports(); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchReports]);

  return { reports, loading, refetch: fetchReports };
}