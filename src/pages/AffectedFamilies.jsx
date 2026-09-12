import React from 'react';
import { useData } from '../contexts/DataContext';
import { Users, Home, Briefcase, HeartHandshake, CheckCircle } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function AffectedFamilies() {
  const { families } = useData();

  const totalAffected = families.length;
  const totalDisplaced = families.filter(f => f.displacedStatus === 'Displaced').length;
  const rrCompleted = families.filter(f => f.rrStatus === 'Completed').length;
  const rrPending = totalAffected - rrCompleted;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Users className="text-sky-400" size={24} />
          <h1 className="text-2xl font-extrabold text-white">Affected Families & Social Impact Directory</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          RFCTLARR Act Social Impact Assessment (SIA) & Family Rehabilitation Tracking
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Total Affected Families</div>
          <div className="text-3xl font-extrabold text-white mt-1">{totalAffected}</div>
          <div className="text-[10px] text-sky-400 mt-1">SIA Verified Families</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Physically Displaced Families</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{totalDisplaced}</div>
          <div className="text-[10px] text-amber-300 mt-1">Requires Housing Colony Plot</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">R&R Completed</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{rrCompleted}</div>
          <div className="text-[10px] text-emerald-300 mt-1">Housing & Grant Handover Done</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">R&R Pending</div>
          <div className="text-3xl font-extrabold text-rose-400 mt-1">{rrPending}</div>
          <div className="text-[10px] text-rose-300 mt-1">Under District Collector Review</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white">Registered Affected Families Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Family ID & Head</th>
                <th className="py-3 px-3">Project Title</th>
                <th className="py-3 px-3">Displacement Status</th>
                <th className="py-3 px-3">Members</th>
                <th className="py-3 px-3">Awarded (₹)</th>
                <th className="py-3 px-3">R&R Entitlement Package</th>
                <th className="py-3 px-3">Relocation State</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {families.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>{f.headOfFamily}</div>
                    <div className="text-[10px] text-sky-400 font-mono">{f.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium truncate max-w-[180px]">{f.projectName}</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{f.displacedStatus}</td>
                  <td className="py-3 px-3">{f.familyMembers} Persons</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">₹{(f.compensationAwarded / 100000).toFixed(2)} L</td>
                  <td className="py-3 px-3 text-slate-300 truncate max-w-[200px]">{f.rrEntitlement}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{f.relocationStatus}</td>
                  <td className="py-3 px-3"><StatusBadge status={f.rrStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
