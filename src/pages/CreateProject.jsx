import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircle, FileText, Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import { STATES_DISTRICTS } from '../services/mockData';

export default function CreateProject() {
  const { addProject } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Highway',
    ministry: 'Ministry of Road Transport and Highways',
    agency: currentUser?.organization || 'National Highways Authority of India (NHAI)',
    state: 'Tamil Nadu',
    district: 'Kanchipuram',
    purpose: '',
    proposedLandArea: 100,
    estimatedCost: 150.0,
    startDate: '2026-10-01',
    completionDate: '2028-03-31',
    priority: 'HIGH',
    description: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const created = addProject(formData, currentUser);
    navigate(`/projects/${created.id}`);
  };

  const availableDistricts = STATES_DISTRICTS[formData.state] || ['Kanchipuram', 'District 1'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white">Submit New Land Acquisition Project Proposal</h1>
        <p className="text-xs text-slate-400">
          Form Section 3A Land Acquisition Proposal for Central/State Government Inter-Department Clearance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            1. Project Identification & Agency
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chennai Suburban Circular Freight Corridor"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Highway">Highway</option>
                <option value="Railway">Railway</option>
                <option value="Industrial Corridor">Industrial Corridor</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Urban Development">Urban Development</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Airport">Airport</option>
                <option value="Other Infrastructure">Other Infrastructure</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nodal Ministry *</label>
              <select
                name="ministry"
                value={formData.ministry}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Ministry of Road Transport and Highways">Ministry of Road Transport and Highways</option>
                <option value="Ministry of Railways">Ministry of Railways</option>
                <option value="Ministry of Housing and Urban Affairs">Ministry of Housing and Urban Affairs</option>
                <option value="Ministry of Commerce and Industry">Ministry of Commerce and Industry</option>
                <option value="Ministry of New and Renewable Energy">Ministry of New and Renewable Energy</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Implementing Agency *</label>
              <input
                type="text"
                required
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Area */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            2. Spatial Location & Acquisition Targets
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                {Object.keys(STATES_DISTRICTS).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">District *</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                {availableDistricts.map(dst => (
                  <option key={dst} value={dst}>{dst}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Area (Acres) *</label>
              <input
                type="number"
                required
                name="proposedLandArea"
                value={formData.proposedLandArea}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-bold text-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Acquisition Cost (₹ Crores) *</label>
              <input
                type="number"
                required
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-bold"
              >
                <option value="LOW">LOW Priority</option>
                <option value="MEDIUM">MEDIUM Priority</option>
                <option value="HIGH">HIGH Priority</option>
                <option value="CRITICAL">CRITICAL Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public Purpose Statement *</label>
            <textarea
              required
              rows={3}
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="State the public purpose under RFCTLARR Act 2013..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Document Upload */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            3. Mandatory Section 3A Gazette & Cadastral Upload
          </h3>

          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-6 text-center space-y-3 bg-slate-950/60 transition-colors">
            <Upload size={32} className="text-indigo-400 mx-auto" />
            <div className="text-xs text-slate-300 font-semibold">
              Drag & Drop Gazette Notifications or Cadastral Survey PDFs here
            </div>
            <p className="text-[10px] text-slate-500">Supports PDF, DOCX, PNG, JPG up to 25MB. AI scanner will auto-verify on upload.</p>
            <input type="file" multiple onChange={handleFileUpload} className="hidden" id="proposal-file-input" />
            <label
              htmlFor="proposal-file-input"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              Browse Local Files
            </label>

            {uploadedFiles.length > 0 && (
              <div className="pt-2 text-left space-y-1">
                {uploadedFiles.map((fn, i) => (
                  <div key={i} className="text-xs text-emerald-400 flex items-center space-x-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <CheckCircle2 size={14} />
                    <span>{fn}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-xl shadow-indigo-900/40 flex items-center justify-center space-x-2 text-xs transition-colors"
        >
          <span>Submit Proposal to District & State Clearance Board</span>
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
