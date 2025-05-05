const express = require('express');
const router = express.Router();
const troubleshootController = require('../controllers/troubleshoot.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.protect);

// Get all troubleshooting scenarios
router.get('/', troubleshootController.getAllScenarios);

// Get scenario by ID
router.get('/:id', troubleshootController.getScenarioById);

// Start troubleshooting scenario
router.post('/:id/start', troubleshootController.startScenario);

// Submit troubleshooting action
router.post('/:id/action', troubleshootController.submitAction);

// Request hint for troubleshooting
router.get('/:id/hint', troubleshootController.getHint);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Create a new troubleshooting scenario
router.post('/', troubleshootController.createScenario);

// Update troubleshooting scenario
router.put('/:id', troubleshootController.updateScenario);

// Delete troubleshooting scenario
router.delete('/:id', troubleshootController.deleteScenario);

module.exports = router;
