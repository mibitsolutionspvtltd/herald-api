const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const operatorController = require('../controllers/operatorController');
const userManagementController = require('../controllers/userManagementController');
const { authenticateToken } = require('../middleware/auth');
const { body } = require('express-validator');

// ============================================
// General Authentication routes (Unified System - All users in Operator table)
// ============================================
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authenticateToken, authController.logout);
router.get('/me', authenticateToken, authController.getProfile);

// ============================================
// Role and Permission routes
// ============================================
router.get('/roles', authenticateToken, authController.getRoles);
router.get('/permissions', authenticateToken, authController.getPermissions);

// ============================================
// User Management CRUD routes (All users stored in Operator table)
// ============================================
router.get('/users', authenticateToken, authController.getAllUsers);
router.get('/users/all', authenticateToken, authController.getAllUsers);
router.get('/users/by-role/:roleCode', authenticateToken, authController.getAllUsers);
router.get('/users/:id', authenticateToken, userManagementController.getUserById);
router.post('/users', authenticateToken, userManagementController.createUser);
router.put('/users/:id', authenticateToken, userManagementController.updateUser);
router.delete('/users/:id', authenticateToken, userManagementController.deleteUser);
router.post('/users/:id/change-password', authenticateToken, userManagementController.changePassword);

// ============================================
// Admin authentication routes (creates operator with ADMIN role)
// ============================================
router.post('/admin/signup', adminController.adminSignup);
router.post('/admin/login', authController.login); // Use unified login

// ============================================
// Operator authentication routes
// ============================================
router.post('/operator/login', 
  [
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('mobile_number').optional().notEmpty().withMessage('Mobile number is required'),
    body('otp_code').optional().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  operatorController.operatorLogin
);

router.get('/operator/profile', authenticateToken, operatorController.getOperatorProfile);
router.put('/operator/profile', authenticateToken, operatorController.updateOperatorProfile);
router.get('/operator/dashboard', authenticateToken, operatorController.getOperatorDashboard);
router.get('/operator/permissions', authenticateToken, operatorController.getOperatorPermissions);

// ============================================
// Dashboard routes (role-based)
// ============================================
const dashboardController = require('../controllers/dashboardController');
router.get('/dashboard', authenticateToken, dashboardController.getDashboardData);
router.get('/dashboard/stats', authenticateToken, dashboardController.getRoleStatistics);

module.exports = router;
