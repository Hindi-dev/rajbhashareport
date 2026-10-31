import React, { useState } from 'react';
import { STATUS, QUARTERS, YEARS } from '../../constants/constants';

export const HindiCellReportsList = ({ reports = [], sections = [], onEdit, onDelete }) => {
  const [filters, setFilters] = useState({ section: '', status: '', quarter: '', year: '' });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredReports = reports.filter(r => {
    if (filters.section && (r.section_name || '').toLowerCase() !== filters.section.toLowerCase()) return false;
    if (filters.status && r.status !== filters.status) return false;
    if (filters.quarter && r.quarter !== filters.quarter) return false;
    if (filters.year && String(r.year) !== String(filters.year)) return false;
    return true;
  });

  const handleDelete = (id, sectionName) => {
    if (window.confirm(`क्या आप वाकई ${sectionName} की इस रिपोर्ट को हटाना चाहते हैं?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <div className="card-head">
          <h2 className="card-title">📋 सभी रिपोर्टें</h2>
          <span className="badge badge-soft">{filteredReports.length} रिपोर्टें</span>
        </div>

        <div className="card-body" style={{ paddingBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
            <select className="select" value={filters.section} onChange={e => handleFilterChange('section', e.target.value)}>
              <option value="">सभी अनुभाग</option>
              {sections.map(s => <option key={s.id} value={s.section_name}>{s.section_name}</option>)}
            </select>
            <select className="select" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
              <option value="">सभी स्थितियाँ</option>
              {Object.keys(STATUS).map(key => <option key={key} value={key}>{STATUS[key].label}</option>)}
            </select>
            <select className="select" value={filters.quarter} onChange={e => handleFilterChange('quarter', e.target.value)}>
              <option value="">सभी तिमाहियाँ</option>
              {QUARTERS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
            </select>
            <select className="select" value={filters.year} onChange={e => handleFilterChange('year', e.target.value)}>
              <option value="">सभी वर्ष</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}
            onClick={() => setFilters({ section: '', status: '', quarter: '', year: '' })}>
            फ़िल्टर रीसेट करें
          </button>
        </div>
      </section>

      <section className="card">
        {filteredReports.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🗂️</div>
            <div className="empty-text">कोई रिपोर्ट नहीं मिली।</div>
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>अनुभाग</th>
                  <th>तिमाही</th>
                  <th>वर्ष</th>
                  <th>स्थिति</th>
                  <th>अंतिम अपडेट</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((rep, idx) => {
                  const st = STATUS[rep.status] || { label: rep.status, bg: "#eee", color: "#333" };
                  return (
                    <tr key={rep.id || rep.ackId || idx}>
                      <td className="cell-strong">{rep.section_name}</td>
                      <td>{rep.quarter}</td>
                      <td>{rep.year}</td>
                      <td><span className="badge" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                      <td style={{ fontSize: 12.5 }}>{rep.updated_at ? new Date(rep.updated_at).toLocaleString('hi-IN') : '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button type="button" className="btn btn-soft btn-sm" onClick={() => onEdit(rep)}>✏️ एडिट</button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(rep.id, rep.section_name)}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
