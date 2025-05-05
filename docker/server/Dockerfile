FROM node:16-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Expose port
EXPOSE ${PORT}

# Start server
CMD ["npm", "run", "dev"]