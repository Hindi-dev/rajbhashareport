import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS } from './AuthContext';

/* ---------- Animated floating dots canvas ---------- */
const FloatingDots = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf;
    const dots = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2.5 + 0.8,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.35 + 0.08,
    }));
    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > cvs.width) d.dx *= -1;
        if (d.y < 0 || d.y > cvs.height) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.o})`;
        ctx.fill();
      });
      // faint connecting lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
};

/* ---------- Role card config ---------- */
const ROLE_CARDS = [
  { key: 'deo', icon: '📝', label: 'DEO / Clerk', labelHi: 'डाटा एंट्री ऑपरेटर', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
  { key: 'aao', icon: '🔍', label: 'AAO (सत्यापन)', labelHi: 'सहायक लेखापरीक्षा अधिकारी', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)' },
  { key: 'sao', icon: '✅', label: 'SAO (स्वीकृति)', labelHi: 'वरिष्ठ लेखापरीक्षा अधिकारी', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  { key: 'hindi_cell', icon: '🏛️', label: 'हिंदी प्रकोष्ठ', labelHi: 'राजभाषा अनुभाग', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
];

/* ---------- Feature badge data ---------- */
const FEATURES = [
  { icon: '📝', text: 'डिजिटल QPR फॉर्म (भाग 1‒9)' },
  { icon: '🔄', text: 'DEO → AAO → SAO → हिंदी प्रकोष्ठ वर्कफ़्लो' },
  { icon: '📑', text: 'हस्ताक्षरित प्रमाण-पत्र PDF सुरक्षा सत्यापन' },
  { icon: '📊', text: 'समेकित रिपोर्ट एवं A4 प्रिंट निर्यात' },
];

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState(null);
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
    setActiveRole(roleKey);
    setError('');
    setTimeout(() => loginAsDemoRole(roleKey), 350);
  };

  /* ---------- Styles ---------- */
  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: 'linear-gradient(135deg, #0c0a1d 0%, #1a1145 30%, #2d1b69 60%, #1e1b4b 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', 'Noto Sans Devanagari', system-ui, sans-serif",
  };

  const glowOrb1 = {
    position: 'absolute', width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
    top: '-15%', right: '-10%', filter: 'blur(40px)',
    animation: 'pulse-glow 6s ease-in-out infinite alternate',
  };
  const glowOrb2 = {
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
    bottom: '-10%', left: '-8%', filter: 'blur(50px)',
    animation: 'pulse-glow 8s ease-in-out infinite alternate-reverse',
  };

  const cardWrap = {
    position: 'relative', zIndex: 2,
    width: '100%', maxWidth: 960,
    display: 'grid', gridTemplateColumns: '1.1fr 0.9fr',
    borderRadius: 24, overflow: 'hidden',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(30px) saturate(1.3)',
    boxShadow: '0 40px 100px -30px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
  };

  const leftPanel = {
    padding: '44px 38px',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 28,
    background: 'linear-gradient(160deg, rgba(79,70,229,0.92) 0%, rgba(124,58,237,0.9) 50%, rgba(168,85,247,0.88) 100%)',
    position: 'relative', overflow: 'hidden',
  };

  const rightPanel = {
    padding: '40px 38px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    background: 'rgba(255,255,255,0.97)',
  };

  return (
    <div style={pageStyle}>
      {/* Animated canvas */}
      <FloatingDots />

      {/* Ambient glow orbs */}
      <div style={glowOrb1} />
      <div style={glowOrb2} />

      {/* Keyframe injection */}
      <style>{`
        @keyframes pulse-glow {
          0% { transform: scale(1) translate(0,0); opacity: 0.7; }
          100% { transform: scale(1.15) translate(20px, -10px); opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .login-role-btn {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .login-role-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -6px rgba(0,0,0,0.15);
        }
        .login-role-btn:active { transform: translateY(0); }
        .login-input-pro {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          background: #f8fafc;
          color: #0f172a;
          transition: all 0.2s ease;
          outline: none;
        }
        .login-input-pro:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .login-submit-btn {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .login-submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 30px -8px rgba(79,70,229,0.5);
        }
        .login-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        @media (max-width: 820px) {
          .login-grid-responsive { grid-template-columns: 1fr !important; }
          .login-left-responsive { padding: 28px 24px !important; }
          .login-right-responsive { padding: 28px 24px 36px !important; }
        }
      `}</style>

      <div style={cardWrap} className="login-grid-responsive">
        {/* ── Left Branding Panel ── */}
        <div style={leftPanel} className="login-left-responsive">
          {/* Decorative circles */}
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', right: -120, bottom: -130 }} />
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', left: -60, top: -40 }} />

          {/* Top branding */}
          <div style={{ position: 'relative', zIndex: 1, animation: 'slide-up 0.5s ease' }}>
            {/* Emblem */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'rgba(255,255,255,0.18)',
              display: 'grid', placeItems: 'center', fontSize: 32,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 20px -8px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              marginBottom: 18,
            }}>🏛️</div>

            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.3, color: '#fff' }}>
              प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: '0 0 8px', lineHeight: 1.6, fontWeight: 500 }}>
              राजभाषा तिमाही प्रगति रिपोर्ट (QPR) पोर्टल
            </p>

            {/* Ministry badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10, padding: '6px 14px',
              fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(6px)',
            }}>
              📋 अनुलग्नक-2 · गृह मंत्रालय, राजभाषा विभाग (संशोधित प्रारूप अप्रैल 2025)
            </div>
          </div>

          {/* Feature badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1, animation: 'slide-up 0.7s ease' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                fontSize: 12.5, color: 'rgba(255,255,255,0.92)', fontWeight: 500,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 10,
                  display: 'grid', placeItems: 'center', fontSize: 14,
                  background: 'rgba(255,255,255,0.14)',
                  flexShrink: 0,
                }}>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Developer Credit — elegantly at bottom of left panel */}
          <div style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(0,0,0,0.22)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14, padding: '14px 18px',
            backdropFilter: 'blur(8px)',
            animation: 'slide-up 0.9s ease',
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#c4b5fd', marginBottom: 6,
            }}>
              ✦ अभिकल्पना एवं विकास
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 650, color: '#f1f5f9', lineHeight: 1.55 }}>
              Designed & Developed by: <strong style={{ color: '#fff' }}>Bharat Bhushan</strong>, Senior Translation Officer (STO), Office of the Principal Director of Audit (PDA), Railway, Mumbai.
            </div>
          </div>
        </div>

        {/* ── Right Login Form Panel ── */}
        <div style={rightPanel} className="login-right-responsive">
          <div style={{ animation: 'slide-up 0.4s ease' }}>
            {/* Header */}
            <div style={{ marginBottom: 26 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>
                पोर्टल लॉगिन
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                अपने विभागीय क्रेडेंशियल्स दर्ज करें अथवा त्वरित परीक्षण लॉगिन का उपयोग करें
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  ईमेल आईडी / Email ID
                </label>
                <input
                  type="email"
                  className="login-input-pro"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your-email@railway.gov.in"
                  required
                  autoComplete="email"
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  पासवर्ड / Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="login-input-pro"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4,
                    color: '#94a3b8',
                  }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  marginBottom: 16, padding: '11px 14px', fontSize: 13,
                  background: '#fef2f2', color: '#dc2626', borderRadius: 12, fontWeight: 600,
                  border: '1px solid #fecaca',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? '🔄 सत्यापन हो रहा है...' : 'लॉगिन करें →'}
              </button>
            </form>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              margin: '24px 0 18px',
            }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                ⚡ त्वरित परीक्षण लॉगिन
              </span>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #e2e8f0, transparent)' }} />
            </div>

            {/* Quick-login role buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {ROLE_CARDS.map(rc => (
                <button
                  key={rc.key}
                  type="button"
                  className="login-role-btn"
                  onClick={() => handleQuickLogin(rc.key)}
                  style={{
                    textAlign: 'left',
                    background: activeRole === rc.key ? rc.bg : '#fafbfc',
                    border: `1.5px solid ${activeRole === rc.key ? rc.color : '#e8ecf1'}`,
                    borderRadius: 14, padding: '12px 14px',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {activeRole === rc.key && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(135deg, ${rc.bg}, transparent)`,
                    }} />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{rc.icon}</span>
                      <span style={{ fontWeight: 800, color: rc.color, fontSize: 13 }}>{rc.label}</span>
                    </div>
                    <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 3, fontWeight: 500 }}>
                      {DEMO_ACCOUNTS[rc.key]?.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tiny password hint */}
            <p style={{ margin: '14px 0 0', fontSize: 10.5, color: '#94a3b8', textAlign: 'center' }}>
              परीक्षण पासवर्ड: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontWeight: 700, color: '#475569' }}>password123</code>
            </p>

            {/* Bottom line */}
            <p style={{ margin: '20px 0 0', fontSize: 10.5, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>
              © 2026 · राजभाषा QPR पोर्टल · प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
