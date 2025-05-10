const mongoose = require('mongoose');
const User = require('../models/user.model');
const Challenge = require('../models/challenge.model');
const Deployment = require('../models/deployment.model');
const Troubleshooting = require('../models/troubleshooting.model');
const Certification = require('../models/certification.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Deployment.deleteMany({});
    await Troubleshooting.deleteMany({});
    await Certification.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created');

    // Create a demo user
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'demo123',
      role: 'developer'
    });

    console.log('Demo user created');

    // Create a sample coding challenge
    const challenge = await Challenge.create({
      title: 'Memory Leak Detection',
      description: 'Identify and fix a memory leak in a Node.js application.',
      difficulty: 'intermediate',
      category: 'Performance',
      starterCode: `const express = require('express');
const app = express();

const requestHistory = [];

app.get('/api/data', (req, res) => {
  requestHistory.push({
    timestamp: Date.now(),
    path: req.path,
    method: req.method
  });
  
  res.json({ message: 'Data retrieved successfully' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      solutionCode: `const express = require('express');
const app = express();

// Limit the size of requestHistory array
const MAX_HISTORY_SIZE = 1000;
const requestHistory = [];

app.get('/api/data', (req, res) => {
  // Add new request to history
  requestHistory.push({
    timestamp: Date.now(),
    path: req.path,
    method: req.method
  });
  
  // Keep only the last MAX_HISTORY_SIZE requests
  if (requestHistory.length > MAX_HISTORY_SIZE) {
    requestHistory.shift();
  }
  
  res.json({ message: 'Data retrieved successfully' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      testCases: [
        {
          input: 'GET /api/data',
          expectedOutput: '{"message":"Data retrieved successfully"}',
          description: 'Basic request should work'
        }
      ],
      hints: [
        'Consider the size of the requestHistory array',
        'Think about implementing a cleanup mechanism'
      ],
      createdBy: admin._id
    });

    console.log('Sample coding challenge created');

    // Create a sample deployment
    const deployment = await Deployment.create({
      title: 'Docker Container Deployment',
      description: 'Deploy a Node.js application using Docker containers.',
      difficulty: 'beginner',
      steps: [
        {
          title: 'Create Dockerfile',
          description: 'Create a Dockerfile for the Node.js application.',
          actionType: 'text',
          correctAnswer: 'FROM node:14\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]',
          hint: 'Start with the base image and set up the working directory'
        },
        {
          title: 'Build Docker Image',
          description: 'Build the Docker image using the Dockerfile.',
          actionType: 'command',
          correctAnswer: 'docker build -t myapp .',
          hint: 'Use the docker build command with a tag'
        },
        {
          title: 'Run Docker Container',
          description: 'Run the Docker container and map the port.',
          actionType: 'command',
          correctAnswer: 'docker run -p 3000:3000 myapp',
          hint: 'Use the docker run command with port mapping'
        }
      ],
      prerequisites: ['Basic Docker knowledge', 'Node.js fundamentals'],
      estimatedTime: 30,
      totalSteps: 3,
      createdBy: admin._id
    });

    console.log('Sample deployment created');

    // Create a sample troubleshooting scenario
    const troubleshooting = await Troubleshooting.create({
      title: 'Memory Leak Investigation',
      description: 'Investigate and resolve a memory leak in a production application.',
      difficulty: 'advanced',
      category: 'Performance',
      steps: [
        {
          title: 'Check Memory Usage',
          description: 'Monitor the application\'s memory usage over time.',
          actionType: 'command',
          correctAnswer: 'top -p $(pgrep -f "node app.js")',
          hint: 'Use the top command to monitor process memory'
        },
        {
          title: 'Analyze Heap Snapshot',
          description: 'Take a heap snapshot to identify memory leaks.',
          actionType: 'command',
          correctAnswer: 'node --heapsnapshot app.js',
          hint: 'Use Node.js heap snapshot feature'
        },
        {
          title: 'Implement Fix',
          description: 'Implement a solution to prevent memory leaks.',
          actionType: 'text',
          correctAnswer: 'Implement request history cleanup',
          hint: 'Consider limiting the size of stored data'
        }
      ],
      prerequisites: ['Node.js debugging', 'Memory profiling'],
      estimatedTime: 45,
      totalSteps: 3,
      createdBy: admin._id
    });

    console.log('Sample troubleshooting scenario created');

    // Create a certification
    const certification = await Certification.create({
      title: 'JavaScript Performance Optimization',
      description: 'This certification demonstrates proficiency in optimizing JavaScript applications for performance. It covers strategies like memoization, memory management, and debugging performance issues.',
      user: demoUser._id,
      requirements: [
        {
          type: 'challenge',
          item: challenge._id,
          completed: false,
        },
        {
          type: 'troubleshooting',
          item: troubleshooting._id,
          completed: false,
        }
      ],
      certificateId: `CERT-${Date.now()}-${demoUser._id.toString().substr(-6)}`,
      isValid: true
    });

    console.log('Sample certification created');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();