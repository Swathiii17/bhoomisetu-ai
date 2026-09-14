import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, ArrowRight, ShieldAlert, History, FileText, UserCheck } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import Timeline from '../components/common/Timeline';

export default function ApprovalWorkflow() {
  const { projects, approvals, approveProjectStage } = useData();
  const { currentUser } = useAuth();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [remarks, setRemarks] = useState('');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectApprovals = approvals.filter(a => a.projectId === activeProject?.id);

  const role = currentUser?.role || 'ADMIN';

  // Specific Approval Hierarchy Stages
  const approvalStages = [
    { key: 'Submitted', label: '1. Proposal Submitted', role: 'PROJECT_AGENCY' },
    { key: 'District Verification', label: '2. District Revenue Verification', role: 'DISTRICT_AUTHORITY' },
    { key: 'State Clearance', label: '3. State Cabinet Land Clearance', role: 'STATE_GOVT' },
    { key: 'Central Clearance', label: '4. Central Ministry Sanction', role: 'CENTRAL_MINISTRY' }
  ];

  const handleDecision = (decision) => {
    if (!activeProject) return;
    const stageName = activeProject.currentStage;
    approveProjectStage(activeProject.id, stageName, decision, remarks, currentUser);
    setRemarks('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Inter-Departmental Approval Workflow Board</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Clearance Portal for District Collectors, State Revenue Depts, & Central Ministries
          </p>
        </div>

        {/* Project Switcher Dropdown */}
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Select Project:</span>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none font-bold"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>
      </div>

      {activeProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Approval Action Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
                      {activeProject.id}
                    </span>
                    <StatusBadge status={activeProject.status} />
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">{activeProject.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">{activeProject.state} • {activeProject.district} • {activeProject.agency}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-right">
                  <span className="text-slate-400 block">Pending Clearance Stage</span>
                  <span className="text-sm font-extrabold text-indigo-300">{activeProject.currentStage}</span>
                </div>
              </div>

              {/* Visual Approval Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Tier Clearance Gateways</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {approvalStages.map((stg, i) => {
                    const isPassed = approvalStages.findIndex(s => s.key === activeProject.currentStage) > i || activeProject.status === 'Completed' || activeProject.status === 'Acquisition in Progress';
                    const isCurrent = stg.key === activeProject.currentStage;

                    return (
                      <div key={stg.key} className={`gateway-card p-3 rounded-2xl border text-xs space-y-1 ${
                        isPassed ? 'gateway-passed bg-emerald-950/40 border-emerald-800/80 text-emerald-300' :
                        isCurrent ? 'gateway-current bg-indigo-950/60 border-indigo-500 text-white font-bold ring-1 ring-indigo-500' :
                        'gateway-pending bg-slate-950/60 border-slate-800 text-slate-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="gateway-label text-[10px] uppercase font-bold text-slate-400">Gate {i+1}</span>
                          {isPassed && <CheckCircle2 size={14} className="text-emerald-400" />}
                          {isCurrent && <Clock size={14} className="text-amber-400 animate-spin" />}
                        </div>
                        <div className="gateway-title font-bold truncate">{stg.key}</div>
                        <div className="gateway-role text-[9px] text-slate-400">{stg.role.replace('_', ' ')}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Approval Form */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <UserCheck className="text-emerald-400" size={16} />
                    <span>Official Gate Action ({currentUser?.role})</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Logged in as {currentUser?.name}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Mandatory Officer Approval Remarks / Conditions</label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter revenue verification remarks, gazette reference, or environmental clearance conditions..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <button
                    onClick={() => handleDecision('APPROVE')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-colors"
                  >
                    <CheckCircle2 size={16} />
                    <span>Approve Stage Clearance</span>
                  </button>

                  <button
                    onClick={() => handleDecision('REJECT')}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-colors"
                  >
                    <XCircle size={16} />
                    <span>Reject / Issue Objections</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Approval Audit History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 h-fit">
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-2">
              <History size={16} className="text-indigo-400" />
              <span>Approval Trail History</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {projectApprovals.length > 0 ? (
                projectApprovals.map(app => (
                  <div key={app.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{app.stage}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-slate-300 text-[11px]">{app.remarks}</p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-900">
                      <span>{app.approverName} ({app.approverRole})</span>
                      <span>{app.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic text-center py-6">No previous approval logs found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
