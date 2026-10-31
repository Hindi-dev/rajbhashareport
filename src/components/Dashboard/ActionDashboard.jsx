import React, { useState } from 'react';
import { STATUS, ROLES, INBOX_STATUSES, ACTION_STATUSES, workflowActionsFor, canActOnReport, quarterLabel, SECTION_COLORS } from '../../constants/constants';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../Common/Toast';
import { CertificateModal } from '../Common/CertificateModal';
import { ReportDataView } from '../Report/ReportDataView';
import { supabase } from '../../supabaseClient';

export const ActionDashboard = ({ reports, onEdit, setView, onPrint, onRefetch }) => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [search, setSearch] = useState("");
  const [showCertModal, setShowCertModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const r = ROLES[profile.role] || ROLES.DEO;

  const inboxStatuses = INBOX_STATUSES[profile.role];
  const myReports = reports.filter(rep => {
    if (profile.role !== 'HINDI_CELL' && rep.section_name !== profile.section_name) return false;
    if (inboxStatuses && !inboxStatuses.includes(rep.status)) {
      if (profile.role === 'DEO') return true;
      return false;
    }
    return true;
  }).filter(x => !search || x.section_name?.includes(search) || x.ackId?.includes(search) || String(x.year).includes(search));

  const handleStatusChange = async (report, nextAction, certData = null) => {
    const allowed = workflowActionsFor(profile.role, report.status).some(btn => btn.action === nextAction);
    if (!allowed) {
      addToast?.("यह कार्रवाई आपकी भूमिका के लिए अनुमत नहीं है।", "error");
      return;
    }
    const isRealUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(report.id);
    try {
      if (isRealUuid && certData) {
        await supabase.from('reports').update({
          b1_cert_name: certData.b1_cert_name,
          b1_cert_desig: certData.b1_cert_desig,
          b1_cert_phone: certData.b1_cert_phone,
          b1_cert_date: certData.b1_cert_date,
          b1_cert_place: certData.b1_cert_place,
          b1_cert_agreed: certData.b1_cert_agreed,
        }).eq('id', report.id);
      }

      if (isRealUuid) {
        const { error: rpcError } = await supabase.rpc('transition_report', {
          p_report_id: report.id,
          p_next_status: nextAction,
          p_remark: remark || '',
        });

        if (rpcError) {
          const { data: existing } = await supabase.from('reports').select('timeline').eq('id', report.id).single();
          const timeline = [...(existing?.timeline || [])];
          timeline.push({
            ts: new Date().toISOString(),
            role: profile.role,
            name: profile.section_name,
            action: `स्थिति बदली: ${STATUS[nextAction]?.label || nextAction}`,
            remark: remark || "",
          });
          await supabase.from('reports').update({
            status: nextAction,
            updated_at: new Date().toISOString(),
            timeline,
          }).eq('id', report.id);
        }
      }

      // Sync local cache
      try {
        const stored = JSON.parse(localStorage.getItem('rajbhasha_reports_cache') || '[]');
        const idx = stored.findIndex(r => r.id === report.id || r.ackId === report.ackId);
        if (idx >= 0) {
          stored[idx].status = nextAction;
          stored[idx].updated_at = new Date().toISOString();
          stored[idx].timeline = [...(stored[idx].timeline || []), {
            ts: new Date().toISOString(),
            role: profile.role,
            name: profile.section_name,
            action: `स्थिति बदली: ${STATUS[nextAction]?.label || nextAction}`,
            remark: remark || "",
          }];
          localStorage.setItem('rajbhasha_reports_cache', JSON.stringify(stored));
        }
      } catch (e) {
        // ignore
      }

      addToast?.("स्थिति अपडेट की गई", "success");
      setSelected(null);
      setShowCertModal(false);
      setPendingAction(null);
      setRemark("");
      onRefetch?.();
    } catch (err) {
      console.error("Status change error:", err);
      addToast?.(err.message, "error");
    }
  };

  const handleActionClick = (report, action) => {
    if (profile.role === 'SAO' && action === 'SAO_APPROVED') {
      setPendingAction({ report, action });
      setShowCertModal(true);
    } else {
      handleStatusChange(report, action);
    }
  };

  const renderTimeline = (timeline) => {
    if (!timeline || timeline.length === 0) return <p style={{ color: 'var(--ink-3)', fontSize: 13, margin: 0 }}>कोई ऑडिट ट्रेल उपलब्ध नहीं है।</p>;
    return (
      <div className="audit-timeline">
        {timeline.map((entry, idx) => (
          <div key={idx} className="entry">
            <div className="time">{new Date(entry.ts).toLocaleString('hi-IN')}</div>
            <div className="action">{entry.action}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>द्वारा: {entry.role} – {entry.name}</div>
            {entry.remark && <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>टिप्पणी: {entry.remark}</div>}
          </div>
        ))}
      </div>
    );
  };

  if (selected) {
    const st = STATUS[selected.status] || { label: selected.status, bg: "#eee", color: "#333", icon: "📌" };
    const actionBtns = workflowActionsFor(profile.role, selected.status);

    return (
      <div className="stack" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSelected(null); setRemark(""); }}>← वापस सूची में</button>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {profile.role === 'HINDI_CELL' && (
              <button type="button" className="btn btn-soft btn-sm" onClick={() => onEdit(selected)}>✏️ एडिट करें</button>
            )}
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onPrint(selected)}>🖨️ PDF</button>
          </div>
        </div>

        <div className="detail-head" style={{ background: r.grad || r.color }}>
          <div>
            <h2>{selected.section_name}</h2>
            <div className="detail-sub">{quarterLabel(selected.quarter)} · {selected.year} · {selected.ackId}</div>
          </div>
          <div className="detail-badge">{st.icon} {st.label}</div>
        </div>

        <section className="card">
          <div className="card-body">
            <ReportDataView report={selected} />

            {actionBtns.length > 0 ? (
              <div className="no-print" style={{ marginTop: 20, padding: 18, borderRadius: 16, background: "var(--surface-2)", border: "1.5px solid #e8edf5" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", margin: "0 0 12px" }}>{r.icon} आपकी कार्रवाई</h3>
                <textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="टिप्पणी (वैकल्पिक)..."
                  className="textarea" rows={2} style={{ marginBottom: 14 }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {actionBtns.map(btn => (
                    <button key={btn.action} type="button" className="btn" style={{ flex: 1, minWidth: 190, background: btn.grad, color: "#fff", padding: "12px 16px" }}
                      onClick={() => {
                        if (btn.action === 'EDIT') onEdit(selected);
                        else handleActionClick(selected, btn.action);
                      }}>{btn.label}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="alert alert-info" style={{ marginTop: 20 }}>वर्तमान स्थिति में आपके लिए कोई कार्रवाई लंबित नहीं है।</div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h3 className="card-title">📜 ऑडिट ट्रेल</h3>
          </div>
          <div className="card-body">{renderTimeline(selected.timeline)}</div>
        </section>

        {showCertModal && (
          <CertificateModal report={selected} onConfirm={(cert) => handleStatusChange(pendingAction.report, pendingAction.action, cert)} onCancel={() => { setShowCertModal(false); setPendingAction(null); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <section className="card">
        <div className="card-head" style={{ background: r.grad || r.color }}>
          <h2 className="card-title" style={{ color: "#fff" }}>{profile.role === "DEO" ? "📋 मेरी रिपोर्टें" : "📥 आवक रिपोर्टें"}</h2>
          {profile.role === 'DEO' && (
            <button type="button" className="btn btn-light btn-sm" onClick={() => setView('form')}>+ नई रिपोर्ट</button>
          )}
        </div>

        <div style={{ padding: "14px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 अनुभाग, वर्ष या पावती संख्या से खोजें..." className="input" />
        </div>

        {myReports.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">{profile.role === "DEO" ? "📂" : "📭"}</div>
            <div className="empty-text">{profile.role === "DEO" ? "अभी तक कोई रिपोर्ट नहीं।" : "अभी कोई रिपोर्ट प्रतीक्षा में नहीं।"}</div>
          </div>
        ) : (
          <div>
            {myReports.map((rep, i) => {
              const st = STATUS[rep.status] || { label: rep.status, bg: "#eee", color: "#333", icon: "📌" };
              const c = SECTION_COLORS[i % SECTION_COLORS.length];
              const needsAction = canActOnReport(profile.role, rep) || (ACTION_STATUSES[profile.role] || []).includes(rep.status);
              return (
                <div key={rep.id} className="list-row" onClick={() => setSelected(rep)}>
                  <div className="list-avatar" style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text }}>
                    {(rep.section_name || "?").slice(0, 1)}
                  </div>
                  <div className="list-main">
                    <div className="list-title">{rep.section_name}</div>
                    <div className="list-sub">{quarterLabel(rep.quarter)} · {rep.year} · {rep.ackId}</div>
                  </div>
                  <span className="badge" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>{st.icon} {st.label}</span>
                  {needsAction && <span className="action-flag badge" style={{ background: r.color, color: "#fff" }}>कार्रवाई करें</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
