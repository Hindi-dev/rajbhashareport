import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS } from './AuthContext';

/* ---------- Role definitions with distinct administrative identity ---------- */
const ROLES_LIST = [
  {
    key: 'deo',
    icon: '📝',
    badge: 'प्रवेश / DEO',
    title: 'डाटा एंट्री ऑपरेटर / अनुभाग',
    titleEn: 'Data Entry Operator / Section',
    name: 'श्री राजेश कुमार',
    section: 'प्रशासन अनुभाग',
    color: '#4f46e5',
    bg: '#eef2ff',
    border: '#c7d2fe',
    accentGrad: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
  },
  {
    key: 'aao',
    icon: '🔍',
    badge: 'सत्यापन / AAO',
    title: 'सहायक लेखापरीक्षा अधिकारी',
    titleEn: 'Asst. Audit Officer (Review)',
    name: 'श्री सुनील शर्मा',
    section: 'प्रशासन मुख्यालय',
    color: '#0284c7',
    bg: '#f0f9ff',
    border: '#bae6fd',
    accentGrad: 'linear-gradient(135deg, #0284c7, #2563eb)'
  },
  {
    key: 'sao',
    icon: '✅',
    badge: 'स्वीकृति / SAO',
    title: 'वरिष्ठ लेखापरीक्षा अधिकारी',
    titleEn: 'Senior Audit Officer (Approve)',
    name: 'श्री अनिल मेहता',
    section: 'प्रशासन मुख्यालय',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    accentGrad: 'linear-gradient(135deg, #059669, #0d9488)'
  },
  {
    key: 'hindi_cell',
    icon: '🏛️',
    badge: 'प्रकोष्ठ / Admin',
    title: 'हिंदी प्रकोष्ठ / राजभाषा विभाग',
    titleEn: 'Official Language Cell (STO)',
    name: 'श्री भारत भूषण (STO)',
    section: 'राजभाषा विभाग (सभी अनुभाग)',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    accentGrad: 'linear-gradient(135deg, #d97706, #e11d48)'
  }
];

export const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' (default) | 'test_running'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loggingInRole, setLoggingInRole] = useState(null);
  const { signIn, loginAsDemoRole } = useAuth();

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || "ईमेल या पासवर्ड गलत है।");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = (roleKey) => {
    setLoggingInRole(roleKey);
    setError('');
    setTimeout(() => {
      loginAsDemoRole(roleKey);
    }, 280);
  };

  const prefillRoleCredentials = (roleKey) => {
    const acc = DEMO_ACCOUNTS[roleKey];
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setActiveTab('credentials');
    }
  };

  return (
    <div className="login-root">
      {/* 1. Official Government Tri-Color Accent Ribbon */}
      <div className="login-tricolor" />

      {/* Ambient background glow elements (Zero CPU, 100% pure CSS) */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />
      <div className="login-bg-grid" />

      {/* 2. Top Section: Centered Header Text (पेज के सबसे ऊपर - मिडल में अलाइन) */}
      <header className="top-header-section">
        <div className="emblem-pill-box">
          <div className="emblem-icon-circle">🏛️</div>
          <span className="motto-text">लोकहितार्थ सत्यनिष्ठा</span>
          <span className="cag-divider">|</span>
          <span className="cag-subtext">CAG · INDIAN AUDIT & ACCOUNTS DEPT.</span>
        </div>

        <h1 className="main-office-title">
          प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
        </h1>
        <p className="main-office-sub">
          Office of the Principal Director of Audit (PDA), Railway, Mumbai
        </p>

        <div className="system-pill">
          <span className="dot" />
          <span>राजभाषा तिमाही प्रगति रिपोर्ट (QPR) प्रणाली · अनुलग्नक-2 (संशोधित प्रारूप)</span>
        </div>
      </header>

      {/* 3. Center Section: Professional Login Card (पेज के मध्य में) */}
      <main className="central-stage">
        <div className="login-card">
          <div className="card-top-row">
            <div className="auth-badge">
              <span>🔒</span>
              <span>विभागीय प्रमाणीकरण पोर्टल</span>
            </div>
            <div className="ssl-badge">
              ✓ 256-Bit SSL
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'credentials' ? 'active' : ''}`}
              onClick={() => { setActiveTab('credentials'); setError(''); }}
            >
              <span>🔑 विभागीय लॉगिन</span>
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeTab === 'test_running' ? 'active' : ''}`}
              onClick={() => { setActiveTab('test_running'); setError(''); }}
            >
              <span>🧪 विकल्प: टैस्ट रनिंग</span>
              <span className="tab-badge">04 फील्ड्स</span>
            </button>
          </div>

          {/* TAB 1: Departmental Credentials Form */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="credentials-form">
              <div className="field-group">
                <label className="field-label">विभागीय ईमेल आईडी (Official Email ID)</label>
                <div className="field-input-box">
                  <span className="field-icon">📧</span>
                  <input
                    type="email"
                    className="field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@cag.gov.in / railway.gov.in"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <div className="label-row">
                  <label className="field-label">पासवर्ड (Password)</label>
                  <span className="hint-pill">डिफ़ॉल्ट: password123</span>
                </div>
                <div className="field-input-box">
                  <span className="field-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="field-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pwd-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    title={showPassword ? "पासवर्ड छिपाएं" : "पासवर्ड देखें"}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-alert">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'प्रमाणीकरण हो रहा है...' : 'पोर्टल में सुरक्षित प्रवेश करें (Sign In) →'}
              </button>

              {/* 'टैस्ट रनिंग' विकल्प कार्ड (Test Running Option Card inside Credentials) */}
              <div className="test-option-card">
                <div className="test-option-badge-row">
                  <span className="test-badge">🧪 विकल्प: टैस्ट रनिंग (Test Running)</span>
                  <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700 }}>त्वरित डेमो</span>
                </div>
                <p className="test-option-desc">
                  परीक्षण हेतु किसी भी भूमिका कार्ड पर क्लिक करके सीधे डैशबोर्ड में प्रवेश किया जा सकता है:
                </p>
                <button
                  type="button"
                  className="btn-open-test"
                  onClick={() => { setActiveTab('test_running'); setError(''); }}
                >
                  🚀 'टैस्ट रनिंग' के 04 फील्ड देखें (DEO, AAO, SAO, हिंदी प्रकोष्ठ) →
                </button>

                <div className="quick-fill-row">
                  <span className="quick-fill-label">क्रेडेंशियल्स स्वतः भरें (Autofill):</span>
                  <div className="quick-fill-chips">
                    {ROLES_LIST.map(r => (
                      <button
                        key={r.key}
                        type="button"
                        className="fill-chip"
                        onClick={() => prefillRoleCredentials(r.key)}
                        title={`${r.name} (${r.title})`}
                      >
                        {r.icon} {r.badge.split(' / ')[1] || r.key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Dedicated 'Test Running' Option (04 Role Fields) */}
          {activeTab === 'test_running' && (
            <div className="test-running-view">
              <div className="test-running-header">
                <div className="test-running-badge-pill">
                  <span>🧪</span>
                  <span>विकल्प: टैस्ट रनिंग (Test Running Mode)</span>
                </div>
                <div className="test-running-instruction">
                  <span className="inst-icon">💡</span>
                  <span>
                    <strong>परीक्षण हेतु किसी भी भूमिका कार्ड पर क्लिक करके सीधे डैशबोर्ड में प्रवेश किया जा सकता है:</strong>
                  </span>
                </div>
              </div>

              {/* 04 Role Cards */}
              <div className="roles-grid">
                {ROLES_LIST.map((r) => {
                  const isProcessing = loggingInRole === r.key;
                  return (
                    <div
                      key={r.key}
                      className={`role-card-item ${isProcessing ? 'is-processing' : ''}`}
                      style={{ borderLeft: `3.5px solid ${r.color}` }}
                      onClick={() => !loggingInRole && handleQuickRoleLogin(r.key)}
                    >
                      <div className="role-card-top">
                        <span className="role-badge" style={{ background: r.bg, color: r.color, border: `1px solid ${r.border}` }}>
                          {r.badge}
                        </span>
                        <span style={{ fontSize: '16px' }}>{r.icon}</span>
                      </div>

                      <div>
                        <div className="role-title">{r.title}</div>
                        <div className="role-name">{r.name} ({r.section})</div>
                      </div>

                      <button
                        type="button"
                        className="btn-role-enter"
                        style={{ background: isProcessing ? '#0f172a' : r.accentGrad }}
                        disabled={Boolean(loggingInRole)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickRoleLogin(r.key);
                        }}
                      >
                        {isProcessing ? 'प्रवेश हो रहा है...' : 'सीधे प्रवेश करें →'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="test-running-footer-row">
                <button
                  type="button"
                  className="btn-back-to-credentials"
                  onClick={() => { setActiveTab('credentials'); setError(''); }}
                >
                  ← विभागीय लॉगिन फॉर्म पर वापस जाएं
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 4. Bottom Section: Developer Credits (पेज में सबसे नीचे - फुल-विड्थ कैनवा बार) */}
      <footer className="bottom-footer-section">
        <div className="developer-bar-canva">
          <div className="dev-left-info">
            <div className="dev-star-badge">✦</div>
            <div>
              <div className="dev-tagline">अभिकल्पना एवं विकास (DESIGNED & DEVELOPED BY)</div>
              <div className="dev-name-title">
                <strong>भारत भूषण</strong> · वरिष्ठ अनुवाद अधिकारी (वरि.अ.अधि. / STO)
              </div>
              <div className="dev-office-inline">
                कार्यालय प्रधान निदेशक लेखापरीक्षा (रेलवे), मुंबई · Western Railway
              </div>
            </div>
          </div>

          <div className="security-copyright-strip">
            <div><strong>🛡️ सुरक्षित 256-बिट SSL</strong> एन्क्रिप्टेड शासकीय सर्वर</div>
            <div style={{ marginTop: '2px' }}>© 2026 भारत सरकार · सर्वाधिकार सुरक्षित</div>
          </div>
        </div>
      </footer>

      {/* Component Styles (Optimized, Responsive & Fast to Load) */}
      <style>{`
        .login-root {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(145deg, #09081a 0%, #110e30 40%, #1e164d 75%, #0f0b29 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Plus Jakarta Sans', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
          color: #ffffff;
        }

        /* Official Government Tri-Color Accent Ribbon */
        .login-tricolor {
          height: 4px;
          width: 100%;
          background: linear-gradient(90deg, #ff9933 0%, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
        }

        /* Ambient Glow Background Orbs */
        .login-bg-glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
          opacity: 0.35;
        }
        .glow-1 {
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 350px;
          background: radial-gradient(circle, #6366f1 0%, #a855f7 60%, transparent 100%);
        }
        .glow-2 {
          bottom: -80px;
          left: 20%;
          width: 450px;
          height: 280px;
          background: radial-gradient(circle, #0284c7 0%, #4338ca 70%, transparent 100%);
        }
        .login-bg-grid {
          position: fixed;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* ============================================================
           1. Top Section: Centered Header Text (पेज के सबसे ऊपर)
           ============================================================ */
        .top-header-section {
          text-align: center;
          padding: 30px 20px 14px;
          position: relative;
          z-index: 10;
          max-width: 980px;
          margin: 0 auto;
        }
        .emblem-pill-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1.5px solid rgba(254, 240, 138, 0.38);
          border-radius: 999px;
          padding: 6px 18px 6px 10px;
          margin-bottom: 14px;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        .emblem-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(254, 240, 138, 0.5);
          display: grid;
          place-items: center;
          font-size: 19px;
        }
        .motto-text {
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.07em;
          color: #fef08a;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .cag-divider {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 300;
        }
        .cag-subtext {
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.9);
        }

        .main-office-title {
          font-size: 26px;
          font-weight: 900;
          line-height: 1.32;
          margin: 0 0 6px;
          color: #ffffff;
          letter-spacing: -0.015em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }
        .main-office-sub {
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
          margin: 0 0 14px;
          letter-spacing: 0.01em;
        }
        .system-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(90deg, rgba(79, 70, 229, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%);
          border: 1px solid rgba(192, 132, 252, 0.4);
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          color: #f3e8ff;
          box-shadow: 0 2px 12px rgba(126, 34, 206, 0.18);
          backdrop-filter: blur(8px);
        }
        .system-pill .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }

        /* ============================================================
           2. Center Section: Professional Login Card (पेज के मध्य में)
           ============================================================ */
        .central-stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px 20px;
          position: relative;
          z-index: 10;
        }
        .login-card {
          width: 100%;
          max-width: 520px;
          background: rgba(255, 255, 255, 0.96);
          color: #0f172a;
          border-radius: 24px;
          padding: 26px 28px;
          box-shadow: 0 24px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          box-sizing: border-box;
          animation: fade-in 0.3s ease;
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 750;
          color: #4338ca;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .ssl-badge {
          font-size: 10.5px;
          color: #059669;
          font-weight: 700;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* Nav Tabs */
        .nav-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 18px;
        }
        .nav-tab-btn {
          padding: 9px 12px;
          border: none;
          border-radius: 9px;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 750;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          color: #64748b;
          background: transparent;
        }
        .nav-tab-btn.active {
          background: #ffffff;
          color: #4338ca;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .tab-badge {
          font-size: 9.5px;
          padding: 2px 6px;
          border-radius: 12px;
          background: #fef3c7;
          color: #92400e;
          font-weight: 800;
        }

        /* Form Fields */
        .credentials-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .field-label {
          font-size: 12px;
          font-weight: 750;
          color: #1e293b;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hint-pill {
          font-size: 10px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .field-input-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 12px;
          font-size: 15px;
          color: #94a3b8;
          pointer-events: none;
        }
        .field-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          background: #f8fafc;
          color: #0f172a;
          box-sizing: border-box;
          transition: all 0.18s ease;
        }
        .field-input:focus {
          border-color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }
        .pwd-toggle {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          color: #64748b;
        }

        .error-alert {
          padding: 9px 12px;
          border-radius: 9px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-submit {
          width: 100%;
          padding: 12px 18px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
          margin-top: 2px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45);
        }
        .btn-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Test Running Option Card inside Credentials view */
        .test-option-card {
          margin-top: 14px;
          padding: 12px 14px;
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .test-option-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .test-badge {
          font-size: 11px;
          font-weight: 800;
          color: #b45309;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .test-option-desc {
          font-size: 11.5px;
          color: #475569;
          margin: 0;
          line-height: 1.4;
          font-weight: 600;
        }
        .btn-open-test {
          width: 100%;
          padding: 8px 12px;
          border: 1.5px solid #a5b4fc;
          background: #ffffff;
          color: #4338ca;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 750;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .btn-open-test:hover {
          background: #eef2ff;
          border-color: #6366f1;
        }

        .quick-fill-row {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-top: 7px;
          border-top: 1px dashed #e2e8f0;
        }
        .quick-fill-label {
          font-size: 10.5px;
          font-weight: 700;
          color: #64748b;
        }
        .quick-fill-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .fill-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 7px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .fill-chip:hover {
          background: #eef2ff;
          color: #4f46e5;
          border-color: #c7d2fe;
        }

        /* Test Running View (Tab 2) */
        .test-running-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: fade-in 0.22s ease;
        }
        .test-running-header {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .test-running-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #b45309;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 2px 8px;
          border-radius: 999px;
          align-self: flex-start;
        }
        .test-running-instruction {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 11.5px;
          color: #1e293b;
          line-height: 1.45;
        }
        .inst-icon {
          font-size: 15px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Roles Grid */
        .roles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .role-card-item {
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .role-card-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
          border-color: #6366f1;
        }
        .role-card-item.is-processing {
          opacity: 0.7;
          pointer-events: none;
        }
        .role-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .role-badge {
          display: inline-block;
          font-size: 9.5px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 999px;
        }
        .role-title {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.3;
        }
        .role-name {
          font-size: 10.5px;
          color: #64748b;
          margin-top: 3px;
          font-weight: 600;
        }
        .btn-role-enter {
          margin-top: 8px;
          padding: 6px 10px;
          border: none;
          border-radius: 7px;
          color: #fff;
          font-family: inherit;
          font-size: 10.5px;
          font-weight: 750;
          cursor: pointer;
          text-align: center;
          transition: all 0.18s ease;
        }
        .btn-role-enter:hover {
          filter: brightness(1.08);
        }

        .test-running-footer-row {
          display: flex;
          justify-content: center;
          padding-top: 4px;
        }
        .btn-back-to-credentials {
          padding: 7px 14px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .btn-back-to-credentials:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* ============================================================
           3. Bottom Section: Developer Credits Bar (पेज में सबसे नीचे)
           ============================================================ */
        .bottom-footer-section {
          width: 100%;
          padding: 14px 20px 18px;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
          max-width: 980px;
          margin: 0 auto;
        }
        .developer-bar-canva {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.85) 100%);
          border: 1.5px solid rgba(254, 240, 138, 0.4);
          border-radius: 16px;
          padding: 12px 20px;
          backdrop-filter: blur(14px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .dev-left-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dev-star-badge {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(254, 240, 138, 0.15);
          border: 1px solid rgba(254, 240, 138, 0.4);
          display: grid;
          place-items: center;
          color: #fde047;
          font-size: 16px;
          flex-shrink: 0;
        }
        .dev-tagline {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #fde047;
          text-transform: uppercase;
        }
        .dev-name-title {
          font-size: 13px;
          color: #ffffff;
          font-weight: 700;
          margin-top: 2px;
        }
        .dev-name-title strong {
          color: #ffffff;
          font-weight: 900;
        }
        .dev-office-inline {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 1px;
        }
        .security-copyright-strip {
          text-align: right;
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
        }
        .security-copyright-strip strong {
          color: #4ade80;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ============================================================
           Responsive Breakpoints for Mobile, Tablet & Wide Screens
           ============================================================ */
        @media (max-width: 720px) {
          .top-header-section {
            padding: 20px 14px 10px;
          }
          .main-office-title {
            font-size: 20px;
          }
          .emblem-pill-box {
            flex-direction: column;
            gap: 4px;
            border-radius: 18px;
            padding: 8px 14px;
          }
          .cag-divider {
            display: none;
          }
          .central-stage {
            padding: 10px 14px 16px;
          }
          .login-card {
            padding: 20px 16px;
            border-radius: 18px;
          }
          .roles-grid {
            grid-template-columns: 1fr;
          }
          .bottom-footer-section {
            padding: 10px 14px 16px;
          }
          .developer-bar-canva {
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            gap: 10px;
          }
          .security-copyright-strip {
            text-align: left;
          }
          .field-input {
            font-size: 16px; /* Prevents auto-zoom on iOS Safari */
          }
        }
      `}</style>
    </div>
  );
};
