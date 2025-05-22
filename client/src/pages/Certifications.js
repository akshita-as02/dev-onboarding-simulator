import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import CertificationCard from '../components/CertificationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Certifications.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState({
    earned: [],
    available: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('earned');

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get('/api/certifications/my-certifications');
        setCertifications({
          earned: response.data.data.earnedCertifications || [],
          available: response.data.data.availableCertifications || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load certifications');
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <LoadingSpinner message="Loading certifications..." />;
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
    <div className="certifications-container">
      <div className="certifications-header">
        <h1>Your Certifications</h1>
        <p>
          Track your progress and earn certifications to showcase your skills.
        </p>
      </div>

      <div className="certifications-tabs">
        <button
          className={`tab ${activeTab === 'earned' ? 'active' : ''}`}
          onClick={() => handleTabChange('earned')}
        >
          Earned ({certifications.earned.length})
        </button>
        <button
          className={`tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => handleTabChange('available')}
        >
          Available ({certifications.available.length})
        </button>
      </div>

      <div className="certifications-content">
        {activeTab === 'earned' ? (
          certifications.earned.length > 0 ? (
            <div className="certifications-grid">
              {certifications.earned.map((certification) => (
                <CertificationCard
                  key={certification._id}
                  certification={certification}
                  isEarned={true}
                />
              ))}
            </div>
          ) : (
            <div className="no-certifications">
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <h3>No Certifications Yet</h3>
                <p>
                  Complete challenges, deployments, and troubleshooting
                  scenarios to earn certifications.
                </p>
                <button
                  className="view-available-btn"
                  onClick={() => handleTabChange('available')}
                >
                  View Available Certifications
                </button>
              </div>
            </div>
          )
        ) : (
          certifications.available.length > 0 ? (
            <div className="certifications-grid">
              {certifications.available.map((certification) => (
                <CertificationCard
                  key={certification._id}
                  certification={certification}
                  isEarned={false}
                />
              ))}
            </div>
          ) : (
            <div className="no-certifications">
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Available Certifications</h3>
                <p>
                  All certifications have been earned. Great job!
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Certifications;
