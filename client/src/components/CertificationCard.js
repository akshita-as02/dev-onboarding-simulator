import React from 'react';
import '../styles/CertificationCard.css';

const CertificationCard = ({ certification, isEarned = false }) => {
  const {
    title,
    description,
    requirements,
    issuedAt,
    certificateId,
  } = certification;
  
  const completedRequirements = requirements.filter((req) => req.completed).length;
  const totalRequirements = requirements.length;
  const progressPercentage = (completedRequirements / totalRequirements) * 100;
  
  return (
    <div className={`certification-card ${isEarned ? 'earned' : ''}`}>
      <div className="certification-header">
        <h3 className="certification-title">{title}</h3>
        {isEarned && (
          <div className="earned-badge">
            <span className="badge-icon">🏆</span>
            <span>Earned</span>
          </div>
        )}
      </div>
      
      <div className="certification-body">
        <p className="certification-description">{description}</p>
        
        <div className="requirements-progress">
          <div className="progress-label">
            <span>Requirements Completed</span>
            <span>
              {completedRequirements}/{totalRequirements}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="requirements-list">
          <h4>Requirements:</h4>
          <ul>
            {requirements.map((req, index) => (
              <li
                key={index}
                className={req.completed ? 'completed' : 'incomplete'}
              >
                <span className="check-icon">
                  {req.completed ? '✓' : '○'}
                </span>
                <span className="requirement-text">
                  {req.description || `Complete ${req.type}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {isEarned && (
          <div className="certificate-details">
            <div className="detail-item">
              <span className="detail-label">Certificate ID:</span>
              <span className="detail-value">{certificateId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Issued Date:</span>
              <span className="detail-value">
                {new Date(issuedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="certification-footer">
        {isEarned ? (
          <button className="view-certificate-btn">View Certificate</button>
        ) : (
          <button className="progress-btn">View Progress</button>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;