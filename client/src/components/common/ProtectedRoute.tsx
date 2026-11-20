import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * - Displays a loading indicator while the initial session is being restored
 * - Redirects unauthenticated users to /login while preserving the requested URL in state
 * - Renders children or Outlet if authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#ef4a23] border-t-transparent rounded-full animate-spin" />
        <p className="font-archivo text-xs uppercase tracking-widest text-[#141110]/60">
          Verifying Member Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
