import React from 'react';
import { STATUS } from '../../constants/constants';

export const ReportDataView = ({ report }) => {
  if (!report) return <p style={{ color: 'var(--ink-3)' }}>कोई डेटा उपलब्ध नहीं</p>;

  return (
    <div className="report-data-view" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Basic Info */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          🏢 कार्यालय विवरण एवं सामान्य जानकारी
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, fontSize: 13 }}>
          <div><strong>अनुभाग:</strong> {report.section_name}</div>
          <div><strong>क्षेत्र:</strong> {report.region}</div>
          <div><strong>वित्तीय वर्ष / तिमाही:</strong> {report.year} · {report.quarter}</div>
          <div><strong>पावती सं. (Ack ID):</strong> {report.ackId}</div>
          <div><strong>कार्यालय का पता:</strong> {report.officeNameAddress}</div>
          <div><strong>दूरभाष:</strong> {report.officerPhone}</div>
          <div><strong>ईमेल:</strong> {report.officerEmail}</div>
          <div><strong>वर्तमान स्थिति:</strong> {STATUS[report.status]?.label || report.status}</div>
        </div>
      </div>

      {/* Part 1: Section 3(3) Compliance */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          📄 भाग 1: धारा 3(3) का अनुपालन
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13 }}>
          <div><strong>कुल जारी दस्तावेज:</strong> {report.b1_s3_total_issued || '0'}</div>
          <div><strong>द्विभाषी जारी:</strong> {report.b1_s3_bilingual || '0'}</div>
          <div><strong>केवल अंग्रेजी में:</strong> {report.b1_s3_english_only || '0'}</div>
          <div><strong>केवल हिंदी में:</strong> {report.b1_s3_hindi_only || '0'}</div>
        </div>
      </div>

      {/* Part 2: Rule 5 Compliance */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          📬 भाग 2: नियम 5 का अनुपालन (हिंदी में प्राप्त पत्रों के उत्तर)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13 }}>
          <div><strong>कुल प्राप्त पत्र:</strong> {report.b1_s4_total_received || '0'}</div>
          <div><strong>हिंदी/द्विभाषी उत्तर:</strong> {report.b1_s4_hindi_reply || '0'}</div>
          <div><strong>अंग्रेजी में उत्तर:</strong> {report.b1_s4_english_reply || '0'}</div>
          <div><strong>उत्तर अपेक्षित नहीं:</strong> {report.b1_s4_no_reply_needed || '0'}</div>
        </div>
      </div>

      {/* Part 3: English Letters Replied in Hindi */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          ✉️ भाग 3: अंग्रेजी में प्राप्त पत्रों के उत्तर हिंदी में
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="report-data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>क्षेत्र</th>
                <th>अंग्रेजी में प्राप्त</th>
                <th>हिंदी में उत्तर</th>
                <th>अंग्रेजी में उत्तर</th>
                <th>उत्तर अपेक्षित नहीं</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>'क' क्षेत्र</strong></td>
                <td>{report.b1_s5_ka_total || '0'}</td>
                <td>{report.b1_s5_ka_hindi_reply || '0'}</td>
                <td>{report.b1_s5_ka_eng_reply || '0'}</td>
                <td>{report.b1_s5_ka_no_reply || '0'}</td>
              </tr>
              <tr>
                <td><strong>'ख' क्षेत्र</strong></td>
                <td>{report.b1_s5_kha_total || '0'}</td>
                <td>{report.b1_s5_kha_hindi_reply || '0'}</td>
                <td>{report.b1_s5_kha_eng_reply || '0'}</td>
                <td>{report.b1_s5_kha_no_reply || '0'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 4: Originating Correspondence */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          📨 भाग 4: मूल पत्राचार (Originating Correspondence)
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="report-data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>क्षेत्र</th>
                <th>हिंदी में</th>
                <th>अंग्रेजी में</th>
                <th>कुल</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>'क' क्षेत्र</strong></td>
                <td>{report.b1_s6_ka_hindi || '0'}</td>
                <td>{report.b1_s6_ka_english || '0'}</td>
                <td>{report.b1_s6_ka_total || '0'}</td>
              </tr>
              <tr>
                <td><strong>'ख' क्षेत्र</strong></td>
                <td>{report.b1_s6_kha_hindi || '0'}</td>
                <td>{report.b1_s6_kha_english || '0'}</td>
                <td>{report.b1_s6_kha_total || '0'}</td>
              </tr>
              <tr>
                <td><strong>'ग' क्षेत्र</strong></td>
                <td>{report.b1_s6_ga_hindi || '0'}</td>
                <td>{report.b1_s6_ga_english || '0'}</td>
                <td>{report.b1_s6_ga_total || '0'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 5: File Notings */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          🗂️ भाग 5: फाइलों पर टिप्पण लेखन
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: 13 }}>
          <div><strong>हिंदी टिप्पण पृष्ठ:</strong> {report.b1_s7_hindi_pages || '0'}</div>
          <div><strong>अंग्रेजी टिप्पण पृष्ठ:</strong> {report.b1_s7_eng_pages || '0'}</div>
          <div><strong>कुल टिप्पण पृष्ठ:</strong> {report.b1_s7_total_pages || '0'}</div>
          <div><strong>ई-ऑफिस टिप्पणियाँ:</strong> {report.b1_s7_eoffice || '0'}</div>
        </div>
      </div>

      {/* Part 6 & 7: Workshops & OLIC */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          🎓 भाग 6 एवं 7: कार्यशालाएं एवं राकास बैठकें
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 13 }}>
          <div><strong>आयोजित कार्यशालाएं:</strong> {report.b1_s8_workshops || '0'}</div>
          <div><strong>प्रशिक्षित अधिकारी:</strong> {report.b1_s8_officers || '0'}</div>
          <div><strong>प्रशिक्षित कर्मचारी:</strong> {report.b1_s8_staff || '0'}</div>
          <div><strong>राकास बैठक तिथि:</strong> {report.b1_s9_meeting_date || '—'}</div>
          <div><strong>कार्यसूची/कार्यवृत्त हिंदी में:</strong> {report.b1_s9_agenda_hindi || 'हाँ'}</div>
        </div>
      </div>

      {/* Part 8: Special Achievements */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          🏆 भाग 8: विशेष उपलब्धियां / उल्लेखनीय कार्य (अधिकतम 250 वर्ण)
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, background: 'var(--surface-2)', padding: 10, borderRadius: 8 }}>
          {report.b1_s11_special_achievements || report.b1_s11_innovation || 'कोई विशेष कार्य दर्ज नहीं।'}
        </p>
      </div>

      {/* Part 9: Certificate & PDF */}
      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--brand)' }}>
          📜 भाग 9: अनिवार्य प्रमाण-पत्र एवं हस्ताक्षरित PDF
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 13, marginBottom: 12 }}>
          <div><strong>सत्यापनकर्ता का नाम:</strong> {report.b1_cert_name || '—'}</div>
          <div><strong>पदनाम:</strong> {report.b1_cert_desig || '—'}</div>
          <div><strong>दूरभाष:</strong> {report.b1_cert_phone || '—'}</div>
          <div><strong>स्थान एवं दिनांक:</strong> {report.b1_cert_place || '—'}, {report.b1_cert_date || '—'}</div>
        </div>
        <div>
          {report.certificate_pdf_url ? (
            <a
              href={report.certificate_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              📄 हस्ताक्षरित प्रमाण-पत्र PDF देखें / डाउनलोड करें ({report.certificate_pdf_name || 'certificate.pdf'})
            </a>
          ) : (
            <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
              ⚠️ कोई PDF प्रमाण-पत्र संलग्न नहीं है।
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
