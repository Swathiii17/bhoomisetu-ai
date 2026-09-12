import React from 'react';
import { useData } from '../contexts/DataContext';
import { ShieldCheck, Clock, User, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useData();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-emerald-400" size={24} />
          <h1 className="text-2xl font-extrabold text-white">System Audit & Governance Logs</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Immutable Tamper-Evident System Event Trail
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Log ID & Timestamp</th>
                <th className="py-3 px-3">Officer & Role</th>
                <th className="py-3 px-3">Action Event</th>
                <th className="py-3 px-3">Project / Target</th>
                <th className="py-3 px-3">Event Details</th>
                <th className="py-3 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-indigo-400">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">{log.project}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-md">{log.details}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
