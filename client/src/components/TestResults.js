import React from 'react';
import '../styles/TestResults.css';

const TestResults = ({ results, allPassed }) => {
  if (!results || results.length === 0) {
    return null;
  }
  
  const passedCount = results.filter((result) => result.passed).length;
  
  return (
    <div className="test-results-container">
      <div className="test-results-header">
        <h3>Test Results</h3>
        <div className={`test-status ${allPassed ? 'passed' : 'failed'}`}>
          {allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
        </div>
      </div>
      
      <div className="test-stats">
        <div className="test-stat">
          <span>Passed:</span> {passedCount} / {results.length}
        </div>
      </div>
      
      <div className="test-details">
        {results.map((result, index) => (
          <div
            key={index}
            className={`test-case ${result.passed ? 'passed' : 'failed'}`}
          >
            <div className="test-case-header">
              <span className="test-number">Test {index + 1}</span>
              <span className={`test-result ${result.passed ? 'passed' : 'failed'}`}>
                {result.passed ? 'Passed' : 'Failed'}
              </span>
            </div>
            
            {!result.passed && (
              <div className="test-case-details">
                <div className="test-input">
                  <h4>Input:</h4>
                  <pre>{result.input === 'Hidden' ? 'Hidden' : JSON.stringify(result.input, null, 2)}</pre>
                </div>
                
                <div className="test-output">
                  <h4>Expected Output:</h4>
                  <pre>{result.expectedOutput === 'Hidden' ? 'Hidden' : JSON.stringify(result.expectedOutput, null, 2)}</pre>
                </div>
                
                <div className="test-output">
                  <h4>Your Output:</h4>
                  <pre>{result.actualOutput === 'Hidden' ? 'Hidden' : JSON.stringify(result.actualOutput, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;