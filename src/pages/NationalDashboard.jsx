import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useTranslation } from '../i18n/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  MapPin,
  IndianRupee,
  Users,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Building,
  Brain,
  ChevronRight
} from 'lucide-react';
import {
  ProjectsByStateChart,
  LandAcquisitionProgressChart,
  CompensationDisbursementChart,
  ProjectStatusPieChart
} from '../components/charts/AnalyticsCharts';
import StatusBadge from '../components/common/StatusBadge';
import BottleneckBanner from '../components/common/BottleneckBanner';
import GISMap from '../components/maps/GISMap';

export default function NationalDashboard() {
  const { projects, parcels } = useData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Filter projects
  const filteredProjects = projects.filter(p => {
    const matchState = selectedState === 'ALL' || p.state === selectedState;
    const matchType = selectedType === 'ALL' || p.type === selectedType;
    const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    return matchState && matchType && matchStatus;
  });

  // Calculate aggregates
  const totalProjects = filteredProjects.length;
  const totalLandProposed = filteredProjects.reduce((sum, p) => sum + (p.proposedLandArea || 0), 0);
  const totalLandAcquired = filteredProjects.reduce((sum, p) => sum + (p.acquiredLandArea || 0), 0);
  const totalCompAssessed = filteredProjects.reduce((sum, p) => sum + (p.compensationAssessed || 0), 0);
  const totalCompPaid = filteredProjects.reduce((sum, p) => sum + (p.compensationPaid || 0), 0);
  const totalAffected = filteredProjects.reduce((sum, p) => sum + (p.affectedFamilies || 0), 0);
  const highRiskCount = filteredProjects.filter(p => p.aiRiskLevel === 'HIGH').length;

  const showcaseProject = projects.find(p => p.id === 'PRJ-2026-TN-001') || projects[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">National Executive Land Dashboard</h1>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE GIS DATA</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring across 28 States & Union Territories
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
          <Filter size={14} className="text-indigo-400 ml-1" />
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
          </select>

          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Infrastructure Types</option>
            <option value="Highway">Highway</option>
            <option value="Railway">Railway</option>
            <option value="Industrial Corridor">Industrial Corridor</option>
            <option value="Urban Development">Urban Development</option>
            <option value="Renewable Energy">Renewable Energy</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Total Projects</span>
            <div className="p-2 bg-indigo-950 text-indigo-400 rounded-xl border border-indigo-800">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalProjects}</div>
          <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp size={10} />
            <span>100% Monitored digitally</span>
          </div>
        </div>

        {/* Proposed vs Acquired Land */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Land Acquired / Proposed</span>
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
              <Building size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {totalLandAcquired.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {totalLandProposed.toLocaleString()} Acres</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Progress: <span className="font-bold text-emerald-300">{((totalLandAcquired / Math.max(1, totalLandProposed)) * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Compensation Paid */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Compensation Paid</span>
            <div className="p-2 bg-amber-950 text-amber-400 rounded-xl border border-amber-800">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{totalCompPaid} <span className="text-xs text-slate-400 font-normal">/ ₹{totalCompAssessed} Cr</span>
          </div>
          <div className="text-[10px] text-amber-400">
            Pending: ₹{(totalCompAssessed - totalCompPaid).toFixed(1)} Cr
          </div>
        </div>

        {/* High Risk Alerts */}
        <div className="bg-gradient-to-br from-slate-900 to-rose-950/60 border border-rose-800/80 p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-300 font-medium">
            <span>High Risk Projects</span>
            <div className="p-2 bg-rose-950 text-rose-400 rounded-xl border border-rose-700 animate-pulse">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{highRiskCount}</div>
          <div className="text-[10px] text-rose-400 font-bold">
            Requires Lok Adalat Escalation
          </div>
        </div>
      </div>

      {/* Bottleneck Banner for Showcase Project */}
      <BottleneckBanner project={showcaseProject} />

      {/* Analytics Visualizers Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LandAcquisitionProgressChart projects={filteredProjects} />
        <CompensationDisbursementChart projects={filteredProjects} />
      </div>

      {/* Analytics Visualizers Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectsByStateChart projects={filteredProjects} />
        </div>
        <ProjectStatusPieChart projects={filteredProjects} />
      </div>

      {/* Interactive GIS Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
            <MapPin className="text-emerald-400" size={20} />
            <span>National Spatial GIS Parcel Monitor</span>
          </h2>
          <Link to="/gis-map" className="text-xs text-indigo-400 font-bold hover:underline flex items-center space-x-1">
            <span>Full Map Workspace</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <GISMap parcels={parcels} projects={filteredProjects} height="460px" onSelectParcel={(p) => navigate(`/land-parcels?id=${p.id}`)} />
      </div>

      {/* Dashboard Drill-Down Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white">Dashboard Drill-Down: Projects Registry</h3>
            <p className="text-xs text-slate-400">Click any project to inspect lifecycle, bottlenecks, & AI delay predictions</p>
          </div>
          <Link to="/projects" className="text-xs text-indigo-400 hover:underline font-semibold">
            View All Projects ({projects.length})
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Project ID & Name</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3">Land Acquired</th>
                <th className="py-3 px-3">Compensation Paid</th>
                <th className="py-3 px-3">Health Score</th>
                <th className="py-3 px-3">AI Delay Risk</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProjects.map(prj => (
                <tr key={prj.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link to={`/projects/${prj.id}`} className="hover:text-indigo-400 transition-colors">
                      {prj.name}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{prj.id} • {prj.type}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200">{prj.state}</span>
                    <div className="text-[10px] text-slate-400">{prj.district}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-100">{prj.acquiredLandArea}</span> / {prj.proposedLandArea} Acres
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-300">
                    ₹{prj.compensationPaid} / ₹{prj.compensationAssessed} Cr
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-extrabold px-2 py-0.5 rounded text-[11px] ${
                      prj.healthScore >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                      prj.healthScore >= 50 ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                      'bg-rose-950 text-rose-300 border border-rose-700'
                    }`}>
                      {prj.healthScore}/100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-bold flex items-center space-x-1 text-[11px] ${
                      prj.aiRiskLevel === 'HIGH' ? 'text-rose-400' :
                      prj.aiRiskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      <Brain size={12} />
                      <span>{prj.aiRiskScore}% ({prj.aiRiskLevel})</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={prj.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/projects/${prj.id}`}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/60"
                    >
                      <span>Drill Down</span>
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
