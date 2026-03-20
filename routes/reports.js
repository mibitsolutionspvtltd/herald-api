const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Report generation routes (simplified auth for testing)
router.get('/content', authenticateToken, reportsController.generateContentReport);
router.get('/users', authenticateToken, reportsController.generateUserReport);
router.get('/system', authenticateToken, reportsController.generateSystemReport);
router.get('/activity', authenticateToken, reportsController.generateSystemReport);

module.exports = router;
