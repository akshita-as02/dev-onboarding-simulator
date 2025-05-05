const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const authController = require('../controllers/auth.controller');

// Protect all routes
router.use(authController.protect);

// Get my certifications
router.get('/my-certifications', certificationController.getMyCertifications);

// Get certification by ID
router.get('/:id', certificationController.getCertificationById);

// Verify certification by ID
router.get('/:id/verify', certificationController.verifyCertification);

// Admin/Mentor only routes
router.use(authController.restrictTo('admin', 'mentor'));

// Create a new certification
router.post('/', certificationController.createCertification);

// Issue certification to user
router.post('/:id/issue', certificationController.issueCertification);

// Revoke certification
router.put('/:id/revoke', certificationController.revokeCertification);

module.exports = router;