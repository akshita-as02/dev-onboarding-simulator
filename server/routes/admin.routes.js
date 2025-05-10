const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');

// Protect all admin routes
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Get admin dashboard stats
router.get('/stats', adminController.getStats);

module.exports = router; 