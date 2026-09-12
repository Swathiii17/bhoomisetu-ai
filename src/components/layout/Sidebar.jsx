import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  Building,
  Briefcase,
  Layers,
  Map as MapIcon,
  FileText,
  IndianRupee,
  Users,
  Home,
  Brain,
  FileSearch,
  Smartphone,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  UserCog,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, closeSidebar }) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const role = currentUser?.role || 'ADMIN';

  const isCentral = role === 'CENTRAL_MINISTRY';
  const isState = role === 'STATE_GOVT';
  const isDistrict = role === 'DISTRICT_AUTHORITY' || role === 'FIELD_OFFICER';
  const isAgency = role === 'PROJECT_AGENCY';

  // Navigation Items
  const navItems = [
    { label: t('nav.landing'), path: '/', icon: Home, roles: ['ADMIN'] },
    
    { header: 'DASHBOARDS' },
    { label: t('nav.nationalDashboard'), path: '/dashboard/national', icon: LayoutDashboard, roles: ['ADMIN', 'CENTRAL_MINISTRY'] },
    { label: t('nav.stateDashboard'), path: '/dashboard/state', icon: Building2, roles: ['ADMIN', 'STATE_GOVT'] },
    { label: t('nav.districtDashboard'), path: '/dashboard/district', icon: MapPin, roles: ['ADMIN', 'STATE_GOVT', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER'] },
    { label: t('nav.agencyDashboard'), path: '/dashboard/agency', icon: Briefcase, roles: ['ADMIN', 'PROJECT_AGENCY'] },

    { header: 'PROJECT LIFECYCLE' },
    { label: t('nav.projects'), path: '/projects', icon: Layers, roles: ['ADMIN', 'CENTRAL_MINISTRY', 'STATE_GOVT', 'PROJECT_AGENCY'] },
    { label: isCentral ? 'Central Approval' : isState ? 'State Approval' : isDistrict ? 'Verification' : 'Approval Workflow', path: '/approval-workflow', icon: ShieldCheck, roles: ['ADMIN', 'CENTRAL_MINISTRY', 'STATE_GOVT', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER'] },
    { label: t('nav.gisMap'), path: '/gis-map', icon: MapIcon, roles: ['ADMIN', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER'] },
    { label: 'Create Project Proposal', path: '/create-project', icon: PlusCircle, roles: ['ADMIN', 'PROJECT_AGENCY'] },

    { header: 'CORE MODULES' },
    { label: isAgency ? 'Land Progress' : t('nav.parcels'), path: '/land-parcels', icon: Building, roles: ['ADMIN', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER', 'PROJECT_AGENCY'] },
    { label: t('nav.compensation'), path: '/compensation', icon: IndianRupee, roles: ['ADMIN', 'STATE_GOVT', 'PROJECT_AGENCY'] },
    { label: t('nav.affectedFamilies'), path: '/affected-families', icon: Users, roles: ['ADMIN', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER'] },
    { label: t('nav.rrManagement'), path: '/rr-management', icon: Building2, roles: ['ADMIN', 'STATE_GOVT', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER', 'PROJECT_AGENCY'] },
    { label: t('nav.documents'), path: '/documents', icon: FileText, roles: ['ADMIN', 'PROJECT_AGENCY'] },

    { header: 'AI & DECISION SUPPORT', badge: 'AI' },
    { label: t('nav.aiDelayPrediction'), path: '/ai-delay-prediction', icon: Brain, roles: ['ADMIN', 'CENTRAL_MINISTRY'] },
    { label: t('nav.aiDocVerification'), path: '/ai-document-verification', icon: FileSearch, roles: ['ADMIN', 'CENTRAL_MINISTRY'] },
    { label: t('nav.fieldVerification'), path: '/field-verification', icon: Smartphone, roles: ['ADMIN', 'DISTRICT_AUTHORITY', 'FIELD_OFFICER'] },
    { label: t('nav.earlyWarnings'), path: '/early-warnings', icon: AlertTriangle, roles: ['ADMIN', 'CENTRAL_MINISTRY'] },

    { header: 'GOVERNANCE & REPORTS' },
    { label: t('nav.reports'), path: '/reports', icon: BarChart3, roles: ['ADMIN', 'CENTRAL_MINISTRY'] },
    { label: t('nav.auditLogs'), path: '/audit-logs', icon: ShieldCheck, roles: ['ADMIN'] },
    { label: t('nav.users'), path: '/users', icon: UserCog, roles: ['ADMIN'] }
  ];

  const filteredNav = navItems.reduce((items, item, index) => {
    if (!item.header) {
      if (item.roles.includes(role)) items.push(item);
      return items;
    }

    const hasVisibleItem = navItems.slice(index + 1).some(nextItem =>
      !nextItem.header && nextItem.roles.includes(role)
    );
    if (hasVisibleItem) items.push(item);
    return items;
  }, []);

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-[65px] bottom-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between overflow-y-auto`}
      >
        <div className="py-4 px-3 space-y-1">
          {filteredNav.map((item, index) => {
            if (item.header) {
              return (
                <div key={index} className="pt-4 pb-1 px-3 flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>{item.header}</span>
                  {item.badge && (
                    <span className="bg-indigo-900/60 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center space-x-0.5">
                      <Sparkles size={8} />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </div>
              );
            }

            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer info card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 text-center">
            <div className="text-[11px] font-bold text-slate-200">National SIH Platform</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Govt of India Land Portal</div>
          </div>
        </div>
      </aside>
    </>
  );
}
