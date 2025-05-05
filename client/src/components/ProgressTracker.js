import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProgressTracker.css';

const ProgressTracker = ({ progress }) => {
  const {
    challengesCompleted,
    totalChallenges,
    deploymentsCompleted,
    totalDeployments,
    troubleshootCompleted,
    totalTroubleshoot,
    certificationsEarned,
    overallProgress,
  } = progress;
  
  return (
    <div className="progress-tracker">
      <h2>Your Progress</h2>
      
      <div className="overall-progress">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="progress-sections">
        <div className="progress-section">
          <div className="section-header">
            <h3>Coding Challenges</h3>
            <span className="completion-status">
              {challengesCompleted}/{totalChallenges}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill challenges"
              style={{
                width: `${
                  totalChallenges > 0
                    ? (challengesCompleted / totalChallenges) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <Link to="/challenges" className="section-link">
            View Challenges
          </Link>
        </div>
        
        <div className="progress-section">
          <div className="section-header">
            <h3>Deployment Simulations</h3>
            <span className="completion-status">
              {deploymentsCompleted}/{totalDeployments}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill deployments"
              style={{
                width: `${
                  totalDeployments > 0
                    ? (deploymentsCompleted / totalDeployments) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <Link to="/deployments" className="section-link">
            View Deployments
          </Link>
        </div>
        
        <div className="progress-section">
          <div className="section-header">
            <h3>Troubleshooting Scenarios</h3>
            <span className="completion-status">
              {troubleshootCompleted}/{totalTroubleshoot}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill troubleshoot"
              style={{
                width: `${
                  totalTroubleshoot > 0
                    ? (troubleshootCompleted / totalTroubleshoot) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
          <Link to="/troubleshoot" className="section-link">
            View Scenarios
          </Link>
        </div>
      </div>
      
      <div className="certifications-earned">
        <h3>Certifications Earned</h3>
        {certificationsEarned.length > 0 ? (
          <div className="certification-list">
            {certificationsEarned.map((cert) => (
              <div key={cert._id} className="certification-badge">
                <div className="badge-icon">🏆</div>
                <div className="badge-info">
                  <span className="badge-title">{cert.title}</span>
                  <span className="badge-date">
                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-certifications">
            You haven't earned any certifications yet. Complete challenges,
            deployments, and troubleshooting scenarios to earn certifications. 
            Check the requirements for each certification.
          </p>
        )}
        
        <Link to="/certifications" className="section-link">
          View Certifications
        </Link>
      </div>
    </div>
  );
};

export default ProgressTracker;