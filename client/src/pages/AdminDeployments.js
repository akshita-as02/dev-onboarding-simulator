// client/src/pages/AdminDeployments.js
import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/AdminPages.css';

const AdminDeployments = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    steps: [],
    currentStep: ''
  });

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      const response = await api.get('/api/deployments');
      setDeployments(response.data.data.deployments || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load deployments');
      setLoading(false);
    }
  };

  const handleCreateDeployment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/deployments', formData);
      setDeployments([...deployments, response.data.data.deployment]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        steps: [],
        currentStep: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create deployment');
    }
  };

  const handleUpdateDeployment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/deployments/${selectedDeployment._id}`, formData);
      setDeployments(deployments.map(deployment => 
        deployment._id === selectedDeployment._id ? response.data.data.deployment : deployment
      ));
      setShowEditModal(false);
      setSelectedDeployment(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update deployment');
    }
  };

  const handleDeleteDeployment = async (id) => {
    if (window.confirm('Are you sure you want to delete this deployment?')) {
      try {
        await api.delete(`/api/deployments/${id}`);
        setDeployments(deployments.filter(deployment => deployment._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete deployment');
      }
    }
  };

  const handleEditClick = (deployment) => {
    setSelectedDeployment(deployment);
    setFormData({
      title: deployment.title,
      description: deployment.description,
      difficulty: deployment.difficulty,
      steps: deployment.steps || [],
      currentStep: ''
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

  const handleAddStep = () => {
    if (formData.currentStep.trim()) {
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, prev.currentStep.trim()],
        currentStep: ''
      }));
    }
  };

  const handleRemoveStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading deployments..." />;
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
        <h1>Manage Deployments</h1>
        <button 
          className="add-button"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Deployment
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Steps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deployments.length > 0 ? (
              deployments.map((deployment) => (
                <tr key={deployment._id}>
                  <td>{deployment.title}</td>
                  <td>{deployment.difficulty}</td>
                  <td>{deployment.steps?.length || 0} steps</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-link"
                      onClick={() => handleEditClick(deployment)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteDeployment(deployment._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No deployments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Deployment</h2>
            <form onSubmit={handleCreateDeployment}>
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
                <label>Difficulty:</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Steps:</label>
                <div className="steps-container">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="step-item">
                      <span>{index + 1}. {step}</span>
                      <button
                        type="button"
                        className="remove-step"
                        onClick={() => handleRemoveStep(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-step">
                    <input
                      type="text"
                      value={formData.currentStep}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStep: e.target.value }))}
                      placeholder="Add a new step"
                    />
                    <button
                      type="button"
                      className="add-step-button"
                      onClick={handleAddStep}
                    >
                      Add Step
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
            <h2>Edit Deployment</h2>
            <form onSubmit={handleUpdateDeployment}>
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
                <label>Difficulty:</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label>Steps:</label>
                <div className="steps-container">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="step-item">
                      <span>{index + 1}. {step}</span>
                      <button
                        type="button"
                        className="remove-step"
                        onClick={() => handleRemoveStep(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-step">
                    <input
                      type="text"
                      value={formData.currentStep}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStep: e.target.value }))}
                      placeholder="Add a new step"
                    />
                    <button
                      type="button"
                      className="add-step-button"
                      onClick={handleAddStep}
                    >
                      Add Step
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

export default AdminDeployments;