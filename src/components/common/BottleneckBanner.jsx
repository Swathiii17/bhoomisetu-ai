import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert, Check, Clock } from 'lucide-react';

export default function BottleneckBanner({ project }) {
  if (!project || !project.bottleneckStage || project.bottleneckStage === 'None') return null;

  return (
    <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/80 border border-rose-700/60 rounded-2xl p-4 lg:p-5 shadow-2xl relative overflow-hidden my-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-rose-900/60 border border-rose-500/50 rounded-xl text-rose-300 shrink-0 animate-pulse">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-rose-900/80 text-rose-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-rose-700">
                BOTTLENECK DETECTED
              </span>
              <span className="text-slate-400 text-xs font-mono">
                {project.approvalDelayDays || 18} Days Delayed
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Current Bottleneck: <span className="text-rose-400 font-extrabold">{project.bottleneckStage}</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              {project.bottleneckReason}
            </p>
          </div>
        </div>

        {/* Action Suggestion */}
        <div className="bg-slate-950/80 border border-slate-700/70 p-3 rounded-xl min-w-[280px] text-xs">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center space-x-1">
            <AlertCircle size={12} />
            <span>Recommended AI Action</span>
          </div>
          <p className="text-slate-200 mt-1 font-medium leading-tight">
            {project.aiRecommendations?.[0] || 'Escalate to District Collector for immediate Lok Adalat settlement.'}
          </p>
        </div>
      </div>

      {/* Mini lifecycle bottleneck strip */}
      <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center space-x-4 text-xs overflow-x-auto text-slate-300">
        <span className="flex items-center space-x-1 text-emerald-400 font-semibold"><Check size={14} /> Proposal</span>
        <span>→</span>
        <span className="flex items-center space-x-1 text-emerald-400 font-semibold"><Check size={14} /> Approval</span>
        <span>→</span>
        <span className="flex items-center space-x-1 text-amber-400 font-semibold"><Clock size={14} /> Land Survey</span>
        <span>→</span>
        <span className="flex items-center space-x-1 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700"><AlertCircle size={14} /> Compensation ⚠</span>
        <span>→</span>
        <span className="flex items-center space-x-1 text-rose-400 font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700"><ShieldAlert size={14} /> R&R 🔴</span>
        <span>→</span>
        <span className="text-slate-500">Possession ⏳</span>
      </div>
    </div>
  );
}
