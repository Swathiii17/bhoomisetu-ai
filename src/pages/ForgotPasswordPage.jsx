import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your registered government email address to receive password reset instructions.</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/80 border border-emerald-700/60 p-4 rounded-2xl text-center space-y-3">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-sm">Reset Link Dispatched</h4>
            <p className="text-xs text-emerald-200">
              Instructions sent to <span className="font-mono font-bold text-white">{email}</span>. Please check your inbox or NIC webmail.
            </p>
            <Link to="/login" className="inline-block bg-slate-900 text-xs font-bold text-slate-200 px-4 py-2 rounded-xl border border-slate-700">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Government Email ID</label>
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

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white">
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
