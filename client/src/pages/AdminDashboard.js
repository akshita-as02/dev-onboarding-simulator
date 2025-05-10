// client/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin data');
        setLoading(false);
      }
    };
    
    fetchAdminStats();
  }, []);
  
  // Redirect if not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }
  
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }
  
  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your onboarding platform</p>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
          <Link to="/admin/users" className="manage-link">Manage Users</Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Challenges</h3>
          <p className="stat-value">{stats?.totalChallenges || 0}</p>
          <Link to="/admin/challenges" className="manage-link">Manage Challenges</Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Deployments</h3>
          <p className="stat-value">{stats?.totalDeployments || 0}</p>
          <Link to="/admin/deployments" className="manage-link">Manage Deployments</Link>
        </div>
        
        <div className="admin-stat-card">
          <h3>Troubleshooting</h3>
          <p className="stat-value">{stats?.totalTroubleshoot || 0}</p>
          <Link to="/admin/troubleshoot" className="manage-link">Manage Scenarios</Link>
        </div>
      </div>
      
      <div className="admin-sections">
        <div className="admin-section">
          <h2>Recent User Activity</h2>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentActivity?.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.userName}</td>
                    <td>{activity.description}</td>
                    <td>{new Date(activity.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
                {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
                  <tr>
                    <td colSpan="3" className="no-data">No recent activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="admin-section">
          <h2>Platform Statistics</h2>
          <div className="platform-stats">
            <div className="platform-stat">
              <h4>Completion Rate</h4>
              <div className="stat-progress">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats?.completionRate || 0}%` }}
                ></div>
              </div>
              <p>{Math.round(stats?.completionRate || 0)}%</p>
            </div>
            
            <div className="platform-stat">
              <h4>Certifications Issued</h4>
              <p className="big-stat">{stats?.certificationsIssued || 0}</p>
            </div>
            
            <div className="platform-stat">
              <h4>Avg. Completion Time</h4>
              <p className="big-stat">{stats?.avgCompletionTime || 0} days</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="admin-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/challenges/new" className="action-button">
            Create Challenge
          </Link>
          <Link to="/admin/deployments/new" className="action-button">
            Create Deployment
          </Link>
          <Link to="/admin/troubleshoot/new" className="action-button">
            Create Scenario
          </Link>
          <Link to="/admin/certifications/new" className="action-button">
            Create Certification
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;