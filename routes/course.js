const express = require('express');
const router = express.Router();
const multer = require('multer');
const courseController = require('../controllers/courseController');
const { authenticateToken, checkPermission, checkRole } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Public course routes (now with authentication)
router.get('/', authenticateToken, courseController.getCourses);
router.post('/', authenticateToken, upload.single('image'), courseController.createCourse);
router.get('/:id', authenticateToken, courseController.getCourseById);
router.put('/:id', authenticateToken, upload.single('image'), courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse); // DELETE method
router.put('/:id/delete', authenticateToken, courseController.deleteCourse); // PUT method - soft delete

// Admin course routes  
router.get('/admin', authenticateToken, courseController.getAllCourses); // For search with query params
router.get('/admin/all', authenticateToken, courseController.getAllCourses);
router.get('/admin/:id', authenticateToken, courseController.getCourseById); // Get single course by ID
router.post('/admin/create', authenticateToken, upload.single('image'), courseController.createCourse);
router.put('/admin/:id', authenticateToken, upload.single('image'), courseController.updateCourse);
router.delete('/admin/:id', authenticateToken, courseController.deleteCourse); // DELETE method for admin
router.put('/admin/:id/delete', authenticateToken, courseController.deleteCourse); // PUT method - soft delete
router.post('/admin/bulk-action', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), courseController.bulkAction);

module.exports = router;
