const express = require('express');
const router = express.Router();
const carouselController = require('../controllers/carouselController');
const { authenticateToken, checkPermission } = require('../middleware/auth');
const { single } = require('../middleware/upload');
const { PERMISSIONS } = require('../constants/roles');

// Public carousel routes
router.get('/', carouselController.getCarouselItems);
router.get('/:id', carouselController.getCarouselItemById);

// Admin carousel routes
router.get('/admin/all', authenticateToken, checkPermission(PERMISSIONS.VIEW_CAROUSEL), carouselController.getAllCarouselItems);
router.post('/', authenticateToken, checkPermission(PERMISSIONS.CREATE_CAROUSEL), single('coverImage'), carouselController.createCarouselItem);
router.put('/:id', authenticateToken, checkPermission(PERMISSIONS.EDIT_CAROUSEL), single('coverImage'), carouselController.updateCarouselItem);
router.delete('/:id', authenticateToken, checkPermission(PERMISSIONS.DELETE_CAROUSEL), carouselController.deleteCarouselItem); // DELETE method
router.put('/:id/delete', authenticateToken, checkPermission(PERMISSIONS.DELETE_CAROUSEL), carouselController.deleteCarouselItem); // PUT method - soft delete
router.post('/admin/reorder', authenticateToken, checkPermission(PERMISSIONS.EDIT_CAROUSEL), carouselController.updateDisplayOrder); // Bulk update display order

module.exports = router;
