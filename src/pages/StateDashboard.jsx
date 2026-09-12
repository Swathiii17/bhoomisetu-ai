import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Building2, MapPin, IndianRupee, Users, ArrowUpRight, Filter, ShieldAlert } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import GISMap from '../components/maps/GISMap';

export default function StateDashboard() {
  const { projects, parcels } = useData();
  const { currentUser } = useAuth();

  const [selectedState, setSelectedState] = useState(currentUser?.state !== 'All India' ? currentUser?.state || 'Tamil Nadu' : 'Tamil Nadu');

  const stateProjects = projects.filter(p => p.state === selectedState);
  const stateParcels = parcels.filter(p => p.state === selectedState);

  const totalLandProposed = stateProjects.reduce((s, p) => s + (p.proposedLandArea || 0), 0);
  const totalLandAcquired = stateProjects.reduce((s, p) => s + (p.acquiredLandArea || 0), 0);
  const totalCompAssessed = stateProjects.reduce((s, p) => s + (p.compensationAssessed || 0), 0);
  const totalCompPaid = stateProjects.reduce((s, p) => s + (p.compensationPaid || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">State Revenue & Land Dashboard</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring State Level Proposals, Land Acquisition, Compensation & R&R Execution
          </p>
        </div>

        {/* State Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <Filter size={14} className="text-indigo-400" />
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-bold"
          >
            <option value="Tamil Nadu">State: Tamil Nadu</option>
            <option value="Maharashtra">State: Maharashtra</option>
            <option value="Karnataka">State: Karnataka</option>
            <option value="Gujarat">State: Gujarat</option>
            <option value="Uttar Pradesh">State: Uttar Pradesh</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">State Infrastructure Projects</div>
          <div className="text-2xl font-extrabold text-white mt-1">{stateProjects.length}</div>
          <div className="text-[10px] text-indigo-400 mt-1">Active within {selectedState}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">State Land Acquired</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {totalLandAcquired} <span className="text-xs text-slate-400 font-normal">/ {totalLandProposed} Acres</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Rate: <span className="font-bold text-slate-200">{((totalLandAcquired / Math.max(1, totalLandProposed)) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">State Compensation Paid</div>
          <div className="text-2xl font-extrabold text-amber-300 mt-1">
            ₹{totalCompPaid} <span className="text-xs text-slate-400 font-normal">/ ₹{totalCompAssessed} Cr</span>
          </div>
          <div className="text-[10px] text-amber-400 mt-1">
            Pending: ₹{(totalCompAssessed - totalCompPaid).toFixed(1)} Cr
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Disputed Land Parcels</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">
            {stateParcels.filter(p => p.acquisitionStatus === 'Disputed').length}
          </div>
          <div className="text-[10px] text-rose-300 mt-1 font-semibold">Under Revenue Court Review</div>
        </div>
      </div>

      {/* GIS Regional Map */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-200">State Cadastral Parcel Spatial Map ({selectedState})</h2>
        <GISMap parcels={stateParcels} projects={stateProjects} height="400px" />
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white">State Projects Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Project Title</th>
                <th className="py-3 px-3">District</th>
                <th className="py-3 px-3">Land Proposed</th>
                <th className="py-3 px-3">Comp Paid</th>
                <th className="py-3 px-3">R&R Progress</th>
                <th className="py-3 px-3">Stage Status</th>
                <th className="py-3 px-3 text-right">Drill Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stateProjects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link to={`/projects/${p.id}`} className="hover:text-indigo-400">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3">{p.district}</td>
                  <td className="py-3 px-3 font-bold">{p.acquiredLandArea} / {p.proposedLandArea} Acres</td>
                  <td className="py-3 px-3 font-bold text-amber-300">₹{p.compensationPaid} Cr</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{p.rrCompletedPercentage}%</td>
                  <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-3 text-right">
                    <Link to={`/projects/${p.id}`} className="text-indigo-400 font-bold hover:underline inline-flex items-center space-x-1">
                      <span>View</span>
                      <ArrowUpRight size={12} />
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
