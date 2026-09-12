import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NationalDashboard from './pages/NationalDashboard';
import StateDashboard from './pages/StateDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import ApprovalWorkflow from './pages/ApprovalWorkflow';
import GISMapPage from './pages/GISMapPage';
import LandParcelManagement from './pages/LandParcelManagement';
import CompensationManagement from './pages/CompensationManagement';
import AffectedFamilies from './pages/AffectedFamilies';
import RRManagement from './pages/RRManagement';
import DocumentManagement from './pages/DocumentManagement';
import AIDelayPrediction from './pages/AIDelayPrediction';
import AIDocumentVerification from './pages/AIDocumentVerification';
import FieldVerification from './pages/FieldVerification';
import EarlyWarningCenter from './pages/EarlyWarningCenter';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import UserManagement from './pages/UserManagement';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/dashboard/national" element={<NationalDashboard />} />
            <Route path="/dashboard/state" element={<StateDashboard />} />
            <Route path="/dashboard/district" element={<DistrictDashboard />} />
            <Route path="/dashboard/agency" element={<AgencyDashboard />} />

            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/approval-workflow" element={<ApprovalWorkflow />} />

            <Route path="/gis-map" element={<GISMapPage />} />
            <Route path="/land-parcels" element={<LandParcelManagement />} />
            <Route path="/compensation" element={<CompensationManagement />} />
            <Route path="/affected-families" element={<AffectedFamilies />} />
            <Route path="/rr-management" element={<RRManagement />} />
            <Route path="/documents" element={<DocumentManagement />} />

            <Route path="/ai-delay-prediction" element={<AIDelayPrediction />} />
            <Route path="/ai-document-verification" element={<AIDocumentVerification />} />
            <Route path="/field-verification" element={<FieldVerification />} />
            <Route path="/early-warnings" element={<EarlyWarningCenter />} />

            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/users" element={<UserManagement />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <DataProvider>
              <AppLayout />
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}
