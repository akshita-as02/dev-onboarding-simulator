import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/DeploymentsList.css';

const DeploymentsList = () => {
  const [deployments, setDeployments] = useState([]);
  const [filteredDeployments, setFilteredDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    search: '',
  });

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await api.get('/api/deployments');
        setDeployments(response.data.data.deployments);
        setFilteredDeployments(response.data.data.deployments);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load deployments');
        setLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = deployments;

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      result = result.filter(
        (deployment) => deployment.difficulty === filters.difficulty
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (deployment) =>
          deployment.title.toLowerCase().includes(searchTerm) ||
          deployment.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredDeployments(result);
  }, [filters, deployments]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value,
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading deployment simulations..." />;
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
    <div className="deployments-list-container">
      <div className="deployments-header">
        <h1>Deployment Simulations</h1>
        <p>
          Learn deployment processes through guided walkthroughs in a safe,
          simulated environment.
        </p>
      </div>

      <div className="deployments-filters">
        <div className="filter-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="filter-group search-group">
          <input
            type="text"
            placeholder="Search simulations..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="deployments-count">
        <p>
          Showing {filteredDeployments.length} of {deployments.length} simulations
        </p>
      </div>

      <div className="deployments-grid">
        {filteredDeployments.length > 0 ? (
          filteredDeployments.map((deployment) => (
            <div key={deployment._id} className="deployment-card">
              <div className="deployment-card-header">
                <h3 className="deployment-title">{deployment.title}</h3>
                <span className={`deployment-difficulty ${deployment.difficulty}`}>
                  {deployment.difficulty.charAt(0).toUpperCase() +
                    deployment.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="deployment-card-content">
                <p className="deployment-description">
                  {deployment.description.length > 150
                    ? deployment.description.substring(0, 150) + '...'
                    : deployment.description}
                </p>
                
                <div className="deployment-meta">
                  <span className="deployment-steps">
                    {deployment.totalSteps} Steps
                  </span>
                  <span className="deployment-time">
                    Est. Time: {deployment.estimatedTime} min
                  </span>
                </div>
              </div>
              
              <div className="deployment-card-footer">
                {deployment.progress && (
                  <div className="deployment-progress">
                    <div className="progress-label">
                      <span>Progress:</span>
                      <span>{deployment.progress.completedSteps}/{deployment.totalSteps}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${(deployment.progress.completedSteps / deployment.totalSteps) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <Link 
                  to={`/deployments/${deployment._id}`} 
                  className="deployment-button"
                >
                  {deployment.progress ? 'Continue' : 'Start Simulation'}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-deployments">
            <p>No deployment simulations found matching your filters.</p>
            <button
              onClick={() =>
                setFilters({ difficulty: 'all', search: '' })
              }
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentsList;