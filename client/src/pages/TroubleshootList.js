import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/TroubleshootList.css';

const TroubleshootList = () => {
  const [scenarios, setScenarios] = useState([]);
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    category: 'all',
    search: '',
  });

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await api.get('/api/troubleshoot');
        setScenarios(response.data.data.scenarios);
        setFilteredScenarios(response.data.data.scenarios);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load troubleshooting scenarios');
        setLoading(false);
      }
    };

    fetchScenarios();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = scenarios;

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      result = result.filter(
        (scenario) => scenario.difficulty === filters.difficulty
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(
        (scenario) => scenario.category === filters.category
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (scenario) =>
          scenario.title.toLowerCase().includes(searchTerm) ||
          scenario.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredScenarios(result);
  }, [filters, scenarios]);

  // Get unique categories from scenarios
  const categories = [
    'all',
    ...new Set(scenarios.map((scenario) => scenario.category)),
  ];

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
    <div className="troubleshoot-list-container">
      <div className="troubleshoot-header">
        <h1>Troubleshooting Scenarios</h1>
        <p>
          Develop debugging skills by diagnosing and fixing common issues in
          realistic scenarios.
        </p>
      </div>

      <div className="troubleshoot-filters">
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

        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all'
                  ? 'All Categories'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group search-group">
          <input
            type="text"
            placeholder="Search scenarios..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="scenarios-count">
        <p>
          Showing {filteredScenarios.length} of {scenarios.length} scenarios
        </p>
      </div>

      <div className="scenarios-grid">
        {filteredScenarios.length > 0 ? (
          filteredScenarios.map((scenario) => (
            <div key={scenario._id} className="scenario-card">
              <div className="scenario-card-header">
                <h3 className="scenario-title">{scenario.title}</h3>
                <span className={`scenario-difficulty ${scenario.difficulty}`}>
                  {scenario.difficulty.charAt(0).toUpperCase() +
                    scenario.difficulty.slice(1)}
                </span>
              </div>
              
              <div className="scenario-card-content">
                <p className="scenario-description">
                  {scenario.description.length > 150
                    ? scenario.description.substring(0, 150) + '...'
                    : scenario.description}
                </p>
                
                <div className="scenario-meta">
                  <span className="scenario-category">{scenario.category}</span>
                  <span className="scenario-time">
                    Est. Time: {scenario.estimatedTime} min
                  </span>
                </div>
              </div>
              
              <div className="scenario-card-footer">
                {scenario.progress && (
                  <div className="scenario-progress">
                    <div className="progress-label">
                      <span>Status:</span>
                      <span className={`status ${scenario.progress.status}`}>
                        {scenario.progress.status.charAt(0).toUpperCase() +
                          scenario.progress.status.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                
                <Link 
                  to={`/troubleshoot/${scenario._id}`} 
                  className="scenario-button"
                >
                  {scenario.progress ? 'Continue' : 'Start Scenario'}
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-scenarios">
            <p>No troubleshooting scenarios found matching your filters.</p>
            <button
              onClick={() =>
                setFilters({ difficulty: 'all', category: 'all', search: '' })
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

export default TroubleshootList;