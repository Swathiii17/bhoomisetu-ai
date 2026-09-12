import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart3, Download, FileSpreadsheet, CheckCircle2, Printer, Filter } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function ReportsPage() {
  const { projects, parcels, compensation, families } = useData();
  const [reportType, setReportType] = useState('project_wise');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [exportedMsg, setExportedMsg] = useState('');

  const statesList = ['ALL', ...new Set(projects.map(p => p.state))];
  const ministriesList = ['ALL', ...new Set(projects.map(p => p.ministry))];

  const filteredProjects = projects.filter(p => {
    if (selectedState !== 'ALL' && p.state !== selectedState) return false;
    if (selectedMinistry !== 'ALL' && p.ministry !== selectedMinistry) return false;
    if (reportType === 'high_risk' && p.aiRiskLevel !== 'HIGH') return false;
    return true;
  });

  const exportToCSV = () => {
    let headers = [];
    let rows = [];

    if (reportType === 'project_wise' || reportType === 'high_risk') {
      headers = ['Project ID', 'Project Name', 'State', 'District', 'Ministry', 'Proposed Area (Acres)', 'Acquired Area (Acres)', 'Compensation Paid (Cr)', 'Health Score', 'AI Risk Level'];
      rows = filteredProjects.map(p => [
        p.id,
        `"${p.name}"`,
        p.state,
        p.district,
        `"${p.ministry}"`,
        p.proposedLandArea,
        p.acquiredLandArea,
        p.compensationPaid,
        p.healthScore,
        p.aiRiskLevel
      ]);
    } else if (reportType === 'compensation_report') {
      headers = ['Award ID', 'Survey Number', 'Owner Name', 'Bank Account', 'Assessed (INR)', 'Paid (INR)', 'Pending (INR)', 'Status'];
      rows = compensation.map(c => [
        c.id,
        c.surveyNumber,
        `"${c.ownerName}"`,
        `"${c.bankAccount}"`,
        c.assessedAmount,
        c.paidAmount,
        c.pendingAmount,
        c.paymentStatus
      ]);
    } else if (reportType === 'rr_report') {
      headers = ['Family ID', 'Project Name', 'Head of Family', 'Displacement Status', 'Awarded (INR)', 'Relocation State', 'Status'];
      rows = families.map(f => [
        f.id,
        `"${f.projectName}"`,
        `"${f.headOfFamily}"`,
        f.displacedStatus,
        f.compensationAwarded,
        `"${f.relocationStatus}"`,
        f.rrStatus
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BhoomiSetu_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportedMsg(`Exported ${reportType} CSV report successfully!`);
    setTimeout(() => setExportedMsg(''), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Customizable MIS Reports & Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate and Download Government Land Acquisition Executive Performance Reports
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center space-x-2 text-xs transition-colors"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {exportedMsg && (
        <div className="bg-emerald-950 border border-emerald-700 p-4 rounded-2xl text-emerald-200 text-xs font-bold text-center flex items-center justify-center space-x-2 print:hidden">
          <CheckCircle2 size={16} />
          <span>{exportedMsg}</span>
        </div>
      )}

      {/* Report Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {[
          { id: 'project_wise', title: 'Project Acquisition MIS', desc: 'Overall status of national infrastructure projects.' },
          { id: 'compensation_report', title: 'Compensation Financials', desc: 'Breakdown of assessed, disbursed, and pending awards.' },
          { id: 'rr_report', title: 'R&R Social Impact Summary', desc: 'Affected families displacement & housing plot status.' },
          { id: 'high_risk', title: 'High Risk & Delayed Projects', desc: 'Projects flagged with high delay risk (>60%).' }
        ].map(rpt => (
          <div
            key={rpt.id}
            onClick={() => setReportType(rpt.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              reportType === rpt.id
                ? 'bg-indigo-950/80 border-indigo-500 shadow-xl'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <FileSpreadsheet className="text-indigo-400 mb-2" size={20} />
            <h4 className="font-bold text-white text-xs">{rpt.title}</h4>
            <p className="text-[11px] text-slate-400 mt-1">{rpt.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center gap-4 text-xs print:hidden">
        <div className="flex items-center space-x-2 text-slate-300 font-bold">
          <Filter size={16} className="text-indigo-400" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">State:</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-1.5 font-bold"
          >
            {statesList.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Ministry:</span>
          <select
            value={selectedMinistry}
            onChange={e => setSelectedMinistry(e.target.value)}
            className="bg-slate-950 text-white border border-slate-800 rounded-xl px-3 py-1.5 font-bold"
          >
            {ministriesList.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generated Report Output Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 print:border-none print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase print:text-black">
              Official Executive Report: {reportType.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400 print:text-gray-600">Generated on {new Date().toLocaleString()} for {selectedState} Region</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 print:text-black print:border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 print:bg-gray-100 print:text-black">
              <tr>
                <th className="py-3 px-3">Project ID</th>
                <th className="py-3 px-3">Project Name</th>
                <th className="py-3 px-3">State & District</th>
                <th className="py-3 px-3">Proposed Area</th>
                <th className="py-3 px-3">Compensation Paid</th>
                <th className="py-3 px-3">Stage & Status</th>
                <th className="py-3 px-3">AI Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-gray-300">
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-400 print:text-black">{p.id}</td>
                  <td className="py-3 px-3 font-bold text-white print:text-black">{p.name}</td>
                  <td className="py-3 px-3 text-slate-300 print:text-black">{p.state}, {p.district}</td>
                  <td className="py-3 px-3 font-bold">{p.proposedLandArea} Acres</td>
                  <td className="py-3 px-3 font-bold text-emerald-400 print:text-black">₹{p.compensationPaid} Cr</td>
                  <td className="py-3 px-3"><StatusBadge status={p.status} /></td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      p.aiRiskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {p.aiRiskScore}% ({p.aiRiskLevel})
                    </span>
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
