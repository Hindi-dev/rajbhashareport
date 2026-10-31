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

/* ---------- Key portal capabilities ---------- */
const CAPABILITIES = [
  { icon: '📋', title: 'डिजिटल QPR फॉर्म (भाग 1‒9)', desc: 'गृह मंत्रालय के अप्रैल 2025 संशोधित प्रारूप के पूर्णतः अनुरूप' },
  { icon: '🔄', title: '4-स्तरीय प्रशासनिक वर्कफ़्लो', desc: 'DEO → AAO सत्यापन → SAO स्वीकृति → हिंदी प्रकोष्ठ अंतिम अनुमोदन' },
  { icon: '📑', title: 'हस्ताक्षरित PDF प्रमाण-पत्र', desc: 'डिजिटल सत्यापन, हेडर बाइट्स सुरक्षा व ऑनलाइन अभिलेखागार' },
  { icon: '📊', title: 'स्वचालित समेकन एवं A4 प्रिंट', desc: 'समस्त अनुभागों की समेकित रिपोर्ट व आधिकारिक प्रिंट तैयार करना' },
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
      {/* Official Government Tri-Color Accent Ribbon */}
      <div className="login-tricolor" />

      {/* Ambient background glow elements (Zero JS, 100% pure CSS) */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />
      <div className="login-bg-grid" />

      {/* Main Glassmorphic Card Container */}
      <div className="login-container">
        {/* ── Left Branding Showcase Panel ── */}
        <div className="login-left-panel">
          {/* Header & Crest */}
          <div>
            <div className="emblem-wrapper">
              <div className="emblem-icon">🏛️</div>
              <div className="emblem-badge">
                <span className="emblem-motto">लोकहितार्थ सत्यनिष्ठा</span>
                <span className="emblem-sub">CAG · INDIAN AUDIT & ACCOUNTS DEPT.</span>
              </div>
            </div>

            <h1 className="portal-main-title">
              प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
            </h1>
            <p className="portal-sub-title">
              Office of the Principal Director of Audit (PDA), Railway, Mumbai
            </p>

            <div className="ministry-pill">
              <span className="dot" />
              <span>राजभाषा तिमाही प्रगति रिपोर्ट (QPR) प्रणाली · अनुलग्नक-2 (संशोधित प्रारूप)</span>
            </div>
          </div>

          {/* Core Feature Highlights */}
          <div className="features-stack">
            {CAPABILITIES.map((cap, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon">{cap.icon}</div>
                <div className="feature-text">
                  <div className="feature-title">{cap.title}</div>
                  <div className="feature-desc">{cap.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Official Design & Development Attribution */}
          <div className="developer-box">
            <div className="dev-header">
              <span className="sparkle">✦</span>
              <span>अभिकल्पना एवं विकास (DESIGNED & DEVELOPED BY)</span>
            </div>
            <div className="dev-author">
              <strong>भारत भूषण</strong> · वरिष्ठ अनुवाद अधिकारी (वरि.अ.अधि. / STO)
            </div>
            <div className="dev-office">
              कार्यालय प्रधान निदेशक लेखापरीक्षा (रेलवे), मुंबई · Western Railway
            </div>
          </div>
        </div>

        {/* ── Right Action / Login Form Panel ── */}
        <div className="login-right-panel">
          {/* Panel Header */}
          <div className="login-header">
            <div className="secure-badge">
              <span>🔒</span>
              <span>विभागीय प्रमाणीकरण पोर्टल (Authorized Access)</span>
            </div>
            <h2 className="login-title">पोर्टल प्रवेश (Login)</h2>
            <p className="login-desc">
              कृपया अपनी अधिकृत भूमिका का चयन करें अथवा विभागीय क्रेडेंशियल्स द्वारा लॉगिन करें
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mode-tabs">
            <button
              type="button"
              className={`mode-tab ${activeTab === 'credentials' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('credentials'); setError(''); }}
            >
              <span>🔑 विभागीय लॉगिन</span>
              <span className="tab-pill">अधिकृत</span>
            </button>
            <button
              type="button"
              className={`mode-tab ${activeTab === 'test_running' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('test_running'); setError(''); }}
            >
              <span>🧪 विकल्प: टैस्ट रनिंग</span>
              <span className="tab-pill tab-pill-test">04 फील्ड्स</span>
            </button>
          </div>

          {/* TAB 1: Departmental Credentials Form (Professional & Secure) */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsLogin} className="credentials-form">
              <div className="input-group">
                <label className="input-label">विभागीय ईमेल आईडी (Official Email ID)</label>
                <div className="input-wrapper">
                  <span className="field-icon">📧</span>
                  <input
                    type="email"
                    className="styled-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@railway.gov.in / cag.gov.in"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="label-row">
                  <label className="input-label">पासवर्ड (Password)</label>
                  <span className="hint-pill">डिफ़ॉल्ट: password123</span>
                </div>
                <div className="input-wrapper">
                  <span className="field-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="styled-input"
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
                className="btn-submit-login"
                disabled={loading}
              >
                {loading ? 'प्रमाणीकरण हो रहा है...' : 'पोर्टल में सुरक्षित प्रवेश करें (Sign In) →'}
              </button>

              {/* 'टैस्ट रनिंग' विकल्प कार्ड (Test Running Option Container) */}
              <div className="test-running-box">
                <div className="test-box-header">
                  <div className="test-box-badge">🧪 विकल्प: टैस्ट रनिंग (Test Running)</div>
                </div>
                <p className="test-box-desc">
                  परीक्षण हेतु किसी भी भूमिका कार्ड पर क्लिक करके सीधे डैशबोर्ड में प्रवेश किया जा सकता है:
                </p>
                <button
                  type="button"
                  className="btn-open-test-running"
                  onClick={() => { setActiveTab('test_running'); setError(''); }}
                >
                  <span>🚀 'टैस्ट रनिंग' के 04 फील्ड देखें एवं 1-क्लिक प्रवेश करें →</span>
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
                      className={`role-card ${isProcessing ? 'is-processing' : ''}`}
                      style={{ '--role-color': r.color, '--role-bg': r.bg, '--role-border': r.border }}
                      onClick={() => !loggingInRole && handleQuickRoleLogin(r.key)}
                    >
                      <div className="role-card-top">
                        <div className="role-icon-box" style={{ background: r.accentGrad }}>
                          {r.icon}
                        </div>
                        <span className="role-tag" style={{ color: r.color, background: r.bg, borderColor: r.border }}>
                          {r.badge}
                        </span>
                      </div>

                      <div className="role-info">
                        <div className="role-name">{r.title}</div>
                        <div className="role-name-en">{r.titleEn}</div>
                        <div className="role-meta">
                          <span className="user-icon">👤</span>
                          <span>{r.name} ({r.section})</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="role-enter-btn"
                        style={{ background: isProcessing ? '#0f172a' : r.accentGrad }}
                        disabled={Boolean(loggingInRole)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickRoleLogin(r.key);
                        }}
                      >
                        {isProcessing ? 'प्रवेश हो रहा है...' : 'सीधे डैशबोर्ड में प्रवेश करें →'}
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

          {/* Footer Legal & Security */}
          <div className="login-footer">
            <div className="security-note">
              <span>🛡️ सुरक्षित 256-बिट SSL एन्क्रिप्टेड शासकीय सर्वर</span>
            </div>
            <div className="copyright-note">
              © 2026 भारत सरकार · कार्यालय प्रधान निदेशक लेखापरीक्षा, रेलवे, मुंबई · सर्वाधिकार सुरक्षित
            </div>
          </div>
        </div>
      </div>

      {/* Component Styles (Optimized, responsive & high-speed) */}
      <style>{`
        .login-root {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: linear-gradient(135deg, #09081a 0%, #110e30 35%, #1e164d 70%, #130f33 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-sizing: border-box;
        }

        .login-tricolor {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff9933 0%, #ff9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%);
          z-index: 999;
          box-shadow: 0 0 12px rgba(255, 153, 51, 0.4);
        }

        .login-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.45;
          transform: translateZ(0);
        }
        .glow-1 {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          top: -12%;
          right: -8%;
        }
        .glow-2 {
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, #0284c7 0%, transparent 70%);
          bottom: -10%;
          left: -6%;
        }

        .login-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 1;
        }

        .login-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1080px;
          display: grid;
          grid-template-columns: 1.12fr 1fr;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 
            0 32px 80px -20px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* ── Left Showcase Panel (Canva Style Refined Aesthetics) ── */
        .login-left-panel {
          padding: 42px 38px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          background: linear-gradient(162deg, #3730a3 0%, #4338ca 32%, #581c87 75%, #6b21a8 100%);
          color: #fff;
          position: relative;
        }

        .emblem-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .emblem-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%);
          border: 1.5px solid rgba(254, 240, 138, 0.45);
          display: grid;
          place-items: center;
          font-size: 26px;
          box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.35);
          flex-shrink: 0;
        }
        .emblem-badge {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .emblem-motto {
          font-size: 15px;
          font-weight: 850;
          letter-spacing: 0.07em;
          color: #fef08a;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
          line-height: 1.25;
        }
        .emblem-sub {
          font-size: 9.5px;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 750;
        }

        .portal-main-title {
          font-size: 21.5px;
          font-weight: 850;
          line-height: 1.36;
          margin: 0 0 6px;
          color: #ffffff;
          letter-spacing: -0.015em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
        }
        .portal-sub-title {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.88);
          margin: 0 0 16px;
          line-height: 1.5;
          font-weight: 500;
        }

        .ministry-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 15px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.24);
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          backdrop-filter: blur(8px);
        }
        .ministry-pill .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }

        .features-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 8px 0;
        }
        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 12px;
          padding: 10px 14px;
          transition: background 0.2s ease, transform 0.2s ease;
          backdrop-filter: blur(6px);
        }
        .feature-item:hover {
          background: rgba(255, 255, 255, 0.14);
          transform: translateX(2px);
        }
        .feature-icon {
          font-size: 17px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .feature-title {
          font-size: 12px;
          font-weight: 750;
          color: #ffffff;
        }
        .feature-desc {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 2px;
          line-height: 1.35;
        }

        /* Developer Credits - Canva Card pinned to the very bottom */
        .developer-box {
          margin-top: auto;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 27, 75, 0.55) 100%);
          border: 1.5px solid rgba(254, 240, 138, 0.35);
          border-radius: 16px;
          padding: 14px 18px;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35);
        }
        .dev-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #fde047;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .dev-header .sparkle {
          font-size: 12px;
          color: #fde047;
          filter: drop-shadow(0 0 4px rgba(253, 224, 71, 0.6));
        }
        .dev-author {
          font-size: 13.5px;
          color: #f8fafc;
          line-height: 1.45;
          font-weight: 600;
        }
        .dev-author strong {
          color: #ffffff;
          font-weight: 850;
          letter-spacing: 0.01em;
        }
        .dev-office {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.82);
          margin-top: 3px;
          line-height: 1.4;
        }
        .dev-author {
          font-size: 13px;
          color: #f8fafc;
          line-height: 1.45;
        }
        .dev-author strong {
          color: #ffffff;
          font-weight: 800;
        }
        .dev-office {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 3px;
        }

        /* ── Right Panel ── */
        .login-right-panel {
          padding: 40px 36px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
        }

        .login-header {
          margin-bottom: 20px;
        }
        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          margin-bottom: 10px;
        }
        .login-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .login-desc {
          font-size: 12.5px;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Tabs */
        .mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 14px;
          margin-bottom: 20px;
        }
        .mode-tab {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          border: none;
          border-radius: 10px;
          background: transparent;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mode-tab.is-active {
          background: #ffffff;
          color: #4f46e5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .tab-pill {
          font-size: 9.5px;
          background: #dbeafe;
          color: #1e40af;
          padding: 2px 6px;
          border-radius: 999px;
          font-weight: 700;
        }
        .tab-pill-test {
          background: #fef3c7;
          color: #92400e;
        }

        /* Test Running Dedicated Container (Tab 2) */
        .test-running-view {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: fade-in 0.22s ease;
        }
        .test-running-header {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
          padding: 3px 10px;
          border-radius: 20px;
          align-self: flex-start;
        }
        .test-running-instruction {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: #1e293b;
          line-height: 1.45;
        }
        .inst-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .test-running-footer-row {
          display: flex;
          justify-content: center;
          padding-top: 4px;
        }
        .btn-back-to-credentials {
          padding: 9px 18px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .btn-back-to-credentials:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* Roles Grid */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 8px;
        }
        .role-card {
          border: 1.5px solid var(--role-border);
          background: var(--role-bg);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          position: relative;
        }
        .role-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);
          border-color: var(--role-color);
        }
        .role-card.is-processing {
          opacity: 0.7;
          pointer-events: none;
          transform: scale(0.98);
        }

        .role-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .role-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 18px;
          box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.2);
        }
        .role-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid;
          letter-spacing: 0.02em;
        }

        .role-info {
          margin-bottom: 12px;
        }
        .role-name {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.35;
        }
        .role-name-en {
          font-size: 10.5px;
          color: #64748b;
          margin-top: 1px;
          font-weight: 600;
        }
        .role-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #475569;
          margin-top: 6px;
          font-weight: 600;
        }

        .role-enter-btn {
          width: 100%;
          padding: 9px 12px;
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-family: inherit;
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
        }
        .role-enter-btn:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .quick-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          font-size: 11.5px;
          color: #475569;
          font-weight: 600;
        }

        /* Credentials Form */
        .credentials-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fade-in 0.25s ease;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-label {
          font-size: 12.5px;
          font-weight: 700;
          color: #1e293b;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hint-pill {
          font-size: 10.5px;
          font-weight: 700;
          color: #4f46e5;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          font-size: 15px;
          pointer-events: none;
          color: #94a3b8;
        }
        .styled-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 14px;
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .styled-input:focus {
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
          padding: 10px 14px;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 12.5px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-submit-login {
          padding: 13px 20px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #ffffff;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.4);
        }
        .btn-submit-login:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.5);
        }
        .btn-submit-login:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* 'टैस्ट रनिंग' विकल्प कार्ड (Test Running Option Card inside Credentials) */
        .test-running-box {
          margin-top: 14px;
          padding: 13px 15px;
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .test-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .test-box-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #4338ca;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 3px 10px;
          border-radius: 20px;
        }
        .test-box-desc {
          font-size: 11.5px;
          color: #475569;
          margin: 0;
          line-height: 1.45;
          font-weight: 600;
        }
        .btn-open-test-running {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #a5b4fc;
          background: #ffffff;
          color: #4338ca;
          font-family: inherit;
          font-size: 12px;
          font-weight: 750;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(67, 56, 202, 0.08);
        }
        .btn-open-test-running:hover {
          background: #eef2ff;
          border-color: #6366f1;
          transform: translateY(-1px);
        }
        .quick-fill-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-top: 8px;
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
          gap: 8px;
        }
        .fill-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          border-radius: 8px;
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

        /* Footer */
        .login-footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }
        .security-note {
          font-size: 11px;
          font-weight: 650;
          color: #059669;
          margin-bottom: 4px;
        }
        .copyright-note {
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.4;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ============================================================
           Responsive Breakpoints for Mobile, Tablet & Wide Screens
           ============================================================ */
        @media (max-width: 960px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 600px;
            border-radius: 22px;
          }
          .login-left-panel {
            padding: 32px 24px;
            gap: 20px;
          }
          .portal-main-title {
            font-size: 18px;
          }
          .features-stack {
            display: none; /* Hide dense highlights on mobile/tablet to keep load & scroll fast */
          }
          .login-right-panel {
            padding: 32px 24px;
          }
        }

        @media (max-width: 540px) {
          .login-root {
            padding: 12px 10px;
            align-items: flex-start;
          }
          .login-container {
            border-radius: 18px;
            margin-top: 8px;
            margin-bottom: 16px;
          }
          .login-left-panel {
            padding: 24px 18px;
            gap: 16px;
          }
          .emblem-icon {
            width: 44px;
            height: 44px;
            font-size: 22px;
          }
          .portal-main-title {
            font-size: 16px;
          }
          .portal-sub-title {
            font-size: 11.5px;
            margin-bottom: 12px;
          }
          .ministry-pill {
            font-size: 10px;
            padding: 5px 10px;
          }
          .developer-box {
            padding: 10px 14px;
          }
          .dev-author {
            font-size: 11.5px;
          }
          .dev-office {
            font-size: 10px;
          }

          .login-right-panel {
            padding: 24px 18px;
          }
          .login-title {
            font-size: 19px;
          }
          .mode-tabs {
            grid-template-columns: 1fr;
            gap: 4px;
          }
          .roles-grid {
            grid-template-columns: 1fr; /* Stack role cards cleanly on narrow mobile */
            gap: 10px;
          }
          .styled-input {
            font-size: 16px; /* Prevents auto-zoom on iOS Safari */
          }
        }
      `}</style>
    </div>
  );
};
