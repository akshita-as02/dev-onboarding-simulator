const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const authController = require('../controllers/auth.controller');

// Get all challenges
router.get('/', challengeController.getAllChallenges);

// Get challenge by ID
router.get('/:id', challengeController.getChallengeById);

// Protected routes
router.use(authController.protect);

// Submit challenge solution
router.post('/:id/submit', challengeController.submitSolution);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Create a new challenge
router.post('/', challengeController.createChallenge);

// Update challenge
router.put('/:id', challengeController.updateChallenge);

// Delete challenge
router.delete('/:id', challengeController.deleteChallenge);

module.exports = router;