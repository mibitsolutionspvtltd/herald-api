const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateToken, checkPermission, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Special routes MUST come before /:id routes to avoid conflicts
// Authors endpoint (must be before /:id)
router.get('/authors', authenticateToken, articleController.getAuthors);

// Admin routes (must be before /:id)
router.get('/admin', authenticateToken, articleController.getAllArticles); // For search with query params
router.get('/admin/all', authenticateToken, articleController.getAllArticles);
router.get('/admin/:id', authenticateToken, articleController.getArticleById); // Get single article by ID
router.post('/admin/create', authenticateToken, upload.single('coverImage'), articleController.createArticle);
router.put('/admin/:id', authenticateToken, upload.single('coverImage'), articleController.updateArticle);
router.delete('/admin/:id', authenticateToken, articleController.deleteArticle); // DELETE method for admin
router.put('/admin/:id/delete', authenticateToken, articleController.deleteArticle); // PUT method - soft delete by setting status_id=2

// Analytics and bulk operations (must be before /:id)
router.get('/admin/analytics/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER', 'EDITOR']), articleController.getArticleAnalytics);
router.post('/admin/bulk-action', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), articleController.bulkAction);

// Public article routes (now with authentication)
router.get('/', authenticateToken, articleController.getArticles);
router.post('/', authenticateToken, upload.single('coverImage'), articleController.createArticle);
router.get('/all', authenticateToken, articleController.getAllArticlesPublic);

// Article-specific routes with :id parameter
router.get('/:id', authenticateToken, articleController.getArticleById);
router.put('/:id', authenticateToken, upload.single('coverImage'), articleController.updateArticle);
router.delete('/:id', authenticateToken, articleController.deleteArticle); // DELETE method
router.put('/:id/delete', authenticateToken, articleController.deleteArticle); // PUT method - soft delete by setting status_id=2

// Related posts
router.get('/:id/related', authenticateToken, articleController.getRelatedPosts);
router.post('/:id/related', authenticateToken, articleController.updateRelatedPosts);

// Revisions
router.get('/:id/revisions', authenticateToken, articleController.getArticleRevisions);
router.post('/:id/revisions/:revisionId/restore', authenticateToken, articleController.restoreRevision);

// SEO Analysis
router.post('/:id/analyze-seo', authenticateToken, articleController.analyzeSEO);
router.get('/:id/seo-score', authenticateToken, articleController.getSEOScore);

module.exports = router;
