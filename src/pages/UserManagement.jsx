import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCog, ShieldCheck, Mail, Building, PlusCircle } from 'lucide-react';

export default function UserManagement() {
  const { DEMO_USERS } = useAuth();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCog className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Government User & Role Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Role-Based Access Control (RBAC) & Administrative Jurisdiction Settings
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors self-start sm:self-auto">
          <PlusCircle size={16} />
          <span>Provision New Officer</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Officer Name</th>
                <th className="py-3 px-3">System Role</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Department / Organization</th>
                <th className="py-3 px-3">Assigned State</th>
                <th className="py-3 px-3">Assigned District</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {DEMO_USERS.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-indigo-300 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800 text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-3 px-3 text-slate-200">{u.organization}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-400">{u.state}</td>
                  <td className="py-3 px-3 font-semibold text-amber-300">{u.district}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
