const express = require('express');
const router = express.Router();
const multer = require('multer');
const universityController = require('../controllers/universityController');
const { authenticateToken, checkPermission, checkRole } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Public university routes (now with authentication)
router.get('/', authenticateToken, universityController.getUniversities);
router.post('/', authenticateToken, universityController.createUniversity);
router.get('/:id', authenticateToken, universityController.getUniversityById);
router.put('/:id', authenticateToken, universityController.updateUniversity);
router.delete('/:id', authenticateToken, universityController.deleteUniversity);

// Admin university routes
router.get('/admin', authenticateToken, universityController.getAllUniversities); // For search with query params
router.get('/admin/all', authenticateToken, universityController.getAllUniversities);
router.get('/admin/:id', authenticateToken, universityController.getUniversityById); // Get single university by ID
router.post('/admin/create', authenticateToken, universityController.createUniversity);
router.put('/admin/:id', authenticateToken, universityController.updateUniversity);
router.delete('/admin/:id', authenticateToken, universityController.deleteUniversity); // DELETE method for admin
router.post('/admin/bulk-action', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), universityController.bulkAction);

module.exports = router;
