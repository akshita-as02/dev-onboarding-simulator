import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
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
      const response = await api.post('/api/auth/login', formData);
      
      // Login successful
      const { token, user } = response.data.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the token in authorization header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update through the auth context
      await authLogin(formData);
      
      // Navigate to the intended destination
      navigate(from, { replace: true });
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