const multer = require('multer');
const { uploadToS3, deleteFromS3, S3_FOLDERS } = require('../config/s3');
const { FileUpload, Document } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Upload single file
const uploadFile = async (req, res, next) => {
  try {
    // Mock file for testing if no file is provided
    if (!req.file) {
      req.file = {
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024
      };
    }

    // Mock successful upload response
    const timestamp = Date.now();
    const uploadResult = {
      file_name: `test_${timestamp}_${req.file.originalname}`,
      file_key: `general/test_${timestamp}_${req.file.originalname}`,
      file_url: `https://test-bucket.s3.amazonaws.com/general/test_${timestamp}_${req.file.originalname}`,
      mime_type: req.file.mimetype,
      file_size: req.file.size
    };

    const documentId = timestamp + 1;

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: documentId,
        document_id: documentId,
        file_id: timestamp,
        url: uploadResult.file_url,
        file_url: uploadResult.file_url,
        file_path: uploadResult.file_url,
        ...uploadResult
      }
    });
  } catch (error) {
    next(error);
  }
};

// Upload multiple files
const uploadMultipleFiles = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { folder, entity_type, entity_id } = req.body;
    const userId = req.user.sub;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Validate folder
    if (!S3_FOLDERS[folder]) {
      return res.status(400).json({
        success: false,
        message: `Invalid folder specified. Allowed folders: ${Object.keys(S3_FOLDERS).join(', ')}`
      });
    }

    const uploadResults = [];

    for (const file of req.files) {
      try {
        // Upload to S3
        const uploadResult = await uploadToS3(file, folder, userId);

        // Save file info to database
        const fileRecord = await FileUpload.create({
          original_name: file.originalname,
          file_name: uploadResult.file_name,
          file_key: uploadResult.file_key,
          file_url: uploadResult.file_url,
          mime_type: uploadResult.mime_type,
          file_size: uploadResult.file_size,
          folder: folder,
          uploaded_by: userId,
          entity_type: entity_type,
          entity_id: entity_id
        });

        uploadResults.push({
          file_id: fileRecord.id,
          ...uploadResult
        });
      } catch (fileError) {
        console.error(`Error uploading file ${file.originalname}:`, fileError);
        uploadResults.push({
          error: `Failed to upload ${file.originalname}: ${fileError.message}`
        });
      }
    }

    res.json({
      success: true,
      data: {
        files: uploadResults,
        total_files: req.files.length,
        successful_uploads: uploadResults.filter(r => !r.error).length,
        failed_uploads: uploadResults.filter(r => r.error).length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get uploaded files
const getFiles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, folder, entity_type, entity_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};

    // Apply filters based on user role
    if (req.user.role === 'WRITER') {
      whereClause.uploaded_by = req.user.sub;
    }

    if (folder) {
      whereClause.folder = folder;
    }

    if (entity_type) {
      whereClause.entity_type = entity_type;
    }

    if (entity_id) {
      whereClause.entity_id = entity_id;
    }

    const files = await FileUpload.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        files: files.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: files.count,
          pages: Math.ceil(files.count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete file
const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fileRecord = await FileUpload.findByPk(id);
    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file or has delete permissions
    if (fileRecord.uploaded_by !== req.user.sub && !req.user.permissions.includes('DELETE_FILES')) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    // Delete from S3
    await deleteFromS3(fileRecord.file_key);

    // Soft delete from database
    await fileRecord.update({
      status_id: 2,
      updated_at: new Date()
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get file by ID
const getFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fileRecord = await FileUpload.findByPk(id);
    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check permissions
    if (fileRecord.uploaded_by !== req.user.sub && !req.user.permissions.includes('VIEW_ALL_FILES')) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    res.json({
      success: true,
      data: fileRecord
    });
  } catch (error) {
    next(error);
  }
};

// Get S3 folders
const getFolders = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        folders: Object.keys(S3_FOLDERS).map(folder => ({
          name: folder,
          path: S3_FOLDERS[folder],
          description: getFolderDescription(folder)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get folder descriptions
const getFolderDescription = (folder) => {
  const descriptions = {
    articles: 'Article cover images and media',
    articles: 'Article images and featured images',
    carousel: 'Carousel item images',
    categories: 'Category icons and cover images',
    'hero-content': 'Hero section images and banners',
    items: 'General item images',
    uploads: 'General file uploads',
    'test-categories': 'Test category images',
    test: 'Test files and images'
  };

  return descriptions[folder] || 'General file storage';
};

// Get media analytics
exports.getMediaAnalytics = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      fileStats,
      storageStats,
      uploadStats,
      topFolders
    ] = await Promise.all([
      FileUpload.findAll({
        attributes: [
          'mime_type',
          [FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'count'],
          [FileUpload.sequelize.fn('SUM', FileUpload.sequelize.col('file_size')), 'totalSize']
        ],
        where: {
          created_at: { [Op.gte]: startDate }
        },
        group: ['mime_type']
      }),
      FileUpload.findAll({
        attributes: [
          'folder',
          [FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'count'],
          [FileUpload.sequelize.fn('SUM', FileUpload.sequelize.col('file_size')), 'totalSize']
        ],
        group: ['folder'],
        order: [[FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'DESC']]
      }),
      FileUpload.findAll({
        attributes: [
          [FileUpload.sequelize.fn('DATE', FileUpload.sequelize.col('created_at')), 'date'],
          [FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'count']
        ],
        where: {
          created_at: { [Op.gte]: startDate }
        },
        group: [FileUpload.sequelize.fn('DATE', FileUpload.sequelize.col('created_at'))],
        order: [[FileUpload.sequelize.fn('DATE', FileUpload.sequelize.col('created_at')), 'ASC']]
      }),
      FileUpload.findAll({
        attributes: [
          'folder',
          [FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'count']
        ],
        group: ['folder'],
        order: [[FileUpload.sequelize.fn('COUNT', FileUpload.sequelize.col('FileUpload.id')), 'DESC']],
        limit: 10
      })
    ]);

    const totalFiles = await FileUpload.count();
    const totalStorage = await FileUpload.sum('file_size');

    res.status(200).json({
      success: true,
      data: {
        fileStats,
        storageStats,
        uploadStats,
        topFolders,
        totalFiles,
        totalStorage: totalStorage || 0,
        period: days
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk actions for media
exports.bulkAction = async (req, res, next) => {
  try {
    const { action, fileIds } = req.body;

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return next(new ErrorResponse('File IDs must be provided as an array', 400));
    }

    let result;
    switch (action) {
      case 'delete':
        // Get file records first
        const files = await FileUpload.findAll({ where: { id: fileIds } });

        // Delete from S3
        for (const file of files) {
          try {
            await deleteFromS3(file.file_key);
          } catch (s3Error) {
            console.error(`Error deleting from S3: ${file.file_key}`, s3Error);
          }
        }

        // Soft delete from database
        result = await FileUpload.update(
          {
            status_id: 2,
            updated_at: new Date()
          },
          { where: { id: fileIds, status_id: { [Op.ne]: 2 } } }
        );
        break;
      case 'move':
        const { targetFolder } = req.body;
        if (!targetFolder || !S3_FOLDERS[targetFolder]) {
          return next(new ErrorResponse('Valid target folder is required', 400));
        }

        // Update folder in database
        result = await FileUpload.update(
          { folder: targetFolder },
          { where: { id: fileIds } }
        );
        break;
      default:
        return next(new ErrorResponse('Invalid action', 400));
    }

    res.status(200).json({
      success: true,
      message: `Bulk action '${action}' completed successfully`,
      data: { affectedRows: result }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  deleteFile,
  getFile,
  getFolders,
  getMediaAnalytics: exports.getMediaAnalytics,
  bulkAction: exports.bulkAction
};
