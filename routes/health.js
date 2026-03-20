/**
 * Health Check Routes
 * Provides system health and status information
 */

const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const logger = require('../config/logger');

/**
 * Basic health check
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    await sequelize.authenticate();
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
      version: require('../package.json').version,
    };
    
    res.json({
      success: true,
      data: healthData,
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: 'Service unavailable',
      error: error.message,
    });
  }
});

/**
 * Detailed health check (for monitoring systems)
 * GET /api/health/detailed
 */
router.get('/detailed', async (req, res) => {
  const checks = {
    database: false,
    s3: false,
  };
  
  try {
    // Database check
    await sequelize.authenticate();
    checks.database = true;
    
    // S3 check (optional - can be slow)
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3();
    // await s3.headBucket({ Bucket: process.env.S3_BUCKET_NAME }).promise();
    // checks.s3 = true;
    
    const allHealthy = Object.values(checks).every(check => check === true);
    
    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      checks,
      error: error.message,
    });
  }
});

/**
 * Readiness check (for Kubernetes/Docker)
 * GET /api/health/ready
 */
router.get('/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

/**
 * Liveness check (for Kubernetes/Docker)
 * GET /api/health/live
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

module.exports = router;
