// client/src/pages/AdminCertifications.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AdminPages.css';

const AdminCertifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [],
    currentRequirement: {
      type: 'challenge',
      item: ''
    }
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/api/certifications');
      setCertifications(response.data.data.certifications || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certifications');
      setLoading(false);
    }
  };

  const handleCreateCertification = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/certifications', formData);
      setCertifications([...certifications, response.data.data.certification]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        requirements: [],
        currentRequirement: {
          type: 'challenge',
          item: ''
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create certification');
    }
  };

  const handleUpdateCertification = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/certifications/${selectedCertification._id}`, formData);
      setCertifications(certifications.map(certification => 
        certification._id === selectedCertification._id ? response.data.data.certification : certification
      ));
      setShowEditModal(false);
      setSelectedCertification(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update certification');
    }
  };

  const handleDeleteCertification = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.delete(`/api/certifications/${id}`);
        setCertifications(certifications.filter(certification => certification._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete certification');
      }
    }
  };

  const handleEditClick = (certification) => {
    setSelectedCertification(certification);
    setFormData({
      title: certification.title,
      description: certification.description,
      requirements: certification.requirements || [],
      currentRequirement: {
        type: 'challenge',
        item: ''
      }
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      currentRequirement: {
        ...prev.currentRequirement,
        type: e.target.value
      }
    }));
  };

  const handleRequirementItemChange = (e) => {
    setFormData(prev => ({
      ...prev,
      currentRequirement: {
        ...prev.currentRequirement,
        item: e.target.value
      }
    }));
  };

  const handleAddRequirement = () => {
    if (formData.currentRequirement.item.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, { ...prev.currentRequirement }],
        currentRequirement: {
          type: 'challenge',
          item: ''
        }
      }));
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading certifications..." />;
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
    <div className="admin-page-container">
      <div className="admin-header">
        <h1>Manage Certifications</h1>
        <button 
          className="add-button"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Certification
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Requirements</th>
              <th>Users Certified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {certifications.length > 0 ? (
              certifications.map((certification) => (
                <tr key={certification._id}>
                  <td>{certification.title}</td>
                  <td>{certification.requirements?.length || 0} requirements</td>
                  <td>0 users</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-link"
                      onClick={() => handleEditClick(certification)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteCertification(certification._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No certifications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Certification</h2>
            <form onSubmit={handleCreateCertification}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Requirements:</label>
                <div className="requirements-container">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="requirement-item">
                      <span>{req.type}: {req.item}</span>
                      <button
                        type="button"
                        className="remove-requirement"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-requirement">
                    <select
                      value={formData.currentRequirement.type}
                      onChange={handleRequirementTypeChange}
                    >
                      <option value="challenge">Challenge</option>
                      <option value="deployment">Deployment</option>
                      <option value="troubleshoot">Troubleshooting</option>
                    </select>
                    <input
                      type="text"
                      value={formData.currentRequirement.item}
                      onChange={handleRequirementItemChange}
                      placeholder="Enter requirement ID"
                    />
                    <button
                      type="button"
                      className="add-requirement-button"
                      onClick={handleAddRequirement}
                    >
                      Add Requirement
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Create</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Certification</h2>
            <form onSubmit={handleUpdateCertification}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Requirements:</label>
                <div className="requirements-container">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="requirement-item">
                      <span>{req.type}: {req.item}</span>
                      <button
                        type="button"
                        className="remove-requirement"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-requirement">
                    <select
                      value={formData.currentRequirement.type}
                      onChange={handleRequirementTypeChange}
                    >
                      <option value="challenge">Challenge</option>
                      <option value="deployment">Deployment</option>
                      <option value="troubleshoot">Troubleshooting</option>
                    </select>
                    <input
                      type="text"
                      value={formData.currentRequirement.item}
                      onChange={handleRequirementItemChange}
                      placeholder="Enter requirement ID"
                    />
                    <button
                      type="button"
                      className="add-requirement-button"
                      onClick={handleAddRequirement}
                    >
                      Add Requirement
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="submit-button">Update</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCertifications;