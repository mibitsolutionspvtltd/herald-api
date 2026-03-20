const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Public routes (with authentication)
router.get('/article/:id', commentController.getArticleComments);
router.post('/article/:id', commentController.createComment);

// Admin routes
router.get('/admin/all', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER', 'EDITOR']), commentController.getAllComments);
router.put('/admin/:id/moderate', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER', 'EDITOR']), commentController.moderateComment);
router.delete('/admin/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), commentController.deleteComment);
router.post('/admin/bulk-moderate', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), commentController.bulkModerate);

module.exports = router;
