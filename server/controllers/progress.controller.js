// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// exports.getMyProgress = catchAsync(async (req, res, next) => {
//     // Placeholder implementation
//     res.status(200).json({
//       status: 'success',
//       data: {
//         progress: {
//           challengesCompleted: 0,
//           totalChallenges: 10,
//           deploymentsCompleted: 0,
//           totalDeployments: 5,
//           troubleshootCompleted: 0,
//           totalTroubleshoot: 8,
//           certificationsEarned: [],
//           overallProgress: 0,
//         },
//       },
//     });
//   });
  
//   // Get progress by ID
//   exports.getProgressById = catchAsync(async (req, res, next) => {
//     // Placeholder implementation
//     res.status(200).json({
//       status: 'success',
//       data: {
//         progress: {
//           id: req.params.id,
//           user: req.user._id,
//           status: 'in-progress',
//         },
//       },
//     });
//   });
  
//   // Get all progress
//   exports.getAllProgress = catchAsync(async (req, res, next) => {
//     // Placeholder implementation
//     res.status(200).json({
//       status: 'success',
//       data: {
//         progress: [],
//       },
//     });
//   });
  
//   // Update progress
//   exports.updateProgress = catchAsync(async (req, res, next) => {
//     // Placeholder implementation
//     res.status(200).json({
//       status: 'success',
//       data: {
//         progress: {
//           id: req.params.id,
//           ...req.body,
//         },
//       },
//     });
//   });

// server/controllers/progress.controller.js
const Progress = require('../models/progress.model');
const Challenge = require('../models/challenge.model');
const Deployment = require('../models/deployment.model');
const Troubleshoot = require('../models/troubleshoot.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get my progress
exports.getMyProgress = catchAsync(async (req, res, next) => {
  // Count total challenges, deployments, troubleshoot scenarios
  const totalChallenges = await Challenge.countDocuments();
  const totalDeployments = await Deployment.countDocuments();
  const totalTroubleshoot = await Troubleshoot.countDocuments();
  
  // Count completed items
  const challengesCompleted = await Progress.countDocuments({
    user: req.user._id,
    challenge: { $exists: true },
    status: 'completed',
  });
  
  const deploymentsCompleted = await Progress.countDocuments({
    user: req.user._id,
    deployment: { $exists: true },
    status: 'completed',
  });
  
  const troubleshootCompleted = await Progress.countDocuments({
    user: req.user._id,
    troubleshoot: { $exists: true },
    status: 'completed',
  });
  
  // Get certifications earned
  const certificationsEarned = [];
  
  // Calculate overall progress
  const totalItems = totalChallenges + totalDeployments + totalTroubleshoot;
  const completedItems = challengesCompleted + deploymentsCompleted + troubleshootCompleted;
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  res.status(200).json({
    status: 'success',
    data: {
      progress: {
        challengesCompleted,
        totalChallenges,
        deploymentsCompleted,
        totalDeployments,
        troubleshootCompleted,
        totalTroubleshoot,
        certificationsEarned,
        overallProgress,
      },
    },
  });
});

// Get progress by ID
exports.getProgressById = catchAsync(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id);
  
  if (!progress) {
    return next(new AppError('No progress found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      progress,
    },
  });
});

// Get all progress
exports.getAllProgress = catchAsync(async (req, res, next) => {
  const progress = await Progress.find();
  
  res.status(200).json({
    status: 'success',
    results: progress.length,
    data: {
      progress,
    },
  });
});

// Update progress
exports.updateProgress = catchAsync(async (req, res, next) => {
  const progress = await Progress.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  if (!progress) {
    return next(new AppError('No progress found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      progress,
    },
  });
});