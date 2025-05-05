import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/api/users/profile');
        setProfileData(response.data.data.user);
        setFormData({
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate passwords if changing
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        
        if (!formData.currentPassword) {
          setError('Current password is required to set a new password');
          return;
        }
      }
      
      setLoading(true);
      
      // Prepare update data
      const updateData = {
        name: formData.name,
      };
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }
      
      // Submit update
      const response = await api.put('/api/users/profile', updateData);
      
      // Update profile data
      setProfileData(response.data.data.user);
      
      // Reset password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setMessage('Profile updated successfully');
      setIsEditing(false);
      setLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError('');
    setMessage('');
  };

  if (loading && !profileData) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error && !profileData) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!profileData) {
    return <ErrorMessage message="Profile data not found" />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          {message && <div className="profile-message success">{message}</div>}
          {error && <div className="profile-message error">{error}</div>}
          
          {isEditing ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <div className="password-section">
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={toggleEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="profile-avatar">
                <div className="avatar">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="profile-details">
                <div className="profile-field">
                  <span className="field-label">Name:</span>
                  <span className="field-value">{profileData.name}</span>
                </div>
                
                <div className="profile-field">
                  <span className="field-label">Email:</span>
                  <span className="field-value">{profileData.email}</span>
                </div>
                
                <div className="profile-field">
                  <span className="field-label">Role:</span>
                  <span className="field-value role">
                    {profileData.role.charAt(0).toUpperCase() +
                      profileData.role.slice(1)}
                  </span>
                </div>
                
                <div className="profile-field">
                  <span className="field-label">Joined:</span>
                  <span className="field-value">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="profile-actions">
                <button className="edit-btn" onClick={toggleEdit}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-stats">
          <h2>Your Stats</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{profileData.stats?.challengesCompleted || 0}</div>
              <div className="stat-label">Challenges Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{profileData.stats?.deploymentsCompleted || 0}</div>
              <div className="stat-label">Deployments Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{profileData.stats?.troubleshootCompleted || 0}</div>
              <div className="stat-label">Issues Resolved</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{profileData.stats?.certificationsEarned || 0}</div>
              <div className="stat-label">Certifications Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;