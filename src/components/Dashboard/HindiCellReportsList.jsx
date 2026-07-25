import React, { useState } from 'react';
import { STATUS, QUARTERS, YEARS } from '../../constants/constants';

export const HindiCellReportsList = ({ reports, sections, onEdit, onDelete }) => {
  const [filters, setFilters] = useState({ section: '', status: '', quarter: '', year: '' });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredReports = reports.filter(r => {
    if (filters.section && r.section_name.toLowerCase() !== filters.section.toLowerCase()) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.quarter && r.quarter !== filters.quarter) return false;
    if (filters.year && r.year !== filters.year) return false;
    return true;
  });

  const handleDelete = (id, sectionName) => {
    if (window.confirm(`क्या आप वाकई ${sectionName} की इस रिपोर्ट को हटाना चाहते हैं?`)) {
      onDelete(id);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", marginBottom: "20px" }}>📋 सभी रिपोर्टें (संपादन/हटाने हेतु)</h2>
      <div className="filter-bar">
        <select value={filters.section} onChange={e => handleFilterChange('section', e.target.value)}>
          <option value="">सभी अनुभाग</option>
          {sections.map(s => <option key={s.id} value={s.section_name}>{s.section_name}</option>)}
        </select>
        <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
          <option value="">सभी स्थितियाँ</option>
          {Object.keys(STATUS).map(key => <option key={key} value={key}>{STATUS[key].label}</option>)}
        </select>
        <select value={filters.quarter} onChange={e => handleFilterChange('quarter', e.target.value)}>
          <option value="">सभी तिमाहियाँ</option>
          {QUARTERS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
        </select>
        <select value={filters.year} onChange={e => handleFilterChange('year', e.target.value)}>
          <option value="">सभी वर्ष</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={() => setFilters({ section: '', status: '', quarter: '', year: '' })} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: 600, cursor: "pointer" }}>
          फ़िल्टर रीसेट करें
        </button>
      </div>
      {filteredReports.length === 0 ? (
        <p style={{ color: "#64748b", textAlign: "center" }}>कोई रिपोर्ट नहीं मिली।</p>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>अनुभाग</th>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>तिमाही</th>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>वर्ष</th>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>स्थिति</th>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>अंतिम अपडेट</th>
                <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(rep => {
                const st = STATUS[rep.status] || { label: rep.status, bg: "#eee", color: "#333" };
                return (
                  <tr key={rep.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{rep.section_name}</td>
                    <td style={{ padding: "12px 16px" }}>{rep.quarter}</td>
                    <td style={{ padding: "12px 16px" }}>{rep.year}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: st.bg, color: st.color, padding: "4px 12px", borderRadius: "6px", fontWeight: 600, fontSize: "12px" }}>{st.label}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>{new Date(rep.updated_at).toLocaleString('hi-IN')}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => onEdit(rep)} style={{ background: "#6366f1", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: 600, fontSize: "12px", cursor: "pointer", marginRight: "8px" }}>✏️ संपादित करें</button>
                      <button onClick={() => handleDelete(rep.id, rep.section_name)} style={{ background: "#dc2626", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: 600, fontSize: "12px", cursor: "pointer" }}>🗑️ हटाएँ</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};