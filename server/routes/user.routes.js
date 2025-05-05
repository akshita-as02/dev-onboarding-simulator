const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes after this middleware
router.use(authController.protect);

// Get all users (admin only)
router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
