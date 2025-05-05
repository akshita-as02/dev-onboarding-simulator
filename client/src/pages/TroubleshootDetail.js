import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TroubleshootScenario from '../components/TroubleshootScenario';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/TroubleshootDetail.css';

const TroubleshootDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await api.get(`/api/troubleshoot/${id}`);
        setScenario(response.data.data.scenario);
        
        // Set progress if it exists
        if (response.data.data.progress) {
          setProgress(response.data.data.progress);
          setIsSolved(response.data.data.progress.status === 'completed');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load scenario');
        setLoading(false);
      }
    };

    fetchScenario();
  }, [id]);

  const handleActionSubmit = async (action) => {
    try {
      const response = await api.post(`/api/troubleshoot/${id}/action`, {
        action,
      });
      
      // Check if scenario is solved
      if (response.data.data.solved) {
        setIsSolved(true);
        
        // Wait a bit before showing the completion message
        setTimeout(() => {
          alert('Congratulations! You have solved the issue.');
        }, 500);
      }
      
      return {
        success: response.data.success,
        message: response.data.data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error processing action',
      };
    }
  };

  const handleRequestHint = async () => {
    try {
      const response = await api.get(`/api/troubleshoot/${id}/hint`);
      alert(`Hint: ${response.data.data.hint}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get hint');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading troubleshooting scenario..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!scenario) {
    return <ErrorMessage message="Troubleshooting scenario not found" />;
  }

  return (
    <div className="troubleshoot-detail-container">
      <div className="troubleshoot-header">
        <div className="troubleshoot-title-section">
          <h1>{scenario.title}</h1>
          <div className="troubleshoot-meta">
            <span className={`difficulty ${scenario.difficulty}`}>
              {scenario.difficulty.charAt(0).toUpperCase() +
                scenario.difficulty.slice(1)}
            </span>
            <span className="category">{scenario.category}</span>
            <span className="estimated-time">
              Est. Time: {scenario.estimatedTime} min
            </span>
          </div>
        </div>
        
        <button 
          className="back-button" 
          onClick={() => navigate('/troubleshoot')}
        >
          Back to Scenarios
        </button>
      </div>

      <div className="troubleshoot-content">
        {isSolved ? (
          <div className="troubleshoot-solved">
            <div className="solved-icon">✓</div>
            <h2>Scenario Solved!</h2>
            <p>You have successfully resolved this issue.</p>
            <div className="solved-actions">
              <button 
                className="view-solution-btn"
                onClick={() => alert('Solution: ' + scenario.solution)}
              >
                View Solution
              </button>
              <button
                className="next-scenario-btn"
                onClick={() => navigate('/troubleshoot')}
              >
                More Scenarios
              </button>
            </div>
          </div>
        ) : (
          <TroubleshootScenario
            scenario={scenario}
            onActionSubmit={handleActionSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default TroubleshootDetail;
