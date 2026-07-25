export const ROLES = {
  DEO: { label: "DEO/Clerk", icon: "🏢", color: "#6366f1", bg: "#eef2ff" },
  AAO: { label: "AAO", icon: "🔎", color: "#0ea5e9", bg: "#f0f9ff" },
  SAO: { label: "SAO", icon: "✅", color: "#10b981", bg: "#ecfdf5" },
  HINDI_CELL: { label: "हिंदी प्रकोष्ठ", icon: "🏛️", color: "#f59e0b", bg: "#fffbeb" },
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

export const YEARS = ["2025", "2026", "2027", "2028"];

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
  b1_s9_meeting_date: "", b1_s9_sub_office_cmtes: "", b1_s9_sub_office_meetings: "", b1_s9_agenda_hindi: "हाँ",
  b1_s10_meeting_date: "",
  b1_s11_innovation: "", b1_s11_special: "", b1_s11_other: "",
  b1_cert_name: "", b1_cert_desig: "", b1_cert_phone: "", b1_cert_date: "", b1_cert_place: "", b1_cert_agreed: false,
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