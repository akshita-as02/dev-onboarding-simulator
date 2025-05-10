// client/src/components/AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('AdminRoute - User:', user); // Debug log
  console.log('AdminRoute - User role:', user?.role); // Debug log
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  if (!user) {
    console.log('AdminRoute - No user, redirecting to login'); // Debug log
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    console.log('AdminRoute - Not admin, redirecting to dashboard'); // Debug log
    return <Navigate to="/dashboard" />;
  }
  
  console.log('AdminRoute - Admin access granted'); // Debug log
  return children;
};

export default AdminRoute;