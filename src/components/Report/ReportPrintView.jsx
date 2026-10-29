import React, { useEffect } from 'react';
import { STATUS } from '../../constants/constants';

export const ReportPrintView = ({ report, onClose }) => {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  if (!report) return <div className="empty">रिपोर्ट नहीं मिली</div>;

  const fields = [
    { label: 'अनुभाग', value: report.section_name },
    { label: 'क्षेत्र', value: report.region },
    { label: 'कार्यालय का पता', value: report.officeNameAddress },
    { label: 'फोन', value: report.officerPhone },
    { label: 'ईमेल', value: report.officerEmail },
    { label: 'वर्ष', value: report.year },
    { label: 'तिमाही', value: report.quarter },
    { label: 'रिपोर्ट ID', value: report.ackId },
    { label: 'स्थिति', value: STATUS[report.status]?.label || report.status },
  ];

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>✕ बंद करें</button>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>🖨️ प्रिंट करें</button>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="print-container">
            <h1 style={{ fontSize: 21, fontWeight: 800, textAlign: 'center', margin: '0 0 6px' }}>प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई</h1>
            <h2 style={{ fontSize: 16, fontWeight: 650, textAlign: 'center', color: 'var(--brand)', margin: '0 0 22px' }}>राजभाषा तिमाही प्रगति रिपोर्ट</h2>
            <table>
              <tbody>
                {fields.map((f, idx) => {
                  if (f.value === undefined || f.value === null || f.value === '') return null;
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, width: '40%', background: 'var(--surface-2)' }}>{f.label}</td>
                      <td>{f.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ marginTop: 18, fontSize: 12, color: 'var(--ink-3)' }}>रिपोर्ट जनरेट तिथि: {new Date().toLocaleString('hi-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
