const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Dashboard analytics
router.get('/dashboard', authenticateToken, analyticsController.getDashboardAnalytics);

// Content analytics
router.get('/content', authenticateToken, analyticsController.getContentAnalytics);

// User analytics
router.get('/users', authenticateToken, analyticsController.getUserAnalytics);
router.get('/users/registration', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getUserRegistration);
router.get('/users/engagement', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getUserEngagement);

// System analytics
router.get('/system', authenticateToken, checkRole(['ADMIN']), analyticsController.getSystemAnalytics);
router.get('/system/realtime', authenticateToken, checkRole(['ADMIN']), analyticsController.getRealTimeStats);
router.get('/system/errors', authenticateToken, checkRole(['ADMIN']), analyticsController.getErrorAnalytics);

// Performance metrics
router.get('/performance', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getPerformanceMetrics);

// User activity analytics
router.get('/user-activity/devices', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getDeviceAnalytics);
router.get('/user-activity/geography', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getGeographicAnalytics);
router.get('/user-activity/search', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getSearchAnalytics);

// Time-based analytics
router.get('/daily', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getDailyStats);
router.get('/weekly', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getWeeklyStats);
router.get('/monthly', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getMonthlyStats);

// Media analytics
router.get('/media', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), analyticsController.getMediaAnalytics);

module.exports = router;
