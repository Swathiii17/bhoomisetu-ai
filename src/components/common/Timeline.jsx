import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Circle, XCircle } from 'lucide-react';

export const LIFECYCLE_STAGES = [
  'Project Proposal',
  'Document Submission',
  'District Verification',
  'State Verification',
  'Central Approval',
  'Land Identification',
  'Land Notification',
  'Land Acquisition',
  'Award Declaration',
  'Compensation Assessment',
  'Compensation Disbursement',
  'Rehabilitation & Resettlement',
  'Possession',
  'Project Completed'
];

export default function Timeline({ currentStage, status }) {
  const currentIndex = LIFECYCLE_STAGES.indexOf(currentStage);
  const activeIdx = currentIndex === -1 ? 9 : currentIndex; // default fallback index

  return (
    <div className="w-full bg-slate-900/90 p-4 lg:p-6 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between min-w-[1000px] relative pb-2">
        {/* Connector line behind icons */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 -z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(activeIdx / (LIFECYCLE_STAGES.length - 1)) * 100}%` }}
          />
        </div>

        {LIFECYCLE_STAGES.map((stage, idx) => {
          let state = 'PENDING';
          if (idx < activeIdx) state = 'COMPLETED';
          else if (idx === activeIdx) {
            state = status === 'Rejected' ? 'REJECTED' : (status === 'Delayed' ? 'DELAYED' : 'IN_PROGRESS');
          }

          return (
            <div key={stage} className="flex flex-col items-center relative z-10 w-24 text-center group">
              {/* Stage Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-md ${
                  state === 'COMPLETED'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : state === 'IN_PROGRESS'
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-400 ring-4 ring-indigo-500/20 animate-pulse'
                    : state === 'DELAYED'
                    ? 'bg-amber-950 border-amber-500 text-amber-400 ring-4 ring-amber-500/20 animate-bounce'
                    : state === 'REJECTED'
                    ? 'bg-rose-950 border-rose-500 text-rose-400'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}
              >
                {state === 'COMPLETED' && <CheckCircle2 size={16} />}
                {state === 'IN_PROGRESS' && <Clock size={16} />}
                {state === 'DELAYED' && <AlertTriangle size={16} />}
                {state === 'REJECTED' && <XCircle size={16} />}
                {state === 'PENDING' && <Circle size={14} />}
              </div>

              {/* Stage Label */}
              <span
                className={`text-[11px] font-medium mt-2 leading-tight transition-colors ${
                  idx === activeIdx
                    ? 'text-indigo-300 font-bold underline underline-offset-4 decoration-indigo-500'
                    : idx < activeIdx
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {stage}
              </span>

              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-950 text-slate-200 text-[10px] py-1 px-2 rounded border border-slate-700 whitespace-nowrap pointer-events-none transition-opacity">
                Stage {idx + 1}: {stage} ({state})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
