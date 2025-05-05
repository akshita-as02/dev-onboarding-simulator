import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import ProgressTracker from "../components/ProgressTracker";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingCertifications, setUpcomingCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch progress data
        const progressResponse = await api.get("/api/progress/my-progress");
        setProgressData(progressResponse.data.data.progress);

        // Fetch recent activity
        const activityResponse = await api.get("/api/users/activity");
        setRecentActivity(activityResponse.data.data.activities);

        // Fetch upcoming certifications
        const certResponse = await api.get("/api/certifications/upcoming");
        setUpcomingCertifications(certResponse.data.data.certifications);

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p className="last-login">Last login: {new Date().toLocaleString()}</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-main">
          {progressData && <ProgressTracker progress={progressData} />}

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/challenges" className="action-card">
                <div className="action-icon">💻</div>
                <div className="action-text">
                  <h3>Coding Challenges</h3>
                  <p>Practice your coding skills</p>
                </div>
              </Link>

              <Link to="/deployments" className="action-card">
                <div className="action-icon">🚀</div>
                <div className="action-text">
                  <h3>Deployment Simulations</h3>
                  <p>Learn deployment processes</p>
                </div>
              </Link>

              <Link to="/troubleshoot" className="action-card">
                <div className="action-icon">🔍</div>
                <div className="action-text">
                  <h3>Troubleshooting</h3>
                  <p>Develop debugging skills</p>
                </div>
              </Link>

              <Link to="/certifications" className="action-card">
                <div className="action-icon">🏆</div>
                <div className="action-text">
                  <h3>Certifications</h3>
                  <p>View your achievements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="dashboard-sidebar">
          <div className="upcoming-certifications">
            <h2>Upcoming Certifications</h2>
            {upcomingCertifications && upcomingCertifications.length > 0 ? (
              <div className="certifications-list">
                {upcomingCertifications.map((cert) => (
                  <div key={cert._id} className="upcoming-cert">
                    <h3>{cert.title}</h3>
                    <div className="cert-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            (cert.completedRequirements /
                              cert.totalRequirements) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="cert-stats">
                      <span>
                        {cert.completedRequirements}/{cert.totalRequirements}{" "}
                        requirements completed
                      </span>
                    </div>
                    <Link
                      to={`/certifications/${cert._id}`}
                      className="view-cert-link"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-certifications">
                You have no upcoming certifications. Complete more challenges to
                unlock certifications.
              </p>
            )}
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            {recentActivity.length > 0 ? (
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity._id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === "challenge" && "💻"}
                      {activity.type === "deployment" && "🚀"}
                      {activity.type === "troubleshoot" && "🔍"}
                      {activity.type === "certification" && "🏆"}
                    </div>
                    <div className="activity-details">
                      <p className="activity-description">
                        {activity.description}
                      </p>
                      <p className="activity-time">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-activity">No recent activity to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
