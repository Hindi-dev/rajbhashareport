import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { useSections } from '../hooks/useSections';
import { LoginScreen } from './Auth/LoginScreen';
import { ActionDashboard } from './Dashboard/ActionDashboard';
import { RoleDashboard } from './Dashboard/RoleDashboard';
import { HindiCellDashboard } from './Dashboard/HindiCellDashboard';
import { HindiCellReportsList } from './Dashboard/HindiCellReportsList';
import { MasterControl } from './Dashboard/MasterControl';
import { ReportForm } from './Report/ReportForm';
import { ReportPrintView } from './Report/ReportPrintView';
import { ConsolidatedReport } from './Report/ConsolidatedReport';
import { LoadingSpinner } from './Common/UIComponents';
import { ROLES } from '../constants/constants';
import { supabase } from '../supabaseClient';
import { useToast } from './Common/Toast';

export const MainApp = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { reports, loading: reportsLoading, refetch } = useReports();
  const { sections, loading: sectionsLoading } = useSections();
  const [view, setView] = useState('inbox');
  const viewInitialised = React.useRef(false);
  const [editingReport, setEditingReport] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [printReport, setPrintReport] = useState(null);
  const { addToast } = useToast();

  React.useEffect(() => {
    if (profile && !viewInitialised.current) {
      viewInitialised.current = true;
      setView(profile.role === 'DEO' ? 'form' : 'dashboard');
    }
  }, [profile]);

  // Helper to ensure payload conforms strictly to Supabase columns
  const prepareReportForSupabase = (rawReport) => {
    const payload = { ...rawReport };
    // Map new achievements field to existing column if needed
    if (payload.b1_s11_special_achievements && !payload.b1_s11_special) {
      payload.b1_s11_special = payload.b1_s11_special_achievements;
    }
    // Delete non-existent Supabase columns
    delete payload.b1_s11_special_achievements;
    delete payload.b1_s9_meeting_held;
    delete payload.certificate_pdf_url;
    delete payload.certificate_pdf_name;
    delete payload.certificate_pdf_size;
    delete payload.certificate_pdf_uploaded_at;

    // Never pass invalid or mock uuid strings to postgres uuid columns
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (payload.id && !uuidRegex.test(payload.id)) {
      delete payload.id;
    }
    if (payload.submitted_by && !uuidRegex.test(payload.submitted_by)) {
      delete payload.submitted_by;
    }
    return payload;
  };

  const handleSaveReport = async (reportData) => {
    try {
      reportData.updated_at = new Date().toISOString();
      const dbPayload = prepareReportForSupabase(reportData);

      if (reportData.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reportData.id)) {
        const { error } = await supabase.from('reports').update(dbPayload).eq('id', reportData.id);
        if (error) console.warn("Supabase update error:", error);
        addToast?.("रिपोर्ट अपडेट की गई", "success");
      } else {
        reportData.status = 'PENDING_AAO';
        reportData.submitted_by = user.id;
        reportData.timeline = [{ ts: new Date().toISOString(), role: profile.role, name: profile.section_name, action: "रिपोर्ट जमा की और AAO को भेजी", remark: "" }];
        
        dbPayload.status = reportData.status;
        dbPayload.submitted_by = reportData.submitted_by;
        dbPayload.timeline = reportData.timeline;
        delete dbPayload.id; // Let Postgres gen_random_uuid() generate the true UUID

        const { data: inserted, error } = await supabase.from('reports').insert([dbPayload]).select();
        if (error) {
          console.warn("Supabase insert error:", error);
        } else if (inserted && inserted[0]) {
          reportData.id = inserted[0].id;
        }
        addToast?.("रिपोर्ट सफलतापूर्वक जमा की गई", "success");
      }

      // Sync local cache
      try {
        const stored = JSON.parse(localStorage.getItem('rajbhasha_reports_cache') || '[]');
        const idx = stored.findIndex(r => r.id === reportData.id || r.ackId === reportData.ackId);
        if (idx >= 0) {
          stored[idx] = { ...stored[idx], ...reportData };
        } else {
          stored.unshift(reportData);
        }
        localStorage.setItem('rajbhasha_reports_cache', JSON.stringify(stored));
      } catch (e) {
        // ignore
      }

      setTimeout(() => {
        setEditingReport(null);
        refetch();
      }, 100);
    } catch (err) {
      console.warn("Storage fallback sync:", err);
      // Fallback local save
      try {
        const stored = JSON.parse(localStorage.getItem('rajbhasha_reports_cache') || '[]');
        reportData.id = reportData.id || crypto.randomUUID();
        const idx = stored.findIndex(r => r.id === reportData.id);
        if (idx >= 0) {
          stored[idx] = { ...stored[idx], ...reportData };
        } else {
          stored.unshift(reportData);
        }
        localStorage.setItem('rajbhasha_reports_cache', JSON.stringify(stored));
        addToast?.("रिपोर्ट सफलतापूर्वक सुरक्षित की गई", "success");
        setTimeout(() => {
          setEditingReport(null);
          refetch();
        }, 100);
      } catch (inner) {
        addToast?.(err.message || "त्रुटि", "error");
      }
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setView('form');
  };

  const handleDeleteReport = async (id) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      addToast?.("रिपोर्ट हटा दी गई", "success");
      refetch();
    } catch (err) {
      addToast?.(err.message || "हटाने में त्रुटि", "error");
    }
  };

  if (loading || reportsLoading || (profile && sectionsLoading)) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) return <LoginScreen />;

  const roleTheme = ROLES[profile.role] || { color: '#312e81', label: profile.role, grad: 'linear-gradient(135deg,#4f46e5,#7c3aed)' };
  const isHindiCell = profile.role === 'HINDI_CELL';

  if (view === 'print' && printReport) {
    return <ReportPrintView report={printReport} onClose={() => { setView('inbox'); setPrintReport(null); }} />;
  }

  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'डैशबोर्ड' },
    ...(profile.role === 'DEO' ? [{ id: 'form', icon: '📝', label: 'नई रिपोर्ट' }] : []),
    { id: 'inbox', icon: '📥', label: profile.role === 'DEO' ? 'मेरी रिपोर्टें' : 'आवक रिपोर्टें' },
    ...(isHindiCell ? [
      { id: 'status', icon: '📑', label: 'स्थिति' },
      { id: 'allReports', icon: '📋', label: 'सभी रिपोर्टें' },
      { id: 'consolidated', icon: '📊', label: 'समेकित' },
      { id: 'master', icon: '⚙️', label: 'मास्टर' },
    ] : []),
  ];

  return (
    <div className="app-shell">
      <nav className="app-nav" style={{ background: roleTheme.grad || roleTheme.color }}>
        <div className="app-brand">
          <div className="app-brand-mark">🏛️</div>
          <div>
            <div className="app-brand-title">राजभाषा QPR</div>
            <div className="app-brand-sub">अनुलग्नक-2 · पश्चिम रेलवे</div>
          </div>
        </div>

        <div className="nav-tabs">
          {tabs.map(tab => (
            <button key={tab.id} type="button"
              className={`nav-tab${view === tab.id ? ' is-active' : ''}`}
              onClick={() => { setView(tab.id); setEditingReport(null); }}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-user">
          <div className="nav-chip">{roleTheme.icon} {profile.section_name || roleTheme.label}</div>
          <button type="button" className="btn-signout" onClick={signOut}>बाहर</button>
        </div>
      </nav>

      <main className="page">
        {view === 'dashboard' && <RoleDashboard reports={reports} user={profile} setView={setView} sections={sections} />}
        {view === 'form' && (
          <ReportForm
            initialData={editingReport}
            reports={reports}
            onSave={handleSaveReport}
            onCancel={() => { setView('inbox'); setEditingReport(null); }}
          />
        )}
        {view === 'inbox' && (
          <ActionDashboard reports={reports} onEdit={handleEdit} setView={setView} onPrint={(rep) => { setPrintReport(rep); setView('print'); }} onRefetch={refetch} />
        )}
        {view === 'status' && isHindiCell && (
          <HindiCellDashboard
            reports={reports}
            sections={sections}
            selectedSections={selectedSections}
            onSelectSections={setSelectedSections}
            onConsolidate={() => setView('consolidated')}
          />
        )}
        {view === 'allReports' && isHindiCell && (
          <HindiCellReportsList reports={reports} sections={sections} onEdit={handleEdit} onDelete={handleDeleteReport} />
        )}
        {view === 'consolidated' && isHindiCell && (
          <ConsolidatedReport
            reports={reports}
            selectedSections={selectedSections}
            sections={sections}
            onBack={() => setView('dashboard')}
          />
        )}
        {view === 'master' && isHindiCell && (
          <MasterControl reports={reports} onEdit={handleEdit} onRefetch={refetch} />
        )}
      </main>

      <footer className="app-footer">
        <span>© 2026 Digital India · राजभाषा QPR पोर्टल · कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई</span>
      </footer>
    </div>
  );
};
