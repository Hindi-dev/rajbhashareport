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
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          📊 सभी अनुभागों की रिपोर्ट स्थिति ({currentQuarter} {currentYear})
        </h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleToggleAll} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}>
            {selectAll ? "सभी अचयनित करें" : "सभी चुनें"}
          </button>
          <button onClick={onConsolidate} disabled={selectedSections.length === 0} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: selectedSections.length === 0 ? "#94a3b8" : "#6366f1", color: "#fff", fontWeight: 700, cursor: selectedSections.length === 0 ? "not-allowed" : "pointer", fontSize: "14px" }}>
            📄 समेकित रिपोर्ट बनाएँ ({selectedSections.length})
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>चुनें</th>
              <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>अनुभाग</th>
              <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>रिपोर्ट स्थिति</th>
              <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>अंतिम अपडेट</th>
              <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>रिपोर्ट ID</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(sec => {
              const latest = getLatestReport(sec.section_name);
              const status = latest ? STATUS[latest.status] : null;
              const isSelected = selectedSections.includes(sec.id);
              return (
                <tr key={sec.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <input type="checkbox" checked={isSelected} onChange={() => handleToggle(sec.id)} disabled={!latest} style={{ width: 18, height: 18 }} />
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{sec.section_name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {status ? (
                      <span style={{ background: status.bg, color: status.color, padding: "4px 12px", borderRadius: "6px", fontWeight: 600, fontSize: "12px" }}>{status.icon} {status.label}</span>
                    ) : <span style={{ color: "#94a3b8" }}>रिपोर्ट नहीं</span>}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>{latest ? new Date(latest.updated_at).toLocaleDateString('hi-IN') : '-'}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px" }}>{latest ? latest.ackId : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};