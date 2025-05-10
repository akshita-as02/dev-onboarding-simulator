const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  command: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    enum: ['command', 'text', 'multiple-choice'],
    required: true,
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  options: [String], // For multiple-choice action type
  hint: String,
  image: String, // Optional image URL for visual guidance
});

const deploymentSchema = new mongoose.Schema({
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
  steps: [stepSchema],
  prerequisites: [String],
  estimatedTime: {
    type: Number, // in minutes
    default: 30,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  availableCommands: [commandSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Deployment = mongoose.model('Deployment', deploymentSchema);

module.exports = Deployment;