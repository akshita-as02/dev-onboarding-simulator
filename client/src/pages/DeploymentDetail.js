import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DeploymentStep from '../components/DeploymentStep';
import DockerConsole from '../components/DockerConsole';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/DeploymentDetail.css';

const DeploymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [deployment, setDeployment] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [consoleCommands, setConsoleCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchDeployment = async () => {
      try {
        const response = await api.get(`/api/deployments/${id}`);
        setDeployment(response.data.data.deployment);
        
        // Set progress if it exists
        if (response.data.data.progress) {
          const { currentStepIndex, completedStepIds } = response.data.data.progress;
          setCurrentStep(currentStepIndex);
          setCompletedSteps(completedStepIds);
        }
        
        // Set available commands for docker console
        if (response.data.data.deployment.availableCommands) {
          setConsoleCommands(response.data.data.deployment.availableCommands);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load deployment');
        setLoading(false);
      }
    };

    fetchDeployment();
  }, [id]);

  const handleStepComplete = async (stepIndex, answer) => {
    try {
      const response = await api.post(`/api/deployments/${id}/submit-step`, {
        stepIndex,
        answer,
      });
      
      if (response.data.success) {
        // Step completed successfully
        setCompletedSteps([...completedSteps, stepIndex]);
        
        // Check if there are more steps
        if (stepIndex < deployment.steps.length) {
          setCurrentStep(stepIndex + 1);
        } else {
          // Deployment completed
          alert('Congratulations! You have completed this deployment simulation.');
          navigate('/deployments');
        }
      } else {
        // Step failed
        alert(response.data.message || 'Incorrect answer. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit step');
    }
  };

  const handleCommandExecuted = (command) => {
    // Update progress or other state based on command execution
    console.log('Command executed:', command);
  };

  if (loading) {
    return <LoadingSpinner message="Loading deployment simulation..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!deployment) {
    return <ErrorMessage message="Deployment simulation not found" />;
  }

  return (
    <div className="deployment-detail-container">
      <div className="deployment-header">
        <div className="deployment-title-section">
          <h1>{deployment.title}</h1>
          <div className="deployment-meta">
            <span className={`difficulty ${deployment.difficulty}`}>
              {deployment.difficulty.charAt(0).toUpperCase() +
                deployment.difficulty.slice(1)}
            </span>
            <span className="estimated-time">
              Est. Time: {deployment.estimatedTime} min
            </span>
          </div>
        </div>
        
        <button 
          className="back-button" 
          onClick={() => navigate('/deployments')}
        >
          Back to Deployments
        </button>
      </div>

      <div className="deployment-content">
        <div className="deployment-description">
          <h2>Description</h2>
          <p>{deployment.description}</p>
          
          {deployment.prerequisites && (
            <div className="prerequisites">
              <h3>Prerequisites</h3>
              <ul>
                {deployment.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="deployment-progress-bar">
          {deployment.steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step ${
                completedSteps.includes(index + 1)
                  ? 'completed'
                  : currentStep === index + 1
                  ? 'current'
                  : ''
              }`}
            >
              <span className="step-number">{index + 1}</span>
            </div>
          ))}
        </div>
        
        <div className="deployment-simulator">
          <div className="steps-panel">
            {deployment.steps.map((step, index) => (
              <DeploymentStep
                key={index}
                step={step}
                stepNumber={index + 1}
                currentStep={currentStep}
                isCompleted={completedSteps.includes(index + 1)}
                onComplete={handleStepComplete}
              />
            ))}
          </div>
          
          <div className="console-panel">
            <DockerConsole
              commands={consoleCommands}
              onCommandExecuted={handleCommandExecuted}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDetail;