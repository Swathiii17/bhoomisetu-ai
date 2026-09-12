import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Layers,
  MapPin,
  Building2,
  IndianRupee,
  Users,
  Brain,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  Play
} from 'lucide-react';
import Timeline from '../components/common/Timeline';
import BottleneckBanner from '../components/common/BottleneckBanner';
import HealthGauge from '../components/common/HealthGauge';
import StatusBadge from '../components/common/StatusBadge';
import GISMap from '../components/maps/GISMap';
import MilestonesTracker from '../components/common/MilestonesTracker';

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects, parcels, families, documents, runAIRiskPrediction } = useData();
  const { currentUser } = useAuth();

  const project = projects.find(p => p.id === id) || projects.find(p => p.id === 'PRJ-2026-TN-001') || projects[0];

  const projectParcels = parcels.filter(p => p.projectId === project.id);
  const projectFamilies = families.filter(f => f.projectId === project.id);
  const projectDocs = documents.filter(d => d.projectId === project.id);

  const [activeTab, setActiveTab] = useState('overview'); // overview | parcels | families | documents | ai
  const [predicting, setPredicting] = useState(false);

  const handleRunAi = () => {
    setPredicting(true);
    setTimeout(() => {
      runAIRiskPrediction(project.id, currentUser);
      setPredicting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Back Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link to="/projects" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
          <ArrowLeft size={16} />
          <span>Back to Projects Directory</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunAi}
            disabled={predicting}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-indigo-900/40 transition-all"
          >
            <Sparkles size={14} className={predicting ? 'animate-spin' : ''} />
            <span>{predicting ? 'Running Random Forest Model...' : 'Run Live AI Risk Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Project Overview Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-3 py-1 rounded-lg border border-indigo-800">
                {project.id}
              </span>
              <StatusBadge status={project.status} />
              <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {project.type} Corridor
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">{project.name}</h1>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{project.purpose}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>State: <strong className="text-slate-200">{project.state}</strong></span>
              <span>•</span>
              <span>District: <strong className="text-slate-200">{project.district}</strong></span>
              <span>•</span>
              <span>Ministry: <strong className="text-slate-200">{project.ministry}</strong></span>
              <span>•</span>
              <span>Agency: <strong className="text-slate-200">{project.agency}</strong></span>
            </div>
          </div>

          <HealthGauge score={project.healthScore} />
        </div>

        {/* 14-Stage Visual Lifecycle Timeline */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">14-Stage Land Acquisition Lifecycle Tracking</h3>
          <Timeline currentStage={project.currentStage} status={project.status} />
        </div>
      </div>

      {/* Automated Bottleneck Banner */}
      <BottleneckBanner project={project} />

      {/* AI Delay Prediction Showcase Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/80 border border-indigo-500/40 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-950 border border-indigo-800 rounded-2xl text-indigo-400">
              <Brain size={28} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-white">AI Delay Risk Prediction Engine</h3>
                <span className="bg-indigo-900/80 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-700">
                  Scikit-Learn ML Model
                </span>
              </div>
              <p className="text-xs text-slate-400">Random Forest predictive inference based on 10 land parameters</p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-extrabold ${project.aiRiskLevel === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {project.aiRiskScore}% RISK
            </div>
            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${
              project.aiRiskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {project.aiRiskLevel} DELAY PROBABILITY
            </span>
          </div>
        </div>

        {/* Factors & Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/90 border border-rose-900/60 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle size={14} />
              <span>Major Identified Risk Factors</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {project.aiRiskFactors?.length > 0 ? (
                project.aiRiskFactors.map((rf, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>8 ongoing legal court disputes regarding land compensation rate determination.</span></li>
                  <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>Pending compensation balance of ₹12.0 Crore remaining for over 60 days.</span></li>
                  <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>R&R completion rate lagging at 68% for 120 affected families.</span></li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-slate-950/90 border border-emerald-900/60 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle size={14} />
              <span>Recommended Actionable Mitigations</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {project.aiRecommendations?.length > 0 ? (
                project.aiRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{rec}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Establish Special Lok Adalat bench at Sriperumbudur for fast-track dispute settlement.</span></li>
                  <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Expedite direct bank transfer of ₹12 Cr via Aadhaar-seeded DBT gateway.</span></li>
                  <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Fast-track plot handover at Sector 4 R&R housing colony.</span></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex items-center space-x-4">
        {[
          { id: 'overview', label: 'Key Metrics & GIS' },
          { id: 'milestones', label: 'Milestones & Timeline' },
          { id: 'parcels', label: `Land Parcels (${projectParcels.length})` },
          { id: 'families', label: `Affected Families & R&R (${projectFamilies.length})` },
          { id: 'documents', label: `Documents (${projectDocs.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-white font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Detailed Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Proposed Land Area</div>
              <div className="text-2xl font-extrabold text-white mt-1">{project.proposedLandArea} Acres</div>
              <div className="text-[10px] text-emerald-400 mt-1">Acquired: {project.acquiredLandArea} Acres</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Total Compensation Assessed</div>
              <div className="text-2xl font-extrabold text-white mt-1">₹{project.compensationAssessed} Cr</div>
              <div className="text-[10px] text-amber-300 mt-1">Paid: ₹{project.compensationPaid} Cr</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Affected / Displaced Families</div>
              <div className="text-2xl font-extrabold text-white mt-1">{project.affectedFamilies} / {project.displacedFamilies}</div>
              <div className="text-[10px] text-sky-400 mt-1">R&R Completion: {project.rrCompletedPercentage}%</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Ongoing Legal Disputes</div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{project.legalDisputes}</div>
              <div className="text-[10px] text-slate-400 mt-1">Approval Delay: {project.approvalDelayDays} days</div>
            </div>
          </div>

          {/* Interactive GIS Spatial Map for Project */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200">Spatial Land Corridor Cadastral Map</h3>
            <GISMap parcels={projectParcels} projects={[project]} height="420px" />
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <MilestonesTracker projectId={project.id} />
      )}

      {activeTab === 'parcels' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Project Cadastral Land Parcels Directory</h3>
            <Link to="/land-parcels" className="text-xs text-indigo-400 hover:underline">Add Parcel</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Survey Number</th>
                  <th className="py-3 px-3">Village</th>
                  <th className="py-3 px-3">Area (Acres)</th>
                  <th className="py-3 px-3">Owners</th>
                  <th className="py-3 px-3">Compensation</th>
                  <th className="py-3 px-3">Acquisition Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projectParcels.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-semibold text-white">Survey No {p.surveyNumber}</td>
                    <td className="py-3 px-3">{p.village}</td>
                    <td className="py-3 px-3 font-bold">{p.areaAcquired}</td>
                    <td className="py-3 px-3">{p.ownerNames}</td>
                    <td className="py-3 px-3 font-bold text-amber-300">₹{(p.totalCompensation / 100000).toFixed(2)} Lakh</td>
                    <td className="py-3 px-3"><StatusBadge status={p.acquisitionStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'families' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-extrabold text-white">Affected Families & Rehabilitation Entitlements</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Head of Family</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Members</th>
                  <th className="py-3 px-3">R&R Package Entitlement</th>
                  <th className="py-3 px-3">R&R Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {projectFamilies.map(f => (
                  <tr key={f.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-semibold text-white">{f.headOfFamily}</td>
                    <td className="py-3 px-3 font-bold text-amber-400">{f.displacedStatus}</td>
                    <td className="py-3 px-3">{f.familyMembers} Persons</td>
                    <td className="py-3 px-3 text-slate-300">{f.rrEntitlement}</td>
                    <td className="py-3 px-3"><StatusBadge status={f.rrStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white">Cadastral & Gazette Documents Vault</h3>
            <Link to="/ai-document-verification" className="text-xs text-indigo-400 hover:underline">Scan Document with AI</Link>
          </div>
          <div className="space-y-3">
            {projectDocs.map(doc => (
              <div key={doc.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">({doc.version})</span>
                  </div>
                  <p className="text-xs text-slate-400">{doc.documentType} • Uploaded by {doc.uploadedBy} on {doc.uploadDate}</p>
                  <p className="text-xs text-indigo-300 mt-1 bg-indigo-950/60 p-2 rounded border border-indigo-900">
                    <strong className="text-indigo-200">AI Notes:</strong> {doc.aiNotes}
                  </p>
                </div>
                <StatusBadge status={doc.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
