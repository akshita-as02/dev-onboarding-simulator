const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.protect);

// Get user's progress
router.get('/my-progress', progressController.getMyProgress);

// Get progress by ID
router.get('/:id', progressController.getProgressById);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Get all users' progress
router.get('/', progressController.getAllProgress);

// Update progress (for mentors to provide feedback)
router.put('/:id', progressController.updateProgress);

module.exports = router;