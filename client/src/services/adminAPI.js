// client/src/services/adminApi.js
import api from './api';

const adminApi = {
  // Stats
  getStats: () => api.get('/api/admin/stats'),
  
  // Users
  getAllUsers: () => api.get('/api/users'),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  
  // Challenges
  getAllChallenges: () => api.get('/api/challenges'),
  getChallenge: (id) => api.get(`/api/challenges/${id}`),
  createChallenge: (challengeData) => api.post('/api/challenges', challengeData),
  updateChallenge: (id, challengeData) => api.put(`/api/challenges/${id}`, challengeData),
  deleteChallenge: (id) => api.delete(`/api/challenges/${id}`),
  
  // Deployments
  getAllDeployments: () => api.get('/api/deployments'),
  getDeployment: (id) => api.get(`/api/deployments/${id}`),
  createDeployment: (deploymentData) => api.post('/api/deployments', deploymentData),
  updateDeployment: (id, deploymentData) => api.put(`/api/deployments/${id}`, deploymentData),
  deleteDeployment: (id) => api.delete(`/api/deployments/${id}`),
  
  // Troubleshooting
  getAllTroubleshooting: () => api.get('/api/troubleshoot'),
  getTroubleshooting: (id) => api.get(`/api/troubleshoot/${id}`),
  createTroubleshooting: (troubleshootingData) => api.post('/api/troubleshoot', troubleshootingData),
  updateTroubleshooting: (id, troubleshootingData) => api.put(`/api/troubleshoot/${id}`, troubleshootingData),
  deleteTroubleshooting: (id) => api.delete(`/api/troubleshoot/${id}`),
  
  // Certifications
  getAllCertifications: () => api.get('/api/admin/certifications'),
  getCertification: (id) => api.get(`/api/admin/certifications/${id}`),
  createCertification: (certificationData) => api.post('/api/admin/certifications', certificationData),
  updateCertification: (id, certificationData) => api.put(`/api/admin/certifications/${id}`, certificationData),
  deleteCertification: (id) => api.delete(`/api/admin/certifications/${id}`),
  issueCertification: (id, userId) => api.post(`/api/admin/certifications/${id}/issue`, { userId }),
  revokeCertification: (id) => api.put(`/api/admin/certifications/${id}/revoke`),
  verifyCertification: (id) => api.get(`/api/admin/certifications/${id}/verify`)
};

export default adminApi;