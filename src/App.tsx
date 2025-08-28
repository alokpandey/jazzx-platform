import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './hooks/useNotification';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BrokerLoginPage from './pages/BrokerLoginPage';
import QuickQuotePage from './pages/QuickQuotePage';
import QuoteResultsPage from './pages/QuoteResultsPage';
import ApplicationPage from './pages/ApplicationPage';
import DashboardPage from './pages/DashboardPage';
import LoanStatusPage from './pages/LoanStatusPage';
import DocumentsPage from './pages/DocumentsPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';
import BrokerDashboardPage from './pages/BrokerDashboardPage';
import ClientManagementPage from './pages/ClientManagementPage';
import AIInsightsPage from './pages/AIInsightsPage';
import PipelinePage from './pages/PipelinePage';
import ReportsPage from './pages/ReportsPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Real Azure Functions backend deployed - no client-side mocks needed

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/broker-login" element={<BrokerLoginPage />} />
                <Route path="/quick-quote" element={<QuickQuotePage />} />
                <Route path="/quote-results" element={<QuoteResultsPage />} />

                {/* Protected borrower routes */}
                <Route
                  path="/application"
                  element={
                    <ProtectedRoute userType="borrower">
                      <ApplicationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute userType="borrower">
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/loan-status"
                  element={
                    <ProtectedRoute userType="borrower">
                      <LoanStatusPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute userType="borrower">
                      <DocumentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute userType="borrower">
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute userType="borrower">
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected broker routes */}
                <Route
                  path="/broker-dashboard"
                  element={
                    <ProtectedRoute userType="broker">
                      <BrokerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client-management"
                  element={
                    <ProtectedRoute userType="broker">
                      <ClientManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ai-insights"
                  element={
                    <ProtectedRoute userType="broker">
                      <AIInsightsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pipeline"
                  element={
                    <ProtectedRoute userType="broker">
                      <PipelinePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute userType="broker">
                      <ReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
