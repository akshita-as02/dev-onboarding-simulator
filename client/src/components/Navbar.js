import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          DevOnboard
        </Link>
        
        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/challenges" className="nav-link">
                  Challenges
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/deployments" className="nav-link">
                  Deployments
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/troubleshoot" className="nav-link">
                  Troubleshoot
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/certifications" className="nav-link">
                  Certifications
                </Link>
              </li>
              <li className="nav-item dropdown">
                <div className="nav-link dropdown-toggle">
                  {user.name}
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;