import React, { useState } from 'react';
import { quarterLabel } from '../../constants/constants';
import { supabase } from '../../supabaseClient';
import { useToast } from '../Common/Toast';

export const MasterControl = ({ reports = [], onEdit, onRefetch }) => {
  const [search, setSearch] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  const { addToast } = useToast();

  const query = search.trim().toLowerCase();
  const filteredReports = reports.filter(r =>
    !query ||
    (r.section_name || '').toLowerCase().includes(query) ||
    String(r.year || '').includes(query) ||
    (r.ackId || '').toLowerCase().includes(query)
  );

  const handleResetAll = async () => {
    const pass = window.prompt("⚠️ सभी रिपोर्टें हमेशा के लिए मिटाने हेतु 'RESET' टाइप करें:");
    if (pass !== 'RESET') return;
    setIsClearing(true);
    try {
      const { error } = await supabase.from('reports').delete().neq('status', 'SETTINGS');
      if (error) throw error;
      addToast?.("सभी रिपोर्टें मिटा दी गईं", "success");
      onRefetch?.();
    } catch (err) {
      console.error("Reset error:", err);
      addToast?.(err.message || "डेटा मिटाने में त्रुटि", "error");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="stack" style={{ maxWidth: 860, margin: '0 auto' }}>
      <section className="card">
        <div className="card-head">
          <div>
            <h2 className="card-title">✏️ मास्टर रिपोर्ट एडिटर</h2>
            <p className="card-sub">सभी अनुभागों की रिपोर्ट को एडिट करें</p>
          </div>
          <span className="badge badge-soft">{filteredReports.length} रिपोर्टें</span>
        </div>
        <div className="card-body">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="अनुभाग, वर्ष या पावती संख्या खोजें..."
            className="input" style={{ marginBottom: 16 }} />

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
                {filteredReports.map(r => (
                  <tr key={r.id}>
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
