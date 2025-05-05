const User = require('../models/user.model');
const Progress = require('../models/progress.model');
const Certification = require('../models/certification.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all users (admin only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// Get user by ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Update user
exports.updateUser = catchAsync(async (req, res, next) => {
  // Prevent password update via this route
  if (req.body.password) {
    return next(
      new AppError('This route is not for password updates. Please use /updatePassword', 400)
    );
  }
  
  // Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  
  const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select('-password');
  
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Delete user (admin only)
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUserActivity = catchAsync(async (req, res, next) => {
    // Placeholder implementation
    const activities = [];
    
    res.status(200).json({
      status: 'success',
      data: {
        activities,
      },
    });
  });

// Get user profile
exports.getUserProfile = catchAsync(async (req, res, next) => {
    // User is already available in req.user after protect middleware
    // Add additional data here if needed
    
    const user = req.user;
    
    // Get user's progress data
    const progressData = await Progress.find({ user: user._id });
    
    // Calculate statistics
    const stats = {
      challengesCompleted: progressData.filter(item => item.challenge && item.status === 'completed').length,
      deploymentsCompleted: progressData.filter(item => item.deployment && item.status === 'completed').length,
      troubleshootCompleted: progressData.filter(item => item.troubleshoot && item.status === 'completed').length,
      certificationsEarned: await Certification.countDocuments({ user: user._id, issuedAt: { $ne: null } }),
      lastActive: progressData.length > 0 
        ? Math.max(...progressData.map(item => new Date(item.updatedAt || item.createdAt))) 
        : user.updatedAt,
      totalTimeSpent: progressData.reduce((total, item) => total + (item.timeSpent || 0), 0)
    };
    
    // Get recent activity
    const recentActivity = await Progress.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('challenge deployment troubleshoot')
      .select('status completedAt updatedAt challenge deployment troubleshoot');
    
    // Format activity for display
    const formattedActivity = recentActivity.map(activity => {
      let type, title, description;
      
      if (activity.challenge) {
        type = 'challenge';
        title = activity.challenge.title;
        description = `${activity.status === 'completed' ? 'Completed' : 'Worked on'} the "${title}" coding challenge`;
      } else if (activity.deployment) {
        type = 'deployment';
        title = activity.deployment.title;
        description = `${activity.status === 'completed' ? 'Completed' : 'Worked on'} the "${title}" deployment simulation`;
      } else if (activity.troubleshoot) {
        type = 'troubleshoot';
        title = activity.troubleshoot.title;
        description = `${activity.status === 'completed' ? 'Resolved' : 'Worked on'} the "${title}" troubleshooting scenario`;
      }
      
      return {
        _id: activity._id,
        type,
        title,
        description,
        status: activity.status,
        timestamp: activity.completedAt || activity.updatedAt
      };
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          ...user.toObject(),
          stats,
          recentActivity: formattedActivity
        }
      },
    });
  });

// Helper function to filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};