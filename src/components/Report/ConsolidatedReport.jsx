import React, { useState, useEffect } from 'react';
import { getCurrentQuarterYear } from '../../utils/helpers';

export const ConsolidatedReport = ({ reports, selectedSections, sections, onBack }) => {
  const [consolidatedData, setConsolidatedData] = useState(null);
  const { quarter: currentQuarter, year: currentYear } = getCurrentQuarterYear(reports);

  useEffect(() => {
    const selectedReports = sections
      .filter(s => selectedSections.includes(s.id))
      .map(s => {
        const sectionReports = reports.filter(r => r.section_name === s.section_name && r.quarter === currentQuarter && r.year === currentYear);
        if (sectionReports.length === 0) return null;
        return sectionReports.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
      })
      .filter(r => r !== null);

    if (selectedReports.length === 0) {
      setConsolidatedData(null);
      return;
    }

    const sumFields = (fields) => {
      const result = {};
      fields.forEach(f => {
        result[f] = selectedReports.reduce((acc, r) => acc + (parseInt(r[f]) || 0), 0);
      });
      return result;
    };

    const numericFields = [
      'b1_s1_total_files', 'b1_s1_hindi_files',
      'b1_s2_total_meetings', 'b1_s2_hindi_minutes', 'b1_s2_total_docs', 'b1_s2_hindi_docs',
      'b1_s3_total_issued', 'b1_s3_bilingual', 'b1_s3_english_only', 'b1_s3_hindi_only',
      'b1_s4_total_received', 'b1_s4_no_reply_needed', 'b1_s4_hindi_reply', 'b1_s4_english_reply',
      'b1_s5_ka_total', 'b1_s5_ka_hindi_reply', 'b1_s5_ka_eng_reply', 'b1_s5_ka_no_reply',
      'b1_s5_kha_total', 'b1_s5_kha_hindi_reply', 'b1_s5_kha_eng_reply', 'b1_s5_kha_no_reply',
      'b1_s6_ka_total', 'b1_s6_ka_hindi', 'b1_s6_ka_english',
      'b1_s6_kha_total', 'b1_s6_kha_hindi', 'b1_s6_kha_english',
      'b1_s6_ga_total', 'b1_s6_ga_hindi', 'b1_s6_ga_english',
      'b1_s7_hindi_pages', 'b1_s7_eng_pages', 'b1_s7_total_pages', 'b1_s7_eoffice',
      'b1_s8_workshops', 'b1_s8_staff', 'b1_s8_officers',
      'b1_s9_sub_office_cmtes', 'b1_s9_sub_office_meetings',
    ];
    const sums = sumFields(numericFields);

    setConsolidatedData({
      sections: selectedReports.map(r => r.section_name),
      sums,
      totalReports: selectedReports.length,
      quarter: currentQuarter,
      year: currentYear
    });
  }, [reports, selectedSections, sections, currentQuarter, currentYear]);

  if (!consolidatedData) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>← वापस डैशबोर्ड</button>
        <p style={{ textAlign: "center", marginTop: "40px", color: "#64748b" }}>चयनित अनुभागों के लिए कोई रिपोर्ट उपलब्ध नहीं है।</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }} className="no-print">
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>← वापस डैशबोर्ड</button>
        <button onClick={() => window.print()} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: 700, cursor: "pointer" }}>🖨️ प्रिंट करें</button>
      </div>
      <div className="print-container" style={{ background: "#fff", borderRadius: "16px", padding: "32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 800, textAlign: "center", color: "#1e293b", margin: "0 0 8px" }}>🏛️ प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई</h1>
        <h2 style={{ textAlign: "center", color: "#4f46e5", marginBottom: "8px" }}>समेकित राजभाषा तिमाही प्रगति रिपोर्ट</h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: "24px" }}>तिमाही: {consolidatedData.quarter} · वर्ष: {consolidatedData.year}</p>
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
          <strong>चयनित अनुभाग: </strong>
          {consolidatedData.sections.join(', ')}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "left" }}>मद</th>
              <th style={{ padding: "10px", border: "1px solid #e2e8f0", textAlign: "right" }}>कुल</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(consolidatedData.sums).map(([key, value]) => {
              const labelMap = {
                'b1_s1_total_files': 'कुल भेजी गई फ़ाइलें',
                'b1_s1_hindi_files': 'हिंदी में भेजी गई फ़ाइलें',
                'b1_s2_total_meetings': 'कुल बैठकें',
                'b1_s2_hindi_minutes': 'हिंदी में कार्यवाही',
                'b1_s2_total_docs': 'कुल कागजात',
                'b1_s2_hindi_docs': 'हिंदी में कागजात',
                'b1_s3_total_issued': 'कुल जारी दस्तावेज',
                'b1_s3_bilingual': 'द्विभाषी',
                'b1_s3_english_only': 'केवल अंग्रेजी',
                'b1_s3_hindi_only': 'केवल हिंदी',
                'b1_s4_total_received': 'कुल प्राप्त पत्र',
                'b1_s4_no_reply_needed': 'उत्तर अपेक्षित नहीं',
                'b1_s4_hindi_reply': 'हिंदी/द्विभाषी में उत्तर',
                'b1_s4_english_reply': 'अंग्रेजी में उत्तर',
                'b1_s5_ka_total': "'क' क्षेत्र – कुल प्राप्त",
                'b1_s5_ka_hindi_reply': "'क' – हिंदी उत्तर",
                'b1_s5_ka_eng_reply': "'क' – अंग्रेजी उत्तर",
                'b1_s5_ka_no_reply': "'क' – उत्तर नहीं",
                'b1_s5_kha_total': "'ख' क्षेत्र – कुल प्राप्त",
                'b1_s5_kha_hindi_reply': "'ख' – हिंदी उत्तर",
                'b1_s5_kha_eng_reply': "'ख' – अंग्रेजी उत्तर",
                'b1_s5_kha_no_reply': "'ख' – उत्तर नहीं",
                'b1_s6_ka_total': "'क' – कुल भेजे",
                'b1_s6_ka_hindi': "'क' – हिंदी",
                'b1_s6_ka_english': "'क' – अंग्रेजी",
                'b1_s6_kha_total': "'ख' – कुल भेजे",
                'b1_s6_kha_hindi': "'ख' – हिंदी",
                'b1_s6_kha_english': "'ख' – अंग्रेजी",
                'b1_s6_ga_total': "'ग' – कुल भेजे",
                'b1_s6_ga_hindi': "'ग' – हिंदी",
                'b1_s6_ga_english': "'ग' – अंग्रेजी",
                'b1_s7_hindi_pages': 'हिंदी टिप्पणी पृष्ठ',
                'b1_s7_eng_pages': 'अंग्रेजी टिप्पणी पृष्ठ',
                'b1_s7_total_pages': 'कुल टिप्पणी पृष्ठ',
                'b1_s7_eoffice': 'ई-ऑफिस टिप्पणियाँ',
                'b1_s8_workshops': 'कार्यशालाएँ',
                'b1_s8_staff': 'प्रशिक्षित कर्मचारी',
                'b1_s8_officers': 'प्रशिक्षित अधिकारी',
                'b1_s9_sub_office_cmtes': 'अधीनस्थ समितियाँ',
                'b1_s9_sub_office_meetings': 'आयोजित बैठकें (अधीनस्थ)',
              };
              const label = labelMap[key] || key;
              return (
                <tr key={key}>
                  <td style={{ padding: "8px", border: "1px solid #e2e8f0" }}>{label}</td>
                  <td style={{ padding: "8px", border: "1px solid #e2e8f0", textAlign: "right", fontWeight: 600 }}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ marginTop: "24px", color: "#64748b", fontSize: "13px" }}>नोट: यह समेकित रिपोर्ट {consolidatedData.totalReports} अनुभागों के आंकड़ों का योग है।</p>
      </div>
    </div>
  );
};