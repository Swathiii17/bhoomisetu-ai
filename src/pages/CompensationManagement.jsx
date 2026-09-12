import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { IndianRupee, Send, CheckCircle, Clock, AlertTriangle, ShieldCheck, CreditCard, Building } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { CompensationDisbursementChart } from '../components/charts/AnalyticsCharts';

export default function CompensationManagement() {
  const { projects, compensation, triggerCompensationPayment } = useData();
  const { currentUser } = useAuth();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const totalAssessed = projects.reduce((s, p) => s + (p.compensationAssessed || 0), 0);
  const totalPaid = projects.reduce((s, p) => s + (p.compensationPaid || 0), 0);
  const totalPending = totalAssessed - totalPaid;

  const handleOpenPayout = (record) => {
    setSelectedRecord(record);
    setPayAmount(record.pendingAmount.toString());
  };

  const handleProcessDBT = (e) => {
    e.preventDefault();
    if (!selectedRecord || !payAmount) return;
    setProcessing(true);
    setTimeout(() => {
      triggerCompensationPayment(selectedRecord.id, parseFloat(payAmount), currentUser);
      setProcessing(false);
      setSelectedRecord(null);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <IndianRupee className="text-amber-400" size={24} />
          <h1 className="text-2xl font-extrabold text-white">Direct Beneficiary Compensation Tracker & DBT Gateway</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          RFCTLARR Act Award Disbursement, Bank Account Settlement, & Pending Balance Audit
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Assessed Compensation</span>
          <div className="text-3xl font-extrabold text-white">₹{totalAssessed.toFixed(1)} Cr</div>
          <span className="text-[10px] text-slate-500">Determined under Section 23 Valuation</span>
        </div>

        <div className="bg-slate-900 border border-emerald-900/60 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-emerald-300 font-medium">Total Disbursed (Paid)</span>
          <div className="text-3xl font-extrabold text-emerald-400">₹{totalPaid.toFixed(1)} Cr</div>
          <span className="text-[10px] text-emerald-300">
            Paid Rate: {((totalPaid / Math.max(1, totalAssessed)) * 100).toFixed(1)}%
          </span>
        </div>

        <div className="bg-slate-900 border border-rose-900/60 p-5 rounded-2xl shadow-xl space-y-1">
          <span className="text-xs text-rose-300 font-medium">Pending Compensation Balance</span>
          <div className="text-3xl font-extrabold text-rose-400">₹{totalPending.toFixed(1)} Cr</div>
          <span className="text-[10px] text-rose-300 font-semibold">Requires Revenue Clearing</span>
        </div>
      </div>

      {/* Chart */}
      <CompensationDisbursementChart projects={projects} />

      {/* Compensation Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white">Beneficiary Compensation Awards Ledger</h3>
          <span className="text-xs text-slate-400">Connected with Direct Benefit Transfer (DBT)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Award No & Survey</th>
                <th className="py-3 px-3">Beneficiary Owner</th>
                <th className="py-3 px-3">Aadhaar & Bank Account</th>
                <th className="py-3 px-3">Assessed (₹)</th>
                <th className="py-3 px-3">Paid (₹)</th>
                <th className="py-3 px-3">Pending (₹)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">DBT Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {compensation.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>{cmp.id}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">Survey No {cmp.surveyNumber}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{cmp.ownerName}</td>
                  <td className="py-3 px-3 text-slate-400">
                    <div>{cmp.ownerAadhaar}</div>
                    <div className="text-[10px] text-slate-500">{cmp.bankAccount}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">₹{(cmp.assessedAmount / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">₹{(cmp.paidAmount / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3 font-bold text-rose-400">₹{(cmp.pendingAmount / 100000).toFixed(2)} Lakh</td>
                  <td className="py-3 px-3"><StatusBadge status={cmp.paymentStatus} /></td>
                  <td className="py-3 px-3">
                    {cmp.pendingAmount > 0 ? (
                      <button
                        onClick={() => handleOpenPayout(cmp)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center space-x-1 transition-all"
                      >
                        <Send size={12} />
                        <span>Disburse DBT</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle size={12} />
                        <span>Settled</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DBT Payment Disbursement Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
              <CreditCard className="text-indigo-400" size={20} />
              <span>Aadhaar Direct Bank Transfer (DBT)</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-1.5">
              <div>Beneficiary: <strong className="text-white">{selectedRecord.ownerName}</strong></div>
              <div>Survey Number: <strong className="text-indigo-300">No {selectedRecord.surveyNumber}</strong></div>
              <div>Bank: <span className="text-slate-300">{selectedRecord.bankAccount}</span></div>
              <div>Assessed Total: <span className="text-white font-bold">₹{(selectedRecord.assessedAmount / 100000).toFixed(2)} Lakh</span></div>
              <div>Current Pending: <span className="text-rose-400 font-bold">₹{(selectedRecord.pendingAmount / 100000).toFixed(2)} Lakh</span></div>
            </div>

            <form onSubmit={handleProcessDBT} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Disbursement Amount (₹ Rupees)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center space-x-2"
                >
                  <Send size={14} className={processing ? 'animate-bounce' : ''} />
                  <span>{processing ? 'Processing PFMS Portal Gateway...' : 'Execute Direct Bank Transfer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
