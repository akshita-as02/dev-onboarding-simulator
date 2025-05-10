const Certification = require('../models/certification.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get my certifications
exports.getMyCertifications = catchAsync(async (req, res, next) => {
  // Get earned certifications (where user is assigned and issuedAt exists)
  const earnedCertifications = await Certification.find({
    user: req.user._id,
    issuedAt: { $exists: true }
  }).populate('requirements.item');

  // Get available certifications (where user is not assigned)
  const availableCertifications = await Certification.find({
    user: { $exists: false }
  }).populate('requirements.item');

  res.status(200).json({
    status: 'success',
    data: {
      earnedCertifications,
      availableCertifications,
    },
  });
});

// Get all certifications (admin)
exports.getAllCertifications = catchAsync(async (req, res, next) => {
  const certifications = await Certification.find()
    .populate('user', 'name email')
    .populate('requirements.item');

  res.status(200).json({
    status: 'success',
    data: {
      certifications,
    },
  });
});

// Get certification by ID
exports.getCertificationById = catchAsync(async (req, res, next) => {
  const certification = await Certification.findById(req.params.id)
    .populate('user', 'name email')
    .populate('requirements.item');

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      certification,
    },
  });
});

// Verify certification
exports.verifyCertification = catchAsync(async (req, res, next) => {
  // Placeholder implementation
  res.status(200).json({
    status: 'success',
    data: {
      valid: true,
      certification: {
        id: req.params.id,
        title: 'Sample Certification',
        issuedTo: 'John Doe',
        issuedAt: new Date(),
      },
    },
  });
});

// Create certification
exports.createCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      certification,
    },
  });
});

// Issue certification
exports.issueCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.findByIdAndUpdate(
    req.params.id,
    {
      user: req.user._id,
      issuedAt: Date.now(),
      isValid: true
    },
    { new: true }
  );

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      certification,
    },
  });
});

// Revoke certification
exports.revokeCertification = catchAsync(async (req, res, next) => {
  const certification = await Certification.findByIdAndUpdate(
    req.params.id,
    { isValid: false },
    { new: true }
  );

  if (!certification) {
    return next(new AppError('No certification found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      certification,
    },
  });
});

// Get upcoming certifications
exports.getUpcomingCertifications = catchAsync(async (req, res, next) => {
  const upcomingCertifications = await Certification.find({
    user: { $exists: false }
  }).populate('requirements.item');

  res.status(200).json({
    status: 'success',
    data: {
      certifications: upcomingCertifications,
    },
  });
});