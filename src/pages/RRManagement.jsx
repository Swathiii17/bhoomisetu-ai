import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Home, Briefcase, IndianRupee, HeartHandshake, CheckCircle, Edit3 } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function RRManagement() {
  const { rr, updateRRRecord } = useData();
  const { currentUser } = useAuth();

  const [selectedRR, setSelectedRR] = useState(null);
  const [housingStatus, setHousingStatus] = useState('');
  const [vocationalStatus, setVocationalStatus] = useState('');
  const [completionPct, setCompletionPct] = useState(50);

  const handleOpenEdit = (record) => {
    setSelectedRR(record);
    setHousingStatus(record.housingStatus);
    setVocationalStatus(record.vocationalStatus);
    setCompletionPct(record.completionPercentage || 50);
  };

  const handleSaveRR = (e) => {
    e.preventDefault();
    if (!selectedRR) return;
    updateRRRecord(selectedRR.id, {
      housingStatus,
      vocationalStatus,
      completionPercentage: Number(completionPct)
    }, currentUser);
    setSelectedRR(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Building2 className="text-emerald-400" size={24} />
          <h1 className="text-2xl font-extrabold text-white">Rehabilitation & Resettlement (R&R) Execution Matrix</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Monitoring Housing Allotments, Annuity Grants, Employment Schemes, & Transit Relocation
        </p>
      </div>

      {/* R&R Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Home size={18} />
            <h4 className="font-bold text-white text-xs">Housing Plot Allocation</h4>
          </div>
          <p className="text-[11px] text-slate-400">1200 sqft PUCCA house plots in government resettlement sector 4.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400">
            <Briefcase size={18} />
            <h4 className="font-bold text-white text-xs">Employment Rehabilitation</h4>
          </div>
          <p className="text-[11px] text-slate-400">Vocational skill training & NHAI toll operator recruitment.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <IndianRupee size={18} />
            <h4 className="font-bold text-white text-xs">One-Time Resettlement Annuity</h4>
          </div>
          <p className="text-[11px] text-slate-400">₹5.0 Lakh one-time cash grant for immediate transit expenses.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="flex items-center space-x-2 text-sky-400">
            <HeartHandshake size={18} />
            <h4 className="font-bold text-white text-xs">Displacement Assistance</h4>
          </div>
          <p className="text-[11px] text-slate-400">100% Solatium plus agricultural equipment subsidy.</p>
        </div>
      </div>

      {/* R&R Entitlements Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white">Family R&R Implementation Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Head of Family & ID</th>
                <th className="py-3 px-3">Resettlement Colony & Plot</th>
                <th className="py-3 px-3">Housing Allotment</th>
                <th className="py-3 px-3">Vocational Training</th>
                <th className="py-3 px-3">Grant Disbursed</th>
                <th className="py-3 px-3">Progress %</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rr.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>{item.headOfFamily}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    <div>{item.colonyLocation}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{item.plotAllotmentNo}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-amber-300">{item.housingStatus}</td>
                  <td className="py-3 px-3 text-slate-300">
                    <div>{item.vocationalSkill}</div>
                    <div className="text-[10px] text-slate-400 font-semibold">{item.vocationalStatus}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">
                    ₹{(item.financialGrantPaid / 100000).toFixed(2)} Lakh
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-24 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.completionPercentage}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">{item.completionPercentage}%</span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center space-x-1"
                    >
                      <Edit3 size={12} />
                      <span>Update</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedRR && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Update R&R Status: {selectedRR.headOfFamily}</h3>
            
            <form onSubmit={handleSaveRR} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Housing Allotment Status</label>
                <select
                  value={housingStatus}
                  onChange={e => setHousingStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Under Construction">Under Construction</option>
                  <option value="Allotted">Allotted</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Pending Allotment">Pending Allotment</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Vocational Skill Status</label>
                <select
                  value={vocationalStatus}
                  onChange={e => setVocationalStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Total Completion Percentage ({completionPct}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={completionPct}
                  onChange={e => setCompletionPct(e.target.value)}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRR(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500"
                >
                  Save R&R Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
