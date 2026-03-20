const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Public contact routes
router.post('/', contactController.submitContact);
router.post('/submit', contactController.submitContact);

// Admin contact routes (simplified auth)
router.get('/', authenticateToken, contactController.getAllContacts);
router.get('/stats', authenticateToken, checkRole(['ADMIN']), contactController.getContactStats); // Moved before /:id to avoid conflicts
router.get('/:id', authenticateToken, checkRole(['ADMIN']), contactController.getContactById);
router.put('/:id', authenticateToken, checkRole(['ADMIN']), contactController.updateContactStatus);
router.put('/:id/delete', authenticateToken, checkRole(['ADMIN']), contactController.deleteContact); // PUT method - soft delete

module.exports = router;
