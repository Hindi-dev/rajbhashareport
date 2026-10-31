import React, { useMemo, useState } from 'react';
import { EMPTY_FORM, QUARTERS, YEARS, SECTION_COLORS, isHindiSectionUser, quarterLabel, genId } from '../../constants/constants';
import { validateReport, hindiPct } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';
import { Inp, Num, Radio, SecCard, Grid, TblInput } from '../Common/UIComponents';
import { PdfCertificateUploader } from './PdfCertificateUploader';
import { translations } from '../../utils/i18n';

export const ReportForm = ({ initialData, onSave, onCancel, reports = [], defaultLang = 'hi' }) => {
  const { profile } = useAuth();
  const [lang, setLang] = useState(defaultLang);
  const t = translations[lang] || translations.hi;

  const [data, setData] = useState(() => {
    const base = initialData || { ...EMPTY_FORM, ackId: genId() };
    return { ...EMPTY_FORM, ...base, section_name: base.section_name || profile?.section_name || "" };
  });

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const isQ4 = data.quarter === "Q4";
  const showPart2 = isQ4 && isHindiSectionUser(profile, data.section_name);

  // Stepper structure
  const steps = [
    { title: t.stepOffice, icon: "🏢" },
    { title: t.stepPart1, icon: "⚖️" },
    { title: t.stepPart2, icon: "📨" },
    { title: t.stepPart3, icon: "🎓" },
    ...(showPart2 ? [{ title: "वार्षिक भाग-II", icon: "📋" }] : []),
    { title: t.stepPart4, icon: "📜" },
    { title: t.stepPreview, icon: "👁️" }
  ];

  const totalSteps = steps.length;
  const previewStepIndex = totalSteps - 1;
  const certStepIndex = totalSteps - 2;

  const alreadySubmitted = !initialData && reports.some(r =>
    r.section_name === (data.section_name || profile?.section_name) &&
    r.year === data.year &&
    r.quarter === data.quarter &&
    r.status !== "AAO_RETURNED" &&
    r.status !== "SAO_RETURNED"
  );

  const validationErrors = useMemo(() => validateReport(data, { showPart2 }), [data, showPart2]);

  // Derived real-time metrics for core form modules
  const p1TotalCalc = (parseFloat(data.b1_s3_bilingual) || 0) + (parseFloat(data.b1_s3_english_only) || 0) + (parseFloat(data.b1_s3_hindi_only) || 0);
  const p1IsMismatch = parseFloat(data.b1_s3_total_issued) > 0 && p1TotalCalc !== parseFloat(data.b1_s3_total_issued);

  const p2TotalCalc = (parseFloat(data.b1_s4_hindi_reply) || 0) + (parseFloat(data.b1_s4_english_reply) || 0) + (parseFloat(data.b1_s4_no_reply_needed) || 0);
  const p2IsMismatch = parseFloat(data.b1_s4_total_received) > 0 && p2TotalCalc !== parseFloat(data.b1_s4_total_received);

  // Origins totals
  const p4KaTotal = (parseFloat(data.b1_s6_ka_hindi) || 0) + (parseFloat(data.b1_s6_ka_english) || 0);
  const p4KhaTotal = (parseFloat(data.b1_s6_kha_hindi) || 0) + (parseFloat(data.b1_s6_kha_english) || 0);
  const p4GaTotal = (parseFloat(data.b1_s6_ga_hindi) || 0) + (parseFloat(data.b1_s6_ga_english) || 0);

  // Tippan pages total
  const p5PagesTotal = (parseFloat(data.b1_s7_hindi_pages) || 0) + (parseFloat(data.b1_s7_eng_pages) || 0);

  const handlePdfUploadSuccess = (pdfMeta) => {
    setData(d => ({
      ...d,
      ...pdfMeta
    }));
  };

  const handlePdfRemove = () => {
    setData(d => ({
      ...d,
      certificate_pdf_url: "",
      certificate_pdf_name: "",
      certificate_pdf_size: 0,
      certificate_pdf_uploaded_at: ""
    }));
  };

  const handleSubmit = async () => {
    if (validationErrors.length > 0) return;
    setSubmitting(true);
    try {
      const report = { ...data, section_name: data.section_name || profile?.section_name };
      if (initialData && profile?.role === 'DEO' && (initialData.status === 'AAO_RETURNED' || initialData.status === 'SAO_RETURNED')) {
        report.status = 'PENDING_AAO';
        report.timeline = [...(report.timeline || []), {
          ts: new Date().toISOString(),
          role: profile.role,
          name: profile.section_name,
          action: "DEO ने वापसी के बाद रिपोर्ट सुधार कर पुनः भेजी",
          remark: "",
        }];
      }
      if (initialData && profile?.role === 'HINDI_CELL') {
        report.timeline = [...(report.timeline || []), {
          ts: new Date().toISOString(),
          role: profile.role,
          name: profile.section_name,
          action: "हिंदी प्रकोष्ठ द्वारा संपादित",
          remark: "",
        }];
      }
      if (initialData && profile?.role === 'AAO' && report.status === 'SAO_RETURNED') {
        report.status = 'PENDING_SAO';
        report.timeline = [...(report.timeline || []), {
          ts: new Date().toISOString(),
          role: profile.role,
          name: profile.section_name,
          action: "AAO ने संशोधन कर SAO को पुनः भेजा",
          remark: "",
        }];
      }
      await onSave(report);
      setDone(true);
    } catch (err) {
      console.error("Report submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div className="card-body" style={{ padding: "48px 24px" }}>
          <div style={{ fontSize: 52 }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#047857", margin: "14px 0 12px" }}>
            {initialData ? "रिपोर्ट सफलतापूर्वक अपडेट हो गई है!" : "रिपोर्ट AAO के पास सफलतापूर्वक अग्रेषित कर दी गई है!"}
          </h2>
          <div className="badge-soft badge" style={{ fontSize: 16, padding: "9px 18px", letterSpacing: "0.04em", margin: "10px 0" }}>
            पावती संख्या: {data.ackId}
          </div>
          <p style={{ color: "var(--ink-2)", fontSize: 13, marginTop: 8 }}>
            हस्ताक्षरित प्रमाण-पत्र (PDF) सुरक्षित रूप से संग्रहीत कर लिया गया है।
          </p>
          <div style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>← वापस डैशबोर्ड पर जाएँ</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Top Header Bar with Language Toggle & Form Title */}
      <div className="no-print" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 16, flexWrap: "wrap", gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "var(--ink)" }}>
            {t.appTitle}
          </h1>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
            {t.appSubtitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setLang(l => l === 'hi' ? 'en' : 'hi')}
            style={{ fontWeight: 700, border: '1px solid var(--line)', padding: '6px 12px' }}
          >
            🌐 {t.langToggle}
          </button>
        </div>
      </div>

      {/* Stepper Progress */}
      <section className="card no-print" style={{ marginBottom: 16 }}>
        <div className="card-body" style={{ padding: "16px 20px" }}>
          <div className="stepper" style={{ display: "flex", justifyContent: "space-between", overflowX: "auto", paddingBottom: 6 }}>
            {steps.map((s, i) => (
              <div
                key={i}
                className={`step${i === step ? " is-active" : i < step ? " is-done" : ""}`}
                onClick={() => i < step && setStep(i)}
                style={{ cursor: i < step ? "pointer" : "default", minWidth: 100 }}
              >
                <div className="step-dot">{i < step ? "✓" : i + 1}</div>
                <span className="step-label" style={{ fontSize: 12 }}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="progress" style={{ marginTop: 10 }}>
            <div className="progress-bar" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }} />
          </div>
        </div>
      </section>

      {/* STEP 0: कार्यालय का विवरण */}
      {step === 0 && (
        <div className="stack">
          {!showPart2 && (
            <div className="alert alert-info">
              <span style={{ fontSize: 20 }}>ℹ️</span>
              <div>
                <strong>{t.appTitle}:</strong> यह फॉर्म गृह मंत्रालय, राजभाषा विभाग द्वारा अप्रैल 2025 से लागू नए संशोधित प्रारूप के पूर्णतः अनुरूप है।
              </div>
            </div>
          )}

          <SecCard title={t.stepOffice} icon="🏢" color={SECTION_COLORS[0]}>
            <Inp
              label={lang === 'hi' ? "कार्यालय का नाम और पूरा पता" : "Office Name & Full Address"}
              value={data.officeNameAddress}
              onChange={v => set("officeNameAddress", v)}
              placeholder={lang === 'hi' ? "जैसे: कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई" : "e.g., Office of the Principal Director of Audit, Railway, Mumbai"}
            />
            <Grid>
              <Inp
                label={lang === 'hi' ? "राजभाषा अधिकारी / प्रभारी का फोन नं." : "Official Language Officer / In-charge Phone No."}
                value={data.officerPhone}
                onChange={v => set("officerPhone", v)}
                placeholder="022-xxxxxxxx"
              />
              <Inp
                label={lang === 'hi' ? "अधिकारी की ई-मेल आईडी" : "Officer Email ID"}
                value={data.officerEmail}
                onChange={v => set("officerEmail", v)}
                type="email"
                placeholder="officer@gov.in"
              />
            </Grid>
            <Grid cols={3}>
              <div className="field">
                <label className="field-label">{lang === 'hi' ? "वित्तीय वर्ष" : "Financial Year"}</label>
                <select className="select" value={data.year} onChange={e => set("year", e.target.value)}>
                  {YEARS.map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">{lang === 'hi' ? "तिमाही" : "Quarter"}</label>
                <select className="select" value={data.quarter} onChange={e => set("quarter", e.target.value)}>
                  {QUARTERS.map(q => <option value={q.id} key={q.id}>{q.label}</option>)}
                </select>
              </div>
              <Radio
                label={lang === 'hi' ? "कार्यालय का क्षेत्र (क/ख/ग)" : "Office Region (A/B/C)"}
                value={data.region}
                onChange={v => set("region", v)}
                options={["क", "ख", "ग"]}
              />
            </Grid>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 8 }}>
              पावती संख्या (Ack ID): <strong style={{ color: "var(--ink-2)" }}>{data.ackId}</strong> · अनुभाग: <strong style={{ color: "var(--ink-2)" }}>{data.section_name}</strong>
            </div>
          </SecCard>

          {alreadySubmitted && (
            <div className="alert alert-danger">
              <span style={{ fontSize: 20 }}>⛔</span>
              <div>आप <strong>{data.year}</strong> की <strong>{quarterLabel(data.quarter)}</strong> की रिपोर्ट पहले ही जमा कर चुके हैं।</div>
            </div>
          )}
        </div>
      )}

      {/* STEP 1: भाग 1 (धारा 3(3)) एवं भाग 2 (नियम 5) */}
      {step === 1 && (
        <div className="stack">
          {/* Part 1: Section 3(3) Compliance */}
          <SecCard title={t.part1Title} icon="📄" color={SECTION_COLORS[2]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part1Desc}</p>
            <Grid cols={2}>
              <Num
                label={t.part1TotalIssued}
                value={data.b1_s3_total_issued}
                onChange={v => set("b1_s3_total_issued", v)}
              />
              <Num
                label={t.part1Bilingual}
                value={data.b1_s3_bilingual}
                onChange={v => set("b1_s3_bilingual", v)}
              />
            </Grid>
            <Grid cols={2}>
              <Num
                label={t.part1EnglishOnly}
                value={data.b1_s3_english_only}
                onChange={v => set("b1_s3_english_only", v)}
              />
              <Num
                label={t.part1HindiOnly}
                value={data.b1_s3_hindi_only}
                onChange={v => set("b1_s3_hindi_only", v)}
              />
            </Grid>

            {p1IsMismatch && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fffbeb', color: '#b45309', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                ⚠️ ध्यान दें: द्विभाषी ({data.b1_s3_bilingual || 0}) + केवल अंग्रेजी ({data.b1_s3_english_only || 0}) + केवल हिंदी ({data.b1_s3_hindi_only || 0}) = {p1TotalCalc} (कुल जारी: {data.b1_s3_total_issued || 0})
              </div>
            )}

            {parseFloat(data.b1_s3_english_only) > 0 && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                {t.part1Warning} (केवल अंग्रेजी में जारी दस्तावेज धारा 3(3) का उल्लंघन हैं)
              </div>
            )}
          </SecCard>

          {/* Part 2: Rule 5 Compliance */}
          <SecCard title={t.part2Title} icon="📬" color={SECTION_COLORS[3]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part2Desc}</p>
            <Grid cols={2}>
              <Num
                label={t.part2TotalReceived}
                value={data.b1_s4_total_received}
                onChange={v => set("b1_s4_total_received", v)}
              />
              <Num
                label={t.part2NoReplyNeeded}
                value={data.b1_s4_no_reply_needed}
                onChange={v => set("b1_s4_no_reply_needed", v)}
              />
            </Grid>
            <Grid cols={2}>
              <Num
                label={t.part2RepliedHindi}
                value={data.b1_s4_hindi_reply}
                onChange={v => set("b1_s4_hindi_reply", v)}
              />
              <Num
                label={t.part2RepliedEnglish}
                value={data.b1_s4_english_reply}
                onChange={v => set("b1_s4_english_reply", v)}
              />
            </Grid>

            {p2IsMismatch && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#fffbeb', color: '#b45309', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                ⚠️ ध्यान दें: हिंदी उत्तर ({data.b1_s4_hindi_reply || 0}) + अंग्रेजी उत्तर ({data.b1_s4_english_reply || 0}) + अपेक्षारहित ({data.b1_s4_no_reply_needed || 0}) = {p2TotalCalc} (कुल प्राप्त: {data.b1_s4_total_received || 0})
              </div>
            )}
          </SecCard>
        </div>
      )}

      {/* STEP 2: भाग 3 (अंग्रेजी पत्रों के उत्तर हिंदी में), भाग 4 (मूल पत्राचार) एवं भाग 5 (फाइल टिप्पण) */}
      {step === 2 && (
        <div className="stack">
          {/* Part 3: English letters replied in Hindi */}
          <SecCard title={t.part3Title} icon="✉️" color={SECTION_COLORS[4]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part3Desc}</p>
            <TblInput
              headers={["क्षेत्र", "अंग्रेजी में प्राप्त", "हिंदी में उत्तर", "अंग्रेजी में उत्तर", "उत्तर अपेक्षित नहीं"]}
              rows={[
                [{ label: t.part3RegionA }, { key: "b1_s5_ka_total" }, { key: "b1_s5_ka_hindi_reply" }, { key: "b1_s5_ka_eng_reply" }, { key: "b1_s5_ka_no_reply" }],
                [{ label: t.part3RegionB }, { key: "b1_s5_kha_total" }, { key: "b1_s5_kha_hindi_reply" }, { key: "b1_s5_kha_eng_reply" }, { key: "b1_s5_kha_no_reply" }],
              ]}
              data={data}
              onChange={set}
            />
          </SecCard>

          {/* Part 4: Originating Correspondence */}
          <SecCard title={t.part4Title} icon="📨" color={SECTION_COLORS[5]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part4Desc}</p>
            <TblInput
              headers={["क्षेत्र", "हिंदी में", "अंग्रेजी में", "कुल"]}
              rows={[
                [{ label: t.part4RegionA }, { key: "b1_s6_ka_hindi" }, { key: "b1_s6_ka_english" }, { key: "b1_s6_ka_total" }],
                [{ label: t.part4RegionB }, { key: "b1_s6_kha_hindi" }, { key: "b1_s6_kha_english" }, { key: "b1_s6_kha_total" }],
                [{ label: t.part4RegionC }, { key: "b1_s6_ga_hindi" }, { key: "b1_s6_ga_english" }, { key: "b1_s6_ga_total" }],
              ]}
              data={data}
              onChange={set}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12.5, fontWeight: 700 }}>
              <div style={{ background: "#ecfdf5", padding: "6px 12px", borderRadius: 8, color: "#065f46" }}>
                'क' क्षेत्र हिंदी प्रगति: {hindiPct(data.b1_s6_ka_hindi, data.b1_s6_ka_total)} (लक्ष्य: 100%)
              </div>
              <div style={{ background: "#f0f9ff", padding: "6px 12px", borderRadius: 8, color: "#075985" }}>
                'ख' क्षेत्र हिंदी प्रगति: {hindiPct(data.b1_s6_kha_hindi, data.b1_s6_kha_total)} (लक्ष्य: 90%)
              </div>
              <div style={{ background: "#fffbeb", padding: "6px 12px", borderRadius: 8, color: "#92400e" }}>
                'ग' क्षेत्र हिंदी प्रगति: {hindiPct(data.b1_s6_ga_hindi, data.b1_s6_ga_total)} (लक्ष्य: 55%)
              </div>
            </div>
          </SecCard>

          {/* Part 5: File Notings (Tippan) */}
          <SecCard title={t.part5Title} icon="🗂️" color={SECTION_COLORS[6]}>
            <div style={{
              background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
              padding: "10px 14px", color: "#1e40af", fontSize: 13, fontWeight: 700, marginBottom: 14
            }}>
              {t.part5RuleNote}
            </div>

            <Grid cols={2}>
              <div className="field">
                <label className="field-label">{t.part5HindiPages}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="input input--num"
                  value={data.b1_s7_hindi_pages ?? ""}
                  onChange={e => set("b1_s7_hindi_pages", e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div className="field">
                <label className="field-label">{t.part5EnglishPages}</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="input input--num"
                  value={data.b1_s7_eng_pages ?? ""}
                  onChange={e => set("b1_s7_eng_pages", e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </Grid>
            <Grid cols={2}>
              <Num
                label={t.part5TotalPages}
                value={data.b1_s7_total_pages}
                onChange={v => set("b1_s7_total_pages", v)}
              />
              <Num
                label={t.part5Eoffice}
                value={data.b1_s7_eoffice}
                onChange={v => set("b1_s7_eoffice", v)}
              />
            </Grid>
            {parseFloat(data.b1_s7_total_pages) > 0 && (
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#047857", marginTop: 8 }}>
                फाइलों पर हिंदी टिप्पण प्रतिशत: {hindiPct(data.b1_s7_hindi_pages, data.b1_s7_total_pages)}
              </div>
            )}
          </SecCard>
        </div>
      )}

      {/* STEP 3: भाग 6 (कार्यशालाएं), भाग 7 (राकास बैठकें) एवं भाग 8 (विशेष उपलब्धियां) */}
      {step === 3 && (
        <div className="stack">
          {/* Part 6: Hindi Workshops */}
          <SecCard title={t.part6Title} icon="🎓" color={SECTION_COLORS[7]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part6Desc}</p>
            <Grid cols={3}>
              <Num
                label={t.part6WorkshopsCount}
                value={data.b1_s8_workshops}
                onChange={v => set("b1_s8_workshops", v)}
              />
              <Num
                label={t.part6OfficersTrained}
                value={data.b1_s8_officers}
                onChange={v => set("b1_s8_officers", v)}
              />
              <Num
                label={t.part6EmployeesTrained}
                value={data.b1_s8_staff}
                onChange={v => set("b1_s8_staff", v)}
              />
            </Grid>
          </SecCard>

          {/* Part 7: OLIC (Rajbhasha Karyanvayan Samiti) */}
          <SecCard title={t.part7Title} icon="🤝" color={SECTION_COLORS[8]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 12px" }}>{t.part7Desc}</p>
            <Grid cols={2}>
              <Radio
                label={t.part7MeetingHeld}
                value={data.b1_s9_meeting_held || "हाँ"}
                onChange={v => set("b1_s9_meeting_held", v)}
                options={["हाँ", "नहीं"]}
              />
              <Inp
                type="date"
                label={t.part7MeetingDate}
                value={data.b1_s9_meeting_date}
                onChange={v => set("b1_s9_meeting_date", v)}
              />
            </Grid>
            <Grid cols={3}>
              <Radio
                label={t.part7AgendaHindi}
                value={data.b1_s9_agenda_hindi}
                onChange={v => set("b1_s9_agenda_hindi", v)}
                options={["हाँ", "नहीं"]}
              />
              <Num
                label={t.part7SubCommittees}
                value={data.b1_s9_sub_office_cmtes}
                onChange={v => set("b1_s9_sub_office_cmtes", v)}
              />
              <Num
                label={t.part7SubMeetings}
                value={data.b1_s9_sub_office_meetings}
                onChange={v => set("b1_s9_sub_office_meetings", v)}
              />
            </Grid>
          </SecCard>

          {/* Part 8: Special Achievements (Strictly <= 250 characters) */}
          <SecCard title={t.part8Title} icon="🏆" color={SECTION_COLORS[10]}>
            <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "0 0 8px" }}>{t.part8Desc}</p>
            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label className="field-label" style={{ margin: 0 }}>उल्लेखनीय एवं विशिष्ट राजभाषा कार्य</label>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: (250 - (data.b1_s11_special_achievements?.length || 0)) < 20 ? "#dc2626" : "var(--ink-3)"
                }}>
                  {t.part8CharCount} {250 - (data.b1_s11_special_achievements?.length || 0)} / 250
                </span>
              </div>
              <textarea
                value={data.b1_s11_special_achievements || ""}
                onChange={e => {
                  if (e.target.value.length <= 250) {
                    set("b1_s11_special_achievements", e.target.value);
                  }
                }}
                maxLength={250}
                rows={4}
                className="textarea"
                placeholder={t.part8Placeholder}
                style={{ resize: "vertical" }}
              />
            </div>
          </SecCard>
        </div>
      )}

      {/* OPTIONAL STEP: वार्षिक भाग-II (Only if Q4 and Hindi section) */}
      {showPart2 && step === 4 && (
        <div className="stack">
          <div className="alert alert-info">📋 भाग-II · वार्षिक राजभाषा रिपोर्ट (केवल 31 मार्च को समाप्त Q4 में)</div>
          <SecCard title="1. राजभाषा नियम, 1976 · अधिसूचना" icon="📜" color={SECTION_COLORS[0]}>
            <Radio label="(i) क्या कार्यालय नियम 10(4) के अंतर्गत अधिसूचित है?" value={data.b2_s1_notified} onChange={v => set("b2_s1_notified", v)} options={["हाँ", "नहीं"]} />
            <Grid cols={3}>
              <Num label="कुल अधीनस्थ कार्यालय" value={data.b2_s1_sub_total} onChange={v => set("b2_s1_sub_total", v)} />
              <Num label="अधिसूचित कार्यालय" value={data.b2_s1_sub_notified} onChange={v => set("b2_s1_sub_notified", v)} />
              <Inp label="शेष हेतु कार्रवाई" value={data.b2_s1_sub_action} onChange={v => set("b2_s1_sub_action", v)} />
            </Grid>
          </SecCard>
          <SecCard title="2(i). अधिकारियों/कर्मचारियों को हिंदी का ज्ञान" icon="🎓" color={SECTION_COLORS[1]}>
            <TblInput headers={["श्रेणी", "कुल", "अनुसचिवीय", "प्रवीणता", "कार्यसाधक", "प्रशिक्षण ले रहे", "प्रशिक्षण शेष"]} rows={[
              [{ label: "अधिकारी" }, { key: "b2_s2i_off_total" }, { key: "b2_s2i_off_ministerial" }, { key: "b2_s2i_off_pravinta" }, { key: "b2_s2i_off_karyasadhak" }, { key: "b2_s2i_off_training" }, { key: "b2_s2i_off_remaining" }],
              [{ label: "कर्मचारी" }, { key: "b2_s2i_staff_total" }, { key: "b2_s2i_staff_ministerial" }, { key: "b2_s2i_staff_pravinta" }, { key: "b2_s2i_staff_karyasadhak" }, { key: "b2_s2i_staff_training" }, { key: "b2_s2i_staff_remaining" }],
            ]} data={data} onChange={set} />
          </SecCard>
          <SecCard title="4. कंप्यूटर/लैपटॉप" icon="💻" color={SECTION_COLORS[5]}>
            <Grid cols={3}>
              <Num label="कुल संख्या" value={data.b2_s4_laptop_total} onChange={v => set("b2_s4_laptop_total", v)} />
              <Num label="यूनिकोड सक्षम" value={data.b2_s4_laptop_unicode} onChange={v => set("b2_s4_laptop_unicode", v)} />
              <Num label="हिंदी कार्य %" value={data.b2_s4_laptop_pct} onChange={v => set("b2_s4_laptop_pct", v)} />
            </Grid>
          </SecCard>
        </div>
      )}

      {/* STEP: भाग 9 - अनिवार्य प्रमाण-पत्र एवं हस्ताक्षरित PDF अपलोड */}
      {step === certStepIndex && (
        <div className="stack">
          <SecCard title={t.part9Title} icon="📜" color={SECTION_COLORS[11]}>
            <div style={{
              background: "var(--surface-2)", borderRadius: 12, padding: 18,
              border: "1px solid var(--line)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.8, marginBottom: 18
            }}>
              <strong>प्रमाण-पत्र घोषणा (Declaration):</strong><br />
              {t.part9CertDeclaration}
            </div>

            <Grid cols={2}>
              <Inp
                label={t.part9SignatoryName}
                value={data.b1_cert_name}
                onChange={v => set("b1_cert_name", v)}
                placeholder="सत्यापनकर्ता का नाम"
              />
              <Inp
                label={t.part9Designation}
                value={data.b1_cert_desig}
                onChange={v => set("b1_cert_desig", v)}
                placeholder="उदा. वरिष्ठ लेखापरीक्षा अधिकारी"
              />
            </Grid>

            <Grid cols={3}>
              <Inp
                label={t.part9Phone}
                value={data.b1_cert_phone !== undefined && data.b1_cert_phone !== "" ? data.b1_cert_phone : (data.officerPhone || "")}
                onChange={v => set("b1_cert_phone", v)}
                placeholder="दूरभाष / मोबाइल"
              />
              <Inp
                type="date"
                label={t.part9Date}
                value={data.b1_cert_date || new Date().toISOString().split('T')[0]}
                onChange={v => set("b1_cert_date", v)}
              />
              <Inp
                label={t.part9Place}
                value={data.b1_cert_place || "मुंबई"}
                onChange={v => set("b1_cert_place", v)}
                placeholder="स्थान"
              />
            </Grid>

            <label style={{
              display: "flex", alignItems: "flex-start", gap: 12, marginTop: 18,
              fontWeight: 700, color: "#b91c1c", cursor: "pointer", fontSize: 13
            }}>
              <input
                type="checkbox"
                checked={data.b1_cert_agreed}
                onChange={e => set("b1_cert_agreed", e.target.checked)}
                style={{ width: 20, height: 20, marginTop: 2, accentColor: "#dc2626" }}
              />
              {t.part9AgreeCheckbox}
            </label>

            {/* Dedicated PDF Certificate Uploader Component */}
            <div style={{ marginTop: 24 }}>
              <label className="field-label" style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>
                {t.part9PdfUploadTitle} <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <PdfCertificateUploader
                pdfUrl={data.certificate_pdf_url}
                pdfName={data.certificate_pdf_name}
                pdfSize={data.certificate_pdf_size}
                ackId={data.ackId}
                year={data.year}
                quarter={data.quarter}
                onUploadSuccess={handlePdfUploadSuccess}
                onRemove={handlePdfRemove}
                lang={lang}
              />
            </div>
          </SecCard>
        </div>
      )}

      {/* FINAL STEP: समीक्षा एवं अंतिम प्रेषण (Preview & Final Submit) */}
      {step === previewStepIndex && (
        <section className="card no-print">
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px", color: "var(--ink)" }}>
              👁️ {t.stepPreview}
            </h3>

            {validationErrors.length > 0 && (
              <div className="alert alert-danger" style={{ marginBottom: 18, flexDirection: "column" }}>
                <strong style={{ fontSize: 14 }}>{t.validationFixErrors}</strong>
                <ul style={{ margin: "8px 0 0", paddingLeft: 20, fontWeight: 600, lineHeight: 1.8 }}>
                  {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            <div style={{
              background: "var(--surface-2)", borderRadius: 14, padding: 18,
              border: "1px solid var(--line)", fontSize: 13, color: "var(--ink-2)", lineHeight: 2, marginBottom: 18
            }}>
              <div><strong>कार्यालय / अनुभाग:</strong> {data.section_name} ({data.officeNameAddress || "पता दर्ज नहीं"})</div>
              <div><strong>तिमाही एवं वर्ष:</strong> {quarterLabel(data.quarter)} · वर्ष {data.year} (क्षेत्र: {data.region})</div>
              <div><strong>पावती सं. (Ack ID):</strong> {data.ackId}</div>
              <div>
                <strong>हस्ताक्षरित PDF प्रमाण-पत्र:</strong>{" "}
                {data.certificate_pdf_url ? (
                  <span style={{ color: "#047857", fontWeight: 700 }}>
                    ✓ अपलोड किया गया ({data.certificate_pdf_name || "certificate.pdf"})
                  </span>
                ) : (
                  <span style={{ color: "#dc2626", fontWeight: 700 }}>✗ अपलोड नहीं किया गया (अनिवार्य)</span>
                )}
              </div>
              <div>
                <strong>सत्यापनकर्ता:</strong> {data.b1_cert_name || "—"} ({data.b1_cert_desig || "—"}) · दिनांक: {data.b1_cert_date || "—"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={validationErrors.length > 0 || submitting}
              className="btn btn-primary btn-block"
              style={{ padding: "14px 18px", fontSize: 15 }}
            >
              {submitting ? "जमा हो रहा है..." : initialData ? t.btnUpdate : t.btnSubmit}
            </button>
          </div>
        </section>
      )}

      {/* Navigation Buttons (Previous / Next) */}
      <div className="no-print" style={{
        display: "flex", justifyContent: "space-between", gap: 10,
        marginTop: 20, flexWrap: "wrap"
      }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {t.btnPrevious}
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          {initialData && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              {t.btnCancel}
            </button>
          )}
          {step < totalSteps - 1 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && alreadySubmitted}
            >
              {t.btnNext}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
