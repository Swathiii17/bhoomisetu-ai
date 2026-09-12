import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, Layers, MapPin, IndianRupee, Brain, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function ProjectList() {
  const { projects } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchState = stateFilter === 'ALL' || p.state === stateFilter;
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchSearch && matchState && matchStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">National Infrastructure Projects Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Central & State Land Acquisition Projects Registry
          </p>
        </div>

        <Link
          to="/create-project"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors self-start md:self-auto"
        >
          <PlusCircle size={16} />
          <span>New Land Proposal</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Project Name, ID, Purpose..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto">
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Verification">Under Verification</option>
            <option value="Acquisition in Progress">Acquisition in Progress</option>
            <option value="Possession Pending">Possession Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 group transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {p.id}
                </span>
                <StatusBadge status={p.status} />
              </div>

              <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300 transition-colors">
                <Link to={`/projects/${p.id}`}>{p.name}</Link>
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2">{p.purpose}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 block">State & District</span>
                  <span className="font-semibold text-slate-200">{p.state}, {p.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Land Target</span>
                  <span className="font-bold text-emerald-400">{p.acquiredLandArea} / {p.proposedLandArea} Acres</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Compensation</span>
                  <span className="font-bold text-amber-300">₹{p.compensationPaid} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 block">AI Delay Risk</span>
                  <span className={`font-extrabold ${p.aiRiskLevel === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {p.aiRiskScore}% ({p.aiRiskLevel})
                  </span>
                </div>
              </div>

              <Link
                to={`/projects/${p.id}`}
                className="w-full bg-slate-950 hover:bg-indigo-600 text-slate-300 hover:text-white font-bold py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center space-x-1.5 text-xs transition-all"
              >
                <span>Inspect Lifecycle & AI Analysis</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
