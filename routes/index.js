const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const staticRoutes = require('./static');
const articleRoutes = require('./article');
const categoryRoutes = require('./category');
const heroContentRoutes = require('./heroContent');
const carouselRoutes = require('./carousel');
const contactRoutes = require('./contact');
const courseRoutes = require('./course');
const universityRoutes = require('./university');
const uploadRoutes = require('./upload');
const analyticsRoutes = require('./analytics');
const reportsRoutes = require('./reports');
const settingsRoutes = require('./settings');
const tagRoutes = require('./tag');
const documentRoutes = require('./document');
const roleRoutes = require('./role');
const operatorRoutes = require('./operator');
const adminRoutes = require('./admin');
const advertisementRoutes = require('./advertisement');
const configRoutes = require('./config');
const commentRoutes = require('./comment');
// usersRoutes removed - using auth routes for user management

// Existing modular routes (kept only non-duplicate routes)
const geographicRoutes = require('./geographic');
const systemDataRoutes = require('./systemData');

// Mount authentication routes with /auth prefix
router.use('/auth', authRoutes);

// Mount users routes (unified - all users in operator table)
// These are aliases to /auth/users for convenience
router.use('/users', authRoutes);

// Mount dashboard routes at root level
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');
router.get('/dashboard', authenticateToken, dashboardController.getDashboardData);
router.get('/dashboard/stats', authenticateToken, dashboardController.getDashboardStats);
router.get('/dashboard/role-stats', authenticateToken, dashboardController.getRoleStatistics);

// Mount static routes
router.use('/static', staticRoutes);

// Mount content routes
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/hero-content', heroContentRoutes);
router.use('/carousel', carouselRoutes);
router.use('/comments', commentRoutes);

// Mount contact routes
router.use('/contacts', contactRoutes);

// Mount educational routes
router.use('/courses', courseRoutes);
router.use('/universities', universityRoutes);

// Mount file management routes
router.use('/upload', uploadRoutes);

// Mount advertisement routes
router.use('/advertisements', advertisementRoutes);

// Mount specific admin routes first (order matters!)
router.use('/admin/config', configRoutes);
router.use('/admin/analytics', analyticsRoutes);
router.use('/admin/reports', reportsRoutes);
router.use('/admin/settings', settingsRoutes);
router.use('/admin/tags', tagRoutes);
router.use('/admin/documents', documentRoutes);
router.use('/admin/roles', roleRoutes);
router.use('/admin/operators', operatorRoutes);
// /admin/users removed - use /auth/users instead
// Mount general admin routes last
router.use('/admin', adminRoutes);

// Mount existing comprehensive API routes (only non-duplicate routes)
router.use('/geographic', geographicRoutes);
router.use('/system-data', systemDataRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Comprehensive Admin Panel API is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: [
      'Role-based Access Control',
      'User Management',
      'Content Management', 
      'Geographic Data',
      'System Data Management',
      'Educational Content',
      'Analytics & Reports'
    ]
  });
});

module.exports = router;
