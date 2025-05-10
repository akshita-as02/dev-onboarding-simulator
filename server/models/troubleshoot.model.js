// server/models/troubleshoot.model.js
const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  isSolution: {
    type: Boolean,
    default: false,
  },
});

const troubleshootSchema = new mongoose.Schema({
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
  initialState: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  hints: [String],
  possibleActions: [actionSchema],
  estimatedTime: {
    type: Number, // in minutes
    default: 20,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Troubleshoot = mongoose.model('Troubleshoot', troubleshootSchema);

module.exports = Troubleshoot;