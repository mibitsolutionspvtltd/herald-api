const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public category routes (now with authentication)
router.get('/', authenticateToken, categoryController.getCategories);
router.post('/', authenticateToken, upload.single('coverImage'), categoryController.createCategory);
router.get('/search', authenticateToken, categoryController.searchCategories);
router.get('/dropdown', authenticateToken, categoryController.getAllCategoriesForDropdown);
router.get('/:id', authenticateToken, categoryController.getCategoryById);
router.put('/:id', authenticateToken, upload.single('coverImage'), categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory); // DELETE method
router.put('/:id/delete', authenticateToken, categoryController.deleteCategory); // PUT method - soft delete by setting status_id=2

// Admin category routes
router.get('/admin', authenticateToken, categoryController.getAllCategories); // For search with query params
router.get('/admin/all', authenticateToken, categoryController.getAllCategories);
router.get('/admin/:id', authenticateToken, categoryController.getCategoryById); // Get single category by ID
router.post('/admin/create', authenticateToken, upload.single('coverImage'), categoryController.createCategory);
router.put('/admin/:id', authenticateToken, upload.single('coverImage'), categoryController.updateCategory);
router.delete('/admin/:id', authenticateToken, categoryController.deleteCategory); // DELETE method for admin
router.put('/admin/:id/delete', authenticateToken, categoryController.deleteCategory); // PUT method - soft delete by setting status_id=2

module.exports = router;
