const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// File upload routes - accept any field name
const uploadAny = (req, res, next) => {
  const uploadHandler = upload.any();
  uploadHandler(req, res, (err) => {
    if (err) return next(err);
    // Set req.file to the first uploaded file for backward compatibility
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

// Upload routes
router.post('/', authenticateToken, uploadAny, uploadController.uploadFile);
router.post('/image', authenticateToken, uploadAny, uploadController.uploadFile);
router.post('/document', authenticateToken, uploadAny, uploadController.uploadFile);
router.post('/documents', authenticateToken, uploadController.uploadFile);

// File management routes
router.get('/files', authenticateToken, uploadController.getFiles);
router.get('/files/:id', authenticateToken, uploadController.getFile);
router.delete('/files/:id', authenticateToken, uploadController.deleteFile);
router.get('/folders', authenticateToken, uploadController.getFolders);

// Media analytics
router.get('/analytics', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), uploadController.getMediaAnalytics);

// Bulk actions
router.post('/bulk-action', authenticateToken, checkRole(['ADMIN', 'CONTENT_MANAGER']), uploadController.bulkAction);

module.exports = router;
