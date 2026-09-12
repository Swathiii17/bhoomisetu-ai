import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FileSearch, Sparkles, AlertTriangle, CheckCircle, Upload, ShieldCheck, XCircle } from 'lucide-react';
import { verifyLandDocument } from '../services/mlService';
import StatusBadge from '../components/common/StatusBadge';

export default function AIDocumentVerification() {
  const { documents, parcels } = useData();

  const [selectedDocId, setSelectedDocId] = useState(documents[1]?.id || documents[0]?.id);
  const [fileContentSample, setFileContentSample] = useState(
    "GOVERNMENT OF TAMIL NADU GAZETTE EXTRAORDINARY. Section 3A Acquisition Notice for Survey No. 142/3B in Sriperumbudur Taluk. Owner: M. Shanmugam."
  );
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const selectedDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const targetParcel = parcels.find(p => p.id === 'PAR-TN-KNC-001') || parcels[0];

  const handleRunScan = () => {
    setScanning(true);
    setTimeout(() => {
      const res = verifyLandDocument(
        { ...selectedDoc, fileContent: fileContentSample },
        targetParcel
      );
      setScanResult(res);
      setScanning(false);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <FileSearch className="text-emerald-400" size={24} />
          <h1 className="text-2xl font-extrabold text-white">AI Document Verification & OCR Scanner</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          OCR Text Extraction & Rule-based Validation against Cadastral Parcel Records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Document Selector & Input (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
          <h3 className="text-sm font-extrabold text-white">Select Document for AI Scan</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Target Document from Repository</label>
            <select
              value={selectedDocId}
              onChange={e => setSelectedDocId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">OCR Extracted Text Sample / File Text</label>
            <textarea
              rows={4}
              value={fileContentSample}
              onChange={e => setFileContentSample(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1 text-xs">
            <span className="text-slate-400 font-bold block">Cross-Checking Against Land Parcel Record:</span>
            <div className="font-semibold text-indigo-300">
              Survey No: <span className="font-mono font-bold text-white">{targetParcel.surveyNumber}</span> | Village: {targetParcel.village}
            </div>
            <div className="text-[11px] text-slate-400">Owners: {targetParcel.ownerNames}</div>
          </div>

          <button
            onClick={handleRunScan}
            disabled={scanning}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <Sparkles size={16} className={scanning ? 'animate-spin' : ''} />
            <span>{scanning ? 'Performing OCR & Cross-Checking...' : 'Scan & Cross-Verify Document'}</span>
          </button>
        </div>

        {/* Right Scan Result Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-sm font-extrabold text-white">AI Scan Validation Result</h3>

          {scanResult ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className={`p-4 rounded-2xl border text-center space-y-1 ${
                scanResult.status === 'RED'
                  ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                  : scanResult.status === 'YELLOW'
                  ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                  : 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {scanResult.status === 'RED' ? 'RED: POTENTIAL MISMATCH DETECTED' :
                   scanResult.status === 'YELLOW' ? 'YELLOW: MANUAL VERIFICATION REQUIRED' :
                   'GREEN: DOCUMENT APPEARS VALID'}
                </div>
                <div className="text-xs">{scanResult.summary}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Confidence Score: {scanResult.confidence}%
                </div>
              </div>

              {/* Mismatch Reasons List */}
              {scanResult.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Detected Discrepancies</h4>
                  <div className="space-y-2">
                    {scanResult.issues.map((iss, i) => (
                      <div key={i} className="bg-slate-950 p-3 rounded-xl border border-rose-900/60 text-xs text-rose-200">
                        {iss}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs space-y-2">
              <FileSearch size={32} className="mx-auto text-slate-600" />
              <p>Click "Scan & Cross-Verify Document" to trigger OCR analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
