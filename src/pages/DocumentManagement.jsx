import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Upload, ShieldCheck, Search, Eye, Sparkles } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function DocumentManagement() {
  const { documents, setDocuments, addAuditLog } = useData();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const [newDoc, setNewDoc] = useState({
    title: 'Section 3D Final Land Award Notification',
    documentType: 'Gazette Notification',
    version: 'v1.0'
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const docEntry = {
      id: `DOC-TN-${Math.floor(100 + Math.random() * 900)}`,
      projectId: 'PRJ-2026-TN-001',
      projectName: 'Chennai–Bangalore Highway Expansion (NH-48)',
      title: newDoc.title,
      documentType: newDoc.documentType,
      uploadedBy: currentUser?.name || 'Officer',
      uploadDate: new Date().toISOString().split('T')[0],
      version: newDoc.version,
      status: 'VERIFIED',
      aiVerificationStatus: 'GREEN',
      aiNotes: 'Document upload complete. Valid official seal detected.',
      fileUrl: '#'
    };

    setDocuments(prev => [docEntry, ...prev]);
    addAuditLog(currentUser, 'DOCUMENT_UPLOADED', docEntry.title, `Uploaded ${docEntry.documentType} version ${docEntry.version}`);
    setShowUpload(false);
  };

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="text-indigo-400" size={24} />
            <h1 className="text-2xl font-extrabold text-white">Cadastral & Gazette Document Vault</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Secure Government Document Repository with Versioning & Audit History
          </p>
        </div>

        <button
          onClick={() => setShowUpload(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs transition-colors self-start sm:self-auto"
        >
          <Upload size={16} />
          <span>Upload Land Record</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search Gazette Title, Type, Project..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {doc.id} • {doc.version}
                </span>
                <StatusBadge status={doc.status} />
              </div>

              <h4 className="font-bold text-white text-sm">{doc.title}</h4>
              <p className="text-xs text-slate-400">{doc.projectName}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <span className="text-indigo-400 font-bold block mb-0.5">AI Scanner Analysis:</span>
                {doc.aiNotes}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>By: {doc.uploadedBy}</span>
                <span>Date: {doc.uploadDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-white">Upload Land Gazette Record</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={newDoc.title}
                onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
                <select
                  value={newDoc.documentType}
                  onChange={e => setNewDoc({ ...newDoc, documentType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Gazette Notification">Gazette Notification</option>
                  <option value="Land Records">Land Records</option>
                  <option value="Award Document">Award Document</option>
                  <option value="Survey Report">Survey Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Version Number</label>
                <input
                  type="text"
                  value={newDoc.version}
                  onChange={e => setNewDoc({ ...newDoc, version: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs">
                Upload & Run AI Scan
              </button>
              <button type="button" onClick={() => setShowUpload(false)} className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
