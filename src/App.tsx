import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResumeAnalyzer = lazy(() => import('./pages/ResumeAnalyzer'));
const PortfolioBuilder = lazy(() => import('./pages/PortfolioBuilder'));
const PortfolioView = lazy(() => import('./pages/PortfolioView'));
const InterviewSimulator = lazy(() => import('./pages/InterviewSimulator'));
const JobMatcher = lazy(() => import('./pages/JobMatcher'));
const RoadmapGenerator = lazy(() => import('./pages/RoadmapGenerator'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-medium animate-pulse">Loading CareerBoost...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground font-medium animate-pulse">Initializing workspace...</p>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/p/:slug" element={<PortfolioView />} />

        {/* Authenticated Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <PortfolioBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewSimulator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobMatcher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
              <RoadmapGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
