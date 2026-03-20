const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Settings routes (simplified auth)
router.get('/', authenticateToken, settingsController.getSettings);
router.put('/categories', authenticateToken, checkRole(['ADMIN']), settingsController.updateCategorySettings);
router.put('/services', authenticateToken, checkRole(['ADMIN']), settingsController.updateServiceSettings);
router.put('/search-metadata', authenticateToken, checkRole(['ADMIN']), settingsController.updateSearchMetadataSettings);

// System configuration
router.get('/config', authenticateToken, checkRole(['ADMIN']), settingsController.getSystemConfig);
router.put('/config', authenticateToken, checkRole(['ADMIN']), settingsController.updateSystemConfig);

// Backup management
router.get('/backup', authenticateToken, checkRole(['ADMIN']), settingsController.getBackupInfo);
router.post('/backup', authenticateToken, checkRole(['ADMIN']), settingsController.triggerBackup);

module.exports = router;
