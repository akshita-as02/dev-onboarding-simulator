import React, { useState } from 'react';
import '../styles/DeploymentStep.css';

const DeploymentStep = ({
  step,
  stepNumber,
  currentStep,
  onComplete,
  isCompleted,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  
  const isActive = stepNumber === currentStep;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!answer) {
      setError('Please provide an answer');
      return;
    }
    
    onComplete(stepNumber, answer);
  };
  
  return (
    <div
      className={`deployment-step ${isActive ? 'active' : ''} ${
        isCompleted ? 'completed' : ''
      }`}
    >
      <div className="step-header">
        <div className="step-number">{stepNumber}</div>
        <h3 className="step-title">{step.title}</h3>
        {isCompleted && <div className="step-completed-badge">Completed</div>}
      </div>
      
      <div className="step-content">
        <div className="step-description">
          <p>{step.description}</p>
        </div>
        
        {step.image && (
          <div className="step-image">
            <img src={step.image} alt={step.title} />
          </div>
        )}
        
        {isActive && !isCompleted && (
          <div className="step-action">
            <form onSubmit={handleSubmit}>
              {step.actionType === 'text' && (
                <div className="form-group">
                  <label htmlFor="answer">Your Answer:</label>
                  <input
                    type="text"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
              
              {step.actionType === 'command' && (
                <div className="form-group">
                  <label htmlFor="command">Enter Command:</label>
                  <div className="command-input">
                    <span className="command-prompt">$</span>
                    <input
                      type="text"
                      id="command"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your command here..."
                    />
                  </div>
                </div>
              )}
              
              {step.actionType === 'multiple-choice' && (
                <div className="form-group">
                  <label>Select the correct option:</label>
                  <div className="multiple-choice-options">
                    {step.options.map((option, index) => (
                      <div className="option" key={index}>
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="answer"
                          value={option}
                          checked={answer === option}
                          onChange={() => setAnswer(option)}
                        />
                        <label htmlFor={`option-${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="step-actions">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="hint-btn"
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
              </div>
            </form>
            
            {showHint && step.hint && (
              <div className="hint-container">
                <h4>Hint:</h4>
                <p>{step.hint}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentStep;