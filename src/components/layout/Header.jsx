import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../i18n/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useData } from '../../contexts/DataContext';
import {
  ShieldAlert,
  Bell,
  UserCheck,
  LogOut,
  Landmark,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const { currentUser, logout, switchRole } = useAuth();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useData();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels = {
    ADMIN: 'Admin (PMO)',
    CENTRAL_MINISTRY: 'Central Ministry',
    STATE_GOVT: 'State Govt',
    DISTRICT_AUTHORITY: 'District Officer',
    PROJECT_AGENCY: 'Project Agency',
    FIELD_OFFICER: 'Field Officer'
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Left Branding */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-emerald-600 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg text-white tracking-tight leading-none group-hover:text-indigo-300 transition-colors">
                {t('appTitle')}
              </h1>
              <span className="bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>SIH 2026</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {t('appSubtitle')}
            </p>
          </div>
        </Link>
      </div>

      {/* Right Controls & User Profile */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <button
          onClick={toggleTheme}
          className="theme-toggle flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/70 text-xs font-medium transition-colors"
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {/* Quick Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-2 bg-gradient-to-r from-slate-800 to-indigo-950/80 hover:from-slate-700 hover:to-indigo-900 text-indigo-200 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="text-emerald-300 font-bold">{roleLabels[currentUser?.role] || currentUser?.role}</span>
            <ChevronDown className="w-3 h-3 text-indigo-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1 tracking-wider">
                Simulate User Role
              </div>
              {Object.keys(roleLabels).map(roleKey => (
                <button
                  key={roleKey}
                  onClick={() => {
                    switchRole(roleKey);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    currentUser?.role === roleKey
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{roleLabels[roleKey]}</span>
                  {currentUser?.role === roleKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">Alerts & Early Warnings</span>
                <Link to="/early-warnings" onClick={() => setShowNotifMenu(false)} className="text-[11px] text-indigo-400 hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.slice(0, 3).map(n => (
                  <div key={n.id} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                      <span className={n.priority === 'CRITICAL' ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                        {n.priority} ALERT
                      </span>
                      <span className="text-slate-500">{n.timestamp}</span>
                    </div>
                    <p className="font-semibold text-slate-200">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Card */}
        {currentUser ? (
          <div className="hidden md:flex items-center space-x-3 border-l border-slate-800 pl-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{currentUser.organization}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('nav.login')}
          </Link>
        )}
      </div>
    </header>
  );
}
