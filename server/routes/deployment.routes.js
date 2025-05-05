const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deployment.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.protect);

// Get all deployment simulations
router.get('/', deploymentController.getAllDeployments);

// Get deployment by ID
router.get('/:id', deploymentController.getDeploymentById);

// Start deployment simulation
router.post('/:id/start', deploymentController.startDeployment);

// Submit deployment step
router.post('/:id/submit-step', deploymentController.submitDeploymentStep);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Create a new deployment simulation
router.post('/', deploymentController.createDeployment);

// Update deployment simulation
router.put('/:id', deploymentController.updateDeployment);

// Delete deployment simulation
router.delete('/:id', deploymentController.deleteDeployment);

module.exports = router;