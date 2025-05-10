// client/src/pages/AdminTroubleshoot.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AdminTroubleshoot = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await api.get('/api/troubleshoot');
        setScenarios(response.data.data.scenarios || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load troubleshooting scenarios');
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading troubleshooting scenarios..." />;
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
        <h1>Manage Troubleshooting Scenarios</h1>
        <Link to="/admin/troubleshoot/new" className="add-button">Add New Scenario</Link>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.length > 0 ? (
              scenarios.map((scenario) => (
                <tr key={scenario._id}>
                  <td>{scenario.title}</td>
                  <td>{scenario.difficulty}</td>
                  <td>{scenario.category}</td>
                  <td className="actions-cell">
                    <Link to={`/admin/troubleshoot/edit/${scenario._id}`} className="edit-link">Edit</Link>
                    <button className="delete-button">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No scenarios found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTroubleshoot;