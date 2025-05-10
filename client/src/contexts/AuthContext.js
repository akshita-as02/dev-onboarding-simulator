import React, { createContext, useState, useContext, useEffect } from 'react';
//import api from '../services/api';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get token from storage
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user data
        const response = await api.get('/api/auth/me');
        console.log('Loading user data:', response.data.data.user);
        setUser(response.data.data.user);
      } catch (error) {
        // Clear storage on auth error
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        setError(error.customMessage || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/register', userData);
      
      // Save token and user data
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setError(null);
      return user;
    } catch (error) {
      // Extract the error message from the response
      const errorMessage = error.customMessage || 'Registration failed';
      setError(errorMessage);
      throw error; // Keep the original error to preserve the custom message
    } finally {
      setLoading(false);
    }
  };
  
  // Login user - this can be called both from the Login component and directly
  const login = async (credentials) => {
    try {
      // Clear previous success states but keep any existing errors
      setLoading(true);
      
      // If credentials is a token, we'll use that directly
      let userData;
      let token;
      
      if (typeof credentials === 'string') {
        // If called with a token, use that
        token = credentials;
      } else {
        // Otherwise make the login API call
      const response = await api.post('/api/auth/login', credentials);
        const data = response.data.data;
        token = data.token;
        userData = data.user;
      }
      
      // Always ensure token is stored
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // If userData wasn't provided, fetch it
      if (!userData) {
        const userResponse = await api.get('/api/auth/me');
        userData = userResponse.data.data.user;
      }
      
      // On successful login, clear errors and set user
      setError(null);
      setUser(userData);
      
      return userData;
    } catch (error) {
      // Special handling for login errors
      const errorMessage = error.customMessage || 'Login failed';
      console.error('Auth error:', errorMessage);
      setError(errorMessage);
      throw error; // Keep the original error to preserve the custom message
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
    setError(null);
  };
  
  // Clear error (can be called explicitly to clear error state)
  const clearError = () => {
    setError(null);
  };
  
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};