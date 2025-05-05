import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css';

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Developer Onboarding Simulator</h1>
          <p>
            Accelerate your learning with interactive simulations of real-world
            development scenarios.
          </p>
          {user ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="register-button">
                Register
              </Link>
            </div>
          )}
        </div>
      </section>
      
      <section className="features-section">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Interactive Coding Challenges</h3>
            <p>
              Practice with coding challenges that mimic real-world codebase
              patterns and best practices.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Deployment Simulations</h3>
            <p>
              Learn deployment processes through guided walkthroughs in a safe,
              simulated environment.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Troubleshooting Scenarios</h3>
            <p>
              Develop debugging skills by diagnosing and fixing common issues in
              realistic scenarios.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Progress Tracking</h3>
            <p>
              Track your progress and earn certifications to showcase your
              skills and knowledge.
            </p>
          </div>
        </div>
      </section>
      
      <section className="tech-section">
        <h2>Tech Stack</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <h3>Frontend</h3>
            <ul>
              <li>React</li>
              <li>React Router</li>
              <li>Axios</li>
              <li>Monaco Editor</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h3>Backend</h3>
            <ul>
              <li>Node.js</li>
              <li>Express</li>
              <li>MongoDB</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h3>DevOps</h3>
            <ul>
              <li>Docker</li>
              <li>Container Orchestration</li>
              <li>CI/CD Pipelines</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;