import React, { useEffect } from 'react';
import { STATUS } from '../../constants/constants';

export const ReportPrintView = ({ report, onClose }) => {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  if (!report) return <div>रिपोर्ट नहीं मिली</div>;

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
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }} className="no-print">
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>✕ बंद करें</button>
        <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>🖨️ प्रिंट करें</button>
      </div>
      <div className="print-container">
        <h1 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', marginBottom: '4px' }}>प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई</h1>
        <h2 style={{ fontSize: '18px', fontWeight: 600, textAlign: 'center', color: '#4f46e5', marginBottom: '20px' }}>राजभाषा तिमाही प्रगति रिपोर्ट</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <tbody>
            {fields.map((f, idx) => {
              if (f.value === undefined || f.value === null || f.value === '') return null;
              return (
                <tr key={idx}>
                  <td style={{ padding: '4px 8px', border: '1px solid #ccc', fontWeight: 600, width: '40%' }}>{f.label}</td>
                  <td style={{ padding: '4px 8px', border: '1px solid #ccc' }}>{f.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>रिपोर्ट जनरेट तिथि: {new Date().toLocaleString('hi-IN')}</p>
      </div>
    </div>
  );
};