const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Document management routes
router.get('/', authenticateToken, documentController.getAllDocuments);
router.post('/', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.createDocument);
router.get('/stats', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.getDocumentStats);
router.get('/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.getDocumentById);
router.put('/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.updateDocument);
router.put('/:id/delete', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.deleteDocument); // PUT method - soft delete
router.post('/bulk-action', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.bulkAction);

// Document categories
router.get('/categories/all', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.getDocumentCategories);
router.post('/categories', authenticateToken, checkRole(['ADMIN']), documentController.createDocumentCategory);

// Document types
router.get('/types/all', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), documentController.getDocumentTypes);
router.post('/types', authenticateToken, checkRole(['ADMIN']), documentController.createDocumentType);

module.exports = router;
