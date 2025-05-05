import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ChallengeCard from '../components/ChallengeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ChallengesList.css';

const ChallengesList = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    category: 'all',
    search: '',
  });

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/api/challenges');
        setChallenges(response.data.data.challenges);
        setFilteredChallenges(response.data.data.challenges);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load challenges');
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    // Apply filters when filters state changes
    let result = challenges;

    // Filter by difficulty
    if (filters.difficulty !== 'all') {
      result = result.filter(
        (challenge) => challenge.difficulty === filters.difficulty
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(
        (challenge) => challenge.category === filters.category
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchTerm) ||
          challenge.description.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredChallenges(result);
  }, [filters, challenges]);

  // Get unique categories from challenges
  const categories = [
    'all',
    ...new Set(challenges.map((challenge) => challenge.category)),
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
    return <LoadingSpinner message="Loading challenges..." />;
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
    <div className="challenges-list-container">
      <div className="challenges-header">
        <h1>Coding Challenges</h1>
        <p>
          Improve your coding skills with these interactive challenges that mimic
          real-world codebase patterns.
        </p>
      </div>

      <div className="challenges-filters">
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
            placeholder="Search challenges..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="challenges-count">
        <p>
          Showing {filteredChallenges.length} of {challenges.length} challenges
        </p>
      </div>

      <div className="challenges-grid">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <ChallengeCard key={challenge._id} challenge={challenge} />
          ))
        ) : (
          <div className="no-challenges">
            <p>No challenges found matching your filters.</p>
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

export default ChallengesList;