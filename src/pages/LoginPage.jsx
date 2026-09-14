import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getRoleLandingPath, useAuth } from '../contexts/AuthContext';
import { Landmark, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@landvision.gov.in');
  const [password, setPassword] = useState('password123');
  const { login, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(email, password);
    navigate(getRoleLandingPath(user.role));
  };

  const selectDemoUser = (userEmail) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center">
            <Landmark size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Government Portal Sign In</h2>
          <p className="text-xs text-slate-400">National Land Acquisition & Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                placeholder="officer@landvision.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-indigo-600" />
              <span>Remember session</span>
            </label>
            <Link to="/forgot-password" className="text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-900/30 flex items-center justify-center space-x-2 text-xs transition-colors"
          >
            <span>Authenticate & Access</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Sign In presets */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Quick Demo Login Presets
          </span>
          <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
            {DEMO_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => selectDemoUser(u.email)}
                className={`w-full text-left p-2 rounded-lg text-[11px] border transition-colors flex items-center justify-between ${
                  email === u.email
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-200">{u.name}</div>
                  <div className="text-[9px] text-slate-400">{u.role} — {u.email}</div>
                </div>
                {email === u.email && <ShieldCheck size={14} className="text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
