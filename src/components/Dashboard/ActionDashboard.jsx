import React, { useState } from 'react';
import { STATUS } from '../../constants/constants';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../Common/Toast';
import { CertificateModal } from '../Common/CertificateModal';
import { ReportDataView } from '../Report/ReportDataView';
import { supabase } from '../../supabaseClient';

export const ActionDashboard = ({ reports, onEdit, setView, onPrint }) => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");
  const [showCertModal, setShowCertModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const myReports = reports.filter(rep => {
    if (profile.role === 'DEO') return rep.section_name === profile.section_name;
    if (profile.role === 'AAO') return rep.section_name === profile.section_name && ['PENDING_AAO', 'SAO_RETURNED', 'AAO_APPROVED'].includes(rep.status);
    if (profile.role === 'SAO') return rep.section_name === profile.section_name && ['PENDING_SAO', 'AAO_RETURNED', 'SAO_APPROVED'].includes(rep.status);
    if (profile.role === 'HINDI_CELL') return ['SAO_APPROVED', 'SUBMITTED'].includes(rep.status);
    return true;
  });

  const handleStatusChange = async (reportId, nextAction, certData = null) => {
    try {
      const updateData = { status: nextAction, updated_at: new Date().toISOString() };
      if (certData) {
        updateData.b1_cert_name = certData.b1_cert_name;
        updateData.b1_cert_desig = certData.b1_cert_desig;
        updateData.b1_cert_phone = certData.b1_cert_phone;
        updateData.b1_cert_date = certData.b1_cert_date;
        updateData.b1_cert_place = certData.b1_cert_place;
        updateData.b1_cert_agreed = certData.b1_cert_agreed;
      }
      const { data: existing } = await supabase.from('reports').select('timeline').eq('id', reportId).single();
      const timeline = existing?.timeline || [];
      timeline.push({
        ts: new Date().toISOString(),
        role: profile.role,
        name: profile.section_name,
        action: `स्थिति बदली: ${nextAction}`,
        remark: remark || ""
      });
      updateData.timeline = timeline;

      const { error } = await supabase.from('reports').update(updateData).eq('id', reportId);
      if (error) throw error;
      addToast?.("स्थिति अपडेट की गई", "success");
      setSelected(null);
      setShowCertModal(false);
      setPendingAction(null);
      setRemark("");
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
      handleStatusChange(report.id, action);
    }
  };

  const handleCertConfirm = (certData) => {
    if (pendingAction) {
      handleStatusChange(pendingAction.report.id, pendingAction.action, certData);
    }
  };

  const renderTimeline = (timeline) => {
    if (!timeline || timeline.length === 0) return <p>कोई ऑडिट ट्रेल उपलब्ध नहीं है।</p>;
    return (
      <div className="audit-timeline">
        {timeline.map((entry, idx) => (
          <div key={idx} className="entry">
            <div className="time">{new Date(entry.ts).toLocaleString('hi-IN')}</div>
            <div className="action">{entry.action}</div>
            <div style={{ fontSize: '12px', color: '#475569' }}>द्वारा: {entry.role} – {entry.name}</div>
            {entry.remark && <div style={{ fontSize: '12px', color: '#64748b' }}>टिप्पणी: {entry.remark}</div>}
          </div>
        ))}
      </div>
    );
  };

  if (selected) {
    const st = STATUS[selected.status] || { label: selected.status, bg: "#eee", color: "#333", icon: "📌" };
    const actionBtns = (() => {
      if (profile.role === 'DEO' && (selected.status === 'AAO_RETURNED' || selected.status === 'SAO_RETURNED')) {
        return [{ label: "✏️ संपादित करें", action: "EDIT", grad: "linear-gradient(135deg,#f59e0b,#f97316)" }];
      }
      const map = {
        AAO: {
          PENDING_AAO: [
            { label: "✅ SAO को अग्रेषित करें", action: "PENDING_SAO", grad: "linear-gradient(135deg,#10b981,#0ea5e9)" },
            { label: "↩️ अनुभाग (DEO) को वापस करें", action: "AAO_RETURNED", grad: "linear-gradient(135deg,#f97316,#ef4444)" }
          ],
          SAO_RETURNED: [
            { label: "✅ SAO को पुनः भेजें", action: "PENDING_SAO", grad: "linear-gradient(135deg,#10b981,#0ea5e9)" },
            { label: "↩️ अनुभाग (DEO) को वापस करें", action: "AAO_RETURNED", grad: "linear-gradient(135deg,#f97316,#ef4444)" }
          ],
        },
        SAO: {
          PENDING_SAO: [
            { label: "✅ हिंदी प्रकोष्ठ को भेजें", action: "SAO_APPROVED", grad: "linear-gradient(135deg,#10b981,#0ea5e9)" },
            { label: "↩️ AAO को वापस करें", action: "SAO_RETURNED", grad: "linear-gradient(135deg,#f97316,#ef4444)" }
          ],
        },
        HINDI_CELL: {
          SAO_APPROVED: [
            { label: "🎉 अंतिम स्वीकृति दें", action: "SUBMITTED", grad: "linear-gradient(135deg,#f59e0b,#10b981)" },
            { label: "↩️ SAO को वापस करें", action: "SAO_RETURNED", grad: "linear-gradient(135deg,#dc2626,#9f1239)" }
          ],
        },
      };
      return map[profile.role]?.[selected.status] || [];
    })();

    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setSelected(null)} className="no-print" style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", marginBottom: "16px", fontSize: "15px", display: 'flex', alignItems: 'center', gap: '5px', padding: 0 }}>← वापस सूची में</button>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", margin: "0 0 6px 0" }}>{selected.section_name}</h2>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 600 }}>{selected.quarter} · {selected.year} · ID: {selected.ackId}</span>
            </div>
            <span style={{ background: st.bg, color: st.color, padding: "8px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", border: `1px solid ${st.color}40`, display: 'flex', alignItems: 'center', gap: '6px' }}>{st.icon} {st.label}</span>
          </div>

          <ReportDataView report={selected} />

          {actionBtns.length > 0 ? (
            <div className="no-print" style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #cbd5e1", marginTop: '16px' }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1e293b", margin: "0 0 12px 0" }}>⚡ कार्रवाई करें</h3>
              <textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="यहां कोई टिप्पणी लिखें (वैकल्पिक)..." style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "16px", outline: "none", fontFamily: "inherit", fontSize: "14px" }} rows={2} />
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {actionBtns.map(btn => (
                  <button key={btn.action} onClick={() => {
                    if (btn.action === 'EDIT') {
                      onEdit(selected);
                    } else {
                      handleActionClick(selected, btn.action);
                    }
                  }} style={{ flex: 1, padding: "14px", borderRadius: "10px", border: "none", background: btn.grad, color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "15px" }}>{btn.label}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-print" style={{ background: "#f1f5f9", padding: "16px", borderRadius: "10px", color: "#64748b", fontWeight: 600, textAlign: "center", marginTop: '16px', fontSize: "14px" }}>वर्तमान स्थिति में आपके लिए कोई कार्रवाई लंबित नहीं है।</div>
          )}
          <div className="no-print" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => onPrint(selected)} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#0ea5e9", color: "#fff", fontWeight: 700, cursor: "pointer" }}>🖨️ PDF प्रिंट करें</button>
          </div>
          <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>📜 ऑडिट ट्रेल</h3>
            {renderTimeline(selected.timeline)}
          </div>
        </div>
        {showCertModal && (
          <CertificateModal report={selected} onConfirm={handleCertConfirm} onCancel={() => { setShowCertModal(false); setPendingAction(null); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", margin: 0 }}>{profile.role === 'DEO' ? '📋 मेरी फाइलें' : '📥 इनबॉक्स'}</h2>
        {profile.role === 'DEO' && (
          <button onClick={() => setView('form')} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>+ नई रिपोर्ट</button>
        )}
      </div>
      {myReports.length === 0 ? (
        <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
          <p style={{ color: "#64748b", fontWeight: 600, margin: 0, fontSize: "16px" }}>कोई रिपोर्ट नहीं मिली।</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {myReports.map(rep => {
            const st = STATUS[rep.status] || { label: rep.status, bg: "#eee", color: "#333" };
            const needsAction = (() => {
              if (profile.role === 'DEO' && (rep.status === 'AAO_RETURNED' || rep.status === 'SAO_RETURNED')) return true;
              const map = {
                AAO: ['PENDING_AAO', 'SAO_RETURNED'],
                SAO: ['PENDING_SAO', 'AAO_RETURNED'],
                HINDI_CELL: ['SAO_APPROVED']
              };
              return map[profile.role]?.includes(rep.status) || false;
            })();
            return (
              <div key={rep.id} onClick={() => setSelected(rep)} style={{ background: "#fff", padding: "16px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#1e293b" }}>{rep.section_name}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px", fontWeight: 600 }}>{rep.quarter} · {rep.year}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {needsAction && <span style={{ background: "#ef4444", color: "#fff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 800 }}>कार्रवाई आवश्यक</span>}
                  <span style={{ background: st.bg, color: st.color, padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, border: `1px solid ${st.color}30` }}>{st.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};