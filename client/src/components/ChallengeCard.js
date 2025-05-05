import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ChallengeCard.css';

const ChallengeCard = ({ challenge }) => {
  const { _id, title, description, difficulty, category } = challenge;
  
  return (
    <div className={`challenge-card challenge-difficulty-${difficulty}`}>
      <div className="challenge-card-header">
        <h3 className="challenge-title">{title}</h3>
        <span className={`challenge-difficulty challenge-difficulty-${difficulty}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
      </div>
      
      <div className="challenge-card-body">
        <p className="challenge-description">
          {description.length > 150
            ? description.substring(0, 150) + '...'
            : description}
        </p>
        
        <div className="challenge-category">
          <span className="category-tag">{category}</span>
        </div>
      </div>
      
      <div className="challenge-card-footer">
        <Link to={`/challenges/${_id}`} className="challenge-btn">
          Start Challenge
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;