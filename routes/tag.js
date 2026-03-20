const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Tag management routes
router.get('/', tagController.getAllTags); // Public for frontend access
router.get('/popular', tagController.getPopularTags); // Public for frontend access
router.post('/', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.createTag);
router.get('/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.getTagById);
router.put('/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.updateTag);
router.delete('/:id', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.deleteTag);

// Article-tag association routes
router.post('/articles/:articleId', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.addTagsToArticle);
router.get('/articles/:articleId', tagController.getArticleTags);
router.delete('/articles/:articleId/:tagId', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), tagController.removeTagFromArticle);

module.exports = router;
