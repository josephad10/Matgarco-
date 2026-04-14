import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('admin@matgarco.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, accessToken } = response.data.data;
      
      if (user.role !== 'super_admin') {
        setError('لا تملك صلاحية الدخول كمدير للنظام.');
        setLoading(false);
        return;
      }
      
      login(user, accessToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-matgarco-500/5 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-matgarco-500 text-white flex items-center justify-center text-3xl font-black mb-4 shadow-lg shadow-matgarco-500/20">
            M
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Matgarco Admin</h1>
          <p className="text-slate-500 mt-1 text-sm">تسجيل الدخول للإدارة العليا</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 focus:ring-2 focus:ring-matgarco-200 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 focus:ring-2 focus:ring-matgarco-200 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-matgarco-600 hover:bg-matgarco-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-matgarco-600/20 mt-2 disabled:bg-matgarco-400"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
