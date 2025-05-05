const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  expectedOutput: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  solutionCode: {
    type: String,
    required: true,
  },
  testCases: [testCaseSchema],
  hints: [String],
  timeLimit: {
    type: Number,
    default: 30, // in minutes
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;