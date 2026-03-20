const express = require('express');
const router = express.Router();
const {
  getAllOptions,
  getOptionsByType,
  getNavigation,
  createOptionType,
  createOption,
  updateOption,
  deleteOption,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem
} = require('../controllers/configController');
const { authenticateToken } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permission');

// Public/authenticated routes
router.get('/options', authenticateToken, getAllOptions);
router.get('/options/:typeKey', authenticateToken, getOptionsByType);
router.get('/navigation', authenticateToken, getNavigation);

// Admin-only routes for managing configuration
router.post('/option-types', authenticateToken, requirePermission('MANAGE_SETTINGS'), createOptionType);
router.post('/options', authenticateToken, requirePermission('MANAGE_SETTINGS'), createOption);
router.put('/options/:id', authenticateToken, requirePermission('MANAGE_SETTINGS'), updateOption);
router.delete('/options/:id', authenticateToken, requirePermission('MANAGE_SETTINGS'), deleteOption);

router.post('/navigation', authenticateToken, requirePermission('MANAGE_SETTINGS'), createNavigationItem);
router.put('/navigation/:id', authenticateToken, requirePermission('MANAGE_SETTINGS'), updateNavigationItem);
router.delete('/navigation/:id', authenticateToken, requirePermission('MANAGE_SETTINGS'), deleteNavigationItem);

module.exports = router;
