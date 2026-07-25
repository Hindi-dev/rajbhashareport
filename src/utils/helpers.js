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

export function validateReport(data) {
  const warnings = [];
  if (!data.officeNameAddress) warnings.push("कृपया कार्यालय का पता भरें।");
  if (!data.officerPhone) warnings.push("कृपया फोन नंबर भरें।");
  if (!data.officerEmail) warnings.push("कृपया ईमेल भरें।");
  const totalIssued = parseInt(data.b1_s3_total_issued) || 0;
  const sum = (parseInt(data.b1_s3_bilingual)||0) + (parseInt(data.b1_s3_english_only)||0) + (parseInt(data.b1_s3_hindi_only)||0);
  if (totalIssued !== 0 && sum !== totalIssued) {
    warnings.push(`धारा 3(3) कुल जारी (${totalIssued}) द्विभाषी+अंग्रेजी+हिंदी (${sum}) से मेल नहीं खाता।`);
  }
  return warnings;
}