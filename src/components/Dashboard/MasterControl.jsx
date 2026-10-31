import React, { useState } from 'react';
import { quarterLabel } from '../../constants/constants';
import { supabase } from '../../supabaseClient';
import { useToast } from '../Common/Toast';

export const MasterControl = ({
  reports = [],
  sections = [],
  onAddSection,
  onDeleteSection,
  onEdit,
  onRefetch
}) => {
  const [search, setSearch] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const { addToast } = useToast();

  const query = search.trim().toLowerCase();
  const filteredReports = reports.filter(r =>
    !query ||
    (r.section_name || '').toLowerCase().includes(query) ||
    String(r.year || '').includes(query) ||
    (r.ackId || '').toLowerCase().includes(query)
  );

  const handleAddSection = async (e) => {
    e.preventDefault();
    const name = newSectionName.trim();
    if (!name) return;

    setIsAddingSection(true);
    try {
      if (onAddSection) {
        await onAddSection(name);
        addToast?.(`नया अनुभाग '${name}' सफलतापूर्वक जोड़ा गया!`, "success");
        setNewSectionName('');
      }
    } catch (err) {
      addToast?.(err.message || "अनुभाग जोड़ने में त्रुटि हुई।", "error");
    } finally {
      setIsAddingSection(false);
    }
  };

  const handleDeleteSection = async (sec) => {
    const reportCount = reports.filter(r => r.section_name === sec.section_name).length;
    if (reportCount > 0) {
      alert(`अनुभाग '${sec.section_name}' को हटाया नहीं जा सकता क्योंकि इसमें ${reportCount} रिपोर्टें दर्ज हैं।`);
      return;
    }
    if (!window.confirm(`क्या आप वाकई '${sec.section_name}' अनुभाग को हटाना चाहते हैं?`)) {
      return;
    }

    try {
      if (onDeleteSection) {
        await onDeleteSection(sec.id);
        addToast?.(`अनुभाग '${sec.section_name}' हटा दिया गया`, "success");
      }
    } catch (err) {
      addToast?.(err.message || "हटाने में त्रुटि", "error");
    }
  };

  const handleResetAll = async () => {
    const pass = window.prompt("⚠️ सभी रिपोर्टें हमेशा के लिए मिटाने हेतु 'RESET' टाइप करें:");
    if (pass !== 'RESET') return;
    setIsClearing(true);
    try {
      try {
        await supabase.from('reports').delete().neq('status', 'SETTINGS');
      } catch (e) {
        console.warn("Supabase delete error:", e);
      }
      try {
        const stored = JSON.parse(localStorage.getItem('rajbhasha_reports_cache') || '[]');
        const ids = stored.map(r => r.id).filter(Boolean);
        const acks = stored.map(r => r.ackId || r.ack_id || r.ackid).filter(Boolean);
        const existingDeleted = JSON.parse(localStorage.getItem('rajbhasha_deleted_report_ids') || '[]');
        const combined = Array.from(new Set([
          ...existingDeleted,
          ...ids,
          ...acks,
          'a0000001-0001-4000-8000-000000000001',
          'a0000002-0002-4000-8000-000000000002',
          'a0000003-0003-4000-8000-000000000003',
          'RAJ-2026-ADM',
          'RAJ-2026-ACC',
          'RAJ-2026-EST'
        ]));
        localStorage.setItem('rajbhasha_deleted_report_ids', JSON.stringify(combined));
      } catch (e) {}
      localStorage.setItem('rajbhasha_reports_cache', JSON.stringify([]));
      addToast?.("सभी रिपोर्टें हमेशा के लिए मिटा दी गईं", "success");
      onRefetch?.();
    } catch (err) {
      console.error("Reset error:", err);
      localStorage.setItem('rajbhasha_reports_cache', JSON.stringify([]));
      addToast?.(err.message || "डेटा मिटाने में त्रुटि", "error");
      onRefetch?.();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* ── Section Master Management Card ── */}
      <section className="card">
        <div className="card-head" style={{ background: 'linear-gradient(135deg,#0284c7,#4f46e5)' }}>
          <div>
            <h2 className="card-title" style={{ color: '#fff' }}>🏛️ अनुभाग प्रबंधन (Section Master)</h2>
            <p className="card-sub" style={{ color: 'rgba(255,255,255,0.85)' }}>
              नया अनुभाग जोड़ें अथवा मौजूदा अनुभागों की सूची देखें ताकि उनसे QPR रिपोर्ट प्राप्त की जा सके
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff' }}>
            {sections.length} अनुभाग
          </span>
        </div>

        <div className="card-body">
          {/* Add Section Input Form */}
          <form onSubmit={handleAddSection} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <input
              type="text"
              className="input"
              placeholder="नया अनुभाग नाम लिखें (उदा. सामग्री प्रबंधन अनुभाग, वाणिज्य अनुभाग)..."
              value={newSectionName}
              onChange={e => setNewSectionName(e.target.value)}
              style={{ flex: 1, minWidth: 260 }}
              disabled={isAddingSection}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAddingSection || !newSectionName.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              {isAddingSection ? "जोड़ा जा रहा..." : "➕ नया अनुभाग जोड़ें"}
            </button>
          </form>

          {/* List of active sections */}
          <div className="tbl-wrap" style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 14 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>क्र.सं.</th>
                  <th>अनुभाग का नाम</th>
                  <th>दर्ज रिपोर्टें</th>
                  <th style={{ textAlign: 'center', width: 90 }}>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec, idx) => {
                  const repCount = reports.filter(r => r.section_name === sec.section_name).length;
                  return (
                    <tr key={sec.id || idx}>
                      <td>{idx + 1}</td>
                      <td className="cell-strong">
                        <span style={{ marginRight: 8 }}>🏢</span>
                        {sec.section_name}
                      </td>
                      <td>
                        {repCount > 0 ? (
                          <span className="badge" style={{ background: '#ecfdf5', color: '#047857' }}>
                            {repCount} रिपोर्ट
                          </span>
                        ) : (
                          <span style={{ color: 'var(--ink-3)', fontSize: 12 }}>कोई रिपोर्ट नहीं</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {repCount === 0 ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleDeleteSection(sec)}
                            title="अनुभाग हटाएं"
                            style={{ color: '#dc2626' }}
                          >
                            🗑️
                          </button>
                        ) : (
                          <span title="रिपोर्ट मौजूद होने के कारण हटाया नहीं जा सकता" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                            🔒
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Master Report Editor Card ── */}
      <section className="card">
        <div className="card-head">
          <div>
            <h2 className="card-title">✏️ मास्टर रिपोर्ट एडिटर</h2>
            <p className="card-sub">सभी अनुभागों की रिपोर्ट को एडिट करें</p>
          </div>
          <span className="badge badge-soft">{filteredReports.length} रिपोर्टें</span>
        </div>
        <div className="card-body">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="अनुभाग, वर्ष या पावती संख्या खोजें..."
            className="input"
            style={{ marginBottom: 16 }}
          />

          <div className="tbl-wrap" style={{ maxHeight: 340, overflowY: 'auto', border: '1px solid var(--line)', borderRadius: 14 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>अनुभाग</th>
                  <th>तिमाही/वर्ष</th>
                  <th style={{ textAlign: 'center' }}>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r, idx) => (
                  <tr key={r.id || r.ackId || idx}>
                    <td className="cell-strong">{r.section_name}</td>
                    <td>{quarterLabel(r.quarter)} · {r.year}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button type="button" className="btn btn-soft btn-sm" onClick={() => onEdit?.(r)}>✏️ एडिट</button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--ink-3)', padding: 22 }}>कोई रिपोर्ट नहीं</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Danger Zone Card ── */}
      <section className="card" style={{ border: '1.5px solid #fecaca' }}>
        <div className="card-head" style={{ background: 'linear-gradient(135deg,#fef2f2,#fee2e2)', borderBottom: '1px solid #fecaca' }}>
          <div>
            <h2 className="card-title" style={{ color: '#991b1b' }}>⚠️ डेंजर ज़ोन</h2>
            <p className="card-sub" style={{ color: '#b91c1c' }}>सभी रिपोर्टें हमेशा के लिए डिलीट करें। यह कार्रवाई वापस नहीं हो सकती।</p>
          </div>
        </div>
        <div className="card-body">
          <button type="button" className="btn btn-danger" onClick={handleResetAll} disabled={isClearing}>
            🗑️ {isClearing ? "डेटा मिटाया जा रहा..." : "रीसेट करें"}
          </button>
        </div>
      </section>
    </div>
  );
};
