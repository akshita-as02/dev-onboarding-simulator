// client/src/pages/AdminChallenges.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AdminChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    category: '',
    requirements: '',
    testCases: '',
    starterCode: '',
    solutionCode: ''
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/api/challenges');
      setChallenges(response.data.data.challenges || []);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load challenges');
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      // Format test cases as an array of objects
      const formattedTestCases = formData.testCases.split('\n').map(testCase => ({
        input: testCase,
        expectedOutput: 'Expected output will be validated',
        isHidden: false
      }));

      const challengeData = {
        ...formData,
        testCases: formattedTestCases,
        starterCode: formData.starterCode || '// Write your code here',
        solutionCode: formData.solutionCode || '// Solution code here'
      };

      await api.post('/api/challenges', challengeData);
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        category: '',
        testCases: '',
        starterCode: '',
        solutionCode: ''
      });
      fetchChallenges();
    } catch (err) {
      console.error('Error creating challenge:', err);
    }
  };

  const handleUpdateChallenge = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/challenges/${selectedChallenge._id}`, formData);
      setChallenges(challenges.map(challenge => 
        challenge._id === selectedChallenge._id ? response.data.data.challenge : challenge
      ));
      setShowEditModal(false);
      setSelectedChallenge(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update challenge');
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await api.delete(`/api/challenges/${id}`);
        setChallenges(challenges.filter(challenge => challenge._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete challenge');
      }
    }
  };

  const handleEditClick = (challenge) => {
    setSelectedChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      requirements: challenge.requirements,
      testCases: challenge.testCases,
      starterCode: challenge.starterCode,
      solutionCode: challenge.solutionCode
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
    <div className="admin-page-container">
      <div className="admin-header">
        <h1>Manage Challenges</h1>
        <button 
          className="add-button"
          onClick={() => setShowCreateModal(true)}
        >
          Add New Challenge
        </button>
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
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
                <tr key={challenge._id}>
                  <td>{challenge.title}</td>
                  <td>{challenge.difficulty}</td>
                  <td>{challenge.category}</td>
                  <td className="actions-cell">
                    <button 
                      className="edit-link"
                      onClick={() => handleEditClick(challenge)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteChallenge(challenge._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">No challenges found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Challenge</h2>
            <form onSubmit={handleCreateChallenge}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Test Cases (one per line)</label>
                <textarea
                  value={formData.testCases}
                  onChange={(e) => setFormData({ ...formData, testCases: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Starter Code</label>
                <textarea
                  value={formData.starterCode}
                  onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Solution Code</label>
                <textarea
                  value={formData.solutionCode}
                  onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="submit-button">Create</button>
                <button type="button" className="cancel-button" onClick={() => setShowCreateModal(false)}>
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
            <h2>Edit Challenge</h2>
            <form onSubmit={handleUpdateChallenge}>
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
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Requirements:</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Test Cases:</label>
                <textarea
                  name="testCases"
                  value={formData.testCases}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Starter Code:</label>
                <textarea
                  name="starterCode"
                  value={formData.starterCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Solution Code:</label>
                <textarea
                  name="solutionCode"
                  value={formData.solutionCode}
                  onChange={handleInputChange}
                  required
                />
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

export default AdminChallenges;