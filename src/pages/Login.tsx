import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Headphones,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Users,
  Wrench,
  Lock,
} from 'lucide-react';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) return;

    setError('');
    setLoading(true);

    const success = await login(form.username.trim(), form.password);
    setLoading(false);

    if (success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid username or password. Please verify credentials.');
    }
  };

  const setDemoCredentials = (username: string, password: string) => {
    setForm({ username, password });
    setError('');
  };

  const demoAccounts = [
    {
      role: 'System Administrator',
      user: 'Alex Johnson',
      dept: 'IT Infrastructure',
      username: 'admin',
      password: 'admin123',
      icon: Shield,
      accent: 'border-purple-200 bg-purple-50/60 hover:bg-purple-100/60 text-purple-900',
    },
    {
      role: 'Support Engineer',
      user: 'David Chen',
      dept: 'Systems Support',
      username: 'engineer',
      password: 'engineer123',
      icon: Wrench,
      accent: 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-900',
    },
    {
      role: 'Staff Employee',
      user: 'Sarah Miller',
      dept: 'Marketing & Brand',
      username: 'employee',
      password: 'employee123',
      icon: Users,
      accent: 'border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-blue-900',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-900 text-slate-100 font-sans">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-3">
            <Headphones className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">IT Help Desk Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Service Management & Technical Support</p>
        </div>

        {/* Card */}
        <div className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your corporate credentials to access support</p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="e.g. admin, engineer, employee"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm mt-2 disabled:opacity-60"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Demo Accounts (Click to test)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Instant Fill</span>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => setDemoCredentials(acc.username, acc.password)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between ${acc.accent}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      <acc.icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{acc.role}</p>
                      <p className="text-[11px] text-slate-500">{acc.user} · {acc.dept}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {acc.username}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Secure 256-bit encrypted authentication session</span>
          </p>
          <p className="text-[11px] text-slate-600">
            Internal IT Help Desk System · SR University
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
