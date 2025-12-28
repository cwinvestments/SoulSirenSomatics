import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePortalAuth } from '../context/PortalAuthContext';

function PortalProtectedRoute({ children }) {
  const { isLoggedIn, loading } = usePortalAuth();

  if (loading) {
    return (
      <div className="portal-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/portal" replace />;
  }

  return children;
}

export default PortalProtectedRoute;
