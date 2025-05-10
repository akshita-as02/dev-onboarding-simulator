// server/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes after this middleware
router.use(authController.protect);

// Get all users (admin only)
router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

// Get user activity
router.get('/activity', userController.getUserActivity);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Update password
router.put('/update-password', userController.updatePassword);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user (admin only)
router.put('/:id', authController.restrictTo('admin'), userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;