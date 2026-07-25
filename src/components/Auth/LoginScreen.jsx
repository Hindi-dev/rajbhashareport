import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Inp } from '../Common/UIComponents';

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
    catch (err) { setError("ईमेल या पासवर्ड गलत है।"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#312e81', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '32px', padding: '40px 32px', maxWidth: 450, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏛️</div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: '0 0 6px 0' }}>प्रधान निदेशक लेखापरीक्षा का कार्यालय, रेलवे, मुंबई</h1>
          <p style={{ fontSize: '15px', color: '#4f46e5', fontWeight: 700 }}>राजभाषा पोर्टल</p>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>अपने क्रेडेंशियल्स दर्ज करें</p>
        </div>
        <form onSubmit={handleLogin}>
          <Inp label="ईमेल आईडी" type="email" value={email} onChange={setEmail} />
          <div style={{ marginTop: '16px' }}><Inp label="पासवर्ड" type="password" value={password} onChange={setPassword} /></div>
          {error && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '10px', borderRadius: '8px', marginTop: '16px', fontSize: '13px', fontWeight: 600 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 800, fontSize: '16px', marginTop: '24px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
            {loading ? 'सत्यापन हो रहा है...' : 'लॉगिन करें →'}
          </button>
        </form>
      </div>
    </div>
  );
};