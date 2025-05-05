const Challenge = require('../models/challenge.model');
const Progress = require('../models/progress.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { VM } = require('vm2'); // For securely executing user code

// Get all challenges
exports.getAllChallenges = catchAsync(async (req, res, next) => {
  const challenges = await Challenge.find().select('-solutionCode');
  
  res.status(200).json({
    status: 'success',
    results: challenges.length,
    data: {
      challenges,
    },
  });
});

// Get challenge by ID
exports.getChallengeById = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id).select('-solutionCode');
  
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      challenge,
    },
  });
});

// Create a new challenge
exports.createChallenge = catchAsync(async (req, res, next) => {
  // Add creator ID to the challenge
  req.body.createdBy = req.user.id;
  
  const newChallenge = await Challenge.create(req.body);
  
  res.status(201).json({
    status: 'success',
    data: {
      challenge: newChallenge,
    },
  });
});

// Update challenge
exports.updateChallenge = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      challenge,
    },
  });
});

// Delete challenge
exports.deleteChallenge = catchAsync(async (req, res, next) => {
  const challenge = await Challenge.findByIdAndDelete(req.params.id);
  
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Submit solution for a challenge
exports.submitSolution = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  
  if (!code) {
    return next(new AppError('Please provide code solution', 400));
  }
  
  // Get the challenge
  const challenge = await Challenge.findById(req.params.id);
  
  if (!challenge) {
    return next(new AppError('No challenge found with that ID', 404));
  }
  
  // Initialize results array for test cases
  let testResults = [];
  let allTestsPassed = true;
  
  // Run each test case
  for (const testCase of challenge.testCases) {
    try {
      // Create a secure VM
      const vm = new VM({
        timeout: 5000, // 5 seconds timeout for execution
        sandbox: {
          console: {
            log: () => {}, // Disable console.log in submitted code
          },
          // Add any other safe globals here
        },
      });
      
      // Prepare the code and test case
      const testInput = JSON.stringify(testCase.input);
      const wrappedCode = `
        ${code}
        
        // Execute function with the test input
        const result = solution(${testInput});
        result;
      `;
      
      // Execute the code
      const result = vm.run(wrappedCode);
      
      // Compare result with expected output
      const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
      
      if (!passed) {
        allTestsPassed = false;
      }
      
      // Add test result (don't show hidden test details if it's a hidden test)
      testResults.push({
        passed,
        input: testCase.isHidden ? 'Hidden' : testCase.input,
        expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
        actualOutput: testCase.isHidden ? 'Hidden' : result,
      });
    } catch (error) {
      // Code execution error
      allTestsPassed = false;
      testResults.push({
        passed: false,
        input: testCase.isHidden ? 'Hidden' : testCase.input,
        expectedOutput: testCase.isHidden ? 'Hidden' : testCase.expectedOutput,
        actualOutput: 'Error: ' + error.message,
      });
    }
  }
  
  // Update or create progress record
  let progress = await Progress.findOne({
    user: req.user.id,
    challenge: challenge.id,
  });
  
  if (!progress) {
    progress = new Progress({
      user: req.user.id,
      challenge: challenge.id,
      submittedCode: code,
      attempts: 1,
      status: allTestsPassed ? 'completed' : 'in-progress',
      completedAt: allTestsPassed ? Date.now() : undefined,
    });
  } else {
    progress.submittedCode = code;
    progress.attempts += 1;
    progress.status = allTestsPassed ? 'completed' : 'in-progress';
    if (allTestsPassed && !progress.completedAt) {
      progress.completedAt = Date.now();
    }
  }
  
  await progress.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      allTestsPassed,
      testResults,
      progress,
    },
  });
});