import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, AlertCircle, Calendar, CheckSquare, Edit3 } from 'lucide-react';

export default function MilestonesTracker({ projectId }) {
  const { milestones, updateMilestoneStatus } = useData();
  const { currentUser } = useAuth();
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newActualDate, setNewActualDate] = useState('');

  const projectMilestones = milestones.filter(m => m.projectId === projectId).sort((a, b) => a.stageOrder - b.stageOrder);

  const handleOpenEdit = (m) => {
    setEditingMilestone(m);
    setNewStatus(m.status);
    setNewActualDate(m.actualDate || new Date().toISOString().split('T')[0]);
  };

  const handleSaveMilestone = (e) => {
    e.preventDefault();
    if (!editingMilestone) return;
    updateMilestoneStatus(editingMilestone.id, newStatus, newActualDate, currentUser);
    setEditingMilestone(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
            <CheckSquare className="text-indigo-400" size={20} />
            <span>Land Acquisition Project Milestones Tracker</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Track key statutory notices, compensation awards, and possession milestones</p>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
        {projectMilestones.map((m, index) => {
          const isCompleted = m.status === 'Completed';
          const isOverdue = m.status === 'Overdue';
          const isInProgress = m.status === 'In Progress';

          return (
            <div key={m.id} className="relative pl-6">
              {/* Circle Icon Indicator */}
              <div className={`absolute -left-[17px] top-1 p-1 rounded-full border-2 ${
                isCompleted ? 'bg-emerald-950 border-emerald-500 text-emerald-400' :
                isOverdue ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse' :
                isInProgress ? 'bg-amber-950 border-amber-500 text-amber-400' :
                'bg-slate-950 border-slate-700 text-slate-500'
              }`}>
                {isCompleted ? <CheckCircle2 size={16} /> :
                 isOverdue ? <AlertCircle size={16} /> :
                 <Clock size={16} />}
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                      Step {m.stageOrder}
                    </span>
                    <h4 className="text-sm font-bold text-white">{m.title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isCompleted ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                      isOverdue ? 'bg-rose-950 text-rose-300 border-rose-800' :
                      isInProgress ? 'bg-amber-950 text-amber-300 border-amber-800' :
                      'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{m.remarks}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar size={12} className="text-slate-500" />
                      <span>Target Date: <strong className="text-slate-200">{m.targetDate}</strong></span>
                    </span>
                    {m.actualDate && (
                      <span className="text-emerald-400 font-medium">
                        • Actual: <strong>{m.actualDate}</strong>
                      </span>
                    )}
                    {isOverdue && m.overdueDays > 0 && (
                      <span className="bg-rose-950 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-800">
                        {m.overdueDays} DAYS OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEdit(m)}
                  className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-all shrink-0"
                >
                  <Edit3 size={13} />
                  <span>Update</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Milestone Status Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Update Milestone: {editingMilestone.title}</h3>
            
            <form onSubmit={handleSaveMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Actual Completion Date</label>
                <input
                  type="date"
                  value={newActualDate}
                  onChange={e => setNewActualDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMilestone(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500"
                >
                  Save Milestone Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
