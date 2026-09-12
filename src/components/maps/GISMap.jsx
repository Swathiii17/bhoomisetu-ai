import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { Search, Filter, Layers, AlertTriangle, ShieldCheck, MapPin, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

// Custom Marker Icons by Status
const createCustomIcon = (status, isDispute = false) => {
  let color = '#0284c7'; // Proposed - Sky
  if (status === 'Acquired' || status === 'Possession Completed') color = '#059669'; // Emerald
  else if (status === 'Under Verification' || status === 'Compensation Pending') color = '#d97706'; // Amber
  else if (status === 'Disputed' || isDispute) color = '#e11d48'; // Rose Red

  const pulseClass = isDispute || status === 'Disputed' ? 'pulse-dispute' : '';

  const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: `custom-pulse-marker ${pulseClass}`,
    html: svgMarker,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function GISMap({ parcels = [], projects = [], height = '550px', onSelectParcel }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDisputeHeatmap, setShowDisputeHeatmap] = useState(true);

  // Filter parcels
  const filteredParcels = parcels.filter(p => {
    const matchesStatus = statusFilter === 'ALL' || p.acquisitionStatus === statusFilter;
    const matchesState = stateFilter === 'ALL' || p.state === stateFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesState && matchesSearch;
  });

  // Default center (Kanchipuram highway corridor area or India center)
  const defaultCenter = [12.9400, 79.8900];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4">
      {/* Map Control Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Survey No, Village, Parcel ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Proposed">Proposed</option>
            <option value="Under Verification">Under Verification</option>
            <option value="Acquired">Acquired</option>
            <option value="Disputed">Disputed</option>
            <option value="Compensation Pending">Compensation Pending</option>
            <option value="Possession Completed">Possession Completed</option>
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>

          {/* Dispute Heatmap Toggle */}
          <button
            onClick={() => setShowDisputeHeatmap(!showDisputeHeatmap)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              showDisputeHeatmap
                ? 'bg-rose-950/80 text-rose-300 border-rose-700/80'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <AlertTriangle size={14} />
            <span className="hidden sm:inline">Dispute Risk Zones</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div style={{ height }} className="w-full rounded-xl overflow-hidden relative border border-slate-800">
        <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap Dark">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="OpenStreetMap Standard">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* High Risk Dispute Heatmap Rings */}
          {showDisputeHeatmap &&
            filteredParcels
              .filter(p => p.acquisitionStatus === 'Disputed' || p.disputeRisk === 'HIGH')
              .map(p => (
                <Circle
                  key={`heat-${p.id}`}
                  center={[p.lat, p.lng]}
                  radius={1200}
                  pathOptions={{
                    color: '#e11d48',
                    fillColor: '#e11d48',
                    fillOpacity: 0.35,
                    weight: 2,
                    dashArray: '4, 4'
                  }}
                />
              ))}

          {/* Parcel Markers */}
          {filteredParcels.map(parcel => (
            <Marker
              key={parcel.id}
              position={[parcel.lat, parcel.lng]}
              icon={createCustomIcon(parcel.acquisitionStatus, parcel.disputeRisk === 'HIGH')}
            >
              <Popup>
                <div className="p-1 space-y-2 text-slate-100 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-mono font-bold text-indigo-300">{parcel.id}</span>
                    <StatusBadge status={parcel.acquisitionStatus} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Survey No: {parcel.surveyNumber}</h4>
                    <p className="text-[11px] text-slate-300">{parcel.village}, {parcel.district}, {parcel.state}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded border border-slate-800 text-[10px]">
                    <div>
                      <span className="text-slate-400">Area:</span>
                      <div className="font-bold text-slate-200">{parcel.areaAcquired} Acres</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Owners ({parcel.ownerCount}):</span>
                      <div className="font-medium text-slate-200 truncate">{parcel.ownerNames}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Compensation:</span>
                      <div className="font-bold text-amber-300">₹{(parcel.totalCompensation / 100000).toFixed(2)} Lakh</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Possession:</span>
                      <div className="font-bold text-slate-200">{parcel.possessionStatus}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    GPS: {parcel.lat.toFixed(4)}° N, {parcel.lng.toFixed(4)}° E
                  </div>
                  {onSelectParcel && (
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      className="w-full mt-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-2 rounded text-[11px] flex items-center justify-center space-x-1"
                    >
                      <Eye size={12} />
                      <span>Inspect Details</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/90 backdrop-blur border border-slate-800 rounded-xl p-2.5 shadow-2xl text-[10px] text-slate-300 space-y-1.5">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[9px] border-b border-slate-800 pb-1">
            Parcel Map Legend
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Acquired / Possessed</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span><span>Proposed</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Verification / Comp Pending</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span><span className="text-rose-300 font-bold">Disputed (High Risk)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
