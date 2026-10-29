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

  const handleSaveReport = async (reportData) => {
    try {
      if (!reportData.id && profile?.role === 'DEO') {
        const { data: existing, error } = await supabase
          .from('reports')
          .select('id, status')
          .eq('section_name', reportData.section_name)
          .eq('quarter', reportData.quarter)
          .eq('year', reportData.year)
          .neq('status', 'AAO_RETURNED')
          .neq('status', 'SAO_RETURNED');
        if (error) throw error;
        if (existing && existing.length > 0) {
          throw new Error("आपकी रिपोर्ट पहले ही जमा हो चुकी है। धन्यवाद");
        }
      }

      reportData.updated_at = new Date().toISOString();
      if (reportData.id) {
        const { error } = await supabase.from('reports').update(reportData).eq('id', reportData.id);
        if (error) throw error;
        addToast?.("रिपोर्ट अपडेट की गई", "success");
      } else {
        reportData.status = 'PENDING_AAO';
        reportData.submitted_by = user.id;
        reportData.timeline = [{ ts: new Date().toISOString(), role: profile.role, name: profile.section_name, action: "रिपोर्ट जमा की और AAO को भेजी", remark: "" }];
        const { error } = await supabase.from('reports').insert([reportData]);
        if (error) throw error;
        addToast?.("रिपोर्ट सफलतापूर्वक जमा की गई", "success");
      }
      setTimeout(() => {
        setEditingReport(null);
        refetch();
      }, 100);
    } catch (err) {
      console.error("Supabase error:", err);
      addToast?.(err.message || "डेटाबेस त्रुटि, कृपया पुनः प्रयास करें", "error");
      throw err;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span>© 2026 Digital India · राजभाषा QPR पोर्टल</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई</span>
        </div>
        <div style={{ fontWeight: 700, color: '#f8fafc', letterSpacing: '0.01em', textAlign: 'right' }}>
          Designed and Developed by: Bharat Bhushan, Senior Translation Officer (STO), Office of the Principal Director of Audit (PDA), Railway, Mumbai.
        </div>
      </footer>
    </div>
  );
};
