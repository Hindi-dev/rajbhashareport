import React from 'react';
import { ROLES, ACTION_STATUSES, quarterLabel } from '../../constants/constants';
import { WorkflowPipeline } from './WorkflowPipeline';

export const RoleDashboard = ({ reports, user, setView, sections = [] }) => {
  const r = ROLES[user.role] || ROLES.DEO;
  const myReports = user.role === 'HINDI_CELL'
    ? reports
    : reports.filter(x => x.section_name === user.section_name);
  const pendingStatuses = ACTION_STATUSES[user.role] || [];
  const pendingForMe = myReports.filter(x => pendingStatuses.includes(x.status)).length;
  const approved = myReports.filter(x => x.status === "SUBMITTED").length;

  const stats = [
    { label: "कुल रिपोर्टें", value: myReports.length, icon: "📄", c: "#4f46e5" },
    { label: "लंबित", value: pendingForMe, icon: "⏳", c: "#d97706" },
    { label: "स्वीकृत", value: approved, icon: "✅", c: "#059669" },
  ];

  return (
    <div className="stack">
      {/* Prominent Developer Credit & Official Branding Hero Banner */}
      <section className="card" style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%)",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 10px 25px -5px rgba(30, 27, 75, 0.35)",
        padding: "18px 22px"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 12,
              background: "rgba(255, 255, 255, 0.16)",
              display: "grid", placeItems: "center", fontSize: 26,
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3)"
            }}>
              🏛️
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#a5b4fc", textTransform: "uppercase" }}>
                राजभाषा विभाग · गृह मंत्रालय (संशोधित प्रारूप अप्रैल 2025)
              </div>
              <h1 style={{ fontSize: 17, fontWeight: 800, margin: "2px 0 4px", color: "#ffffff", lineHeight: 1.2 }}>
                राजभाषा तिमाही प्रगति रिपोर्ट (QPR) पोर्टल
              </h1>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.85)", fontWeight: 500 }}>
                प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
              </div>
            </div>
          </div>

          <div style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: 10,
            padding: "8px 14px",
            maxWidth: 440
          }}>
            <div style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              अभिकल्पना एवं विकास (Designer & Developer Credit)
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f8fafc", marginTop: 2, lineHeight: 1.4 }}>
              Designed and Developed by: Bharat Bhushan, Senior Translation Officer (STO), Office of the Principal Director of Audit (PDA), Railway, Mumbai.
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head" style={{ background: r.grad }}>
          <h2 className="card-title" style={{ color: '#fff' }}>🔀 रिपोर्ट प्रवाह</h2>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>{r.icon} {r.label}</span>
        </div>
        <div className="card-body">
          <WorkflowPipeline currentRole={user.role} />
        </div>
      </section>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat" style={{ '--accent': s.c, '--accent-soft': `${s.c}1a` }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.c }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {pendingForMe > 0 && (
        <button type="button" onClick={() => setView("inbox")} className="detail-head"
          style={{ background: r.grad || r.color, border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 26, width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
              {user.role === "DEO" ? "✏️" : "📥"}
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>{pendingForMe} रिपोर्ट आपकी प्रतीक्षा में</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', marginTop: 2 }}>
                {user.role === "DEO" ? "वापस की गई रिपोर्ट सुधारें" : "आवक इनबॉक्स खोलें"}
              </div>
            </div>
          </div>
          <span style={{ fontSize: 20 }}>→</span>
        </button>
      )}

      {user.role === "HINDI_CELL" && sections.length > 0 && (
        <section className="card">
          <div className="card-head">
            <h2 className="card-title">📊 अनुभागों की रिपोर्ट जमा स्थिति</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {sections.map(sec => {
                const name = sec.section_name || sec;
                const latest = reports.find(rep => rep.section_name === name);
                const hasSubmitted = reports.some(rep => rep.section_name === name && rep.status === "SUBMITTED");
                const hasAny = Boolean(latest);
                return (
                  <div key={sec.id || name} style={{
                    padding: '9px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: hasSubmitted ? '#ecfdf5' : hasAny ? '#fffbeb' : '#fef2f2',
                    color: hasSubmitted ? '#047857' : hasAny ? '#b45309' : '#b91c1c',
                    border: `1.5px solid ${hasSubmitted ? '#a7f3d0' : hasAny ? '#fde68a' : '#fecaca'}`,
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}>
                    {name} {hasSubmitted ? "✅" : hasAny ? "⏳" : "—"}
                    {latest && <span style={{ fontWeight: 600, opacity: 0.75 }}>{quarterLabel(latest.quarter)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
