const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./config/logger');
const { validateEnvironment } = require('./config/secrets');
const db = require('./models');
const routes = require('./routes');
const healthRoutes = require('./routes/health');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// Compression and logging
app.use(compression());
// Use Winston for logging in production, Morgan for development
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoints
app.use('/api/health', healthRoutes);

// Legacy health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Validate environment variables
    logger.info('Validating environment configuration...');
    const envValid = validateEnvironment();
    if (!envValid && process.env.NODE_ENV === 'production') {
      logger.error('Environment validation failed. Exiting...');
      process.exit(1);
    }
    
    // Test database connection and sync models
    logger.info('Connecting to database...');
    await db.sequelize.authenticate();
    logger.info('✅ Database connection established successfully.');
    console.log('✅ Database connection established successfully.');
    
    // Start server
    app.listen(PORT, () => {
      const startupMessage = `
╔════════════════════════════════════════════════════════════╗
║           Student Herald API Server Started               ║
╠════════════════════════════════════════════════════════════╣
║  🚀 Server:      http://localhost:${PORT}                    ║
║  📊 Environment: ${process.env.NODE_ENV || 'development'}                            ║
║  🌐 Frontend:    ${process.env.FRONTEND_URL || 'http://localhost:3000'}              ║
║  🔗 API:         http://localhost:${PORT}/api                ║
║  🏥 Health:      http://localhost:${PORT}/api/health         ║
╚════════════════════════════════════════════════════════════╝
      `;
      console.log(startupMessage);
      logger.info(`Server started on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
