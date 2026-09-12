import React from 'react';
import { useData } from '../contexts/DataContext';
import { AlertTriangle, ShieldAlert, Bell, CheckCircle2, Filter } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function EarlyWarningCenter() {
  const { notifications, setNotifications } = useData();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-rose-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Early Warning & Priority Alert Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-Time Automated Early Warnings for Approval Overdues, Legal Disputes, & Compensation Delays
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-2 transition-colors self-start sm:self-auto"
        >
          <CheckCircle2 size={16} />
          <span>Mark All Alerts Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all ${
              n.priority === 'CRITICAL'
                ? 'bg-gradient-to-r from-rose-950/90 to-slate-900 border-rose-700/80 shadow-2xl'
                : n.priority === 'HIGH'
                ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-700/80 shadow-xl'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl border mt-0.5 ${
                  n.priority === 'CRITICAL' ? 'bg-rose-900/60 border-rose-500 text-rose-300 animate-pulse' : 'bg-amber-900/60 border-amber-500 text-amber-300'
                }`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      n.priority === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {n.priority} PRIORITY
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{n.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-3xl">{n.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
