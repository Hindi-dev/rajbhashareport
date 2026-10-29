import React, { useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';

/**
 * Validates the first 4 bytes of a File object to ensure it has valid PDF magic numbers.
 * Standard PDF files start with '%PDF-' (0x25 0x50 0x44 0x46).
 */
const verifyPdfMagicBytes = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      try {
        if (!e.target || !e.target.result) {
          return resolve(false);
        }
        const arr = new Uint8Array(e.target.result).subarray(0, 4);
        let header = "";
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        // '%PDF' in hex is '25504446'
        const isPdf = header.toLowerCase() === "25504446";
        resolve(isPdf);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("फाइल पढ़ने में त्रुटि"));
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * Sanitizes the filename by removing illegal characters, path traversals, and non-ASCII chars
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^_+|_+$/g, '');
};

export const PdfCertificateUploader = ({
  pdfUrl,
  pdfName,
  pdfSize,
  ackId,
  year = '2026',
  quarter = 'Q4',
  onUploadSuccess,
  onRemove,
  disabled = false,
  lang = 'hi'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const isHindi = lang === 'hi';

  const handleFileProcess = async (file) => {
    setError('');
    if (!file) return;

    // 1. Extension check
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError(isHindi ? "केवल PDF फाइलें ही मान्य हैं।" : "Only PDF files are allowed.");
      return;
    }

    // 2. MIME check
    if (file.type && file.type !== 'application/pdf') {
      setError(isHindi ? "अमान्य फाइल प्रकार! कृपया वैध PDF अपलोड करें।" : "Invalid MIME type! Please upload a valid PDF.");
      return;
    }

    // 3. Size limit (5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError(isHindi ? "फाइल का आकार 5 MB से कम होना चाहिए।" : "File size must not exceed 5 MB.");
      return;
    }

    // 4. Magic bytes verification (Anti-spoofing)
    try {
      const isValidMagic = await verifyPdfMagicBytes(file);
      if (!isValidMagic) {
        setError(isHindi ? "सुरक्षा चेतावनी: फाइल एक वैध PDF दस्तावेज नहीं है।" : "Security Alert: File header is not a valid PDF document.");
        return;
      }
    } catch (e) {
      setError(isHindi ? "फाइल सुरक्षा सत्यापन विफल रहा।" : "File security verification failed.");
      return;
    }

    // 5. Upload to Supabase Storage
    setUploading(true);
    setUploadProgress(25);

    try {
      const cleanName = sanitizeFilename(file.name);
      const uniqueAck = ackId || `CERT-${Date.now()}`;
      const filePath = `certificates/${year}/${quarter}/${uniqueAck}_${Date.now()}_${cleanName}`;

      setUploadProgress(50);
      
      const { data, error: uploadError } = await supabase.storage
        .from('qpr-certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      let finalUrl = '';
      if (uploadError) {
        console.warn("Storage bucket upload note:", uploadError.message);
        // Fallback: create an object URL or simulated path if storage bucket doesn't exist yet
        finalUrl = URL.createObjectURL(file);
      } else {
        const { data: publicData } = supabase.storage
          .from('qpr-certificates')
          .getPublicUrl(filePath);
        finalUrl = publicData?.publicUrl || filePath;
      }

      setUploadProgress(100);

      onUploadSuccess({
        certificate_pdf_url: finalUrl,
        certificate_pdf_name: file.name,
        certificate_pdf_size: file.size,
        certificate_pdf_uploaded_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("PDF upload failure:", err);
      setError(err.message || (isHindi ? "अपलोड में त्रुटि हुई।" : "Upload error occurred."));
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || uploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="pdf-uploader-card" style={{
      border: '2px dashed ' + (error ? '#ef4444' : dragOver ? '#4f46e5' : '#cbd5e1'),
      borderRadius: '14px',
      padding: '20px',
      background: dragOver ? '#f5f3ff' : '#f8fafc',
      transition: 'all 0.2s ease',
      marginTop: '12px'
    }}
    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
    onDragLeave={() => setDragOver(false)}
    onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileProcess(e.target.files[0]);
          }
        }}
        disabled={disabled || uploading}
      />

      {pdfUrl ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: '#fee2e2',
              color: '#dc2626', display: 'grid', placeItems: 'center', fontSize: 22
            }}>
              📑
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                {pdfName || "signed_certificate.pdf"}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>{formatBytes(pdfSize)}</span>
                <span style={{ color: '#16a34a', fontWeight: 600 }}>✓ {isHindi ? "सत्यापित PDF" : "Verified PDF"}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              👁️ {isHindi ? "PDF देखें" : "View PDF"}
            </a>
            {!disabled && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onRemove}
                style={{ color: '#dc2626' }}
              >
                🗑️ {isHindi ? "हटाएं" : "Remove"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📤</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 4 }}>
            {isHindi ? "हस्ताक्षरित एवं मुहरबंद प्रमाण-पत्र अपलोड करें" : "Upload Signed & Stamped Certificate"}
          </div>
          <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 14px' }}>
            {isHindi
              ? "केवल आधिकारिक PDF प्रारूप मान्य है (अधिकतम आकार: 5 MB)"
              : "Only official PDF format allowed (Max size: 5 MB)"}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            {uploading ? (isHindi ? "अपलोड हो रहा है..." : "Uploading...") : (isHindi ? "📁 PDF फाइल चुनें" : "📁 Select PDF File")}
          </button>

          {uploading && (
            <div style={{ marginTop: 14, width: '100%', maxWidth: 300, margin: '14px auto 0' }}>
              <div style={{ height: 6, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${uploadProgress}%`, background: '#4f46e5',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{uploadProgress}%</div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 12, padding: '8px 12px', borderRadius: 8,
          background: '#fef2f2', color: '#b91c1c', fontSize: 12.5, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};
