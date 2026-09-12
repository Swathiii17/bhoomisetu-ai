import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { MapPin, FileCheck, Smartphone, IndianRupee, Users, CheckCircle, Shield, ArrowUpRight } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function DistrictDashboard() {
  const { projects, parcels, families } = useData();
  const { currentUser } = useAuth();

  const [selectedDistrict, setSelectedDistrict] = useState(currentUser?.district !== 'All' ? currentUser?.district || 'Kanchipuram' : 'Kanchipuram');

  const districtProjects = projects.filter(p => p.district === selectedDistrict);
  const districtParcels = parcels.filter(p => p.district === selectedDistrict);
  const districtFamilies = families.filter(f => districtProjects.some(p => p.id === f.projectId));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-amber-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">District Revenue & Field Verification Cell</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            District Collector & Special Tahsildar Operational Portal ({selectedDistrict} District)
          </p>
        </div>

        {/* District selector */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select District:</span>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-bold"
          >
            <option value="Kanchipuram">District: Kanchipuram</option>
            <option value="Palghar">District: Palghar</option>
            <option value="Bengaluru Urban">District: Bengaluru Urban</option>
            <option value="Ahmedabad">District: Ahmedabad</option>
            <option value="Gautam Buddha Nagar">District: Gautam Buddha Nagar</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">District Projects</div>
          <div className="text-2xl font-extrabold text-white mt-1">{districtProjects.length}</div>
          <div className="text-[10px] text-indigo-400 mt-1">Active within {selectedDistrict}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Land Parcels</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{districtParcels.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1">
            Verified: {districtParcels.filter(p => p.fieldVerified).length} / {districtParcels.length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Affected Families</div>
          <div className="text-2xl font-extrabold text-sky-400 mt-1">{districtFamilies.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">R&R Registered</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-medium">Field Verifications</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {districtParcels.filter(p => p.fieldVerified).length}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">GPS & Photo Proof Captured</div>
        </div>
      </div>

      {/* Action Quick Links for District Officer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/field-verification"
          className="bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-700/60 p-4 rounded-2xl flex items-center space-x-3 hover:border-amber-500 transition-colors"
        >
          <div className="p-3 bg-amber-900/60 rounded-xl text-amber-300">
            <Smartphone size={22} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Launch Field Verification App</h4>
            <p className="text-xs text-slate-300">Capture GPS coordinates & upload photo evidence</p>
          </div>
        </Link>

        <Link
          to="/land-parcels"
          className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3 hover:border-indigo-500 transition-colors"
        >
          <div className="p-3 bg-indigo-950 rounded-xl text-indigo-400">
            <MapPin size={22} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Land Parcel Management</h4>
            <p className="text-xs text-slate-300">Update survey numbers, village area & title status</p>
          </div>
        </Link>

        <Link
          to="/compensation"
          className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-3 hover:border-emerald-500 transition-colors"
        >
          <div className="p-3 bg-emerald-950 rounded-xl text-emerald-400">
            <IndianRupee size={22} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Compensation & Awards</h4>
            <p className="text-xs text-slate-300">Disburse beneficiary awards & record bank settlements</p>
          </div>
        </Link>
      </div>

      {/* District Land Parcel Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-white">District Land Parcels Needing Action</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Parcel ID & Survey No</th>
                <th className="py-3 px-3">Village</th>
                <th className="py-3 px-3">Area & Owners</th>
                <th className="py-3 px-3">Acquisition Status</th>
                <th className="py-3 px-3">Field Verification</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {districtParcels.map(pcl => (
                <tr key={pcl.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>Survey No. {pcl.surveyNumber}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{pcl.id}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">{pcl.village}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white">{pcl.areaAcquired} Acres</span>
                    <div className="text-[10px] text-slate-400">{pcl.ownerCount} Owners</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={pcl.acquisitionStatus} />
                  </td>
                  <td className="py-3 px-3">
                    {pcl.fieldVerified ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                        <CheckCircle size={12} />
                        <span>GPS Verified</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold bg-amber-950 px-2 py-0.5 rounded border border-amber-800 text-[10px]">
                        Pending Verification
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/field-verification?parcelId=${pcl.id}`}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors inline-block"
                    >
                      Verify Field
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
