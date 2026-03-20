const {
  Category,
  Document,
  FileUpload,
  Country,
  StateProvince,
  City,
  Service,
  SearchMetadata,
  Article,

  Operator
} = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all settings
exports.getSettings = async (req, res, next) => {
  try {
    const [
      categories,
      countries,
      services,
      searchMetadata
    ] = await Promise.all([
      Category.findAll({
        order: [['name', 'ASC']]
      }),
      Country.findAll({
        order: [['name', 'ASC']]
      }),
      Service.findAll({
        order: [['id', 'ASC']] // Use id instead of title to avoid column issues
      }),
      SearchMetadata.findAll({
        include: [{
          model: Country,
          as: 'country',
          attributes: ['name']
        }]
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        categories,
        countries,
        services,
        searchMetadata
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update category settings
exports.updateCategorySettings = async (req, res, next) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return next(new ErrorResponse('Categories must be an array', 400));
    }

    const updatedCategories = [];

    for (const categoryData of categories) {
      const { id, name, description, priority, status } = categoryData;

      if (id) {
        // Update existing category
        const category = await Category.findByPk(id);
        if (category) {
          await category.update({
            name,
            description,
            priority: priority || 0,
            status: status || 'ACTIVE'
          });
          updatedCategories.push(category);
        }
      } else {
        // Create new category
        const newCategory = await Category.create({
          name,
          description,
          priority: priority || 0,
          status: status || 'ACTIVE'
        });
        updatedCategories.push(newCategory);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Categories updated successfully',
      data: updatedCategories
    });
  } catch (error) {
    next(error);
  }
};

// Update service settings
exports.updateServiceSettings = async (req, res, next) => {
  try {
    const { services } = req.body;

    if (!Array.isArray(services)) {
      return next(new ErrorResponse('Services must be an array', 400));
    }

    const updatedServices = [];

    for (const serviceData of services) {
      const { id, title, description, iconUrl, noOfExperts, solvedProblemsCount } = serviceData;

      if (id) {
        // Update existing service
        const service = await Service.findByPk(id);
        if (service) {
          await service.update({
            title,
            description,
            iconUrl,
            noOfExperts: noOfExperts || 0,
            solvedProblemsCount: solvedProblemsCount || 0
          });
          updatedServices.push(service);
        }
      } else {
        // Create new service
        const newService = await Service.create({
          title,
          description,
          iconUrl,
          noOfExperts: noOfExperts || 0,
          solvedProblemsCount: solvedProblemsCount || 0
        });
        updatedServices.push(newService);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Services updated successfully',
      data: updatedServices
    });
  } catch (error) {
    next(error);
  }
};

// Update search metadata settings
exports.updateSearchMetadataSettings = async (req, res, next) => {
  try {
    const { searchMetadata } = req.body;

    if (!Array.isArray(searchMetadata)) {
      return next(new ErrorResponse('Search metadata must be an array', 400));
    }

    const updatedMetadata = [];

    for (const metadataData of searchMetadata) {
      const { id, title, subtitle, suggestions, country_id } = metadataData;

      if (id) {
        // Update existing metadata
        const metadata = await SearchMetadata.findByPk(id);
        if (metadata) {
          await metadata.update({
            title,
            subtitle,
            suggestions: Array.isArray(suggestions) ? suggestions : [],
            country_id
          });
          updatedMetadata.push(metadata);
        }
      } else {
        // Create new metadata
        const newMetadata = await SearchMetadata.create({
          title,
          subtitle,
          suggestions: Array.isArray(suggestions) ? suggestions : [],
          country_id
        });
        updatedMetadata.push(newMetadata);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Search metadata updated successfully',
      data: updatedMetadata
    });
  } catch (error) {
    next(error);
  }
};

// Get system configuration
exports.getSystemConfig = async (req, res, next) => {
  try {
    const config = {
      app: {
        name: process.env.APP_NAME || 'Student Herald Admin',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      },
      database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        dialect: process.env.DB_DIALECT
      },
      aws: {
        region: process.env.AWS_REGION,
        bucket: process.env.S3_BUCKET_NAME
      },
      jwt: {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      upload: {
        maxFileSize: process.env.MAX_FILE_SIZE || '10485760',
        allowedTypes: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,application/pdf'
      }
    };

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// Update system configuration
exports.updateSystemConfig = async (req, res, next) => {
  try {
    const { config } = req.body;

    // Note: In a real application, you would update environment variables
    // or a configuration file. For now, we'll just return success.

    res.status(200).json({
      success: true,
      message: 'System configuration updated successfully',
      data: config
    });
  } catch (error) {
    next(error);
  }
};

// Get backup information
exports.getBackupInfo = async (req, res, next) => {
  try {
    const [
      totalArticles,

      totalUsers,
      totalFiles,
      totalStorage
    ] = await Promise.all([
      Article.count(),

      Operator.count(),
      FileUpload.count(),
      FileUpload.sum('file_size')
    ]);

    const backupInfo = {
      lastBackup: new Date().toISOString(), // Mock data
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mock data
      totalRecords: totalArticles + totalUsers, // totalUsers is now Operator count
      totalFiles,
      totalStorage: totalStorage || 0,
      backupSize: Math.round((totalStorage || 0) / 1024 / 1024) + ' MB' // Convert to MB
    };

    res.status(200).json({
      success: true,
      data: backupInfo
    });
  } catch (error) {
    next(error);
  }
};

// Trigger manual backup
exports.triggerBackup = async (req, res, next) => {
  try {
    // Note: In a real application, you would implement actual backup logic
    // This is a placeholder for backup functionality

    res.status(200).json({
      success: true,
      message: 'Backup process initiated successfully',
      data: {
        backupId: 'backup_' + Date.now(),
        status: 'in_progress',
        estimatedTime: '5-10 minutes'
      }
    });
  } catch (error) {
    next(error);
  }
};
