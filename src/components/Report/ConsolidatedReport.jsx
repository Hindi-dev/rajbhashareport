import React, { useEffect, useMemo, useState } from 'react';
import { QUARTERS, YEARS, quarterLabel } from '../../constants/constants';
import { getCurrentQuarterYear } from '../../utils/helpers';

const num = (v) => parseFloat(v) || 0;
const val = (v) => (v === undefined || v === null || v === '' ? '0' : v);
const pctOf = (part, total) => (num(total) > 0 ? `${Math.round((num(part) / num(total)) * 100)}%` : '-');

export const ConsolidatedReport = ({ reports = [], selectedSections = [], sections = [], onBack }) => {
  const { quarter: currentQuarter, year: currentYear } = getCurrentQuarterYear(reports);
  const [quarter, setQuarter] = useState(currentQuarter);
  const [year, setYear] = useState(currentYear);
  const [excludedSections, setExcludedSections] = useState([]);

  const preselectedNames = useMemo(
    () => sections.filter(s => selectedSections.includes(s.id)).map(s => s.section_name),
    [sections, selectedSections]
  );

  const periodReports = useMemo(
    () => reports.filter(r => r.quarter === quarter && String(r.year) === String(year) && r.section_name),
    [reports, quarter, year]
  );

  const availableSections = useMemo(
    () => Array.from(new Set(periodReports.map(r => r.section_name))).sort((a, b) => String(a).localeCompare(String(b), 'hi')),
    [periodReports]
  );

  // Re-select sections whenever the period changes or available sections update.
  useEffect(() => {
    const useDashboardSelection = quarter === currentQuarter && String(year) === String(currentYear) && preselectedNames.length > 0;
    const keep = useDashboardSelection ? preselectedNames : availableSections;
    setExcludedSections(availableSections.filter(name => !keep.includes(name)));
  }, [quarter, year, currentQuarter, currentYear, preselectedNames, availableSections]);

  const filteredReports = useMemo(
    () => periodReports.filter(r => !excludedSections.includes(r.section_name)),
    [periodReports, excludedSections]
  );

  const agg = useMemo(() => {
    const totals = {};
    filteredReports.forEach(r => {
      Object.keys(r).forEach(key => {
        if (/^(b1_|b2_|b11_|b12_|b13_)/.test(key)) {
          const v = parseFloat(r[key]);
          if (!Number.isNaN(v)) totals[key] = (totals[key] || 0) + v;
        }
      });
    });
    return totals;
  }, [filteredReports]);

  const toggleSection = (name) => {
    setExcludedSections(prev => (prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]));
  };

  const selectedCount = availableSections.filter(name => !excludedSections.includes(name)).length;
  const isPart2Filled = quarter === 'Q4' && Boolean(agg.b2_s1_sub_total || agg.b2_s2i_off_total || agg.b2_s3_comp_total);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>← वापस डैशबोर्ड</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--ink)' }}>📑 समेकित रिपोर्ट</h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨️ PDF</button>
      </div>

      <div className="no-print card" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="field" style={{ minWidth: 200 }}>
            <label className="field-label">तिमाही</label>
            <select className="select" value={quarter} onChange={e => setQuarter(e.target.value)}>
              {QUARTERS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
            </select>
          </div>
          <div className="field" style={{ minWidth: 140 }}>
            <label className="field-label">वर्ष</label>
            <select className="select" value={year} onChange={e => setYear(e.target.value)}>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="no-print card" style={{ marginBottom: 16 }}>
        <div className="card-head" style={{ padding: '14px 18px' }}>
          <h3 className="card-title">🗂️ अनुभाग चुनें <span style={{ color: 'var(--ink-3)', fontWeight: 600, fontSize: 12 }}>({selectedCount}/{availableSections.length})</span></h3>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExcludedSections([])}>सभी चुनें</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExcludedSections(availableSections)}>सभी हटाएँ</button>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 14, paddingBottom: 14 }}>
          {availableSections.length === 0 ? (
            <div className="alert alert-danger">इस तिमाही/वर्ष के लिए कोई रिपोर्ट नहीं।</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {availableSections.map(sec => {
                const isSelected = !excludedSections.includes(sec);
                return (
                  <button type="button" key={sec} onClick={() => toggleSection(sec)}
                    className={`chip${isSelected ? ' is-active' : ''}`}>
                    {isSelected ? '✓ ' : '+ '}{sec}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="standard-doc">
        <h2>राजभाषा के प्रगामी प्रयोग के संबंध में समेकित तिमाही प्रगति रिपोर्ट</h2>
        <h3>(अनुलग्नक-2)</h3>

        <table>
          <tbody>
            <tr>
              <td style={{ width: '50%', border: 'none' }}><strong>कार्यालय:</strong> पश्चिम रेलवे (विभिन्न अनुभाग)</td>
              <td style={{ width: '25%', border: 'none' }}><strong>तिमाही:</strong> {quarterLabel(quarter)}</td>
              <td style={{ width: '25%', border: 'none' }}><strong>वर्ष:</strong> {year}</td>
            </tr>
            <tr>
              <td style={{ border: 'none' }}><strong>समेकित अनुभाग:</strong> {selectedCount}</td>
              <td style={{ border: 'none' }} colSpan="2"><strong>क्षेत्र:</strong> 'क', 'ख' एवं 'ग'</td>
            </tr>
          </tbody>
        </table>

        <h4>भाग-I (तिमाही आधार)</h4>
        <table>
          <tbody>
            <tr>
              <td style={{ width: '5%', textAlign: 'center', fontWeight: 'bold' }}>1.</td>
              <td style={{ width: '55%' }}>माननीय मंत्री जी को प्रस्तुत कुल फाइलें</td>
              <td style={{ width: '20%' }}>कुल: {val(agg.b1_s1_total_files)}</td>
              <td style={{ width: '20%' }}>हिंदी: {val(agg.b1_s1_hindi_files)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>2.</td>
              <td>सचिव स्तर पर बैठकें व कागजात</td>
              <td>बैठकें: {val(agg.b1_s2_total_meetings)}<br />कागजात: {val(agg.b1_s2_total_docs)}</td>
              <td>हिंदी कार्यवाही: {val(agg.b1_s2_hindi_minutes)}<br />हिंदी कागजात: {val(agg.b1_s2_hindi_docs)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginBottom: 10 }}>
          <span className="field-title">3. धारा 3(3) जारी दस्तावेज:</span>
          <table>
            <thead><tr><th>(क) कुल</th><th>(ख) द्विभाषी</th><th>(ग) अंग्रेजी</th><th>(घ) हिंदी</th></tr></thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s3_total_issued)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s3_bilingual)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s3_english_only)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s3_hindi_only)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 10 }}>
          <span className="field-title">4. हिंदी में प्राप्त पत्र:</span>
          <table>
            <thead><tr><th>(क) कुल प्राप्त</th><th>(ख) उत्तर अपेक्षित नहीं</th><th>(ग) हिंदी/द्विभाषी उत्तर</th><th>(घ) अंग्रेजी उत्तर</th></tr></thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s4_total_received)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s4_no_reply_needed)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s4_hindi_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s4_english_reply)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 10 }}>
          <span className="field-title">5 व 6. अंग्रेजी पत्रों के उत्तर एवं मूल पत्राचार:</span>
          <table>
            <thead>
              <tr>
                <th rowSpan="2">क्षेत्र</th>
                <th colSpan="4">अंग्रेजी पत्रों के उत्तर (मद 5)</th>
                <th colSpan="4">मूल पत्राचार (मद 6)</th>
              </tr>
              <tr>
                <th>प्राप्त</th><th>हिंदी</th><th>अंग्रेजी</th><th>उत्तर नहीं</th>
                <th>कुल</th><th>हिंदी</th><th>अंग्रेजी</th><th>हिंदी %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>'क'</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_ka_total)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_ka_hindi_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_ka_eng_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_ka_no_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ka_total)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ka_hindi)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ka_english)}</td>
                <td style={{ textAlign: 'center' }}>{pctOf(agg.b1_s6_ka_hindi, agg.b1_s6_ka_total)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>'ख'</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_kha_total)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_kha_hindi_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_kha_eng_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s5_kha_no_reply)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_kha_total)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_kha_hindi)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_kha_english)}</td>
                <td style={{ textAlign: 'center' }}>{pctOf(agg.b1_s6_kha_hindi, agg.b1_s6_kha_total)}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>'ग'</td>
                <td style={{ textAlign: 'center' }} colSpan="4">-</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ga_total)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ga_hindi)}</td>
                <td style={{ textAlign: 'center' }}>{val(agg.b1_s6_ga_english)}</td>
                <td style={{ textAlign: 'center' }}>{pctOf(agg.b1_s6_ga_hindi, agg.b1_s6_ga_total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <table>
          <tbody>
            <tr>
              <td style={{ width: '5%', textAlign: 'center', fontWeight: 'bold' }}>7.</td>
              <td style={{ width: '25%' }}><strong>फाइल टिप्पण</strong></td>
              <td style={{ width: '70%' }}>कुल: {val(agg.b1_s7_total_pages)} | हिंदी: {val(agg.b1_s7_hindi_pages)} | अंग्रेजी: {val(agg.b1_s7_eng_pages)} | ई-ऑफिस: {val(agg.b1_s7_eoffice)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>8.</td>
              <td><strong>हिंदी कार्यशालाएं</strong></td>
              <td>कार्यशालाएं: {val(agg.b1_s8_workshops)} | अधिकारी: {val(agg.b1_s8_officers)} | कर्मचारी: {val(agg.b1_s8_staff)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: 'center', fontWeight: 'bold' }}>9.</td>
              <td><strong>रा.भा.का.स. बैठकें</strong></td>
              <td>अधीनस्थ समितियां: {val(agg.b1_s9_sub_office_cmtes)} | आयोजित: {val(agg.b1_s9_sub_office_meetings)}</td>
            </tr>
          </tbody>
        </table>

        {isPart2Filled && (
          <div className="page-break" style={{ marginTop: 20 }}>
            <h4>भाग-II (वार्षिक मूल्यांकन - Q4)</h4>
            <table>
              <tbody>
                <tr>
                  <td style={{ width: '5%', textAlign: 'center', fontWeight: 'bold' }}>1.</td>
                  <td style={{ width: '35%' }}><strong>नियम 10(4)</strong></td>
                  <td style={{ width: '60%' }}>कुल: {val(agg.b2_s1_sub_total)} | अधिसूचित: {val(agg.b2_s1_sub_notified)}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>3.</td>
                  <td><strong>कंप्यूटर प्रशिक्षण</strong></td>
                  <td>कुल: {val(agg.b2_s3_comp_total)} | प्रशिक्षित: {val(agg.b2_s3_comp_trained)} | कार्यरत: {val(agg.b2_s3_comp_working)}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>4.</td>
                  <td><strong>कंप्यूटर/लैपटॉप</strong></td>
                  <td>कुल: {val(agg.b2_s4_laptop_total)} | यूनिकोड: {val(agg.b2_s4_laptop_unicode)}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>9.</td>
                  <td><strong>प्रकाशन</strong></td>
                  <td>कुल: {val(agg.b2_s9_pub_total)} | हिंदी: {val(agg.b2_s9_pub_hindi)} | अंग्रेजी: {val(agg.b2_s9_pub_eng)}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center', fontWeight: 'bold' }}>10.</td>
                  <td><strong>पुस्तकों पर व्यय</strong></td>
                  <td>कुल: ₹{val(agg.b2_s10_exp_total)} | हिंदी: ₹{val(agg.b2_s10_exp_hindi)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <p style={{ margin: '15px 0 0', fontSize: '10.5pt' }}>
          नोट: यह समेकित रिपोर्ट {selectedCount} अनुभागों के {quarterLabel(quarter)} · {year} के आंकड़ों का योग है।
        </p>
      </div>
    </div>
  );
};
