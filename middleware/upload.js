const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (for S3 upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Export different upload configurations
module.exports = {
  // Single image upload
  single: (fieldName) => upload.single(fieldName),
  
  // Multiple image upload
  multiple: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
  
  // Fields with different names
  fields: (fields) => upload.fields(fields),
  
  // Error handler for multer errors
  handleError: (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 5MB.'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files uploaded.'
        });
      }
    }
    
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed.'
      });
    }
    
    next(error);
  }
};
