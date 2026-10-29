import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS } from './AuthContext';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, loginAsDemoRole } = useAuth();

  const handleLogin = async (e) => {
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

  const handleQuickLogin = (roleKey) => {
    setError('');
    loginAsDemoRole(roleKey);
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: 860 }}>
        {/* Left Branding Panel */}
        <aside className="login-aside">
          <div>
            <div className="login-mark">🏛️</div>
            <h1 style={{ fontSize: 18, fontWeight: 800, margin: '8px 0 4px', lineHeight: 1.3 }}>
              प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              राजभाषा तिमाही प्रगति रिपोर्ट (QPR) पोर्टल · अनुलग्नक-2
            </p>
            <div style={{
              marginTop: 10, fontSize: 11, background: 'rgba(255,255,255,0.14)',
              padding: '6px 12px', borderRadius: 8, display: 'inline-block'
            }}>
              गृह मंत्रालय, राजभाषा विभाग (संशोधित प्रारूप अप्रैल 2025)
            </div>
          </div>

          <div className="login-points" style={{ margin: '24px 0' }}>
            <div className="login-point"><span>📝</span><span>डिजिटल QPR फॉर्म (भाग 1 से 9)</span></div>
            <div className="login-point"><span>🔁</span><span>DEO → AAO → SAO → हिंदी प्रकोष्ठ वर्कफ़्लो</span></div>
            <div className="login-point"><span>📑</span><span>हस्ताक्षरित प्रमाण-पत्र (PDF) सुरक्षा सत्यापन</span></div>
            <div className="login-point"><span>📊</span><span>समेकित राजभाषा प्रगति रिपोर्ट एवं A4 प्रिंट</span></div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 12, padding: '12px 14px', fontSize: 11.5, color: '#f1f5f9', lineHeight: 1.5
          }}>
            <div style={{ textTransform: 'uppercase', fontSize: 9.5, letterSpacing: '0.06em', color: '#93c5fd', fontWeight: 800 }}>
              अभिकल्पना एवं विकास (Developer Credit)
            </div>
            <div style={{ marginTop: 4, fontWeight: 650 }}>
              Designed and Developed by: Bharat Bhushan, Senior Translation Officer (STO), Office of the Principal Director of Audit (PDA), Railway, Mumbai.
            </div>
          </div>
        </aside>

        {/* Right Form & Quick Access Panel */}
        <div className="login-main">
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>पोर्टल लॉगिन</h2>
          <p className="login-sub" style={{ margin: '0 0 20px', color: '#64748b', fontSize: 13 }}>
            अपने विभागीय क्रेडेंशियल्स दर्ज करें अथवा त्वरित परीक्षण का उपयोग करें
          </p>

          <form onSubmit={handleLogin}>
            <div className="field" style={{ marginBottom: 14 }}>
              <label className="field-label" style={{ fontWeight: 700, fontSize: 12.5 }}>ईमेल आईडी / Email ID</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your-email@railway.gov.in"
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label" style={{ fontWeight: 700, fontSize: 12.5 }}>पासवर्ड / Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="login-error" style={{ marginBottom: 16, padding: '9px 12px', fontSize: 13, background: '#fee2e2', color: '#dc2626', borderRadius: 8, fontWeight: 600 }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: '12px 18px', fontSize: 14, fontWeight: 700 }}>
              {loading ? 'सत्यापन हो रहा है...' : 'लॉगिन करें →'}
            </button>
          </form>

          {/* 1-Click Quick Test Credentials Section */}
          <div style={{
            marginTop: 22, paddingTop: 18, borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10
            }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#334155' }}>
                ⚡ त्वरित परीक्षण लॉगिन (1-Click Test Login):
              </span>
              <span style={{ fontSize: 10.5, color: '#64748b' }}>पासवर्ड: password123</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleQuickLogin('deo')}
                style={{ textAlign: 'left', background: '#eef2ff', borderColor: '#c7d2fe', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: 800, color: '#4338ca', fontSize: 12 }}>🏢 DEO / Clerk</div>
                <div style={{ fontSize: 10.5, color: '#6366f1' }}>deo@railway.gov.in</div>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleQuickLogin('aao')}
                style={{ textAlign: 'left', background: '#f0f9ff', borderColor: '#bae6fd', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: 800, color: '#0369a1', fontSize: 12 }}>🔎 AAO (सत्यापन)</div>
                <div style={{ fontSize: 10.5, color: '#0ea5e9' }}>aao@railway.gov.in</div>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleQuickLogin('sao')}
                style={{ textAlign: 'left', background: '#ecfdf5', borderColor: '#a7f3d0', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: 800, color: '#047857', fontSize: 12 }}>✅ SAO (स्वीकृति)</div>
                <div style={{ fontSize: 10.5, color: '#10b981' }}>sao@railway.gov.in</div>
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleQuickLogin('hindi_cell')}
                style={{ textAlign: 'left', background: '#fffbeb', borderColor: '#fde68a', padding: '8px 10px' }}
              >
                <div style={{ fontWeight: 800, color: '#b45309', fontSize: 12 }}>🏛️ हिंदी प्रकोष्ठ</div>
                <div style={{ fontSize: 10.5, color: '#f59e0b' }}>hindi@railway.gov.in</div>
              </button>
            </div>
          </div>

          <p className="login-foot" style={{ marginTop: 20, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
            © 2026 · राजभाषा QPR पोर्टल · प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
          </p>
        </div>
      </div>
    </div>
  );
};
