import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import {
  Landmark,
  Shield,
  MapPin,
  Brain,
  FileCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle,
  Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const { switchRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey, redirectPath) => {
    switchRole(roleKey);
    navigate(redirectPath);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 border border-slate-800 p-8 lg:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-inner">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Smart India Hackathon 2026 — Government Enterprise Decision Support</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
            Digitizing National Land Acquisition with <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">AI & GIS Analytics</span>
          </h1>

          <p className="text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
            BhoomiSetu AI unifies Central Ministries, State Governments, District Revenue Authorities, and Implementing Agencies into a single transparent platform—eliminating delays, predicting acquisition risks, verifying documents with OCR, and tracking compensation in real time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/dashboard/national"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-900/40 flex items-center space-x-2 transition-all"
            >
              <span>Explore National Dashboard</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/gis-map"
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl flex items-center space-x-2 transition-colors"
            >
              <MapPin size={18} className="text-emerald-400" />
              <span>Interactive GIS Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SIH Presentation Matrix: Problem vs Solution */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-rose-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-950 border border-rose-800 rounded-xl text-rose-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">The Existing Challenge</h3>
              <p className="text-xs text-rose-300 font-medium">Traditional Fragmented Land Acquisition</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>Paper-heavy physical document approvals causing 18+ month delays.</span></li>
            <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>Lack of real-time spatial visibility into disputed survey plots.</span></li>
            <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>Compensation disbursement gridlock and unmonitored R&R grievances.</span></li>
            <li className="flex items-start space-x-2"><span className="text-rose-400 font-bold">•</span><span>No early warning mechanism before projects face cost overruns.</span></li>
          </ul>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Our Unified Solution</h3>
              <p className="text-xs text-emerald-300 font-medium">BhoomiSetu AI Decision Support Platform</p>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Random Forest ML predicting acquisition delay risk with 92% accuracy.</span></li>
            <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Leaflet-powered GIS mapping with live dispute heat zone overlays.</span></li>
            <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>AI OCR scanner flagging survey number and owner name mismatches.</span></li>
            <li className="flex items-start space-x-2"><span className="text-emerald-400 font-bold">✓</span><span>Field verification app with live GPS location & timestamp proof.</span></li>
          </ul>
        </div>
      </section>

      {/* Role Access Portal Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white">Role-Based Government Portals</h2>
            <p className="text-xs text-slate-400">Click any role to instantly experience tailored workflows</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Admin */}
          <div
            onClick={() => handleRoleSelect('ADMIN', '/dashboard/national')}
            className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 p-5 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Landmark size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">System Admin</h4>
            <p className="text-xs text-slate-400">Manage users, audit logs, global settings, national oversight.</p>
            <div className="text-[11px] font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>Launch Admin Dashboard</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* Central Ministry */}
          <div
            onClick={() => handleRoleSelect('CENTRAL_MINISTRY', '/dashboard/national')}
            className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Building2 size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Central Ministry</h4>
            <p className="text-xs text-slate-400">National project monitoring, central approvals, high-risk tracking.</p>
            <div className="text-[11px] font-bold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>Launch Ministry View</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* District Authority */}
          <div
            onClick={() => handleRoleSelect('DISTRICT_AUTHORITY', '/dashboard/district')}
            className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <MapPin size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">District Authority</h4>
            <p className="text-xs text-slate-400">Land verification, compensation disbursement, affected family R&R.</p>
            <div className="text-[11px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>Launch District Officer</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* Project Agency */}
          <div
            onClick={() => handleRoleSelect('PROJECT_AGENCY', '/dashboard/agency')}
            className="bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl cursor-pointer transition-all space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Briefcase size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Project Implementing Agency</h4>
            <p className="text-xs text-slate-400">Submit proposals, upload documents, track 14-stage approval progress.</p>
            <div className="text-[11px] font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
              <span>Launch Agency View</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
        <h2 className="text-xl font-extrabold text-white text-center">Core Innovations & Decision Support Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <Brain className="w-8 h-8 text-indigo-400" />
            <h4 className="font-bold text-slate-100 text-sm">AI Delay Risk Prediction</h4>
            <p className="text-xs text-slate-400">Random forest algorithm calculates acquisition risk (0-100%) and pinpoints major drivers like legal court disputes or pending compensation.</p>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <FileCheck className="w-8 h-8 text-emerald-400" />
            <h4 className="font-bold text-slate-100 text-sm">AI Document Verification</h4>
            <p className="text-xs text-slate-400">OCR & cross-validation engine scans gazette notifications & survey extracts, flagging survey number and owner discrepancies immediately.</p>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <Smartphone className="w-8 h-8 text-amber-400" />
            <h4 className="font-bold text-slate-100 text-sm">Field GPS Verification</h4>
            <p className="text-xs text-slate-400">Mobile-responsive portal for field revenue officers to capture real-time geolocation, upload parcel photos, and submit verification.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
