# Production Dockerfile for Student Herald API
FROM node:18-alpine AS base

# Install dependencies for production
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production --ignore-scripts

# Copy application code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health/ready || exit 1

# Set production environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]
