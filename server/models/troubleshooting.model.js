const mongoose = require('mongoose');

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

const troubleshootingSchema = new mongoose.Schema({
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
  steps: [stepSchema],
  prerequisites: [String],
  estimatedTime: {
    type: Number, // in minutes
    default: 20,
  },
  totalSteps: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Troubleshooting = mongoose.model('Troubleshooting', troubleshootingSchema);

module.exports = Troubleshooting; 