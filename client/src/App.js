import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './styles/App.css';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChallengesList from './pages/ChallengesList';
import ChallengeDetail from './pages/ChallengeDetail';
import DeploymentsList from './pages/DeploymentsList';
import DeploymentDetail from './pages/DeploymentDetail';
import TroubleshootList from './pages/TroubleshootList';
import TroubleshootDetail from './pages/TroubleshootDetail';
import Profile from './pages/Profile';
import Certifications from './pages/Certifications';
import NotFound from './pages/NotFound';

// Protected Route component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="challenges" element={
          <ProtectedRoute>
            <ChallengesList />
          </ProtectedRoute>
        } />
        
        <Route path="challenges/:id" element={
          <ProtectedRoute>
            <ChallengeDetail />
          </ProtectedRoute>
        } />
        
        <Route path="deployments" element={
          <ProtectedRoute>
            <DeploymentsList />
          </ProtectedRoute>
        } />
        
        <Route path="deployments/:id" element={
          <ProtectedRoute>
            <DeploymentDetail />
          </ProtectedRoute>
        } />
        
        <Route path="troubleshoot" element={
          <ProtectedRoute>
            <TroubleshootList />
          </ProtectedRoute>
        } />
        
        <Route path="troubleshoot/:id" element={
          <ProtectedRoute>
            <TroubleshootDetail />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="certifications" element={
          <ProtectedRoute>
            <Certifications />
          </ProtectedRoute>
        } />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;