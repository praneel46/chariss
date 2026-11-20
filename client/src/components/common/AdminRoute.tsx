import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children?: React.ReactNode;
}

/**
 * AdminRoute Component
 * - Verifies that the authenticated user possesses the backend-verified 'admin' role
 * - Displays a loading indicator while session restoration is in progress
 * - Redirects unauthenticated users to /login preserving target URL
 * - Redirects authenticated non-admin users to /dashboard
 */
export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#ef4a23] border-t-transparent rounded-full animate-spin" />
        <p className="font-archivo text-xs uppercase tracking-widest text-[#141110]/60">
          Verifying Atelier Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;
