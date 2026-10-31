import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { DEMO_ACCOUNTS } from './AuthContext';
import { supabase } from '../../supabaseClient';

/* ---------- Role definitions for Testing / Demo Switcher ---------- */
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
    accentGrad: 'from-indigo-600 to-indigo-700'
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
    accentGrad: 'from-sky-600 to-blue-700'
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
    accentGrad: 'from-emerald-600 to-teal-700'
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
    accentGrad: 'from-amber-600 to-rose-700'
  }
];

/* ---------- Key System Highlights ---------- */
const CAPABILITIES = [
  { icon: '📋', title: 'डिजिटल QPR फॉर्म (भाग 1‒9)', desc: 'गृह मंत्रालय के अप्रैल 2025 संशोधित प्रारूप के पूर्णतः अनुरूप' },
  { icon: '🔄', title: '4-स्तरीय प्रशासनिक वर्कफ़्लो', desc: 'DEO → AAO सत्यापन → SAO स्वीकृति → हिंदी प्रकोष्ठ अनुमोदन' },
  { icon: '📑', title: 'हस्ताक्षरित PDF प्रमाण-पत्र', desc: 'डिजिटल सत्यापन, हेडर बाइट्स सुरक्षा व ऑनलाइन अभिलेखागार' },
  { icon: '📊', title: 'स्वचालित समेकन एवं A4 प्रिंट', desc: 'समस्त अनुभागों की समेकित रिपोर्ट व आधिकारिक प्रिंट तैयार करना' },
];

export const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'test_running'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingInRole, setLoggingInRole] = useState(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');

  const { signIn, loginAsDemoRole } = useAuth();

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || "ईमेल या पासवर्ड गलत है। कृपया पुनः प्रयास करें।");
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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError("Google OAuth सेवा वर्तमान में स्थानीय डेमो मोड में उपलब्ध नहीं है। कृपया विभागीय क्रेडेंशियल्स या टैस्ट रनिंग का उपयोग करें।");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus('processing');
    try {
      await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: window.location.origin,
      });
      setForgotStatus('sent');
    } catch (err) {
      setForgotStatus('sent');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans antialiased text-slate-100 bg-gradient-to-br from-[#060813] via-[#0b1226] to-[#131130] selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* 1. National Tri-Color Top Accent Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 sticky top-0 z-50 shadow-md shadow-black/30" />

      {/* 2. Appealing Ambient Aurora Mesh Glow (100% Pure CSS) */}
      <div className="fixed -top-40 -left-40 w-[650px] h-[650px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-purple-600/18 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[600px] h-[400px] bg-cyan-600/12 rounded-full blur-[130px] pointer-events-none" />
      
      {/* Subtle Geometric Grid Matrix Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3. Main Split-Screen Section */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 relative z-10 max-w-[1600px] w-full mx-auto">
        
        {/* ============================================================
            LEFT HALF: Official Branding & Engaging Visual Experience
            ============================================================ */}
        <section className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center p-6 sm:p-10 lg:p-14 xl:p-16 relative">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            
            {/* Motto Badge with Official CAG Crest */}
            <div className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-amber-300/35 backdrop-blur-md rounded-full py-1.5 px-4 mb-6 shadow-xl shadow-black/25 transition-all duration-200">
              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-200/30 to-amber-400/15 border border-amber-300/50 flex items-center justify-center text-sm shadow-inner">
                🏛️
              </span>
              <span className="text-sm sm:text-base font-black tracking-wide text-amber-300 drop-shadow-sm">
                लोकहितार्थ सत्यनिष्ठा
              </span>
              <span className="text-white/30 hidden sm:inline">|</span>
              <span className="text-[11px] font-bold tracking-widest text-slate-200 hidden sm:inline">
                CAG · INDIAN AUDIT & ACCOUNTS DEPT.
              </span>
            </div>

            {/* Principal Office Header */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.22] mb-3 drop-shadow-lg">
              प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई
            </h1>
            <p className="text-sm sm:text-base xl:text-lg text-slate-300 font-medium tracking-wide mb-6">
              Office of the Principal Director of Audit (PDA), Railway, Mumbai
            </p>

            {/* Ministry Pill with Active Pulse Indicator */}
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-500/25 to-purple-500/25 border border-purple-400/35 rounded-full py-1.5 px-4 text-xs font-bold text-purple-200 backdrop-blur-md shadow-md mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <span>राजभाषा तिमाही प्रगति रिपोर्ट (QPR) प्रणाली · अनुलग्नक-2 (संशोधित प्रारूप)</span>
            </div>

            {/* 4 Feature Cards Grid (Desktop View) */}
            <div className="hidden lg:grid grid-cols-2 gap-3.5 pt-2">
              {CAPABILITIES.map((cap, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 rounded-2xl p-3.5 backdrop-blur-md transition-all duration-200 hover:translate-x-1"
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg flex-shrink-0">
                    {cap.icon}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">{cap.title}</h3>
                    <p className="text-[11px] text-slate-300/80 leading-relaxed mt-0.5">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ============================================================
            RIGHT HALF: Centered Minimalist Authentication Card
            ============================================================ */}
        <section className="lg:col-span-5 xl:col-span-5 flex items-center justify-center p-4 sm:p-8 lg:p-10 relative">
          <div className="w-full max-w-md">
            
            {/* The Authentication Card */}
            <div className="bg-white/[0.97] backdrop-blur-2xl border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-9 text-slate-900 relative overflow-hidden transition-all duration-200">
              
              {/* Card Top Row */}
              <div className="mb-6 text-center sm:text-left">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <span>🔒</span>
                    <span>विभागीय प्रमाणीकरण</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <span>✓</span>
                    <span>Suraksha v2.5</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  पोर्टल में प्रवेश (Sign In)
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  कृपया अपनी अधिकृत विभागीय ईमेल आईडी अथवा परीक्षण भूमिका चुनें
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => { setActiveTab('credentials'); setError(''); }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    activeTab === 'credentials'
                      ? 'bg-white text-indigo-700 shadow-sm shadow-slate-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🔑</span>
                  <span>विभागीय लॉगिन</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('test_running'); setError(''); }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${
                    activeTab === 'test_running'
                      ? 'bg-white text-indigo-700 shadow-sm shadow-slate-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>🧪</span>
                  <span>टैस्ट रनिंग</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full">
                    04
                  </span>
                </button>
              </div>

              {/* Error State Banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                  <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* ============================================================
                  TAB 1: Departmental Credentials Form with Floating Labels
                  ============================================================ */}
              {activeTab === 'credentials' && (
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  {/* Floating Label: Email Input */}
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder=" "
                      required
                      autoComplete="email"
                      className={`peer block w-full rounded-xl border ${
                        error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
                      } bg-slate-50/70 px-4 pt-6 pb-2 text-sm text-slate-900 placeholder-transparent focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200`}
                    />
                    <label
                      htmlFor="email"
                      className={`pointer-events-none absolute left-4 top-2 origin-left text-[11px] font-bold uppercase tracking-wider ${
                        error ? 'text-rose-500' : 'text-slate-400 peer-focus:text-indigo-600'
                      } transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:capitalize peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase`}
                    >
                      विभागीय ईमेल आईडी (Email ID)
                    </label>
                  </div>

                  {/* Floating Label: Password Input */}
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder=" "
                      required
                      autoComplete="current-password"
                      className={`peer block w-full rounded-xl border ${
                        error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'
                      } bg-slate-50/70 pl-4 pr-11 pt-6 pb-2 text-sm text-slate-900 placeholder-transparent focus:bg-white focus:outline-none focus:ring-4 transition-all duration-200`}
                    />
                    <label
                      htmlFor="password"
                      className={`pointer-events-none absolute left-4 top-2 origin-left text-[11px] font-bold uppercase tracking-wider ${
                        error ? 'text-rose-500' : 'text-slate-400 peer-focus:text-indigo-600'
                      } transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:capitalize peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-bold peer-focus:uppercase`}
                    >
                      पासवर्ड (Password)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                      title={showPassword ? "पासवर्ड छिपाएं" : "पासवर्ड देखें"}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* "Remember me" & "Forgot password?" alignment */}
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5 pb-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 transition-all duration-200 cursor-pointer"
                      />
                      <span className="font-medium">Remember me (मुझे याद रखें)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Primary "Sign In" Button with Loading Spinner */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-600 active:scale-[0.99] shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>प्रमाणीकरण हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <span>पोर्टल में प्रवेश करें (Sign In)</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </button>

                  {/* Subtle "Or continue with" Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white px-3">
                      <span>Or continue with</span>
                    </div>
                  </div>

                  {/* Social OAuth Button (Google) */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all duration-200 active:scale-[0.99]"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Google खाते से लॉगिन करें</span>
                  </button>

                  {/* Autofill Demo Roles Quick Strip */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        त्वरित डेमो क्रेडेंशियल्स:
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('test_running')}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        टैस्ट रनिंग देखें →
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ROLES_LIST.map(r => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => prefillRoleCredentials(r.key)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition-colors duration-150 flex items-center gap-1.5"
                          title={`${r.name} (${r.title})`}
                        >
                          <span>{r.icon}</span>
                          <span>{r.badge.split(' / ')[1] || r.key.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              )}

              {/* ============================================================
                  TAB 2: Dedicated 'Test Running' Option (04 Role Fields)
                  ============================================================ */}
              {activeTab === 'test_running' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                    <span className="text-base flex-shrink-0">💡</span>
                    <span>
                      <strong>परीक्षण हेतु 1-क्लिक प्रवेश:</strong> किसी भी भूमिका कार्ड पर क्लिक करके सीधे डैशबोर्ड में प्रवेश किया जा सकता है।
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROLES_LIST.map((r) => {
                      const isProcessing = loggingInRole === r.key;
                      return (
                        <div
                          key={r.key}
                          onClick={() => !loggingInRole && handleQuickRoleLogin(r.key)}
                          className={`p-3.5 rounded-2xl border ${
                            isProcessing ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200/80 hover:border-indigo-400 bg-white hover:bg-slate-50'
                          } shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex flex-col justify-between group`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span 
                                className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                                style={{ background: r.bg, color: r.color, border: `1px solid ${r.border}` }}
                              >
                                {r.badge}
                              </span>
                              <span className="text-lg">{r.icon}</span>
                            </div>
                            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200 leading-snug">
                              {r.title}
                            </h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">
                              {r.name} ({r.section})
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={Boolean(loggingInRole)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickRoleLogin(r.key);
                            }}
                            className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${r.accentGrad} hover:opacity-95 shadow-sm transition-all duration-150 flex items-center justify-center gap-1.5`}
                          >
                            {isProcessing ? (
                              <span>प्रवेश हो रहा है...</span>
                            ) : (
                              <>
                                <span>प्रवेश करें</span>
                                <span>→</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('credentials')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors duration-150"
                    >
                      ← विभागीय लॉगिन फॉर्म पर वापस जाएं
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          4. FULL-WIDTH DEDICATED BOTTOM SECTION (पेज में सबसे नीचे)
          Developer Credits + 256-Bit SSL Section
          ============================================================ */}
      <footer className="w-full relative z-20 border-t border-white/10 bg-slate-950/75 backdrop-blur-xl py-3.5 px-4 sm:px-8 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Developer Attribution Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-300/40 flex items-center justify-center text-amber-300 text-sm font-black shadow-inner flex-shrink-0">
              ✦
            </div>
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 drop-shadow-sm">
                अभिकल्पना एवं विकास (DESIGNED & DEVELOPED BY)
              </div>
              <div className="text-xs sm:text-sm font-semibold text-cyan-300 mt-0.5">
                भारत भूषण - वरिष्ठ अनुवाद अधिकारी
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                कार्यालय प्रधान निदेशक लेखापरीक्षा (रेलवे), मुंबई · Western Railway
              </div>
            </div>
          </div>

          {/* Security & Verification Badges */}
          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
            <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-bold text-emerald-400 shadow-sm">
              <span className="text-sm">🛡️</span>
              <span>256-Bit SSL सुरक्षित शासकीय सर्वर</span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              © 2026 भारत सरकार · सर्वाधिकार सुरक्षित
            </div>
          </div>

        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                पासवर्ड रीसेट (Reset Password)
              </h3>
              <button
                type="button"
                onClick={() => { setShowForgotModal(false); setForgotStatus(''); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {forgotStatus === 'sent' ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto mb-3">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  ईमेल प्रेषित कर दिया गया है!
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  यदि यह ईमेल पंजीकृत है, तो पासवर्ड रीसेट लिंक <strong>{forgotEmail}</strong> पर भेज दिया गया है।
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotStatus(''); }}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  बंद करें
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  अपनी पंजीकृत विभागीय ईमेल आईडी दर्ज करें। हम आपको पासवर्ड रीसेट करने का लिंक भेजेंगे।
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    विभागीय ईमेल आईडी
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="officer@cag.gov.in"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'processing'}
                    className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl disabled:opacity-50"
                  >
                    {forgotStatus === 'processing' ? 'भेजा जा रहा है...' : 'रीसेट लिंक भेजें'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
