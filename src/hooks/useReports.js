import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../supabaseClient';

const STORAGE_REPORTS_KEY = 'rajbhasha_reports_cache';

// Valid minimal 1-page sample PDF as a base64 Data URI for demo reports
const SAMPLE_CERT_PDF_DATA_URI = "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAxMTUKPj4Kc3RyZWFtCkJUCi9GMSAxOCBUZgoxMDAgNzAwIFRECihoYXN0YWtzaGFyaXQgUHJhbWFuLVBhdHJhIC0gUmFqYmhhc2hhIFFQUikgVGoKMCAtdjIwIFRECihoYXBwcm92ZWQgYW5kIFZlcmlmaWVkKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL1ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA2OCAwMDAwMCBuIAowMDAwMDAwMTI1IDAwMDAwIG4gCjAwMDAwMDAyNDcgMDAwMDAgbiAKMDAwMDAwMDQxNiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjUwNAolJUVPRgo=";

const SAMPLE_REPORTS = [
  {
    id: 'a0000001-0001-4000-8000-000000000001',
    ackId: 'RAJ-2026-ADM',
    section_name: 'प्रशासन अनुभाग',
    region: 'ख',
    year: '2026',
    quarter: 'Q4',
    status: 'PENDING_AAO',
    officeNameAddress: 'कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई',
    officerPhone: '022-22001122',
    officerEmail: 'deo@railway.gov.in',
    b1_s3_total_issued: '150',
    b1_s3_bilingual: '150',
    b1_s3_english_only: '0',
    b1_s3_hindi_only: '0',
    b1_s4_total_received: '80',
    b1_s4_hindi_reply: '65',
    b1_s4_english_reply: '0',
    b1_s4_no_reply_needed: '15',
    b1_s5_ka_total: '20',
    b1_s5_ka_hindi_reply: '18',
    b1_s5_ka_eng_reply: '0',
    b1_s5_ka_no_reply: '2',
    b1_s5_kha_total: '25',
    b1_s5_kha_hindi_reply: '20',
    b1_s5_kha_eng_reply: '0',
    b1_s5_kha_no_reply: '5',
    b1_s6_ka_hindi: '95',
    b1_s6_ka_english: '5',
    b1_s6_ka_total: '100',
    b1_s6_kha_hindi: '85',
    b1_s6_kha_english: '15',
    b1_s6_kha_total: '100',
    b1_s6_ga_hindi: '60',
    b1_s6_ga_english: '40',
    b1_s6_ga_total: '100',
    b1_s7_hindi_pages: '120.5',
    b1_s7_eng_pages: '25.0',
    b1_s7_total_pages: '145.5',
    b1_s7_eoffice: '350',
    b1_s8_workshops: '2',
    b1_s8_officers: '12',
    b1_s8_staff: '38',
    b1_s9_meeting_held: 'हाँ',
    b1_s9_meeting_date: '2026-03-15',
    b1_s9_agenda_hindi: 'हाँ',
    b1_s11_special_achievements: 'कार्यालय में राजभाषा पखवाड़े का सफल आयोजन तथा शत-प्रतिशत द्विभाषी ई-ऑफिस टिप्पण लेखन सुनिश्चित किया गया।',
    b1_cert_name: 'श्री राजेश कुमार',
    b1_cert_desig: 'वरिष्ठ लिपिक / DEO',
    b1_cert_date: '2026-03-31',
    b1_cert_place: 'मुंबई',
    b1_cert_agreed: true,
    certificate_pdf_url: SAMPLE_CERT_PDF_DATA_URI,
    certificate_pdf_name: 'signed_certificate_adm_q4.pdf',
    certificate_pdf_size: 245000,
    updated_at: '2026-03-31T10:00:00Z',
    created_at: '2026-03-31T10:00:00Z',
    timeline: [
      { ts: '2026-03-31T10:00:00Z', role: 'DEO', name: 'प्रशासन अनुभाग', action: 'रिपोर्ट जमा की और AAO को भेजी', remark: '' }
    ]
  },
  {
    id: 'a0000002-0002-4000-8000-000000000002',
    ackId: 'RAJ-2026-ACC',
    section_name: 'लेखा अनुभाग',
    region: 'ख',
    year: '2026',
    quarter: 'Q4',
    status: 'PENDING_SAO',
    officeNameAddress: 'कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई',
    officerPhone: '022-22003344',
    officerEmail: 'aao@railway.gov.in',
    b1_s3_total_issued: '120',
    b1_s3_bilingual: '120',
    b1_s3_english_only: '0',
    b1_s3_hindi_only: '0',
    b1_s4_total_received: '60',
    b1_s4_hindi_reply: '50',
    b1_s4_english_reply: '0',
    b1_s4_no_reply_needed: '10',
    b1_s6_ka_hindi: '80',
    b1_s6_ka_english: '10',
    b1_s6_ka_total: '90',
    b1_s6_kha_hindi: '75',
    b1_s6_kha_english: '15',
    b1_s6_kha_total: '90',
    b1_s6_ga_hindi: '50',
    b1_s6_ga_english: '30',
    b1_s6_ga_total: '80',
    b1_s7_hindi_pages: '95.0',
    b1_s7_eng_pages: '15.0',
    b1_s7_total_pages: '110.0',
    b1_s7_eoffice: '280',
    b1_s8_workshops: '1',
    b1_s8_officers: '8',
    b1_s8_staff: '25',
    b1_s9_meeting_held: 'हाँ',
    b1_s9_meeting_date: '2026-03-12',
    b1_s9_agenda_hindi: 'हाँ',
    b1_s11_special_achievements: 'लेखा रिपोर्टों में शत-प्रतिशत द्विभाषी शीर्षकों का प्रयोग सुनिश्चित किया गया।',
    b1_cert_name: 'श्री सुनील शर्मा',
    b1_cert_desig: 'सहायक लेखापरीक्षा अधिकारी',
    b1_cert_date: '2026-03-30',
    b1_cert_place: 'मुंबई',
    b1_cert_agreed: true,
    certificate_pdf_url: SAMPLE_CERT_PDF_DATA_URI,
    certificate_pdf_name: 'signed_certificate_acc_q4.pdf',
    certificate_pdf_size: 310000,
    updated_at: '2026-03-31T12:00:00Z',
    created_at: '2026-03-30T10:00:00Z',
    timeline: [
      { ts: '2026-03-30T10:00:00Z', role: 'DEO', name: 'लेखा अनुभाग', action: 'रिपोर्ट जमा की और AAO को भेजी', remark: '' },
      { ts: '2026-03-31T12:00:00Z', role: 'AAO', name: 'लेखा अनुभाग', action: 'सत्यापित कर SAO को अग्रेषित की', remark: 'जाँच पूरी हुई' }
    ]
  },
  {
    id: 'a0000003-0003-4000-8000-000000000003',
    ackId: 'RAJ-2026-EST',
    section_name: 'स्थापना अनुभाग',
    region: 'ख',
    year: '2026',
    quarter: 'Q4',
    status: 'SAO_APPROVED',
    officeNameAddress: 'कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई',
    officerPhone: '022-22005566',
    officerEmail: 'sao@railway.gov.in',
    b1_s3_total_issued: '200',
    b1_s3_bilingual: '200',
    b1_s3_english_only: '0',
    b1_s3_hindi_only: '0',
    b1_s4_total_received: '110',
    b1_s4_hindi_reply: '95',
    b1_s4_english_reply: '0',
    b1_s4_no_reply_needed: '15',
    b1_s6_ka_hindi: '140',
    b1_s6_ka_english: '10',
    b1_s6_ka_total: '150',
    b1_s6_kha_hindi: '120',
    b1_s6_kha_english: '20',
    b1_s6_kha_total: '140',
    b1_s6_ga_hindi: '80',
    b1_s6_ga_english: '40',
    b1_s6_ga_total: '120',
    b1_s7_hindi_pages: '150.0',
    b1_s7_eng_pages: '30.0',
    b1_s7_total_pages: '180.0',
    b1_s7_eoffice: '420',
    b1_s8_workshops: '2',
    b1_s8_officers: '15',
    b1_s8_staff: '45',
    b1_s9_meeting_held: 'हाँ',
    b1_s9_meeting_date: '2026-03-10',
    b1_s9_agenda_hindi: 'हाँ',
    b1_s11_special_achievements: 'सभी कर्मचारियों को यूनिकोड फॉन्ट में हिंदी टंकण का विशेष प्रशिक्षण दिया गया।',
    b1_cert_name: 'श्री अनिल मेहता',
    b1_cert_desig: 'वरिष्ठ लेखापरीक्षा अधिकारी',
    b1_cert_date: '2026-03-29',
    b1_cert_place: 'मुंबई',
    b1_cert_agreed: true,
    certificate_pdf_url: SAMPLE_CERT_PDF_DATA_URI,
    certificate_pdf_name: 'signed_certificate_est_q4.pdf',
    certificate_pdf_size: 280000,
    updated_at: '2026-03-31T15:00:00Z',
    created_at: '2026-03-29T10:00:00Z',
    timeline: [
      { ts: '2026-03-29T10:00:00Z', role: 'DEO', name: 'स्थापना अनुभाग', action: 'रिपोर्ट जमा की', remark: '' },
      { ts: '2026-03-30T11:00:00Z', role: 'AAO', name: 'स्थापना अनुभाग', action: 'SAO को अग्रेषित की', remark: '' },
      { ts: '2026-03-31T15:00:00Z', role: 'SAO', name: 'स्थापना अनुभाग', action: 'स्वीकृत कर हिंदी प्रकोष्ठ को भेजी', remark: 'अनुमोदित' }
    ]
  }
];

const normalizeReport = (r) => ({
  ...r,
  ackId: r.ackId || r.ack_id,
  officeNameAddress: r.officeNameAddress || r.office_name_address,
  officerPhone: r.officerPhone || r.officer_phone,
  officerEmail: r.officerEmail || r.officer_email,
  b1_s11_special_achievements: r.b1_s11_special_achievements || r.b1_s11_special || "",
});

export const DELETED_REPORTS_KEY = 'rajbhasha_deleted_report_ids';

export const getDeletedReportIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const markReportAsDeleted = (id, ackId) => {
  try {
    const list = getDeletedReportIds();
    let changed = false;
    const cleanId = id ? String(id).trim() : null;
    const cleanAck = ackId ? String(ackId).trim() : null;
    if (cleanId && !list.includes(cleanId)) {
      list.push(cleanId);
      changed = true;
    }
    if (cleanAck && !list.includes(cleanAck)) {
      list.push(cleanAck);
      changed = true;
    }
    if (changed) {
      localStorage.setItem(DELETED_REPORTS_KEY, JSON.stringify(list));
    }
  } catch (e) {}
};

export const isReportDeleted = (report, deletedIds = null) => {
  if (!report) return false;
  const list = deletedIds || getDeletedReportIds();
  if (list.length === 0) return false;
  const id = report.id ? String(report.id).trim() : null;
  const ackId = report.ackId ? String(report.ackId).trim() : null;
  const ack_id = report.ack_id ? String(report.ack_id).trim() : null;
  const ackid = report.ackid ? String(report.ackid).trim() : null;
  return Boolean(
    (id && list.includes(id)) ||
    (ackId && list.includes(ackId)) ||
    (ack_id && list.includes(ack_id)) ||
    (ackid && list.includes(ackid))
  );
};

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const getCachedReports = () => {
    const deletedList = getDeletedReportIds();
    try {
      const stored = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(r => !isReportDeleted(r, deletedList));
        }
      }
    } catch (e) {
      // ignore
    }
    // Only on clean initial start when STORAGE_REPORTS_KEY has never been written
    const initial = SAMPLE_REPORTS.filter(r => !isReportDeleted(r, deletedList));
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(initial));
    return initial;
  };

  const filterByRole = useCallback((rawList) => {
    if (!profile) return rawList;
    if (
      profile.role === 'HINDI_CELL' ||
      profile.section_name === 'सभी अनुभाग' ||
      profile.section_name === 'प्रशासन मुख्यालय' ||
      !profile.section_name
    ) {
      return rawList;
    }
    const section = profile.mapped_section || profile.section_name;
    const filtered = rawList.filter(r => r.section_name === section);
    return filtered.length > 0 ? filtered : rawList;
  }, [profile]);

  const fetchReports = useCallback(async () => {
    if (!user || !profile) {
      setReports([]);
      setLoading(false);
      return;
    }

    const deletedList = getDeletedReportIds();

    try {
      let query = supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (
        profile.role !== 'HINDI_CELL' &&
        profile.section_name &&
        profile.section_name !== 'सभी अनुभाग' &&
        profile.section_name !== 'प्रशासन मुख्यालय'
      ) {
        const section = profile.mapped_section || profile.section_name;
        query = query.eq('section_name', section);
      }

      // Race against a 3-second timeout to avoid hanging on unreachable Supabase
      const QUERY_TIMEOUT = 3000;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT)
      );
      const { data, error } = await Promise.race([query, timeoutPromise]);
      if (!error && Array.isArray(data) && data.length > 0) {
        const normalized = data
          .map(normalizeReport)
          .filter(r => !isReportDeleted(r, deletedList));
        setReports(filterByRole(normalized));
        localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(normalized));
      } else {
        // Fallback to cache / demo reports filtered by role and tombstone
        const cached = getCachedReports();
        setReports(filterByRole(cached));
      }
    } catch (err) {
      const cached = getCachedReports();
      setReports(filterByRole(cached));
    } finally {
      setLoading(false);
    }
  }, [user, profile, filterByRole]);

  const deleteReport = useCallback(async (id, ackId) => {
    const cleanId = id ? String(id).trim() : null;
    const cleanAck = ackId ? String(ackId).trim() : null;

    // 1. Mark as permanently deleted in tombstone storage
    markReportAsDeleted(cleanId, cleanAck);

    const matchesTarget = (r) => {
      if (!r) return false;
      if (cleanId && r.id && String(r.id).trim() === cleanId) return true;
      if (cleanAck) {
        if (r.ackId && String(r.ackId).trim() === cleanAck) return true;
        if (r.ack_id && String(r.ack_id).trim() === cleanAck) return true;
        if (r.ackid && String(r.ackid).trim() === cleanAck) return true;
      }
      return false;
    };

    // 2. Immediately update state so item vanishes instantly without delay
    setReports(prev => prev.filter(r => !matchesTarget(r)));

    // 3. Update localStorage cache
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_REPORTS_KEY) || '[]');
      if (Array.isArray(stored)) {
        const updated = stored.filter(r => !matchesTarget(r));
        localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(updated));
      }
    } catch (e) {}

    // 4. Delete from Supabase remotely in parallel
    try {
      if (cleanId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanId)) {
        await supabase.from('reports').delete().eq('id', cleanId);
      }
      if (cleanAck) {
        await supabase.from('reports').delete().eq('ackid', cleanAck);
      }
    } catch (e) {
      console.warn("Supabase remote delete note:", e);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    try {
      const channel = supabase.channel('db-reports-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => { fetchReports(); })
        .subscribe();
      return () => { supabase.removeChannel(channel).catch(() => {}); };
    } catch (e) {
      // offline
    }
  }, [fetchReports]);

  return { reports, loading, refetch: fetchReports, deleteReport };
}
