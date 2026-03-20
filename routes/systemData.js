const express = require('express');
const router = express.Router();
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  createPermission,
  assignPermissionsToRole,
  getAllDeviceRegistrations,
  getDeviceStats,
  getAllRoleMappings,
  createRoleMapping,
  initializeDefaultRolesAndPermissions,
  getSystemStats,
  getActiveStatuses
} = require('../controllers/systemDataController');

// Middleware for authentication
const { authenticateToken, checkPermission } = require('../middleware/auth');

// Role Management Routes
router.get('/roles', authenticateToken, checkPermission('MANAGE_ROLES'), getAllRoles);
router.get('/roles/stats', authenticateToken, checkPermission('VIEW_ANALYTICS'), getSystemStats);
router.get('/roles/:id', authenticateToken, checkPermission('MANAGE_ROLES'), getRoleById);
router.post('/roles', authenticateToken, checkPermission('MANAGE_ROLES'), createRole);
router.put('/roles/:id', authenticateToken, checkPermission('MANAGE_ROLES'), updateRole);
router.delete('/roles/:id', authenticateToken, checkPermission('MANAGE_ROLES'), deleteRole);

// Permission Management Routes
router.get('/permissions', authenticateToken, checkPermission('MANAGE_PERMISSIONS'), getAllPermissions);
router.post('/permissions', authenticateToken, checkPermission('MANAGE_PERMISSIONS'), createPermission);
router.post('/roles/:roleId/permissions', authenticateToken, checkPermission('MANAGE_PERMISSIONS'), assignPermissionsToRole);

// Device Tracking Routes
router.get('/devices', authenticateToken, checkPermission('VIEW_ANALYTICS'), getAllDeviceRegistrations);
router.get('/devices/stats', authenticateToken, checkPermission('VIEW_ANALYTICS'), getDeviceStats);

// Role Mapping Routes
router.get('/role-mappings', authenticateToken, checkPermission('MANAGE_ROLES'), getAllRoleMappings);
router.post('/role-mappings', authenticateToken, checkPermission('MANAGE_ROLES'), createRoleMapping);

// System Initialization Routes
router.post('/initialize', authenticateToken, checkPermission('SYSTEM_SETTINGS'), initializeDefaultRolesAndPermissions);

// Active Status Routes (public)
router.get('/active-status', getActiveStatuses);

// System Config Route
router.get('/config', authenticateToken, getSystemStats);

// Root system data endpoint (simplified, no special permissions needed)
router.get('/', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'System Data API',
    data: {
      endpoints: [
        '/system-data/roles',
        '/system-data/permissions',
        '/system-data/devices',
        '/system-data/role-mappings',
        '/system-data/active-status',
        '/system-data/config'
      ]
    }
  });
});

module.exports = router;
