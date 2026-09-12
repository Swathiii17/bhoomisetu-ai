import React from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, FileText, Layers, Clock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function AgencyDashboard() {
  const { projects } = useData();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="text-sky-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Project Implementing Agency Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit Acquisition Proposals, Upload Cadastral Documents, & Track 14-Stage Clearances
          </p>
        </div>

        <Link
          to="/create-project"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle size={16} />
          <span>Submit New Proposal</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Submitted Proposals</div>
          <div className="text-2xl font-extrabold text-white mt-1">{projects.length}</div>
          <div className="text-[10px] text-sky-400 mt-1">Across 5 Central Ministries</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">In Verification Stage</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {projects.filter(p => p.status.includes('Verification') || p.status === 'Submitted').length}
          </div>
          <div className="text-[10px] text-amber-300 mt-1">Pending District Revenue Approval</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Clearances Approved</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {projects.filter(p => p.status.includes('Approved') || p.status.includes('Acquisition') || p.status === 'Completed').length}
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">State & Central Approved</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Document Vault</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">128</div>
          <div className="text-[10px] text-slate-400 mt-1">Uploaded & Scanned by AI</div>
        </div>
      </div>

      {/* Agency Projects Progress Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">Submitted Projects Approval Matrix</h3>
          <Link to="/approval-workflow" className="text-xs text-indigo-400 hover:underline font-semibold">
            Open Workflow Board
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Project & ID</th>
                <th className="py-3 px-3">Ministry & State</th>
                <th className="py-3 px-3">Current Stage</th>
                <th className="py-3 px-3">Land Target</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link to={`/projects/${p.id}`} className="hover:text-indigo-400">
                      {p.name}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div>{p.ministry}</div>
                    <div className="text-[10px] text-slate-400">{p.state}, {p.district}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-indigo-300">
                    {p.currentStage}
                  </td>
                  <td className="py-3 px-3 font-bold">
                    {p.acquiredLandArea} / {p.proposedLandArea} Acres
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/projects/${p.id}`}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-700 inline-flex items-center space-x-1"
                    >
                      <span>Track</span>
                      <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
