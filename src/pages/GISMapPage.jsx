import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import GISMap from '../components/maps/GISMap';
import StatusBadge from '../components/common/StatusBadge';
import { Map, Layers, Search, Eye, X, Building, IndianRupee } from 'lucide-react';

export default function GISMapPage() {
  const { parcels, projects } = useData();
  const [selectedParcel, setSelectedParcel] = useState(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Map className="text-emerald-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">GIS Spatial Land Parcel Portal</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive GIS Map displaying proposed, acquired, and disputed land parcels with spatial risk overlays
          </p>
        </div>
      </div>

      {/* Main Map */}
      <GISMap parcels={parcels} projects={projects} height="600px" onSelectParcel={(p) => setSelectedParcel(p)} />

      {/* Parcel Detail Inspector Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedParcel(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                {selectedParcel.id}
              </span>
              <StatusBadge status={selectedParcel.acquisitionStatus} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">Survey No. {selectedParcel.surveyNumber}</h3>
              <p className="text-xs text-slate-400">{selectedParcel.village}, {selectedParcel.district}, {selectedParcel.state}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Acquired Area</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedParcel.areaAcquired} Acres</span>
              </div>
              <div>
                <span className="text-slate-500 block">Owner Count</span>
                <span className="font-bold text-slate-200 text-sm">{selectedParcel.ownerCount} Owners</span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Compensation</span>
                <span className="font-bold text-amber-300 text-sm">₹{(selectedParcel.totalCompensation / 100000).toFixed(2)} Lakh</span>
              </div>
              <div>
                <span className="text-slate-500 block">Possession</span>
                <span className="font-bold text-slate-200 text-sm">{selectedParcel.possessionStatus}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-semibold mb-1">Land Owner Details</span>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800 font-medium">
                {selectedParcel.ownerNames}
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              GPS Coordinates: {selectedParcel.lat.toFixed(4)}° N, {selectedParcel.lng.toFixed(4)}° E
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
