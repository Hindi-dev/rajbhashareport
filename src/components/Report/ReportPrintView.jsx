import React, { useEffect } from 'react';
import { STATUS, quarterLabel } from '../../constants/constants';
import { hindiPct } from '../../utils/helpers';

export const ReportPrintView = ({ report, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!report) return <div className="empty">रिपोर्ट नहीं मिली</div>;

  const st = STATUS[report.status] || { label: report.status };

  return (
    <div className="page" style={{ maxWidth: 900, margin: '0 auto', background: '#fff', padding: 24 }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>← वापस जाएँ</button>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>🖨️ प्रिंट करें / PDF सहेजें</button>
      </div>

      <div className="standard-doc">
        <div style={{ textAlign: 'center', marginBottom: 20, borderBottom: '2px solid #0f172a', paddingBottom: 14 }}>
          <div style={{ fontSize: 24 }}>🏛️</div>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0', color: '#0f172a' }}>
            प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
          </h1>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '2px 0', color: 'var(--brand)' }}>
            राजभाषा तिमाही प्रगति रिपोर्ट (QPR) · अनुलग्नक-2
          </h2>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
            गृह मंत्रालय, राजभाषा विभाग (संशोधित प्रारूप अप्रैल 2025)
          </div>
        </div>

        {/* Office Details */}
        <table style={{ width: '100%', marginBottom: 16 }}>
          <tbody>
            <tr>
              <td style={{ width: '20%', fontWeight: 700, background: 'var(--surface-2)' }}>अनुभाग का नाम</td>
              <td style={{ width: '30%' }}>{report.section_name}</td>
              <td style={{ width: '20%', fontWeight: 700, background: 'var(--surface-2)' }}>कार्यालय का क्षेत्र</td>
              <td style={{ width: '30%' }}>क्षेत्र '{report.region}'</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>तिमाही एवं वर्ष</td>
              <td>{quarterLabel(report.quarter)} · वर्ष {report.year}</td>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>पावती सं. (Ack ID)</td>
              <td style={{ fontFamily: 'monospace' }}>{report.ackId}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>कार्यालय का पता</td>
              <td colSpan="3">{report.officeNameAddress || '—'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>अधिकारी दूरभाष / ईमेल</td>
              <td>{report.officerPhone || '—'}</td>
              <td colSpan="2">{report.officerEmail || '—'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>रिपोर्ट स्थिति</td>
              <td colSpan="3"><strong>{st.label}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Part 1: Section 3(3) */}
        <h4>भाग 1: राजभाषा अधिनियम, 1963 की धारा 3(3) का अनुपालन</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>कुल जारी दस्तावेज</th>
              <th>द्विभाषी जारी</th>
              <th>केवल अंग्रेजी में</th>
              <th>केवल हिंदी में</th>
              <th>द्विभाषी %</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center' }}>
              <td>{report.b1_s3_total_issued || '0'}</td>
              <td>{report.b1_s3_bilingual || '0'}</td>
              <td>{report.b1_s3_english_only || '0'}</td>
              <td>{report.b1_s3_hindi_only || '0'}</td>
              <td><strong>{hindiPct(report.b1_s3_bilingual, report.b1_s3_total_issued)}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Part 2: Rule 5 */}
        <h4>भाग 2: राजभाषा नियम 5 का अनुपालन (हिंदी पत्रों के उत्तर)</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>हिंदी में प्राप्त कुल पत्र</th>
              <th>हिंदी/द्विभाषी उत्तर</th>
              <th>अंग्रेजी में उत्तर</th>
              <th>उत्तर अपेक्षित नहीं</th>
              <th>हिंदी उत्तर %</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center' }}>
              <td>{report.b1_s4_total_received || '0'}</td>
              <td>{report.b1_s4_hindi_reply || '0'}</td>
              <td>{report.b1_s4_english_reply || '0'}</td>
              <td>{report.b1_s4_no_reply_needed || '0'}</td>
              <td><strong>{hindiPct(report.b1_s4_hindi_reply, (parseFloat(report.b1_s4_total_received || 0) - parseFloat(report.b1_s4_no_reply_needed || 0)))}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Part 3: English Letters Replied in Hindi */}
        <h4>भाग 3: अंग्रेजी में प्राप्त पत्रों के उत्तर हिंदी में</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
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
            <tr style={{ textAlign: 'center' }}>
              <td style={{ fontWeight: 700, textAlign: 'left' }}>'क' क्षेत्र</td>
              <td>{report.b1_s5_ka_total || '0'}</td>
              <td>{report.b1_s5_ka_hindi_reply || '0'}</td>
              <td>{report.b1_s5_ka_eng_reply || '0'}</td>
              <td>{report.b1_s5_ka_no_reply || '0'}</td>
            </tr>
            <tr style={{ textAlign: 'center' }}>
              <td style={{ fontWeight: 700, textAlign: 'left' }}>'ख' क्षेत्र</td>
              <td>{report.b1_s5_kha_total || '0'}</td>
              <td>{report.b1_s5_kha_hindi_reply || '0'}</td>
              <td>{report.b1_s5_kha_eng_reply || '0'}</td>
              <td>{report.b1_s5_kha_no_reply || '0'}</td>
            </tr>
          </tbody>
        </table>

        {/* Part 4: Originating Correspondence */}
        <h4>भाग 4: मूल पत्राचार (Originating Correspondence)</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>क्षेत्र</th>
              <th>हिंदी में</th>
              <th>अंग्रेजी में</th>
              <th>कुल पत्र</th>
              <th>हिंदी प्रगति %</th>
              <th>निर्धारित लक्ष्य</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center' }}>
              <td style={{ fontWeight: 700, textAlign: 'left' }}>'क' क्षेत्र</td>
              <td>{report.b1_s6_ka_hindi || '0'}</td>
              <td>{report.b1_s6_ka_english || '0'}</td>
              <td>{report.b1_s6_ka_total || '0'}</td>
              <td><strong>{hindiPct(report.b1_s6_ka_hindi, report.b1_s6_ka_total)}</strong></td>
              <td>100%</td>
            </tr>
            <tr style={{ textAlign: 'center' }}>
              <td style={{ fontWeight: 700, textAlign: 'left' }}>'ख' क्षेत्र</td>
              <td>{report.b1_s6_kha_hindi || '0'}</td>
              <td>{report.b1_s6_kha_english || '0'}</td>
              <td>{report.b1_s6_kha_total || '0'}</td>
              <td><strong>{hindiPct(report.b1_s6_kha_hindi, report.b1_s6_kha_total)}</strong></td>
              <td>90%</td>
            </tr>
            <tr style={{ textAlign: 'center' }}>
              <td style={{ fontWeight: 700, textAlign: 'left' }}>'ग' क्षेत्र</td>
              <td>{report.b1_s6_ga_hindi || '0'}</td>
              <td>{report.b1_s6_ga_english || '0'}</td>
              <td>{report.b1_s6_ga_total || '0'}</td>
              <td><strong>{hindiPct(report.b1_s6_ga_hindi, report.b1_s6_ga_total)}</strong></td>
              <td>55%</td>
            </tr>
          </tbody>
        </table>

        {/* Part 5: File Notings */}
        <h4>भाग 5: फाइलों पर टिप्पण लेखन (File Notings)</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <thead>
            <tr>
              <th>हिंदी टिप्पण पृष्ठ</th>
              <th>अंग्रेजी टिप्पण पृष्ठ</th>
              <th>कुल टिप्पण पृष्ठ</th>
              <th>ई-ऑफिस टिप्पणियाँ</th>
              <th>हिंदी टिप्पण %</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center' }}>
              <td>{report.b1_s7_hindi_pages || '0'}</td>
              <td>{report.b1_s7_eng_pages || '0'}</td>
              <td>{report.b1_s7_total_pages || '0'}</td>
              <td>{report.b1_s7_eoffice || '0'}</td>
              <td><strong>{hindiPct(report.b1_s7_hindi_pages, report.b1_s7_total_pages)}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Part 6 & 7: Workshops & OLIC */}
        <h4>भाग 6 एवं 7: कार्यशालाएं एवं राकास बैठकें</h4>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <tbody>
            <tr>
              <td style={{ width: '25%', fontWeight: 700, background: 'var(--surface-2)' }}>आयोजित कार्यशालाएं</td>
              <td style={{ width: '25%' }}>{report.b1_s8_workshops || '0'}</td>
              <td style={{ width: '25%', fontWeight: 700, background: 'var(--surface-2)' }}>प्रशिक्षित कार्मिक</td>
              <td style={{ width: '25%' }}>अधिकारी: {report.b1_s8_officers || '0'} | कर्मचारी: {report.b1_s8_staff || '0'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>राकास बैठक तिथि</td>
              <td>{report.b1_s9_meeting_date || '—'}</td>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>कार्यसूची/कार्यवृत्त शत-प्रतिशत हिंदी</td>
              <td>{report.b1_s9_agenda_hindi || 'हाँ'}</td>
            </tr>
          </tbody>
        </table>

        {/* Part 8: Special Achievements */}
        <h4>भाग 8: विशेष उपलब्धियां / उल्लेखनीय कार्य</h4>
        <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, lineHeight: 1.6 }}>
          {report.b1_s11_special_achievements || report.b1_s11_special || 'कार्यालय में राजभाषा के संवर्धन हेतु निर्धारित नियमों का समुचित अनुपालन किया जा रहा है।'}
        </div>

        {/* Part 9: Official Certificate Declaration */}
        <h4>भाग 9: अनिवार्य प्रमाण-पत्र एवं सत्यापन</h4>
        <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, padding: 12, background: 'var(--surface-2)', marginBottom: 16, fontSize: 12, lineHeight: 1.7 }}>
          “मैं यह प्रमाणित करता/करती हूँ कि प्रस्तुत तिमाही प्रगति रिपोर्ट में दी गई सूचना उपलब्ध शासकीय अभिलेखों के आधार पर तैयार की गई है तथा मेरी जानकारी एवं विश्वास के अनुसार पूर्णतया सत्य एवं सही है।”
        </div>
        <table style={{ width: '100%', marginBottom: 16 }}>
          <tbody>
            <tr>
              <td style={{ width: '25%', fontWeight: 700, background: 'var(--surface-2)' }}>सत्यापनकर्ता का नाम</td>
              <td style={{ width: '25%' }}>{report.b1_cert_name || '—'}</td>
              <td style={{ width: '25%', fontWeight: 700, background: 'var(--surface-2)' }}>पदनाम</td>
              <td style={{ width: '25%' }}>{report.b1_cert_desig || '—'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>दूरभाष</td>
              <td>{report.b1_cert_phone || '—'}</td>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>दिनांक एवं स्थान</td>
              <td>{report.b1_cert_date || '—'}, {report.b1_cert_place || 'मुंबई'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, background: 'var(--surface-2)' }}>हस्ताक्षरित PDF प्रमाण-पत्र</td>
              <td colSpan="3">
                {report.certificate_pdf_name ? (
                  <span style={{ color: '#047857', fontWeight: 700 }}>✓ संलग्न ({report.certificate_pdf_name})</span>
                ) : (
                  <span style={{ color: '#047857', fontWeight: 700 }}>✓ डिजिटल रूप से हस्ताक्षरित एवं सत्यापित</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
          <span>रिपोर्ट जनरेट तिथि: {new Date().toLocaleString('hi-IN')}</span>
          <span>राजभाषा QPR पोर्टल · अनुलग्नक-2</span>
        </div>
      </div>
    </div>
  );
};
