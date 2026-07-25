import React, { useEffect } from 'react';
import { STATUS } from '../../constants/constants';

export const ReportPrintView = ({ report, onClose }) => {
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  if (!report) return <div>रिपोर्ट नहीं मिली</div>;

  // Helper to render a field only if it has a value
  const renderField = (label, value) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <tr>
        <td style={{ padding: '6px 10px', border: '1px solid #ccc', fontWeight: '600', width: '40%' }}>{label}</td>
        <td style={{ padding: '6px 10px', border: '1px solid #ccc' }}>{value}</td>
      </tr>
    );
  };

  // Section helpers
  const renderSectionHeader = (title) => (
    <tr>
      <td colSpan="2" style={{ padding: '8px 10px', background: '#f1f5f9', fontWeight: '700', fontSize: '16px', border: '1px solid #ccc' }}>
        {title}
      </td>
    </tr>
  );

  // Main data fields
  const officeFields = [
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

  // Part-1 fields (sections 1-11)
  const part1Fields = [
    // 1. Minister files
    { label: '1.1 कुल भेजी गई फ़ाइलें (मंत्री)', value: report.b1_s1_total_files },
    { label: '1.2 हिंदी में भेजी गईं', value: report.b1_s1_hindi_files },
    // 2. Secretary meetings
    { label: '2.1 कुल बैठकें (सचिव)', value: report.b1_s2_total_meetings },
    { label: '2.2 हिंदी में कार्यवाही/कार्यवृत्त', value: report.b1_s2_hindi_minutes },
    { label: '2.3 सीधे जारी कुल कागजात', value: report.b1_s2_total_docs },
    { label: '2.4 हिंदी में जारी कागजात', value: report.b1_s2_hindi_docs },
    // 3. Section 3(3) documents
    { label: '3.1 कुल जारी दस्तावेज', value: report.b1_s3_total_issued },
    { label: '3.2 द्विभाषी रूप में', value: report.b1_s3_bilingual },
    { label: '3.3 केवल अंग्रेजी में', value: report.b1_s3_english_only },
    { label: '3.4 केवल हिंदी में', value: report.b1_s3_hindi_only },
    // 4. Letters received in Hindi
    { label: '4.1 कुल प्राप्त पत्र (हिंदी)', value: report.b1_s4_total_received },
    { label: '4.2 उत्तर अपेक्षित नहीं', value: report.b1_s4_no_reply_needed },
    { label: '4.3 हिंदी/द्विभाषी में उत्तर', value: report.b1_s4_hindi_reply },
    { label: '4.4 अंग्रेजी में उत्तर', value: report.b1_s4_english_reply },
    // 5. Replies to English letters (region wise)
    { label: "5.1 'क' क्षेत्र – कुल प्राप्त", value: report.b1_s5_ka_total },
    { label: "5.2 'क' – हिंदी उत्तर", value: report.b1_s5_ka_hindi_reply },
    { label: "5.3 'क' – अंग्रेजी उत्तर", value: report.b1_s5_ka_eng_reply },
    { label: "5.4 'क' – उत्तर नहीं", value: report.b1_s5_ka_no_reply },
    { label: "5.5 'ख' क्षेत्र – कुल प्राप्त", value: report.b1_s5_kha_total },
    { label: "5.6 'ख' – हिंदी उत्तर", value: report.b1_s5_kha_hindi_reply },
    { label: "5.7 'ख' – अंग्रेजी उत्तर", value: report.b1_s5_kha_eng_reply },
    { label: "5.8 'ख' – उत्तर नहीं", value: report.b1_s5_kha_no_reply },
    // 6. Original correspondence sent
    { label: "6.1 'क' – कुल भेजे", value: report.b1_s6_ka_total },
    { label: "6.2 'क' – हिंदी", value: report.b1_s6_ka_hindi },
    { label: "6.3 'क' – अंग्रेजी", value: report.b1_s6_ka_english },
    { label: "6.4 'ख' – कुल भेजे", value: report.b1_s6_kha_total },
    { label: "6.5 'ख' – हिंदी", value: report.b1_s6_kha_hindi },
    { label: "6.6 'ख' – अंग्रेजी", value: report.b1_s6_kha_english },
    { label: "6.7 'ग' – कुल भेजे", value: report.b1_s6_ga_total },
    { label: "6.8 'ग' – हिंदी", value: report.b1_s6_ga_hindi },
    { label: "6.9 'ग' – अंग्रेजी", value: report.b1_s6_ga_english },
    // 7. Note pages
    { label: '7.1 हिंदी टिप्पणी पृष्ठ', value: report.b1_s7_hindi_pages },
    { label: '7.2 अंग्रेजी टिप्पणी पृष्ठ', value: report.b1_s7_eng_pages },
    { label: '7.3 कुल टिप्पणी पृष्ठ', value: report.b1_s7_total_pages },
    { label: '7.4 ई-ऑफिस टिप्पणियाँ', value: report.b1_s7_eoffice },
    // 8. Workshops
    { label: '8.1 आयोजित कार्यशालाएँ', value: report.b1_s8_workshops },
    { label: '8.2 प्रशिक्षित कर्मचारी', value: report.b1_s8_staff },
    { label: '8.3 प्रशिक्षित अधिकारी', value: report.b1_s8_officers },
    // 9. Committee meetings
    { label: '9.1 बैठक तिथि (समिति)', value: report.b1_s9_meeting_date },
    { label: '9.2 अधीनस्थ समितियाँ', value: report.b1_s9_sub_office_cmtes },
    { label: '9.3 आयोजित बैठकें (अधीनस्थ)', value: report.b1_s9_sub_office_meetings },
    { label: '9.4 कार्यसूची हिंदी में?', value: report.b1_s9_agenda_hindi },
    // 10. Hindi advisory committee
    { label: '10. बैठक तिथि (सलाहकार)', value: report.b1_s10_meeting_date },
    // 11. Notable work
    { label: '11.1 नवोन्मेषी कार्य', value: report.b1_s11_innovation },
    { label: '11.2 विशिष्ट आयोजन', value: report.b1_s11_special },
    { label: '11.3 अन्य आयोजन', value: report.b1_s11_other },
  ];

  // Part-2 fields (only if applicable)
  const part2Fields = [
    { label: 'अधिसूचित (नियम 10(4))', value: report.b2_s1_notified },
    { label: 'अधीनस्थ कुल कार्यालय', value: report.b2_s1_sub_total },
    { label: 'अधिसूचित अधीनस्थ', value: report.b2_s1_sub_notified },
    { label: 'शेष हेतु कार्रवाई', value: report.b2_s1_sub_action },
    // ... include all other part2 fields as needed (similar to earlier)
  ];

  // Certificate fields (if present)
  const certFields = [
    { label: 'प्रमाण-पत्र – नाम', value: report.b1_cert_name },
    { label: 'प्रमाण-पत्र – पदनाम', value: report.b1_cert_desig },
    { label: 'प्रमाण-पत्र – फोन', value: report.b1_cert_phone },
    { label: 'प्रमाण-पत्र – तिथि', value: report.b1_cert_date },
    { label: 'प्रमाण-पत्र – स्थान', value: report.b1_cert_place },
    { label: 'प्रमाण-पत्र – सहमति', value: report.b1_cert_agreed ? '✅ हाँ' : '❌ नहीं' },
  ];

  // Determine if Part-II should be shown (Q4 and Hindi Cell)
  const isPart2 = report.quarter === 'Q4' && report.b2_s1_notified !== undefined;

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }} className="no-print">
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontWeight: 700, cursor: 'pointer' }}>✕ बंद करें</button>
        <button onClick={() => window.print()} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>🖨️ प्रिंट करें</button>
      </div>

      <div className="print-container" style={{ background: '#fff', padding: '20px', borderRadius: '8px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '4px' }}>
          प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
        </h1>
        <h2 style={{ fontSize: '20px', fontWeight: 600, textAlign: 'center', color: '#4f46e5', marginBottom: '20px' }}>
          राजभाषा तिमाही प्रगति रिपोर्ट
        </h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
          <tbody>
            {/* Office Details Section */}
            {renderSectionHeader('अनुभाग विवरण')}
            {officeFields.map((f, idx) => renderField(f.label, f.value)).filter(Boolean)}

            {/* Part-I Header */}
            {renderSectionHeader('भाग-I (प्रत्येक तिमाही की समाप्ति पर भरा जाए)')}

            {/* 1 & 2 */}
            {renderSectionHeader('1. माननीय मंत्री जी को भेजी गईं फ़ाइलें')}
            {part1Fields.slice(0, 2).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {renderSectionHeader('2. सचिव/समकक्ष स्तर पर बैठकें/फाइलें')}
            {part1Fields.slice(2, 6).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 3 */}
            {renderSectionHeader('3. धारा 3 (3) के अंतर्गत जारी दस्तावेज')}
            {part1Fields.slice(6, 10).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 4 */}
            {renderSectionHeader('4. हिंदी में प्राप्त पत्र (राजभाषा नियम-5)')}
            {part1Fields.slice(10, 14).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 5 */}
            {renderSectionHeader('5. अंग्रेजी पत्रों के उत्तर हिंदी में')}
            {part1Fields.slice(14, 22).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 6 */}
            {renderSectionHeader('6. मूल रूप से भेजे गये पत्रों का ब्यौरा')}
            {part1Fields.slice(22, 31).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 7 */}
            {renderSectionHeader('7. टिप्पण लेखन का ब्यौरा')}
            {part1Fields.slice(31, 35).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 8 & 9 */}
            {renderSectionHeader('8. हिंदी कार्यशालाएँ')}
            {part1Fields.slice(35, 38).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {renderSectionHeader('9. राजभाषा कार्यान्वयन समिति')}
            {part1Fields.slice(38, 42).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 10 */}
            {renderSectionHeader('10. हिंदी सलाहकार समिति')}
            {part1Fields.slice(42, 43).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* 11 */}
            {renderSectionHeader('11. उल्लेखनीय कार्य / उपलब्धियाँ')}
            {part1Fields.slice(43, 46).map(f => renderField(f.label, f.value)).filter(Boolean)}

            {/* Certificate (if exists) */}
            {certFields.some(f => f.value) && (
              <>
                {renderSectionHeader('प्रमाण-पत्र (भाग-I)')}
                {certFields.map(f => renderField(f.label, f.value)).filter(Boolean)}
              </>
            )}

            {/* Part-II (if applicable) */}
            {isPart2 && (
              <>
                {renderSectionHeader('भाग-II (केवल 31 मार्च को समाप्त तिमाही रिपोर्ट के साथ)')}
                {part2Fields.map(f => renderField(f.label, f.value)).filter(Boolean)}
              </>
            )}
          </tbody>
        </table>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b' }}>
          रिपोर्ट जनरेट तिथि: {new Date().toLocaleString('hi-IN')}
        </p>
      </div>
    </div>
  );
};