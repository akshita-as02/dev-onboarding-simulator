import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>DevOnboard</h3>
          <p>Accelerate your onboarding process and become productive faster.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/challenges">Challenges</a></li>
            <li><a href="/deployments">Deployments</a></li>
            <li><a href="/troubleshoot">Troubleshoot</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>support@devonboard.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DevOnboard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;