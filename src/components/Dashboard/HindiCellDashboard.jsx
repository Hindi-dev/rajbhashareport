import React, { useState } from 'react';
import { STATUS } from '../../constants/constants';
import { getCurrentQuarterYear } from '../../utils/helpers';
import { useToast } from '../Common/Toast';

export const HindiCellDashboard = ({
  reports = [],
  sections = [],
  onAddSection,
  onSelectSections,
  selectedSections = [],
  onConsolidate
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSecName, setNewSecName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { quarter: currentQuarter, year: currentYear } = getCurrentQuarterYear(reports);
  const { addToast } = useToast();

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
    const sectionReports = reports.filter(r =>
      (r.section_name || '').trim() === (sectionName || '').trim() &&
      r.quarter === currentQuarter &&
      String(r.year) === String(currentYear)
    );
    if (sectionReports.length === 0) return null;
    const sorted = [...sectionReports].sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
    return sorted[0];
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    const name = newSecName.trim();
    if (!name) return;

    setIsAdding(true);
    try {
      if (onAddSection) {
        await onAddSection(name);
        addToast?.(`नया अनुभाग '${name}' जोड़ा गया! अब इस अनुभाग से रिपोर्ट ली जा सकती है।`, "success");
        setNewSecName('');
        setShowAddForm(false);
      }
    } catch (err) {
      addToast?.(err.message || "त्रुटि हुई।", "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <div className="card-head" style={{ background: 'linear-gradient(135deg,#d97706,#db2777)' }}>
          <div>
            <h2 className="card-title" style={{ color: '#fff' }}>📊 अनुभागों की रिपोर्ट स्थिति</h2>
            <p className="card-sub" style={{ color: 'rgba(255,255,255,0.85)' }}>{currentQuarter} · {currentYear} ({sections.length} अनुभाग पंजीकृत)</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setShowAddForm(v => !v)}
              style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}
            >
              {showAddForm ? "✕ बंद करें" : "➕ नया अनुभाग जोड़ें"}
            </button>
            <button type="button" className="btn btn-light btn-sm" onClick={handleToggleAll}>
              {selectAll ? "सभी अचयनित करें" : "सभी चुनें"}
            </button>
            <button type="button" className="btn btn-sm" onClick={onConsolidate} disabled={selectedSections.length === 0}
              style={{ background: '#fff', color: '#b45309', fontWeight: 700 }}>
              📄 समेकित रिपोर्ट ({selectedSections.length})
            </button>
          </div>
        </div>

        {/* Quick Add Section Collapsible Banner */}
        {showAddForm && (
          <div style={{
            background: '#fffbeb', borderBottom: '1px solid #fde68a',
            padding: '16px 20px', animation: 'slide-up 0.3s ease'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#92400e' }}>
              🏛️ नया अनुभाग जोड़ें
            </h3>
            <p style={{ margin: '0 0 12px', fontSize: 12.5, color: '#78350f' }}>
              नया अनुभाग जोड़ने के उपरांत वह तत्काल इस तालिका में दिखाई देगा और उससे रिपोर्ट जमा कराई जा सकेगी।
            </p>
            <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                type="text"
                className="input"
                placeholder="उदा. सामग्री प्रबंधन अनुभाग, वाणिज्य अनुभाग, आदि..."
                value={newSecName}
                onChange={e => setNewSecName(e.target.value)}
                style={{ flex: 1, minWidth: 260, background: '#fff' }}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAdding || !newSecName.trim()}
              >
                {isAdding ? "जोड़ा जा रहा..." : "✅ सुरक्षित करें"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setShowAddForm(false); setNewSecName(''); }}
              >
                रद्द करें
              </button>
            </form>
          </div>
        )}

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
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggle(sec.id)}
                        disabled={!latest}
                        style={{ width: 17, height: 17, accentColor: '#4f46e5', cursor: latest ? 'pointer' : 'not-allowed' }}
                      />
                    </td>
                    <td className="cell-strong">
                      <span style={{ marginRight: 6 }}>🏢</span>
                      {sec.section_name}
                    </td>
                    <td>
                      {status ? (
                        <span className="badge" style={{ background: status.bg, color: status.color }}>
                          {status.icon} {status.label}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--ink-3)', fontSize: 12.5, fontWeight: 600 }}>
                          ⏳ रिपोर्ट प्रतीक्षित
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5 }}>{latest?.updated_at ? new Date(latest.updated_at).toLocaleDateString('hi-IN') : '-'}</td>
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
