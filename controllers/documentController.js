const { Document, DocumentCategory, DocumentType } = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all documents
exports.getAllDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, size, search, category, type, sort = 'created_on', order = 'DESC' } = req.query;
    const pageSize = size || limit;
    const offset = (page - 1) * pageSize;

    const whereClause = {
      [Op.or]: [
        { status_id: { [Op.ne]: 2 } },
        { status_id: { [Op.is]: null } }
      ]
    };
    
    if (search) {
      whereClause[Op.and] = [
        whereClause[Op.or] ? { [Op.or]: whereClause[Op.or] } : {},
        {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { uid: { [Op.like]: `%${search}%` } }
          ]
        }
      ];
      delete whereClause[Op.or];
    }

    if (type) {
      whereClause.document_type_id = type;
    }

    const documents = await Document.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: DocumentType,
          as: 'documentType',
          attributes: ['id', 'name'],
          required: false
        }
      ],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['created_on', order.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      data: documents.rows.map(doc => ({
        id: doc.id,
        name: doc.name,
        uid: doc.uid,
        url: doc.url,
        type: doc.documentType?.name || 'Unknown',
        mime_type: doc.documentType?.name || 'file',
        size: null, // Document table doesn't have size field
        status: doc.status,
        created_on: doc.created_on,
        last_updated_on: doc.last_updated_on
      })),
      pagination: {
        total: documents.count,
        page: parseInt(page),
        size: parseInt(pageSize),
        totalPages: Math.ceil(documents.count / pageSize)
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    next(error);
  }
};

// Get document by ID
exports.getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id, {
      include: [
        {
          model: DocumentCategory,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: DocumentType,
          as: 'type',
          attributes: ['id', 'name', 'extension', 'mime_type']
        }
      ]
    });

    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
};

// Create document
exports.createDocument = async (req, res, next) => {
  try {
    const {
      name,
      description,
      url,
      file_path,
      file_size,
      category_id,
      type_id,
      entity_type,
      entity_id,
      is_public = false,
      status = 'active'
    } = req.body;

    const document = await Document.create({
      name,
      description,
      url,
      file_path,
      file_size,
      category_id,
      type_id,
      entity_type,
      entity_id,
      is_public,
      status,
      created_at: new Date(),
      updated_at: new Date()
    });

    const createdDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: DocumentCategory,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: DocumentType,
          as: 'type',
          attributes: ['id', 'name', 'extension']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdDocument,
      message: 'Document created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update document
exports.updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_at: new Date()
    };

    const document = await Document.findByPk(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    await document.update(updateData);

    const updatedDocument = await Document.findByPk(id, {
      include: [
        {
          model: DocumentCategory,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: DocumentType,
          as: 'type',
          attributes: ['id', 'name', 'extension']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Document updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete document (soft delete)
exports.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id);
    if (!document) {
      return next(new ErrorResponse('Document not found', 404));
    }

    // Check if already deleted
    if (document.status_id === 2) {
      return next(new ErrorResponse('Document is already deleted', 400));
    }

    // Soft delete by setting status_id to 2 (deleted)
    await document.update({
      status_id: 2,
      last_updated_on: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get document categories
exports.getDocumentCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const categories = await DocumentCategory.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: categories.rows,
      pagination: {
        total: categories.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(categories.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create document category
exports.createDocumentCategory = async (req, res, next) => {
  try {
    const { name, description, status = 'active' } = req.body;

    // Check if category already exists
    const existingCategory = await DocumentCategory.findOne({ where: { name } });
    if (existingCategory) {
      return next(new ErrorResponse('Document category with this name already exists', 400));
    }

    const category = await DocumentCategory.create({
      name,
      description,
      status,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Document category created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get document types
exports.getDocumentTypes = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { extension: { [Op.like]: `%${search}%` } }
      ];
    }

    const types = await DocumentType.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: types.rows,
      pagination: {
        total: types.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(types.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create document type
exports.createDocumentType = async (req, res, next) => {
  try {
    const { name, extension, mime_type, max_size, description, status = 'active' } = req.body;

    // Check if type already exists
    const existingType = await DocumentType.findOne({ 
      where: { 
        [Op.or]: [
          { name },
          { extension }
        ]
      } 
    });
    if (existingType) {
      return next(new ErrorResponse('Document type with this name or extension already exists', 400));
    }

    const type = await DocumentType.create({
      name,
      extension,
      mime_type,
      max_size,
      description,
      status,
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({
      success: true,
      data: type,
      message: 'Document type created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Bulk actions for documents
exports.bulkAction = async (req, res, next) => {
  try {
    const { action, ids } = req.body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorResponse('Action and IDs are required', 400));
    }

    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData.status = 'active';
        break;
      case 'deactivate':
        updateData.status = 'inactive';
        break;
      case 'make_public':
        updateData.is_public = true;
        break;
      case 'make_private':
        updateData.is_public = false;
        break;
      case 'delete':
        await Document.update(
          {
            status_id: 2,
            last_updated_on: new Date()
          },
          { where: { id: { [Op.in]: ids }, status_id: { [Op.ne]: 2 } } }
        );
        return res.status(200).json({
          success: true,
          message: `${ids.length} documents deleted successfully`
        });
      default:
        return next(new ErrorResponse('Invalid action', 400));
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date();
      
      await Document.update(updateData, {
        where: { id: { [Op.in]: ids } }
      });
    }

    res.status(200).json({
      success: true,
      message: `Bulk ${action} completed for ${ids.length} documents`
    });
  } catch (error) {
    next(error);
  }
};

// Get document statistics
exports.getDocumentStats = async (req, res, next) => {
  try {
    const [
      totalDocuments,
      publicDocuments,
      privateDocuments,
      totalSize,
      categoryStats,
      typeStats
    ] = await Promise.all([
      Document.count(),
      Document.count({ where: { is_public: true } }),
      Document.count({ where: { is_public: false } }),
      Document.sum('file_size') || 0,
      Document.findAll({
        include: [
          {
            model: DocumentCategory,
            as: 'category',
            attributes: ['name']
          }
        ],
        attributes: [
          'category_id',
          [Document.sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['category_id', 'category.id'],
        raw: false
      }),
      Document.findAll({
        include: [
          {
            model: DocumentType,
            as: 'type',
            attributes: ['name', 'extension']
          }
        ],
        attributes: [
          'type_id',
          [Document.sequelize.fn('COUNT', '*'), 'count'],
          [Document.sequelize.fn('SUM', Document.sequelize.col('file_size')), 'totalSize']
        ],
        group: ['type_id', 'type.id'],
        raw: false
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        publicDocuments,
        privateDocuments,
        totalSize,
        averageSize: totalDocuments > 0 ? Math.round(totalSize / totalDocuments) : 0,
        categoryStats,
        typeStats
      }
    });
  } catch (error) {
    next(error);
  }
};
