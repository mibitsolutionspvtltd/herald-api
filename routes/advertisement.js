const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (for frontend to fetch ads)
router.get('/slot/:slot', advertisementController.getAdsBySlot);
router.post('/:id/impression', advertisementController.trackImpression);
router.post('/:id/click', advertisementController.trackClick);

// Protected routes (admin only)
router.get('/', authenticateToken, advertisementController.getAllAdvertisements);
router.get('/:id', authenticateToken, advertisementController.getAdvertisementById);
router.get('/:id/stats', authenticateToken, advertisementController.getAdStats);
router.post('/', authenticateToken, advertisementController.createAdvertisement);
router.put('/:id', authenticateToken, advertisementController.updateAdvertisement);
router.delete('/:id', authenticateToken, advertisementController.deleteAdvertisement);

// Image upload endpoint
router.post('/upload-image', authenticateToken, upload.single('image'), advertisementController.uploadImage, upload.handleError);

module.exports = router;
