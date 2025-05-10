const User = require('../models/user.model');
const Challenge = require('../models/challenge.model');
const Deployment = require('../models/deployment.model');
const Troubleshooting = require('../models/troubleshooting.model');
const Certification = require('../models/certification.model');
const catchAsync = require('../utils/catchAsync');

// Get admin dashboard stats
exports.getStats = catchAsync(async (req, res) => {
  // Get total counts
  const totalUsers = await User.countDocuments();
  const totalChallenges = await Challenge.countDocuments();
  const totalDeployments = await Deployment.countDocuments();
  const totalTroubleshoot = await Troubleshooting.countDocuments();
  const certificationsIssued = await Certification.countDocuments({ user: { $exists: true } });

  // Get recent activity (last 5 users who completed something)
  const recentActivity = await User.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('name email updatedAt');

  // Calculate completion rate (placeholder - implement actual logic)
  const completionRate = 75; // Example value

  // Calculate average completion time (placeholder - implement actual logic)
  const avgCompletionTime = 7; // Example value in days

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      totalChallenges,
      totalDeployments,
      totalTroubleshoot,
      certificationsIssued,
      recentActivity: recentActivity.map(user => ({
        userName: user.name,
        description: 'Completed onboarding',
        timestamp: user.updatedAt
      })),
      completionRate,
      avgCompletionTime
    }
  });
}); 