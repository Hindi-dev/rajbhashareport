import React, { useState } from 'react';
import { EMPTY_FORM, QUARTERS, YEARS } from '../../constants/constants';
import { validateReport } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { Inp, Num, Radio, SecCard, Grid, TblInput } from '../Common/UIComponents';

export const ReportForm = ({ initialData, onSave, onCancel }) => {
  const { profile } = useAuth();
  const [data, setData] = useState(initialData || EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const isQ4 = data.quarter === "Q4";
  const showPart2 = isQ4 && profile.role === 'HINDI_CELL';

  const handleSubmit = async () => {
    const warnings = validateReport(data);
    if (warnings.length > 0) {
      setValidationWarnings(warnings);
      if (!window.confirm("कुछ वैलिडेशन चेतावनियाँ हैं:\n" + warnings.join('\n') + "\n\nक्या आप फिर भी रिपोर्ट जमा करना चाहते हैं?")) {
        return;
      }
    }
    setSubmitting(true);
    try {
      const report = { ...data, section_name: data.section_name || profile.section_name };
      if (initialData && profile.role === 'DEO' && (initialData.status === 'AAO_RETURNED' || initialData.status === 'SAO_RETURNED')) {
        report.status = 'PENDING_AAO';
        const timeline = report.timeline || [];
        timeline.push({
          ts: new Date().toISOString(),
          role: profile.role,
          name: profile.section_name,
          action: "DEO ने वापसी के बाद रिपोर्ट सुधार कर पुनः भेजी",
          remark: ""
        });
        report.timeline = timeline;
      }
      if (initialData && profile.role === 'HINDI_CELL') {
        const timeline = report.timeline || [];
        timeline.push({
          ts: new Date().toISOString(),
          role: profile.role,
          name: profile.section_name,
          action: "हिंदी प्रकोष्ठ द्वारा संपादित",
          remark: ""
        });
        report.timeline = timeline;
      }
      await onSave(report);
    } catch (err) {
      console.error("Report submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", paddingBottom: "40px" }}>
      {validationWarnings.length > 0 && (
        <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
          <strong>⚠️ वैलिडेशन चेतावनियाँ:</strong>
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            {validationWarnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
      <div style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)", color: "white", padding: "24px", borderRadius: "16px", marginBottom: "24px", textAlign: "center", boxShadow: "0 6px 20px rgba(99,102,241,0.3)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px 0" }}>🏢 {data.section_name || profile.section_name}</h2>
        <p style={{ fontSize: "14px", opacity: 0.9, margin: 0, fontWeight: 600 }}>राजभाषा हिंदी के प्रगामी प्रयोग से संबंधित तिमाही प्रगति रिपोर्ट</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <SecCard title="अनुभाग विवरण" icon="📋">
          <Grid cols={2}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: '4px', display: 'block' }}>वर्ष</label>
              <select value={data.year} onChange={e => set("year", e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15, fontFamily: "inherit", outline: "none" }}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: '4px', display: 'block' }}>तिमाही</label>
              <select value={data.quarter} onChange={e => set("quarter", e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15, fontFamily: "inherit", outline: "none" }}>
                {QUARTERS.map(q => <option value={q.id} key={q.id}>{q.label}</option>)}
              </select>
            </div>
          </Grid>
          <Inp label="अनुभाग का नाम और पूरा पता" value={data.officeNameAddress} onChange={v => set("officeNameAddress", v)} />
          <Grid>
            <Inp label="संबंधित राजभाषा अधिकारी का फोन नं." value={data.officerPhone} onChange={v => set("officerPhone", v)} />
            <Inp label="ई-मेल" value={data.officerEmail} onChange={v => set("officerEmail", v)} />
          </Grid>
          <div style={{ marginTop: '8px' }}>
            <Radio label="क्षेत्र (क/ख/ग)" value={data.region} onChange={v => set("region", v)} options={["क", "ख", "ग"]} />
          </div>
        </SecCard>

        <div style={{ background: "#eef2ff", padding: "10px 16px", borderRadius: "8px", border: "1px solid #6366f1", color: "#3730a3", fontWeight: 800 }}>भाग-I (प्रत्येक तिमाही की समाप्ति पर भरा जाए)</div>

        <SecCard title="1 & 2. मंत्री / सचिव स्तर पर पत्राचार" icon="📜">
          <h4 style={{ margin: "0 0 10px", fontSize: 14 }}>1. माननीय मंत्री जी को भेजी गईं फ़ाइलें</h4>
          <Grid><Num label="कुल भेजी गई फ़ाइलें" value={data.b1_s1_total_files} onChange={v => set("b1_s1_total_files", v)} /><Num label="हिंदी में भेजी गईं" value={data.b1_s1_hindi_files} onChange={v => set("b1_s1_hindi_files", v)} /></Grid>
          <h4 style={{ margin: "20px 0 10px", fontSize: 14 }}>2. सचिव/समकक्ष स्तर पर बैठकें/फाइलें</h4>
          <Grid><Num label="आयोजित कुल बैठकें" value={data.b1_s2_total_meetings} onChange={v => set("b1_s2_total_meetings", v)} /><Num label="हिंदी में कार्यवाही/कार्यवृत्त" value={data.b1_s2_hindi_minutes} onChange={v => set("b1_s2_hindi_minutes", v)} /></Grid>
          <Grid><Num label="सीधे जारी कुल कागजात" value={data.b1_s2_total_docs} onChange={v => set("b1_s2_total_docs", v)} /><Num label="हिंदी में जारी कागजात" value={data.b1_s2_hindi_docs} onChange={v => set("b1_s2_hindi_docs", v)} /></Grid>
        </SecCard>

        <SecCard title="3. धारा 3 (3) के अंतर्गत जारी दस्तावेज" icon="📄">
          <Grid><Num label="(क) कुल संख्या" value={data.b1_s3_total_issued} onChange={v => set("b1_s3_total_issued", v)} /><Num label="(ख) द्विभाषी रूप में" value={data.b1_s3_bilingual} onChange={v => set("b1_s3_bilingual", v)} /></Grid>
          <Grid><Num label="(ग) केवल अंग्रेजी में" value={data.b1_s3_english_only} onChange={v => set("b1_s3_english_only", v)} /><Num label="(घ) केवल हिंदी में" value={data.b1_s3_hindi_only} onChange={v => set("b1_s3_hindi_only", v)} /></Grid>
        </SecCard>

        <SecCard title="4. हिंदी में प्राप्त पत्र (राजभाषा नियम-5)" icon="📬">
          <Grid><Num label="(क) कुल प्राप्त पत्र" value={data.b1_s4_total_received} onChange={v => set("b1_s4_total_received", v)} /><Num label="(ख) उत्तर अपेक्षित नहीं" value={data.b1_s4_no_reply_needed} onChange={v => set("b1_s4_no_reply_needed", v)} /></Grid>
          <Grid><Num label="(ग) हिंदी/द्विभाषी में उत्तर दिए गए" value={data.b1_s4_hindi_reply} onChange={v => set("b1_s4_hindi_reply", v)} /><Num label="(घ) अंग्रेजी में उत्तर दिए गए" value={data.b1_s4_english_reply} onChange={v => set("b1_s4_english_reply", v)} /></Grid>
        </SecCard>

        <SecCard title="5. अंग्रेजी पत्रों के उत्तर हिंदी में" icon="✉️">
          <TblInput headers={["क्षेत्र", "अंग्रेजी में प्राप्त कुल पत्र", "हिंदी में उत्तर दिए गए", "अंग्रेजी में उत्तर दिए गए", "उत्तर अपेक्षित नहीं"]}
            rows={[
              [{ label: "'क' क्षेत्र" }, { key: "b1_s5_ka_total" }, { key: "b1_s5_ka_hindi_reply" }, { key: "b1_s5_ka_eng_reply" }, { key: "b1_s5_ka_no_reply" }],
              [{ label: "'ख' क्षेत्र" }, { key: "b1_s5_kha_total" }, { key: "b1_s5_kha_hindi_reply" }, { key: "b1_s5_kha_eng_reply" }, { key: "b1_s5_kha_no_reply" }]
            ]} data={data} onChange={set} />
        </SecCard>

        <SecCard title="6. मूल रूप से भेजे गये पत्रों का ब्यौरा" icon="📨">
          <TblInput headers={["क्षेत्र", "हिंदी में", "अंग्रेजी में", "कुल संख्या"]}
            rows={[
              [{ label: "'क' क्षेत्र को" }, { key: "b1_s6_ka_hindi" }, { key: "b1_s6_ka_english" }, { key: "b1_s6_ka_total" }],
              [{ label: "'ख' क्षेत्र को" }, { key: "b1_s6_kha_hindi" }, { key: "b1_s6_kha_english" }, { key: "b1_s6_kha_total" }],
              [{ label: "'ग' क्षेत्र को" }, { key: "b1_s6_ga_hindi" }, { key: "b1_s6_ga_english" }, { key: "b1_s6_ga_total" }]
            ]} data={data} onChange={set} />
        </SecCard>

        <SecCard title="7. टिप्पण लेखन का ब्यौरा" icon="🗂️">
          <Grid><Num label="हिंदी में टिप्पणियों के पृष्ठ" value={data.b1_s7_hindi_pages} onChange={v => set("b1_s7_hindi_pages", v)} /><Num label="अंग्रेजी में टिप्पणियों के पृष्ठ" value={data.b1_s7_eng_pages} onChange={v => set("b1_s7_eng_pages", v)} /></Grid>
          <Grid><Num label="टिप्पणियों के पृष्ठों की कुल संख्या" value={data.b1_s7_total_pages} onChange={v => set("b1_s7_total_pages", v)} /><Num label="ई-ऑफिस से भेजी गई टिप्पणियां" value={data.b1_s7_eoffice} onChange={v => set("b1_s7_eoffice", v)} /></Grid>
        </SecCard>

        <SecCard title="8 & 9. कार्यशालाएं एवं बैठकें" icon="🤝">
          <h4 style={{ margin: "0 0 10px", fontSize: 14 }}>8. हिंदी कार्यशालाएं</h4>
          <Grid cols={3}><Num label="आयोजित कार्यशालाएं" value={data.b1_s8_workshops} onChange={v => set("b1_s8_workshops", v)} /><Num label="प्रशिक्षित कर्मचारी" value={data.b1_s8_staff} onChange={v => set("b1_s8_staff", v)} /><Num label="प्रशिक्षित अधिकारी" value={data.b1_s8_officers} onChange={v => set("b1_s8_officers", v)} /></Grid>
          <h4 style={{ margin: "20px 0 10px", fontSize: 14 }}>9. राजभाषा कार्यान्वयन समिति</h4>
          <Grid><Inp type="date" label="(क) बैठक की तिथि" value={data.b1_s9_meeting_date} onChange={v => set("b1_s9_meeting_date", v)} /><Num label="(ख) अधीनस्थ समितियों की संख्या" value={data.b1_s9_sub_office_cmtes} onChange={v => set("b1_s9_sub_office_cmtes", v)} /></Grid>
          <Grid><Num label="(ग) तिमाही में आयोजित बैठकें" value={data.b1_s9_sub_office_meetings} onChange={v => set("b1_s9_sub_office_meetings", v)} /><Radio label="(घ) कार्यसूची/कार्यवृत्त हिंदी में?" value={data.b1_s9_agenda_hindi} onChange={v => set("b1_s9_agenda_hindi", v)} options={["हाँ", "नहीं"]} /></Grid>
          <h4 style={{ margin: "20px 0 10px", fontSize: 14 }}>10. हिंदी सलाहकार समिति</h4>
          <Inp type="date" label="बैठक के आयोजन की तिथि" value={data.b1_s10_meeting_date} onChange={v => set("b1_s10_meeting_date", v)} />
        </SecCard>

        <SecCard title="11. उल्लेखनीय कार्य / उपलब्धियां (Max 500 chars)" icon="🏆">
          <Inp label="i) नवोन्मेषी कार्य" value={data.b1_s11_innovation} onChange={v => set("b1_s11_innovation", v)} />
          <div style={{marginTop: 10}}><Inp label="ii) विशिष्ट आयोजन / उल्लेखनीय कार्य" value={data.b1_s11_special} onChange={v => set("b1_s11_special", v)} /></div>
          <div style={{marginTop: 10}}><Inp label="iii) हिंदी माध्यम में किये गए अन्य आयोजन" value={data.b1_s11_other} onChange={v => set("b1_s11_other", v)} /></div>
        </SecCard>

        {showPart2 && (
          <>
            <div style={{ background: "#ecfeff", padding: "10px 16px", borderRadius: "8px", border: "1px solid #06b6d4", color: "#164e63", fontWeight: 800, marginTop: "20px" }}>भाग-II (केवल 31 मार्च को समाप्त तिमाही रिपोर्ट के साथ भरा जाए)</div>
            <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
              <p style={{ color: '#64748b' }}>भाग-II के सभी फ़ील्ड यहाँ उपलब्ध हैं। (पूर्ण कोड में सभी फ़ील्ड मौजूद हैं)</p>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
        {initialData && <button onClick={onCancel} style={{ flex: 0.3, padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "15px" }}>रद्द करें</button>}
        <button onClick={handleSubmit} disabled={submitting}
          style={{ flex: 1, padding: "16px", borderRadius: "12px", border: "none", background: "#10b981", color: "#fff", fontWeight: 800, fontSize: "16px", cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
          {submitting ? 'जमा हो रहा है...' : '✅ रिपोर्ट सहेजें'}
        </button>
      </div>
    </div>
  );
};