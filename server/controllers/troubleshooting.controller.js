const Troubleshooting = require('../models/troubleshooting.model');
const Progress = require('../models/progress.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all troubleshooting scenarios
exports.getAllScenarios = catchAsync(async (req, res, next) => {
  const scenarios = await Troubleshooting.find()
    .populate('createdBy', 'name');

  res.status(200).json({
    status: 'success',
    data: {
      scenarios,
    },
  });
});

// Get scenario by ID
exports.getScenarioById = catchAsync(async (req, res, next) => {
  const scenario = await Troubleshooting.findById(req.params.id)
    .populate('createdBy', 'name');

  if (!scenario) {
    return next(new AppError('No scenario found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      scenario,
    },
  });
});

// Create scenario
exports.createScenario = catchAsync(async (req, res, next) => {
  const scenario = await Troubleshooting.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: {
      scenario,
    },
  });
});

// Update scenario
exports.updateScenario = catchAsync(async (req, res, next) => {
  const scenario = await Troubleshooting.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!scenario) {
    return next(new AppError('No scenario found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      scenario,
    },
  });
});

// Delete scenario
exports.deleteScenario = catchAsync(async (req, res, next) => {
  const scenario = await Troubleshooting.findByIdAndDelete(req.params.id);

  if (!scenario) {
    return next(new AppError('No scenario found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Start scenario
exports.startScenario = catchAsync(async (req, res, next) => {
  const scenario = await Troubleshooting.findById(req.params.id);
  
  if (!scenario) {
    return next(new AppError('No scenario found with that ID', 404));
  }

  // Create or update progress
  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      troubleshooting: scenario._id
    },
    {
      user: req.user._id,
      troubleshooting: scenario._id,
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

// Submit scenario step
exports.submitScenarioStep = catchAsync(async (req, res, next) => {
  const { stepIndex, answer } = req.body;
  const scenario = await Troubleshooting.findById(req.params.id);
  
  if (!scenario) {
    return next(new AppError('No scenario found with that ID', 404));
  }

  const step = scenario.steps[stepIndex];
  if (!step) {
    return next(new AppError('Invalid step index', 400));
  }

  const isCorrect = answer.toLowerCase() === step.correctAnswer.toLowerCase();
  
  // Update progress
  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      troubleshooting: scenario._id
    },
    {
      $addToSet: { completedStepIds: stepIndex },
      currentStepIndex: stepIndex + 1,
      status: stepIndex === scenario.steps.length - 1 ? 'completed' : 'in_progress'
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