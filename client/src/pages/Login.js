import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  
  // Get redirect path if user was redirected from a protected route
  const from = location.state?.from || '/dashboard';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Method 1: Direct API call
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Login successful
      const { token, user } = response.data.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the token in authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Method 2: Also update through the auth context (for state consistency)
      try {
        await authLogin(formData);
      } catch (authErr) {
        // Continue anyway as we already have the token
      }
      
      // Delay navigation slightly to ensure everything is set
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (err) {
      // Extract error message
      let errorMessage = 'Failed to login. Please check your credentials.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      // Set error message
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to Your Account</h2>
        
        {error && (
          <div className="auth-error" style={{display: 'block', opacity: 1}}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className={error ? 'error' : ''}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className={error ? 'error' : ''}
            />
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;