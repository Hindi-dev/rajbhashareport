import { QUARTERS } from '../constants/constants';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('hi-IN');
}

export function getCurrentQuarterYear(reports) {
  if (!reports || reports.length === 0) return { quarter: "Q4", year: "2026" };
  const sorted = [...reports].sort((a,b) => {
    if (a.year !== b.year) return b.year - a.year;
    const qOrder = { Q1:1, Q2:2, Q3:3, Q4:4 };
    return qOrder[b.quarter] - qOrder[a.quarter];
  });
  return { quarter: sorted[0].quarter, year: sorted[0].year };
}

export function normalizeDigits(str) {
  if (!str) return '';
  return String(str).replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d));
}

const num = (v) => parseFloat(normalizeDigits(v)) || 0;

export function validateReport(data, { showPart2 = false } = {}) {
  const errors = [];
  
  // Basic office details validation
  if (!data.officeNameAddress || data.officeNameAddress.trim() === '') {
    errors.push("कृपया कार्यालय का नाम और पूरा पता भरें।");
  }
  if (!data.officerPhone || data.officerPhone.trim() === '') {
    errors.push("कृपया संबंधित अधिकारी का फोन नंबर भरें।");
  } else if (!/^[0-9+\-\s()०-९]{7,15}$/.test(data.officerPhone.trim())) {
    errors.push("कृपया वैध फोन नंबर भरें (7 से 15 अंक)।");
  }
  if (!data.officerEmail || data.officerEmail.trim() === '') {
    errors.push("कृपया संबंधित अधिकारी का ईमेल भरें।");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.officerEmail.trim())) {
    errors.push("कृपया वैध ईमेल पता भरें।");
  }

  // Part 1: Section 3(3) Compliance validation
  const sum3 = num(data.b1_s3_bilingual) + num(data.b1_s3_english_only) + num(data.b1_s3_hindi_only);
  if (num(data.b1_s3_total_issued) > 0 && sum3 !== num(data.b1_s3_total_issued)) {
    errors.push(`भाग 1 (धारा 3(3)): जारी दस्तावेजों का योग (${sum3}) कुल जारी दस्तावेजों (${data.b1_s3_total_issued}) के बराबर होना चाहिए।`);
  }

  // Part 2: Rule 5 Compliance validation
  const sum4 = num(data.b1_s4_hindi_reply) + num(data.b1_s4_english_reply) + num(data.b1_s4_no_reply_needed);
  if (num(data.b1_s4_total_received) > 0 && sum4 !== num(data.b1_s4_total_received)) {
    errors.push(`भाग 2 (नियम 5): कुल उत्तरों एवं अपेक्षारहित का योग (${sum4}) प्राप्त पत्रों (${data.b1_s4_total_received}) के बराबर होना चाहिए।`);
  }

  // Part 4: Originating Correspondence validation
  const sum6Ka = num(data.b1_s6_ka_hindi) + num(data.b1_s6_ka_english);
  if (num(data.b1_s6_ka_total) > 0 && sum6Ka !== num(data.b1_s6_ka_total)) {
    errors.push(`भाग 4 (मूल पत्राचार): 'क' क्षेत्र हेतु हिंदी+अंग्रेजी पत्रों का योग (${sum6Ka}) कुल पत्रों (${data.b1_s6_ka_total}) के बराबर होना चाहिए।`);
  }
  const sum6Kha = num(data.b1_s6_kha_hindi) + num(data.b1_s6_kha_english);
  if (num(data.b1_s6_kha_total) > 0 && sum6Kha !== num(data.b1_s6_kha_total)) {
    errors.push(`भाग 4 (मूल पत्राचार): 'ख' क्षेत्र हेतु हिंदी+अंग्रेजी पत्रों का योग (${sum6Kha}) कुल पत्रों (${data.b1_s6_kha_total}) के बराबर होना चाहिए।`);
  }
  const sum6Ga = num(data.b1_s6_ga_hindi) + num(data.b1_s6_ga_english);
  if (num(data.b1_s6_ga_total) > 0 && sum6Ga !== num(data.b1_s6_ga_total)) {
    errors.push(`भाग 4 (मूल पत्राचार): 'ग' क्षेत्र हेतु हिंदी+अंग्रेजी पत्रों का योग (${sum6Ga}) कुल पत्रों (${data.b1_s6_ga_total}) के बराबर होना चाहिए।`);
  }

  // Part 5: File Notings validation
  const sum7 = num(data.b1_s7_hindi_pages) + num(data.b1_s7_eng_pages);
  if (num(data.b1_s7_total_pages) > 0 && sum7 !== num(data.b1_s7_total_pages)) {
    errors.push(`भाग 5 (फाइल टिप्पण): हिंदी+अंग्रेजी पृष्ठों का योग (${sum7}) कुल पृष्ठों (${data.b1_s7_total_pages}) के बराबर होना चाहिए।`);
  }

  // Part 8: Special Achievements validation (strictly <= 250 characters)
  if (data.b1_s11_special_achievements && data.b1_s11_special_achievements.length > 250) {
    errors.push(`भाग 8 (विशेष उपलब्धियां): अधिकतम 250 वर्ण ही मान्य हैं (वर्तमान: ${data.b1_s11_special_achievements.length} वर्ण)।`);
  }

  // Part 9: Mandatory Certificate & Signed PDF Upload validation
  if (!data.certificate_pdf_url) {
    errors.push("भाग 9 (अनिवार्य प्रमाण-पत्र): हस्ताक्षरित एवं मुहरबंद घोषणा प्रमाण-पत्र की PDF अपलोड करना अनिवार्य है।");
  }
  if (!data.b1_cert_agreed) {
    errors.push("भाग 9 (घोषणा): कृपया प्रमाण-पत्र घोषणा की सत्यता चेकबॉक्स को स्वीकार करें।");
  }
  if (!data.b1_cert_name || data.b1_cert_name.trim() === '') {
    errors.push("भाग 9: कृपया प्रमाण-पत्र में सत्यापनकर्ता अधिकारी का नाम भरें।");
  }
  if (!data.b1_cert_desig || data.b1_cert_desig.trim() === '') {
    errors.push("भाग 9: कृपया प्रमाण-पत्र में पदनाम भरें।");
  }

  // Annual Part-II validation if applicable
  if (showPart2) {
    if (num(data.b2_s3_comp_trained) > num(data.b2_s3_comp_total)) {
      errors.push("वार्षिक भाग 2(3): प्रशिक्षित कार्मिक कुल कार्मिकों से अधिक नहीं हो सकते।");
    }
    if (num(data.b2_s4_laptop_unicode) > num(data.b2_s4_laptop_total)) {
      errors.push("वार्षिक भाग 2(4): यूनिकोड सक्षम लैपटॉप कुल लैपटॉप से अधिक नहीं हो सकते।");
    }
    if (num(data.b2_s9_pub_hindi) + num(data.b2_s9_pub_eng) > num(data.b2_s9_pub_total) && num(data.b2_s9_pub_total) > 0) {
      errors.push("वार्षिक भाग 2(9): हिंदी और अंग्रेजी प्रकाशनों का योग कुल प्रकाशनों से अधिक नहीं हो सकता।");
    }
    if (num(data.b2_s10_exp_hindi) > num(data.b2_s10_exp_total)) {
      errors.push("वार्षिक भाग 2(10): हिंदी पुस्तकों पर व्यय कुल व्यय से अधिक नहीं हो सकता।");
    }
  }

  return errors;
}

export function hindiPct(part, total) {
  if (!total || num(total) <= 0) return '-';
  return `${Math.round((num(part) / num(total)) * 100)}%`;
}

export { QUARTERS };
