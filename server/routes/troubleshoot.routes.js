const express = require('express');
const router = express.Router();
const troubleshootingController = require('../controllers/troubleshooting.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.protect);

// Get all troubleshooting scenarios
router.get('/', troubleshootingController.getAllScenarios);

// Get scenario by ID
router.get('/:id', troubleshootingController.getScenarioById);

// Start troubleshooting scenario
router.post('/:id/start', troubleshootingController.startScenario);

// Submit troubleshooting step
router.post('/:id/submit-step', troubleshootingController.submitScenarioStep);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Create a new troubleshooting scenario
router.post('/', troubleshootingController.createScenario);

// Update troubleshooting scenario
router.put('/:id', troubleshootingController.updateScenario);

// Delete troubleshooting scenario
router.delete('/:id', troubleshootingController.deleteScenario);

module.exports = router;
