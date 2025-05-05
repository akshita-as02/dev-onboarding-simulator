import React, { useState } from 'react';
import '../styles/TroubleshootScenario.css';

const TroubleshootScenario = ({ scenario, onActionSubmit }) => {
  const [currentAction, setCurrentAction] = useState('');
  const [actionHistory, setActionHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  const handleActionSubmit = (e) => {
    e.preventDefault();
    
    if (!currentAction) {
      setMessage({
        type: 'error',
        text: 'Please enter an action',
      });
      return;
    }
    
    const result = onActionSubmit(currentAction);
    
    // Add action to history
    setActionHistory([
      ...actionHistory,
      {
        action: currentAction,
        result: result.message,
        success: result.success,
      },
    ]);
    
    setCurrentAction('');
    
    // Display message based on result
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    
    // Reset message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  
  return (
    <div className="troubleshoot-container">
      <div className="scenario-description">
        <h2>{scenario.title}</h2>
        <p>{scenario.description}</p>
        
        {scenario.initialState && (
          <div className="scenario-initial-state">
            <h3>Initial State:</h3>
            <pre>{scenario.initialState}</pre>
          </div>
        )}
      </div>
      
      <div className="action-history">
        <h3>Actions History</h3>
        
        <div className="history-container">
          {actionHistory.length === 0 ? (
            <p className="no-actions">No actions performed yet</p>
          ) : (
            actionHistory.map((entry, index) => (
              <div
                key={index}
                className={`history-entry ${
                  entry.success ? 'success' : 'error'
                }`}
              >
                <div className="history-action">
                  <span className="action-label">Action:</span> {entry.action}
                </div>
                <div className="history-result">
                  <span className="result-label">Result:</span> {entry.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="action-form">
        <h3>Perform Action</h3>
        
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        
        <form onSubmit={handleActionSubmit}>
          <div className="form-group">
            <label htmlFor="action">Enter your action:</label>
            <div className="action-input-container">
              <input
                type="text"
                id="action"
                value={currentAction}
                onChange={(e) => setCurrentAction(e.target.value)}
                placeholder="e.g., check server logs, restart service..."
              />
              <button type="submit" className="action-submit-btn">
                Submit
              </button>
            </div>
          </div>
        </form>
        
        <div className="hint-section">
          <button
            className="hint-toggle-btn"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          
          {showHint && scenario.hints && scenario.hints.length > 0 && (
            <div className="hints">
              <h4>Available Hints:</h4>
              <ul>
                {scenario.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TroubleshootScenario;