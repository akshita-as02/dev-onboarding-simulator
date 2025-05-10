const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const challengeRoutes = require('./routes/challenge.routes');
const deploymentRoutes = require('./routes/deployment.routes');
const troubleshootRoutes = require('./routes/troubleshoot.routes');
const progressRoutes = require('./routes/progress.routes');
const certificationRoutes = require('./routes/certification.routes');
const adminRoutes = require('./routes/admin.routes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['https://devonboard.netlify.app/', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/troubleshoot', troubleshootRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Development error response
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } 
  // Production error response
  else {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    // Programming or other unknown error: don't leak error details
    else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
});

module.exports = app;