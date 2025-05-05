const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requirements: [{
    type: {
      type: String,
      enum: ['challenge', 'deployment', 'troubleshoot'],
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'requirements.type',
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  }],
  issuedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
  },
  certificateId: {
    type: String,
    unique: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Generate unique certificate ID before saving
certificationSchema.pre('save', function(next) {
  if (!this.isModified('certificateId')) {
    this.certificateId = `CERT-${Date.now()}-${this.user.toString().substr(-6)}`;
  }
  next();
});

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;