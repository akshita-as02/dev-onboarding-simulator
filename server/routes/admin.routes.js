const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const adminController = require('../controllers/admin.controller');
const certificationController = require('../controllers/certification.controller');

// Protect all admin routes
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Get admin dashboard stats
router.get('/stats', adminController.getStats);

// Add certification routes for admin
router.get('/certifications', certificationController.getAllCertifications);
router.post('/certifications', certificationController.createCertification);
router.get('/certifications/:id', certificationController.getCertificationById);
router.post('/certifications/:id/issue', certificationController.issueCertification);
router.put('/certifications/:id/revoke', certificationController.revokeCertification);

module.exports = router; 