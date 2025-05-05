# Developer Onboarding Simulator

An interactive system that simulates real-world scenarios for new developers joining a team. This project helps accelerate and standardize the developer onboarding process.

## Features

- Interactive coding challenges that mimic actual codebase patterns
- Guided walkthroughs of deployment processes
- Simulated troubleshooting scenarios based on common issues
- Progress tracking and certification for new team members

## Tech Stack

- **Frontend**: React, React Router, Axios, Monaco Editor
- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **DevOps**: Docker, Container Orchestration

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (if running without Docker)
- MongoDB (if running without Docker)

### Installation with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dev-onboarding-simulator.git
   cd dev-onboarding-simulator
   ```

2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file to set your environment variables.

4. Start the containers:
   ```bash
   docker-compose up -d
   ```

5. The application should now be running:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Installation without Docker

#### Backend

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the necessary environment variables.

4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

## Usage

1. Register for an account on the platform.
2. Explore coding challenges, deployment simulations, and troubleshooting scenarios.
3. Track your progress and earn certifications.

## Development

### Project Structure

```
dev-onboarding-simulator/
├── client/                   # React frontend
│   ├── public/
│   └── src/
│       ├── components/       # Reusable components
│       ├── contexts/         # React contexts
│       ├── pages/            # Page components
│       ├── services/         # API services
│       ├── styles/           # CSS styles
│       └── ...
├── server/                   # Node.js backend
│   ├── controllers/          # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   └── ...
├── docker/                   # Docker configuration
│   ├── client/
│   ├── server/
│   └── docker-compose.yml
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.