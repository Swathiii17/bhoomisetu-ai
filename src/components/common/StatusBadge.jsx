import React from 'react';

export default function StatusBadge({ status }) {
  let color = 'bg-slate-800 text-slate-300 border-slate-700';
  let semanticStatus = 'status-default';

  const s = (status || '').toLowerCase();

  if (s.includes('completed') || s.includes('acquired') || s.includes('fully paid') || s.includes('verified') || s.includes('approved')) {
    color = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 font-bold';
    semanticStatus = 'status-completed';
  } else if (s.includes('progress') || s.includes('submitted') || s.includes('under verification') || s.includes('partially paid')) {
    color = 'bg-amber-950/80 text-amber-300 border-amber-700/60 font-semibold';
    semanticStatus = 'status-progress';
  } else if (s.includes('high') || s.includes('disputed') || s.includes('rejected') || s.includes('critical')) {
    color = 'bg-rose-950/80 text-rose-300 border-rose-700/60 font-bold';
    semanticStatus = 'status-rejected';
  } else if (s.includes('pending')) {
    color = 'bg-amber-950/80 text-amber-300 border-amber-700/60 font-medium';
    semanticStatus = 'status-pending';
  } else if (s.includes('medium') || s.includes('assessment') || s.includes('review')) {
    color = 'bg-sky-950/80 text-sky-300 border-sky-700/60 font-medium';
    semanticStatus = 'status-review';
  }

  return (
    <span className={`status-badge ${semanticStatus} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border uppercase tracking-wider ${color}`}>
      {status || 'Unknown'}
    </span>
  );
}
