import React from 'react';
import { STATUS } from '../../constants/constants';

export const ReportDataView = ({ report }) => {
  if (!report) return <p>कोई डेटा उपलब्ध नहीं</p>;

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
    { label: 'कुल फाइलें (मंत्री)', value: report.b1_s1_total_files },
    { label: 'हिंदी में फाइलें (मंत्री)', value: report.b1_s1_hindi_files },
    { label: 'कुल बैठकें (सचिव)', value: report.b1_s2_total_meetings },
    { label: 'हिंदी में कार्यवाही', value: report.b1_s2_hindi_minutes },
    { label: 'कुल कागजात (सचिव)', value: report.b1_s2_total_docs },
    { label: 'हिंदी में कागजात', value: report.b1_s2_hindi_docs },
    { label: 'कुल दस्तावेज (धारा 3(3))', value: report.b1_s3_total_issued },
    { label: 'द्विभाषी', value: report.b1_s3_bilingual },
    { label: 'केवल अंग्रेजी', value: report.b1_s3_english_only },
    { label: 'केवल हिंदी', value: report.b1_s3_hindi_only },
    { label: 'कुल प्राप्त पत्र (हिंदी)', value: report.b1_s4_total_received },
    { label: 'उत्तर अपेक्षित नहीं', value: report.b1_s4_no_reply_needed },
    { label: 'हिंदी/द्विभाषी में उत्तर', value: report.b1_s4_hindi_reply },
    { label: 'अंग्रेजी में उत्तर', value: report.b1_s4_english_reply },
  ];

  const visibleFields = fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '');

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>📄 रिपोर्ट डेटा</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="report-data-table">
          <tbody>
            {visibleFields.map((f, idx) => (
              <tr key={idx}>
                <th style={{ width: '30%', background: '#f8fafc' }}>{f.label}</th>
                <td>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};