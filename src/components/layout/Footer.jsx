import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">LandVision &copy; 2026 National Land Acquisition Portal</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Smart India Hackathon</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-white cursor-pointer transition-colors">Help Desk: 1800-11-2026</span>
        </div>
      </div>
    </footer>
  );
}
