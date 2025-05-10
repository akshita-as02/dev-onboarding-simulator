import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import '../styles/AdminPages.css';

const AdminStats = () => {
  // const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!stats) {
    return <div className="no-data">No statistics available</div>;
  }

  return (
    <div className="admin-stats-container">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Challenges</h3>
          <p className="stat-number">{stats.totalChallenges}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Deployments</h3>
          <p className="stat-number">{stats.totalDeployments}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Troubleshooting</h3>
          <p className="stat-number">{stats.totalTroubleshoot}</p>
        </div>
        
        <div className="stat-card">
          <h3>Certifications Issued</h3>
          <p className="stat-number">{stats.certificationsIssued}</p>
        </div>
        
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <p className="stat-number">{stats.completionRate}%</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-user">{activity.userName}</div>
              <div className="activity-description">{activity.description}</div>
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button onClick={() => window.location.href = '/admin/users'}>
            Manage Users
          </button>
          <button onClick={() => window.location.href = '/admin/challenges'}>
            Manage Challenges
          </button>
          <button onClick={() => window.location.href = '/admin/deployments'}>
            Manage Deployments
          </button>
          <button onClick={() => window.location.href = '/admin/certifications'}>
            Manage Certifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStats; 