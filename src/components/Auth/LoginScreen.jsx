import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await signIn(email, password); }
    catch (err) { setError(err.message || "ईमेल या पासवर्ड गलत है।"); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <aside className="login-aside">
          <div>
            <div className="login-mark">🏛️</div>
            <h1>प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई</h1>
            <p>राजभाषा तिमाही प्रगति रिपोर्ट · अनुलग्नक-2</p>
          </div>
          <div className="login-points">
            <div className="login-point"><span>📝</span><span>ऑनलाइन रिपोर्ट भरें और जमा करें</span></div>
            <div className="login-point"><span>🔁</span><span>AAO → SAO → हिंदी प्रकोष्ठ वर्कफ़्लो</span></div>
            <div className="login-point"><span>📊</span><span>समेकित रिपोर्ट और PDF प्रिंट</span></div>
          </div>
        </aside>

        <div className="login-main">
          <h2>लॉगिन करें</h2>
          <p className="login-sub">अपने विभाग से प्राप्त क्रेडेंशियल्स का उपयोग करें</p>

          <form onSubmit={handleLogin}>
            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">ईमेल आईडी</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your-email@domain.com" required />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label className="field-label">पासवर्ड</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: '13px 18px', fontSize: 14 }}>
              {loading ? 'सत्यापन हो रहा है...' : 'लॉगिन करें →'}
            </button>
          </form>

          <p className="login-foot">© 2026 · राजभाषा QPR · पश्चिम रेलवे</p>
        </div>
      </div>
    </div>
  );
};
