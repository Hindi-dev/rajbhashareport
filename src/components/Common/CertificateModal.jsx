import React, { useState } from 'react';
import { Inp, Grid } from './UIComponents';

export const CertificateModal = ({ report, onConfirm, onCancel }) => {
  const [cert, setCert] = useState({
    b1_cert_name: report.b1_cert_name || "",
    b1_cert_desig: report.b1_cert_desig || "",
    b1_cert_phone: report.b1_cert_phone || "",
    b1_cert_date: report.b1_cert_date || "",
    b1_cert_place: report.b1_cert_place || "",
    b1_cert_agreed: report.b1_cert_agreed || false,
  });
  const setC = (k, v) => setCert(c => ({ ...c, [k]: v }));

  const handleSubmit = () => {
    if (!cert.b1_cert_name || !cert.b1_cert_desig || !cert.b1_cert_phone || !cert.b1_cert_date || !cert.b1_cert_place) {
      alert("कृपया प्रमाण-पत्र के सभी फ़ील्ड भरें।");
      return;
    }
    if (!cert.b1_cert_agreed) {
      alert("कृपया प्रमाण-पत्र की सहमति चेकबॉक्स टिक करें।");
      return;
    }
    onConfirm(cert);
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: "#fff", borderRadius: "16px", maxWidth: 600, width: "90%", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>📜 भाग-I प्रमाण-पत्र</h3>
        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 20 }}>
          “मैं यह प्रमाणित करता/करती हूं कि संलग्न ....................को समाप्त तिमाही प्रगति रिपोर्ट(भाग-I/II) में दी गई सूचना उपलब्ध अभिलेखों के आधार पर बनाई गई है तथा मेरी जानकारी के अनुसार पूर्णतया सत्य है। मैं यह अच्छी तरह से समझता/समझती हूं कि राजभाषा अधिनियम, 1963 एवं राजभाषा नियम, 1976 के उपबंधों में दिए गए निदेशों के समुचित अनुपालन की जिम्मेदारी अधोहस्ताक्षरी की है। यदि किसी स्टेज पर रिपोर्ट में भरे गए आंकड़े असत्य अथवा बढ़ा-चढ़ा कर दिखाए गए पाए जाते हैं तो इस कार्यालय को अगले 03 वर्षों के लिए राजभाषा पुरस्कार से विचित कर दिया जाएगा तथा गलत सूचना देने के लिए कार्रवाई हेतु मामला मेरे नियंत्रक कार्यालय/मंत्रालय/मुख्यालय के संज्ञान में भी लाया जाएगा।”
        </p>
        <Grid cols={2}>
          <Inp label="अध्यक्ष का नाम" value={cert.b1_cert_name} onChange={v => setC("b1_cert_name", v)} />
          <Inp label="पदनाम" value={cert.b1_cert_desig} onChange={v => setC("b1_cert_desig", v)} />
          <Inp label="फोन नंबर" value={cert.b1_cert_phone} onChange={v => setC("b1_cert_phone", v)} />
          <Inp label="तिथि" type="date" value={cert.b1_cert_date} onChange={v => setC("b1_cert_date", v)} />
          <Inp label="स्थान" value={cert.b1_cert_place} onChange={v => setC("b1_cert_place", v)} />
        </Grid>
        <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", fontWeight: 700, color: "#991b1b", cursor: "pointer" }}>
          <input type="checkbox" checked={cert.b1_cert_agreed} onChange={e => setC("b1_cert_agreed", e.target.checked)} style={{ width: 20, height: 20 }} />
          मैंने उपर्युक्त प्रमाण-पत्र पढ़ लिया है और मैं इससे सहमत हूँ।
        </label>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", fontWeight: 700, cursor: "pointer" }}>रद्द करें</button>
          <button onClick={handleSubmit} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontWeight: 700, cursor: "pointer" }}>✅ पुष्टि करें</button>
        </div>
      </div>
    </div>
  );
};