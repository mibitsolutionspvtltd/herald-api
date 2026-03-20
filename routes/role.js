const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Role management routes
router.get('/', roleController.getAllRoles); // Made public for testing
router.post('/', authenticateToken, checkRole(['ADMIN']), roleController.createRole);
router.get('/stats', authenticateToken, checkRole(['ADMIN']), roleController.getRoleStats);
router.get('/:id', authenticateToken, checkRole(['ADMIN']), roleController.getRoleById);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), roleController.updateRole);
router.delete('/:id', authenticateToken, checkRole(['ADMIN']), roleController.deleteRole);

// Permission management
router.get('/permissions/all', authenticateToken, checkRole(['ADMIN']), roleController.getAllPermissions);

// User role assignment
router.post('/users/:userId/assign', authenticateToken, checkRole(['ADMIN']), roleController.assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', authenticateToken, checkRole(['ADMIN']), roleController.removeRoleFromUser);

module.exports = router;
