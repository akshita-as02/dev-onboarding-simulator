import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // After auth check is complete, mark as checked
    if (!loading) {
      setAuthChecked(true);
    }
    
    // Debug logging
    if (!loading) {
      console.log('ProtectedRoute: Auth check complete', { 
        path: location.pathname,
        isAuthenticated: !!user,
        user
      });
    }
  }, [loading, user, location.pathname]);

  // Show loading state while checking authentication
  if (loading || !authChecked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login with return path
  if (!user) {
    console.log('ProtectedRoute: Redirecting to login', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;