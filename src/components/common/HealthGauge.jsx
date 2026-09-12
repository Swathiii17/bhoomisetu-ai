import React from 'react';
import { Activity } from 'lucide-react';

export default function HealthGauge({ score = 78, label = 'Project Health Score' }) {
  let color = 'text-emerald-400 stroke-emerald-500';
  let bgGradient = 'from-emerald-950/40 to-slate-900';
  let badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-700';
  let statusText = 'HEALTHY EXECUTION';

  if (score < 50) {
    color = 'text-rose-400 stroke-rose-500';
    bgGradient = 'from-rose-950/40 to-slate-900';
    badgeColor = 'bg-rose-950 text-rose-300 border-rose-700';
    statusText = 'CRITICAL ATTENTION';
  } else if (score < 80) {
    color = 'text-amber-400 stroke-amber-500';
    bgGradient = 'from-amber-950/40 to-slate-900';
    badgeColor = 'bg-amber-950 text-amber-300 border-amber-700';
    statusText = 'MODERATE RISKS';
  }

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className={`bg-gradient-to-b ${bgGradient} border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center justify-center text-center relative`}>
      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
        <Activity size={14} className="text-indigo-400" />
        <span>{label}</span>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`transition-all duration-1000 ease-out ${color}`}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">/ 100</span>
        </div>
      </div>

      <span className={`mt-2 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
        {statusText}
      </span>
    </div>
  );
}
