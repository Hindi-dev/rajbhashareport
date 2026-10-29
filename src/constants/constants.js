export const ROLES = {
  DEO: { label: "DEO/Clerk", icon: "🏢", color: "#4f46e5", bg: "#eef2ff", grad: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  AAO: { label: "AAO", icon: "🔎", color: "#0284c7", bg: "#f0f9ff", grad: "linear-gradient(135deg,#0284c7,#4f46e5)" },
  SAO: { label: "SAO", icon: "✅", color: "#059669", bg: "#ecfdf5", grad: "linear-gradient(135deg,#059669,#0d9488)" },
  HINDI_CELL: { label: "हिंदी प्रकोष्ठ", icon: "🏛️", color: "#d97706", bg: "#fffbeb", grad: "linear-gradient(135deg,#d97706,#db2777)" },
};

export const STATUS = {
  DRAFT: { label: "मसौदा", icon: "📝", color: "#94a3b8", bg: "#f8fafc" },
  PENDING_AAO: { label: "AAO के पास", icon: "⏳", color: "#6366f1", bg: "#eef2ff" },
  AAO_APPROVED: { label: "AAO स्वीकृत", icon: "✔️", color: "#0ea5e9", bg: "#f0f9ff" },
  AAO_RETURNED: { label: "AAO ने वापस किया", icon: "↩️", color: "#f97316", bg: "#fff7ed" },
  PENDING_SAO: { label: "SAO के पास", icon: "⏳", color: "#10b981", bg: "#ecfdf5" },
  SAO_APPROVED: { label: "SAO स्वीकृत", icon: "✔️", color: "#10b981", bg: "#d1fae5" },
  SAO_RETURNED: { label: "SAO ने वापस किया", icon: "↩️", color: "#f97316", bg: "#fff7ed" },
  SUBMITTED: { label: "हिंदी प्रकोष्ठ स्वीकृत", icon: "🎉", color: "#16a34a", bg: "#dcfce7" },
};

export const QUARTERS = [
  { id: "Q1", label: "Q1 · अप्रैल–जून" },
  { id: "Q2", label: "Q2 · जुलाई–सितंबर" },
  { id: "Q3", label: "Q3 · अक्टूबर–दिसंबर" },
  { id: "Q4", label: "Q4 · जनवरी–मार्च" }
];

export const YEARS = ["2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

export const SECTION_COLORS = [
  { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6" },
  { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
  { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" },
  { bg: "#fff7ed", border: "#f97316", text: "#9a3412" },
  { bg: "#fefce8", border: "#eab308", text: "#854d0e" },
  { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  { bg: "#ecfeff", border: "#06b6d4", text: "#155e75" },
  { bg: "#eff6ff", border: "#3b82f6", text: "#1e40af" },
  { bg: "#f0fdf4", border: "#10b981", text: "#065f46" },
  { bg: "#fdf4ff", border: "#a855f7", text: "#581c87" },
  { bg: "#fff1f2", border: "#f43f5e", text: "#881337" },
  { bg: "#f8fafc", border: "#64748b", text: "#0f172a" },
];

const FWD = "linear-gradient(135deg,#10b981,#0ea5e9)";
const BACK = "linear-gradient(135deg,#f97316,#ef4444)";

export const WORKFLOW_ACTIONS = {
  DEO: {
    AAO_RETURNED: [{ label: "✏️ सुधार कर AAO को पुनः भेजें", action: "EDIT", grad: "linear-gradient(135deg,#f59e0b,#f97316)" }],
    SAO_RETURNED: [{ label: "✏️ सुधार कर AAO को पुनः भेजें", action: "EDIT", grad: "linear-gradient(135deg,#f59e0b,#f97316)" }],
  },
  AAO: {
    PENDING_AAO: [
      { label: "✅ SAO को अग्रेषित करें", action: "PENDING_SAO", grad: FWD },
      { label: "↩️ अनुभाग (DEO) को वापस करें", action: "AAO_RETURNED", grad: BACK },
    ],
    SAO_RETURNED: [
      { label: "✅ SAO को पुनः भेजें", action: "PENDING_SAO", grad: FWD },
      { label: "↩️ अनुभाग (DEO) को वापस करें", action: "AAO_RETURNED", grad: BACK },
    ],
  },
  SAO: {
    PENDING_SAO: [
      { label: "✅ हिंदी प्रकोष्ठ को भेजें", action: "SAO_APPROVED", grad: FWD },
      { label: "↩️ AAO को वापस करें", action: "SAO_RETURNED", grad: BACK },
    ],
  },
  HINDI_CELL: {
    SAO_APPROVED: [
      { label: "🎉 अंतिम स्वीकृति दें", action: "SUBMITTED", grad: "linear-gradient(135deg,#f59e0b,#10b981)" },
      { label: "↩️ SAO को वापस करें", action: "PENDING_SAO", grad: "linear-gradient(135deg,#dc2626,#9f1239)" },
    ],
  },
};

export const INBOX_STATUSES = {
  DEO: null,
  AAO: null,
  SAO: null,
  HINDI_CELL: ["SAO_APPROVED", "SUBMITTED"],
};

export const ACTION_STATUSES = {
  DEO: ["AAO_RETURNED", "SAO_RETURNED"],
  AAO: ["PENDING_AAO", "SAO_RETURNED"],
  SAO: ["PENDING_SAO"],
  HINDI_CELL: ["SAO_APPROVED"],
};

export function workflowActionsFor(role, status) {
  return WORKFLOW_ACTIONS[role]?.[status] || [];
}

export function canActOnReport(role, report) {
  return workflowActionsFor(role, report?.status).length > 0;
}

export function quarterLabel(id) {
  return QUARTERS.find(q => q.id === id)?.label || id || "";
}

export function isHindiSectionUser(profile, sectionName) {
  const name = sectionName || profile?.section_name || "";
  return profile?.role === "HINDI_CELL" || /हिंदी/.test(name);
}

export function genId() {
  return `RAJ-${Date.now().toString(36).toUpperCase().slice(-7)}`;
}

export const EMPTY_FORM = {
  officeNameAddress: "", officerPhone: "", officerEmail: "", 
  year: "2026", quarter: "Q4", ackId: genId(),
  region: "क",
  b1_s1_total_files: "", b1_s1_hindi_files: "",
  b1_s2_total_meetings: "", b1_s2_hindi_minutes: "", b1_s2_total_docs: "", b1_s2_hindi_docs: "",
  b1_s3_total_issued: "", b1_s3_bilingual: "", b1_s3_english_only: "", b1_s3_hindi_only: "",
  b1_s4_total_received: "", b1_s4_no_reply_needed: "", b1_s4_hindi_reply: "", b1_s4_english_reply: "",
  b1_s5_ka_total: "", b1_s5_ka_hindi_reply: "", b1_s5_ka_eng_reply: "", b1_s5_ka_no_reply: "",
  b1_s5_kha_total: "", b1_s5_kha_hindi_reply: "", b1_s5_kha_eng_reply: "", b1_s5_kha_no_reply: "",
  b1_s6_ka_total: "", b1_s6_ka_hindi: "", b1_s6_ka_english: "",
  b1_s6_kha_total: "", b1_s6_kha_hindi: "", b1_s6_kha_english: "",
  b1_s6_ga_total: "", b1_s6_ga_hindi: "", b1_s6_ga_english: "",
  b1_s7_hindi_pages: "", b1_s7_eng_pages: "", b1_s7_total_pages: "", b1_s7_eoffice: "",
  b1_s8_workshops: "", b1_s8_staff: "", b1_s8_officers: "",
  b1_s9_meeting_held: "हाँ",
  b1_s9_meeting_date: "", b1_s9_sub_office_cmtes: "", b1_s9_sub_office_meetings: "", b1_s9_agenda_hindi: "हाँ",
  b1_s10_meeting_date: "",
  b1_s11_special_achievements: "",
  b1_s11_innovation: "", b1_s11_special: "", b1_s11_other: "",
  b1_cert_name: "", b1_cert_desig: "", b1_cert_phone: "", b1_cert_date: "", b1_cert_place: "", b1_cert_agreed: false,
  certificate_pdf_url: "", certificate_pdf_name: "", certificate_pdf_size: 0, certificate_pdf_uploaded_at: "",
  b2_s1_notified: "हाँ", b2_s1_sub_total: "", b2_s1_sub_notified: "", b2_s1_sub_action: "",
  b2_s2i_off_total: "", b2_s2i_off_ministerial: "", b2_s2i_off_pravinta: "", b2_s2i_off_karyasadhak: "", b2_s2i_off_training: "", b2_s2i_off_remaining: "",
  b2_s2i_staff_total: "", b2_s2i_staff_ministerial: "", b2_s2i_staff_pravinta: "", b2_s2i_staff_karyasadhak: "", b2_s2i_staff_training: "", b2_s2i_staff_remaining: "",
  b2_s2ii_steno_total: "", b2_s2ii_steno_trained: "", b2_s2ii_steno_working: "", b2_s2ii_steno_remaining: "",
  b2_s2ii_typist_total: "", b2_s2ii_typist_trained: "", b2_s2ii_typist_working: "", b2_s2ii_typist_remaining: "",
  b2_s2ii_tax_total: "", b2_s2ii_tax_trained: "", b2_s2ii_tax_working: "", b2_s2ii_tax_remaining: "",
  b2_s2iii_off_total: "", b2_s2iii_off_trained: "", b2_s2iii_off_remaining: "",
  b2_s2iii_staff_total: "", b2_s2iii_staff_trained: "", b2_s2iii_staff_remaining: "",
  b2_s3_comp_total: "", b2_s3_comp_trained: "", b2_s3_comp_working: "",
  b2_s4_laptop_total: "", b2_s4_laptop_unicode: "", b2_s4_laptop_pct: "",
  b2_s5_manual_total: "", b2_s5_manual_bi: "", b2_s5_form_total: "", b2_s5_form_bi: "",
  b2_s6_orders: "", b2_s6_remaining: "",
  b2_s7_prog_name: "", b2_s7_duration: "", b2_s7_hindi: "", b2_s7_eng: "", b2_s7_mixed: "",
  b2_s8_sec_total: "", b2_s8_sec_inspected: "", b2_s8_sub_total: "", b2_s8_sub_inspected: "", b2_s8_hindi_secs: "",
  b2_s9_pub_total: "", b2_s9_pub_hindi: "", b2_s9_pub_eng: "",
  b2_s10_exp_total: "", b2_s10_exp_hindi: "",
  b2_s11_total: "", b2_s11_know: "", b2_s11_not: "", b2_s11_25: "", b2_s11_50: "", b2_s11_75: "", b2_s11_100: "", b2_s11_full: "",
  b2_s12_total: "", b2_s12_know: "", b2_s12_not: "", b2_s12_25: "", b2_s12_50: "", b2_s12_75: "", b2_s12_100: "", b2_s12_full: "",
  b2_s13_post: "", b2_s13_hq_sanc: "", b2_s13_hq_vac: "", b2_s13_sub_sanc: "", b2_s13_sub_vac: "",
  b2_s14_url: "", b2_s14_type: "केवल अंग्रेजी में", b2_s14_lang_opt: "नहीं",
  b2_s15_divas: "", b2_s15_seminar: "", b2_s15_other: "", b2_s15_innovation: "",
  b2_s16_tolic_member: "हाँ", b2_s16_last_meeting: "", b2_s16_hod_attended: "हाँ",
  b2_cert_name: "", b2_cert_desig: "", b2_cert_phone: "", b2_cert_date: "", b2_cert_place: "", b2_cert_agreed: false,
  timeline: []
};