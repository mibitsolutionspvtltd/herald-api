const express = require('express');
const router = express.Router();
const heroContentController = require('../controllers/heroContentController');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { single } = require('../middleware/upload');
const { PERMISSIONS } = require('../constants/roles');

// Public hero content routes
router.get('/', heroContentController.getHeroContent);
router.get('/:id', heroContentController.getHeroContentById);

// Admin hero content routes
router.get('/admin/all', authenticateToken, checkPermission(PERMISSIONS.VIEW_HERO_CONTENT), heroContentController.getAllHeroContent);
router.post('/', authenticateToken, checkPermission(PERMISSIONS.CREATE_HERO_CONTENT), single('coverImage'), heroContentController.createHeroContent);
router.put('/:id', authenticateToken, checkPermission(PERMISSIONS.EDIT_HERO_CONTENT), single('coverImage'), heroContentController.updateHeroContent);
router.delete('/:id', authenticateToken, checkPermission(PERMISSIONS.DELETE_HERO_CONTENT), heroContentController.deleteHeroContent); // DELETE method - soft delete
router.put('/:id/delete', authenticateToken, checkPermission(PERMISSIONS.DELETE_HERO_CONTENT), heroContentController.deleteHeroContent); // PUT method - soft delete (legacy support)

module.exports = router;
