import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Smartphone, MapPin, Camera, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function FieldVerification() {
  const { parcels, verifyParcelField } = useData();
  const { currentUser } = useAuth();

  const [selectedParcelId, setSelectedParcelId] = useState(parcels[0]?.id || '');
  const [gpsCoords, setGpsCoords] = useState({ lat: 12.9685, lng: 79.9412 });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [remarks, setRemarks] = useState('Physical land boundary verified with revenue village map.');
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  const handleCaptureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          // Fallback mock coordinates near Kanchipuram
          setGpsCoords({ lat: 12.9685 + Math.random() * 0.01, lng: 79.9412 + Math.random() * 0.01 });
        }
      );
    } else {
      setGpsCoords({ lat: 12.9685, lng: 79.9412 });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    if (!selectedParcel) return;
    verifyParcelField(selectedParcel.id, gpsCoords, photoPreview, remarks, currentUser);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  if (!selectedParcel) {
    return (
      <div className="max-w-xl mx-auto pb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-sm text-slate-400">
          No land parcels are available for field verification.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 mx-auto flex items-center justify-center">
          <Smartphone size={24} />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Field Verification Mobile Portal</h1>
        <p className="text-xs text-slate-400">
          District Officer On-Site Geolocation Capture & Evidence Submission
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-950 border border-emerald-700 p-4 rounded-2xl text-emerald-200 text-xs font-bold text-center flex items-center justify-center space-x-2 animate-in fade-in">
          <CheckCircle2 size={18} />
          <span>Field Verification successfully submitted with GPS & timestamp!</span>
        </div>
      )}

      <form onSubmit={handleSubmitVerification} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Select Parcel */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Select Parcel for On-Site Inspection</label>
          <select
            value={selectedParcel.id}
            onChange={e => setSelectedParcelId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-bold"
          >
            {parcels.map(p => (
              <option key={p.id} value={p.id}>
                Survey No. {p.surveyNumber} ({p.village}) — {p.id}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Parcel Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Survey No: {selectedParcel.surveyNumber}</span>
            <StatusBadge status={selectedParcel.acquisitionStatus} />
          </div>
          <p className="text-slate-400">{selectedParcel.village}, {selectedParcel.district}</p>
          <div className="text-[11px] text-slate-300 font-medium">Owners: {selectedParcel.ownerNames}</div>
        </div>

        {/* Live GPS Geolocation Capture */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <MapPin size={16} className="text-rose-400" />
              <span>Captured GPS Coordinates</span>
            </span>
            <button
              type="button"
              onClick={handleCaptureGPS}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              Get Live GPS Location
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">LATITUDE</span>
              <span className="font-bold text-emerald-400">{gpsCoords.lat.toFixed(6)}° N</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">LONGITUDE</span>
              <span className="font-bold text-emerald-400">{gpsCoords.lng.toFixed(6)}° E</span>
            </div>
          </div>
        </div>

        {/* On-Site Photo Capture */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Upload On-Site Field Photo Evidence</label>
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-4 text-center space-y-2 bg-slate-950/60">
            {photoPreview ? (
              <img src={photoPreview} alt="Field Proof" className="max-h-40 rounded-xl mx-auto object-cover" />
            ) : (
              <div className="space-y-2">
                <Camera size={28} className="text-slate-500 mx-auto" />
                <span className="text-xs text-slate-400 block">Take Photo or Select File</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="field-photo-input" />
            <label
              htmlFor="field-photo-input"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              {photoPreview ? 'Change Photo' : 'Capture Field Photo'}
            </label>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Inspector Verification Remarks</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg transition-colors"
        >
          Submit Geotagged Field Verification
        </button>
      </form>
    </div>
  );
}
