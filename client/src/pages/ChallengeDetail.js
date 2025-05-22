import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ChallengeDetail.css';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await api.get(`/api/challenges/${id}`);
        setChallenge(response.data.data.challenge);
        setCode(response.data.data.challenge.starterCode);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load challenge');
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowHint(false);
      
      const response = await api.post(`/api/challenges/${id}/submit`, {
        code,
      });
      
      setTestResults(response.data.data.testResults);
      setAllTestsPassed(response.data.data.allTestsPassed);
      
      setIsSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit challenge');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code?')) {
      setCode(challenge.starterCode);
      setTestResults(null);
      setAllTestsPassed(false);
    }
  };

  const handleShowHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else {
      // Cycle through hints
      setCurrentHintIndex((prevIndex) =>
        prevIndex < challenge.hints.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading challenge..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!challenge) {
    return <ErrorMessage message="Challenge not found" />;
  }

  return (
    <div className="challenge-detail-container">
      <div className="challenge-header">
        <div className="challenge-title-section">
          <h1>{challenge.title}</h1>
          <div className="challenge-meta">
            <span className={`difficulty ${challenge.difficulty}`}>
              {challenge.difficulty.charAt(0).toUpperCase() +
                challenge.difficulty.slice(1)}
            </span>
            <span className="category">{challenge.category}</span>
            <span className="time-limit">{challenge.timeLimit} minutes</span>
          </div>
        </div>
        
        <button className="back-button" onClick={() => navigate('/challenges')}>
          Back to Challenges
        </button>
      </div>

      <div className="challenge-content">
        <div className="challenge-description-panel">
          <div className="description-content">
            <h2>Description</h2>
            <p>{challenge.description}</p>

            {showHint && challenge.hints && challenge.hints.length > 0 && (
              <div className="hint-box">
                <h3>Hint {currentHintIndex + 1}/{challenge.hints.length}</h3>
                <p>{challenge.hints[currentHintIndex]}</p>
              </div>
            )}

            {testResults && (
              <TestResults
                results={testResults}
                allPassed={allTestsPassed}
              />
            )}
          </div>
          
          <div className="description-actions">
            {challenge.hints && challenge.hints.length > 0 && (
              <button className="hint-button" onClick={handleShowHint}>
                {showHint
                  ? `Next Hint (${currentHintIndex + 1}/${challenge.hints.length})`
                  : 'Show Hint'}
              </button>
            )}
          </div>
        </div>

        <div className="challenge-editor-panel">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language="javascript"
          />
          
          <div className="editor-actions">
            <button 
              className="submit-button" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </button>
            
            <button className="reset-button" onClick={handleReset}>
              Reset Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;