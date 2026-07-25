import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReports } from '../hooks/useReports';
import { LoginScreen } from './Auth/LoginScreen';
import { ActionDashboard } from './Dashboard/ActionDashboard';
import { HindiCellDashboard } from './Dashboard/HindiCellDashboard';
import { HindiCellReportsList } from './Dashboard/HindiCellReportsList';
import { ReportForm } from './Report/ReportForm';
import { ReportPrintView } from './Report/ReportPrintView';
import { ConsolidatedReport } from './Report/ConsolidatedReport';
import { ROLES } from '../constants/constants';
import { supabase } from '../supabaseClient';
import { useToast } from './Common/Toast';

export const MainApp = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { reports, loading: reportsLoading, refetch } = useReports();
  const [view, setView] = useState(profile?.role === 'DEO' ? 'form' : 'inbox');
  const [editingReport, setEditingReport] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [showConsolidated, setShowConsolidated] = useState(false);
  const [printReport, setPrintReport] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (profile?.role === 'HINDI_CELL') {
      supabase.from('sections').select('*').then(({ data, error }) => {
        if (!error) setSections(data || []);
      });
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
          const hasActive = existing.some(r => r.status !== 'AAO_RETURNED' && r.status !== 'SAO_RETURNED');
          if (hasActive) {
            throw new Error("आपकी रिपोर्ट पहले ही जमा हो चुकी है। धन्यवाद");
          }
        }
      }

      reportData.updated_at = new Date().toISOString();
      if (reportData.id) {
        const { error } = await supabase.from('reports').update(reportData).eq('id', reportData.id);
        if (error) throw error;
        addToast?.("रिपोर्ट अपडेट की गई", "success");
      } else {
        reportData.status = 'PENDING_AAO';
        reportData.timeline = [{ ts: new Date().toISOString(), role: profile.role, name: profile.section_name, action: "रिपोर्ट बनाई गई", remark: "" }];
        const { error } = await supabase.from('reports').insert([reportData]);
        if (error) throw error;
        addToast?.("रिपोर्ट सफलतापूर्वक जमा की गई", "success");
      }
      setTimeout(() => {
        setEditingReport(null);
        setView('inbox');
        refetch();
      }, 100);
    } catch (err) {
      console.error("Supabase error:", err);
      addToast?.(err.message || "डेटाबेस त्रुटि, कृपया पुनः प्रयास करें", "error");
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setView('form');
  };

  const handleConsolidate = () => {
    setShowConsolidated(true);
  };

  const handleDeleteReport = async (id) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      addToast?.("रिपोर्ट हटा दी गई", "success");
      refetch();
    } catch (err) {
      console.error("Delete error:", err);
      addToast?.(err.message || "हटाने में त्रुटि", "error");
    }
  };

  const handlePrint = (report) => {
    setPrintReport(report);
    setView('print');
  };

  if (loading || reportsLoading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="spinner"></div></div>;
  }

  if (!user || !profile) return <LoginScreen />;

  const roleTheme = ROLES[profile.role] || { color: '#312e81', label: profile.role };
  const isHindiCell = profile.role === 'HINDI_CELL';

  if (showConsolidated) {
    return (
      <ConsolidatedReport reports={reports} selectedSections={selectedSections} sections={sections} onBack={() => setShowConsolidated(false)} />
    );
  }

  if (view === 'print' && printReport) {
    return <ReportPrintView report={printReport} onClose={() => { setView('inbox'); setPrintReport(null); }} />;
  }

  return (
    <div>
      <nav style={{ background: roleTheme.color, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <div style={{ color: "white", fontWeight: 800, fontSize: "16px", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🏛️</span> प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setView('inbox')} style={{ background: view === 'inbox' ? "rgba(255,255,255,0.2)" : "transparent", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>📥 डैशबोर्ड</button>
          {profile.role === 'DEO' && (
            <button onClick={() => setView('form')} style={{ background: view === 'form' ? "rgba(255,255,255,0.2)" : "transparent", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>📝 नई रिपोर्ट</button>
          )}
          {isHindiCell && (
            <>
              <button onClick={() => setView('dashboard')} style={{ background: view === 'dashboard' ? "rgba(255,255,255,0.2)" : "transparent", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>📊 स्थिति</button>
              <button onClick={() => setView('allReports')} style={{ background: view === 'allReports' ? "rgba(255,255,255,0.2)" : "transparent", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>📋 सभी रिपोर्टें</button>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "white", fontSize: "13px", fontWeight: 700, background: "rgba(0,0,0,0.2)", padding: "6px 14px", borderRadius: "20px" }}>{roleTheme.label}</span>
          <button onClick={signOut} style={{ background: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>लॉगआउट</button>
        </div>
      </nav>

      <main style={{ padding: "30px 20px 80px" }}>
        {view === 'form' && (
          <ReportForm initialData={editingReport} onSave={handleSaveReport} onCancel={() => { setView('inbox'); setEditingReport(null); }} />
        )}
        {view === 'inbox' && (
          <ActionDashboard reports={reports} onEdit={handleEdit} setView={setView} onPrint={handlePrint} />
        )}
        {view === 'dashboard' && isHindiCell && (
          <HindiCellDashboard
            reports={reports}
            sections={sections}
            selectedSections={selectedSections}
            onSelectSections={setSelectedSections}
            onConsolidate={handleConsolidate}
          />
        )}
        {view === 'allReports' && isHindiCell && (
          <HindiCellReportsList
            reports={reports}
            sections={sections}
            onEdit={handleEdit}
            onDelete={handleDeleteReport}
          />
        )}
      </main>
    </div>
  );
};