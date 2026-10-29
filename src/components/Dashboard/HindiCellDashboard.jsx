import React, { useState } from 'react';
import { STATUS } from '../../constants/constants';
import { getCurrentQuarterYear } from '../../utils/helpers';

export const HindiCellDashboard = ({ reports, sections, onSelectSections, selectedSections, onConsolidate }) => {
  const [selectAll, setSelectAll] = useState(false);
  const { quarter: currentQuarter, year: currentYear } = getCurrentQuarterYear(reports);

  const handleToggleAll = () => {
    const allIds = sections.map(s => s.id);
    if (selectAll) {
      onSelectSections([]);
    } else {
      onSelectSections(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleToggle = (id) => {
    if (selectedSections.includes(id)) {
      onSelectSections(selectedSections.filter(s => s !== id));
    } else {
      onSelectSections([...selectedSections, id]);
    }
  };

  const getLatestReport = (sectionName) => {
    const sectionReports = reports.filter(r => r.section_name === sectionName && r.quarter === currentQuarter && r.year === currentYear);
    if (sectionReports.length === 0) return null;
    const sorted = sectionReports.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at));
    return sorted[0];
  };

  return (
    <div className="stack">
      <section className="card">
        <div className="card-head" style={{ background: 'linear-gradient(135deg,#d97706,#db2777)' }}>
          <div>
            <h2 className="card-title" style={{ color: '#fff' }}>📊 अनुभागों की रिपोर्ट स्थिति</h2>
            <p className="card-sub" style={{ color: 'rgba(255,255,255,0.8)' }}>{currentQuarter} · {currentYear}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-light btn-sm" onClick={handleToggleAll}>
              {selectAll ? "सभी अचयनित करें" : "सभी चुनें"}
            </button>
            <button type="button" className="btn btn-sm" onClick={onConsolidate} disabled={selectedSections.length === 0}
              style={{ background: '#fff', color: '#b45309' }}>
              📄 समेकित रिपोर्ट ({selectedSections.length})
            </button>
          </div>
        </div>

        <div className="tbl-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>चुनें</th>
                <th>अनुभाग</th>
                <th>रिपोर्ट स्थिति</th>
                <th>अंतिम अपडेट</th>
                <th>रिपोर्ट ID</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(sec => {
                const latest = getLatestReport(sec.section_name);
                const status = latest ? STATUS[latest.status] : null;
                const isSelected = selectedSections.includes(sec.id);
                return (
                  <tr key={sec.id}>
                    <td>
                      <input type="checkbox" checked={isSelected} onChange={() => handleToggle(sec.id)} disabled={!latest}
                        style={{ width: 17, height: 17, accentColor: '#4f46e5' }} />
                    </td>
                    <td className="cell-strong">{sec.section_name}</td>
                    <td>
                      {status ? (
                        <span className="badge" style={{ background: status.bg, color: status.color }}>{status.icon} {status.label}</span>
                      ) : <span style={{ color: 'var(--ink-3)' }}>रिपोर्ट नहीं</span>}
                    </td>
                    <td style={{ fontSize: 12.5 }}>{latest ? new Date(latest.updated_at).toLocaleDateString('hi-IN') : '-'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{latest ? latest.ackId : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
