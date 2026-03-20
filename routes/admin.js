const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const userManagementController = require('../controllers/userManagementController');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// ============================================
// Dashboard routes (accessible by all authenticated users with admin portal access)
// ============================================
router.get('/dashboard', authenticateToken, dashboardController.getDashboardData);
router.get('/dashboard/stats', authenticateToken, dashboardController.getRoleStatistics);

// ============================================
// Admin user management routes (operators with ADMIN role)
// ============================================
router.get('/admins', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.getAllAdmins);
router.post('/admins', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.createAdmin);
router.delete('/admins/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.deleteAdmin);

// ============================================
// User management routes (all users - unified system)
// ============================================
router.get('/users/all', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER']), authController.getAllUsers);
router.post('/users', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.createUser);
router.put('/users/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.updateUser);
router.delete('/users/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.deleteUser);
router.get('/users/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER']), userManagementController.getUserById);
router.post('/users/:id/change-password', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), userManagementController.changePassword);

// ============================================
// Legacy admin routes (for backward compatibility - redirects to unified system)
// ============================================
router.get('/', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), adminController.getAllAdmins);
router.get('/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), adminController.getAdminById);
router.put('/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), adminController.updateAdmin);
router.delete('/:id', authenticateToken, checkRole(['ADMIN', 'SUPER_ADMIN']), adminController.deleteAdmin);

module.exports = router;
