const Deployment = require('../models/deployment.model');
const Progress = require('../models/progress.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all deployments
exports.getAllDeployments = catchAsync(async (req, res, next) => {
  const deployments = await Deployment.find()
    .populate('createdBy', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      deployments,
    },
  });
});

// Get deployment by ID
exports.getDeploymentById = catchAsync(async (req, res, next) => {
  const deployment = await Deployment.findById(req.params.id)
    .populate('createdBy', 'name');

  if (!deployment) {
    return next(new AppError('No deployment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deployment,
    },
  });
});

// Create deployment
exports.createDeployment = catchAsync(async (req, res, next) => {
  const deployment = await Deployment.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      deployment,
    },
  });
});

// Update deployment
exports.updateDeployment = catchAsync(async (req, res, next) => {
  const deployment = await Deployment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!deployment) {
    return next(new AppError('No deployment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      deployment,
    },
  });
});

// Delete deployment
exports.deleteDeployment = catchAsync(async (req, res, next) => {
  const deployment = await Deployment.findByIdAndDelete(req.params.id);

  if (!deployment) {
    return next(new AppError('No deployment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Start deployment
exports.startDeployment = catchAsync(async (req, res, next) => {
  const deployment = await Deployment.findById(req.params.id);
  
  if (!deployment) {
    return next(new AppError('No deployment found with that ID', 404));
  }

  // Create or update progress
  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      deployment: deployment._id
    },
    {
      user: req.user._id,
      deployment: deployment._id,
      status: 'in_progress',
      currentStepIndex: 0,
      completedStepIds: []
    },
    { upsert: true, new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      progress,
    },
  });
});

// Submit deployment step
exports.submitDeploymentStep = catchAsync(async (req, res, next) => {
  const { stepIndex, answer } = req.body;
  const deployment = await Deployment.findById(req.params.id);
  
  if (!deployment) {
    return next(new AppError('No deployment found with that ID', 404));
  }

  const step = deployment.steps[stepIndex];
  if (!step) {
    return next(new AppError('Invalid step index', 400));
  }

  const isCorrect = answer.toLowerCase() === step.correctAnswer.toLowerCase();
  
  // Update progress
  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      deployment: deployment._id
    },
    {
      $addToSet: { completedStepIds: stepIndex },
      currentStepIndex: stepIndex + 1,
      status: stepIndex === deployment.steps.length - 1 ? 'completed' : 'in_progress'
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      success: isCorrect,
      message: isCorrect ? 'Step completed successfully' : 'Incorrect answer',
      progress
    },
  });
});
