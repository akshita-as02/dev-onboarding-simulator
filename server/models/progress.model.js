const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
  },
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment',
  },
  troubleshooting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Troubleshooting',
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'stuck'],
    default: 'in_progress',
  },
  currentStepIndex: {
    type: Number,
    default: 0,
  },
  completedStepIds: [Number],
  submittedCode: {
    type: String,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
}, { timestamps: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;