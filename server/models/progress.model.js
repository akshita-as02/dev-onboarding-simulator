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
    required: true,
  },
  deployment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deployment',
  },
  troubleshoot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Troubleshoot',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'stuck'],
    default: 'in-progress',
  },
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