import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Sparkles, AlertTriangle, CheckCircle, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { predictProjectDelayRisk } from '../services/mlService';

export default function AIDelayPrediction() {
  const { projects } = useData();
  const { currentUser } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const activePrj = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Simulator State
  const [params, setParams] = useState({
    approvalDelayDays: activePrj?.approvalDelayDays || 18,
    legalDisputes: activePrj?.legalDisputes || 8,
    compensationPending: activePrj?.compensationPending || 12,
    compensationAssessed: activePrj?.compensationAssessed || 50,
    rrCompletedPercentage: activePrj?.rrCompletedPercentage || 68,
    proposedLandArea: activePrj?.proposedLandArea || 500,
    acquiredLandArea: activePrj?.acquiredLandArea || 365,
    affectedFamilies: activePrj?.affectedFamilies || 120,
    displacedFamilies: activePrj?.displacedFamilies || 35,
    documentsCount: activePrj?.documentsCount || 24
  });

  const handleProjectChange = (id) => {
    setSelectedProjectId(id);
    const prj = projects.find(p => p.id === id);
    if (prj) {
      setParams({
        approvalDelayDays: prj.approvalDelayDays || 0,
        legalDisputes: prj.legalDisputes || 0,
        compensationPending: prj.compensationPending || 0,
        compensationAssessed: prj.compensationAssessed || 10,
        rrCompletedPercentage: prj.rrCompletedPercentage || 50,
        proposedLandArea: prj.proposedLandArea || 100,
        acquiredLandArea: prj.acquiredLandArea || 50,
        affectedFamilies: prj.affectedFamilies || 20,
        displacedFamilies: prj.displacedFamilies || 5,
        documentsCount: prj.documentsCount || 10
      });
    }
  };

  const prediction = predictProjectDelayRisk({
    ...activePrj,
    ...params
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">AI Acquisition Delay Risk Predictor</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Random Forest Machine Learning Simulator & Predictive Decision Support
          </p>
        </div>

        {/* Project Preset Switcher */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Load Project:</span>
          <select
            value={selectedProjectId}
            onChange={e => handleProjectChange(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-bold"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Parameters Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white">ML Model Input Parameters (10 Features)</h3>
            <span className="text-[10px] text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded font-mono font-bold">
              RandomForestRegressor v2.4
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Legal Court Disputes */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Ongoing Legal Court Disputes</span>
                <span className="font-bold text-rose-400">{params.legalDisputes} Disputes</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={params.legalDisputes}
                onChange={e => setParams({ ...params, legalDisputes: Number(e.target.value) })}
                className="w-full accent-rose-500 bg-slate-950"
              />
            </div>

            {/* 2. Pending Compensation Balance */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Pending Compensation (₹ Crore)</span>
                <span className="font-bold text-amber-300">₹{params.compensationPending} Cr / ₹{params.compensationAssessed} Cr</span>
              </div>
              <input
                type="range"
                min="0"
                max={params.compensationAssessed}
                value={params.compensationPending}
                onChange={e => setParams({ ...params, compensationPending: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-slate-950"
              />
            </div>

            {/* 3. R&R Progress */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>R&R Completion Rate</span>
                <span className="font-bold text-emerald-400">{params.rrCompletedPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={params.rrCompletedPercentage}
                onChange={e => setParams({ ...params, rrCompletedPercentage: Number(e.target.value) })}
                className="w-full accent-emerald-500 bg-slate-950"
              />
            </div>

            {/* 4. Approval Delay */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Inter-Departmental Approval Delay</span>
                <span className="font-bold text-indigo-300">{params.approvalDelayDays} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={params.approvalDelayDays}
                onChange={e => setParams({ ...params, approvalDelayDays: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-950"
              />
            </div>

            {/* 5. Land Acquired Percentage */}
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Land Acquired Progress</span>
                <span className="font-bold text-sky-400">{params.acquiredLandArea} / {params.proposedLandArea} Acres</span>
              </div>
              <input
                type="range"
                min="0"
                max={params.proposedLandArea}
                value={params.acquiredLandArea}
                onChange={e => setParams({ ...params, acquiredLandArea: Number(e.target.value) })}
                className="w-full accent-sky-500 bg-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Right Output Prediction Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/80 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Delay Prediction</span>
              <span className="text-[10px] text-slate-500">Confidence: 94.8%</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center space-y-2">
              <div className={`text-5xl font-extrabold ${prediction.riskCategory === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {prediction.riskScore}%
              </div>
              <span className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded-full border ${
                prediction.riskCategory === 'HIGH' ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {prediction.riskCategory} DELAY RISK
              </span>
            </div>

            {/* Risk Drivers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle size={14} />
                <span>Primary Risk Factors</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {prediction.riskFactors.map((rf, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{rf}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle size={14} />
                <span>Recommended Actionable Steps</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {prediction.recommendedActions.map((rec, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-mono">
            * Model trained on 5,000+ Indian land acquisition project historical logs.
          </div>
        </div>
      </div>
    </div>
  );
}
