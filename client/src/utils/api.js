import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Get the error response
    const response = error.response;
    
    if (!response) {
      // Network error or no response
      error.customMessage = 'Network error. Please check your connection.';
      return Promise.reject(error);
    }
    
    // Extract URL path and method for checking endpoints
    const url = response.config?.url || '';
    const method = response.config?.method?.toUpperCase() || '';
    const status = response.status;
    
    // Special handling for common error types
    if (url.includes('/register') && status === 400) {
      // Registration error - likely duplicate email
      const message = response.data?.message || '';
      if (message.includes('already exists') || message.includes('email')) {
        error.customMessage = 'This email is already registered. Please use a different email or login with your existing account.';
        return Promise.reject(error);
      }
    }
    
    // Enhance the error object with a custom message from the server
    error.customMessage = response.data?.message || 
                         response.data?.error || 
                         'An error occurred';
    
    // CRITICAL: These endpoints should NEVER trigger a redirect, regardless of status code
    const noRedirectEndpoints = [
      '/api/users/update-password',
      '/update-password',
      '/api/auth/login',
      '/login',
      '/api/auth/register',
      '/register'
    ];
    
    // Check if we should NEVER redirect for this endpoint
    const isNoRedirectEndpoint = noRedirectEndpoints.some(endpoint => 
      url.toLowerCase().includes(endpoint.toLowerCase())
    );
    
    // Special handling for password updates - always provide a clear error
    if (url.toLowerCase().includes('password') && status === 401) {
      error.customMessage = 'Current password is incorrect';
      return Promise.reject(error);
    }
    
    // Only redirect on 401s for endpoints not in our no-redirect list
    if (status === 401 && !isNoRedirectEndpoint) {
      localStorage.removeItem('token');
      
      // Use window.location.replace for a cleaner navigation (no history)
      window.location.replace('/login');
    }
    
    return Promise.reject(error);
  }
);

export default api; 