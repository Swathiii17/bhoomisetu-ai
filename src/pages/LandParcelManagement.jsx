import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Building, PlusCircle, Search, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function LandParcelManagement() {
  const { parcels, projects, addParcel } = useData();
  const { currentUser } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || '',
    surveyNumber: '301/2B',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    village: 'Sriperumbudur',
    areaAcquired: 5.0,
    ownerCount: 2,
    ownerNames: 'K. Ramasamy, R. Vijaya',
    acquisitionStatus: 'Proposed',
    lat: 12.9600,
    lng: 79.9300,
    totalCompensation: 25000000
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const selectedPrj = projects.find(p => p.id === formData.projectId);
    addParcel({
      ...formData,
      projectName: selectedPrj?.name || 'Project'
    }, currentUser);
    setShowAddModal(false);
  };

  const filtered = parcels.filter(p =>
    p.surveyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Cadastral Land Parcel Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Register Survey Numbers, GPS Coordinates, Ownership Extracts, & Acquisition Statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Register New Land Parcel</span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Survey No, Village, Parcel ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Parcel ID & Survey No</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Village / District</th>
                <th className="py-3 px-3">Area (Acres)</th>
                <th className="py-3 px-3">Landowners</th>
                <th className="py-3 px-3">Compensation</th>
                <th className="py-3 px-3">Field GPS Status</th>
                <th className="py-3 px-3">Acquisition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>Survey No. {p.surveyNumber}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{p.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{p.projectName}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-200">{p.village}</span>
                    <div className="text-[10px] text-slate-400">{p.district}, {p.state}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{p.areaAcquired} Acres</td>
                  <td className="py-3 px-3 truncate max-w-[150px]">{p.ownerNames} ({p.ownerCount})</td>
                  <td className="py-3 px-3 font-bold text-amber-300">₹{(p.totalCompensation / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3">
                    {p.fieldVerified ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                        Verified ({p.lat.toFixed(2)}, {p.lng.toFixed(2)})
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Not Verified</span>
                    )}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={p.acquisitionStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Parcel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-white">Register Cadastral Land Parcel</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Infrastructure Project</label>
              <select
                value={formData.projectId}
                onChange={e => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Survey Number</label>
                <input
                  type="text"
                  required
                  value={formData.surveyNumber}
                  onChange={e => setFormData({ ...formData, surveyNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Village Name</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Acquired Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.areaAcquired}
                  onChange={e => setFormData({ ...formData, areaAcquired: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold text-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Compensation (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.totalCompensation}
                  onChange={e => setFormData({ ...formData, totalCompensation: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold text-amber-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Landowner Full Names</label>
              <input
                type="text"
                required
                value={formData.ownerNames}
                onChange={e => setFormData({ ...formData, ownerNames: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                Save Parcel to Database
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
