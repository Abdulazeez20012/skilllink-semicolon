
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Spinner from './components/ui/Spinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CohortsPage = lazy(() => import('./pages/CohortsPage'));
const CohortDetailPage = lazy(() => import('./pages/CohortDetailPage'));
const AssignmentsPage = lazy(() => import('./pages/AssignmentsPage'));
const AssignmentDetailPage = lazy(() => import('./pages/AssignmentDetailPage'));
const DiscussionsPage = lazy(() => import('./pages/DiscussionsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <Suspense fallback={
            <div className="w-full h-screen flex items-center justify-center bg-secondary dark:bg-neutral-soft-black">
              <Spinner size="lg" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<LoginPage />} />
              
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="cohorts" element={<CohortsPage />} />
                <Route path="cohorts/:id" element={<CohortDetailPage />} />
                <Route path="assignments" element={<AssignmentsPage />} />
                <Route path="assignments/:id" element={<AssignmentDetailPage />} />
                <Route path="discussions" element={<DiscussionsPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;