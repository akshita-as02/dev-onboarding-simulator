const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certification.controller');
const authController = require('../controllers/auth.controller');

// In certification.routes.js - at the top, before other routes
router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Certification routes are working'
    });
  });
// Protect all routes
router.use(authController.protect);

// // Public routes (for all authenticated users)
// router.get('/my-certifications', certificationController.getMyCertifications);
// router.get('/upcoming', certificationController.getUpcomingCertifications);
// router.get('/:id', certificationController.getCertificationById);
// router.get('/:id/verify', certificationController.verifyCertification);

// // Admin/Mentor only routes
// router.use(authController.restrictTo('admin', 'mentor'));
// router.get('/', certificationController.getAllCertifications);
// router.post('/', certificationController.createCertification);
// router.post('/:id/issue', certificationController.issueCertification);
// router.put('/:id/revoke', certificationController.revokeCertification);

// module.exports = router;

// Routes for all authenticated users
router.get('/my-certifications', certificationController.getMyCertifications);
router.get('/upcoming', certificationController.getUpcomingCertifications);
router.get('/:id/verify', certificationController.verifyCertification);

// Admin/Mentor only routes - apply restrictTo to each admin route individually
router.get('/', authController.restrictTo('admin', 'mentor'), certificationController.getAllCertifications);
router.post('/', authController.restrictTo('admin', 'mentor'), certificationController.createCertification);
router.post('/:id/issue', authController.restrictTo('admin', 'mentor'), certificationController.issueCertification);
router.put('/:id/revoke', authController.restrictTo('admin', 'mentor'), certificationController.revokeCertification);

// This route needs to come after the admin routes to avoid conflicts with those routes
router.get('/:id', certificationController.getCertificationById);

module.exports = router;