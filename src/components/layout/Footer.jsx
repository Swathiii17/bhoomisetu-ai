import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">BhoomiSetu AI &copy; 2026 National Land Acquisition Portal</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Smart India Hackathon</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center space-x-1 text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 font-mono">
            <Sparkles size={10} />
            <span>AI Predictive Engine v2.4 Active</span>
          </span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-white cursor-pointer transition-colors">Help Desk: 1800-11-2026</span>
        </div>
      </div>
    </footer>
  );
}
