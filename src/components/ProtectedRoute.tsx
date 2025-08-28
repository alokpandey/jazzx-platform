import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'borrower' | 'broker';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on userType
    const loginPath = userType === 'broker' ? '/broker-login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (userType && user?.userType !== userType) {
    // Redirect to appropriate dashboard based on user's actual type
    const dashboardPath = user?.userType === 'broker' ? '/broker-dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
