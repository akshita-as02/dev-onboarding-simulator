// client/src/pages/AdminUsers.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data.data.users || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setEditModalOpen(true);
    setUpdateError('');
    setUpdateSuccess(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentUser(null);
    setUpdateError('');
    setUpdateSuccess(false);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !selectedRole) return;
    
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);
    
    try {
      await api.put(`/api/users/${currentUser._id}`, { 
        role: selectedRole 
      });
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === currentUser._id 
          ? { ...user, role: selectedRole } 
          : user
      ));
      
      setUpdateSuccess(true);
      
      // Close the modal after a short delay
      setTimeout(() => {
        closeEditModal();
      }, 1500);
      
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchUsers}
      />
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <h1>Manage Users</h1>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-link"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit User Modal */}
      {editModalOpen && currentUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit User Role</h2>
              <button className="close-button" onClick={closeEditModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="user-details">
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Current Role:</strong> 
                  <span className={`role-badge role-${currentUser.role}`}>
                    {currentUser.role}
                  </span>
                </p>
              </div>
              
              {updateError && (
                <div className="error-message">
                  {updateError}
                </div>
              )}
              
              {updateSuccess && (
                <div className="success-message">
                  User role updated successfully!
                </div>
              )}
              
              <form onSubmit={handleUpdateRole}>
                <div className="form-group">
                  <label htmlFor="role">Select New Role:</label>
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="mentor">Mentor</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="confirm-button"
                    disabled={updateLoading || !selectedRole || selectedRole === currentUser.role}
                  >
                    {updateLoading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;