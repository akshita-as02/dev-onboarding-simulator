import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Profile.css';
import axios from 'axios';

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

  // Add useEffect to flash error message and handle errors visually
  useEffect(() => {
    // When an error is set, make it visually attention-getting
    if (error) {
      console.log('Error message set:', error);
      
      // Find the error element
      const errorEl = document.querySelector('.profile-message.error');
      if (errorEl) {
        // Add attention class that will be removed after animation
        errorEl.classList.add('flash-error');
        
        // Scroll to the error if not in view
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove the flash class after animation completes
        setTimeout(() => {
          errorEl.classList.remove('flash-error');
        }, 1000);
      }
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error and messages when user starts typing
    if (name === 'currentPassword' || name === 'newPassword' || name === 'confirmPassword') {
      setError('');
      setMessage('');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Always clear previous messages first
    setError('');
    setMessage('');
    
    // Validate password matching
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        
    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
          return;
        }
    
    // Set loading state
    const updateBtn = e.target.querySelector('button[type="submit"]');
    if (updateBtn) {
      updateBtn.disabled = true;
      updateBtn.textContent = 'Updating...';
    }
    
    console.log('Updating password...');
    
    try {
      // Directly use axios instead of our api instance to bypass interceptors
      const token = localStorage.getItem('token');
      const response = await axios({
        method: 'put',
        url: 'http://localhost:5000/api/users/update-password',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      });
      
      console.log('Password update successful:', response.data);
      
      // Clear password fields on success
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Show success message
      setMessage('Password updated successfully');
    } catch (err) {
      console.error('Password update error:', err);
      
      // Handle 401 errors specially
      if (err.response?.status === 401) {
        setError('Current password is incorrect. Please try again.');
      } else {
        // Use the custom message or a generic fallback
        setError(err.customMessage || err.response?.data?.message || 'Failed to update password. Please try again.');
      }
      
      // Log full error details for debugging
      console.log('Error details:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data,
        customMessage: err.customMessage
      });
    } finally {
      // Re-enable the button
      if (updateBtn) {
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update Password';
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setMessage('');
      
      const response = await api.put('/api/users/profile', {
        name: formData.name,
        email: formData.email,
      });
      
      setProfileData(response.data.data.user);
      setMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.customMessage || 'Failed to update profile');
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
      <div className="profile-container">
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
      </div>
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
            <div className="profile-edit-container">
              <form className="profile-form" onSubmit={handleProfileUpdate}>
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
              
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Profile
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={toggleEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              
              <form className="password-form" onSubmit={handlePasswordUpdate}>
                <h3>Change Password</h3>
                
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
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
                    required
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
                    required
                  />
              </div>
              
              <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Update Password
                </button>
              </div>
            </form>
            </div>
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