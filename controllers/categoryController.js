const { Category, Country, Document, ActiveStatus } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// Get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { status_id: { [Op.ne]: 2 } }, // Exclude deleted categories
          { status_id: { [Op.is]: null } } // Include categories with NULL status (treat as active)
        ]
      },
      include: [
        {
          model: Country,
          as: 'country'
        },
        {
          model: Document,
          as: 'coverImage'
        },
        {
          model: ActiveStatus,
          as: 'status'
        }
      ],
      order: [['priority', 'ASC'], ['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: categories.map(category => ({
        id: category.id.toString(),
        title: category.name,
        name: category.name,
        description: category.description,
        link: `/categories/${category.id}`,
        iconUrl: category.icon_url,
        image_url: category.coverImage ? category.coverImage.url : null,
        coverImageUrl: category.coverImage ? category.coverImage.url : null,
        coverImage: category.coverImage,
        priority: category.priority,
        status: category.status ? category.status.name : 'active',
        created_on: category.created_on,
        last_updated_on: category.last_updated_on,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories for admin (with pagination and search)
exports.getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, size = 20, search = '', sortBy = 'created_on', sortOrder = 'DESC' } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const whereClause = {
      [Op.or]: [
        { status_id: { [Op.ne]: 2 } }, // Exclude deleted categories
        { status_id: { [Op.is]: null } } // Include categories with NULL status (treat as active)
      ]
    };
    if (search) {
      whereClause[Op.and] = [
        {
          [Op.or]: [
            { status_id: { [Op.ne]: 2 } }, // Exclude deleted categories
            { status_id: { [Op.is]: null } } // Include categories with NULL status (treat as active)
          ]
        },
        {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ]
        }
      ];
    }

    const { count, rows: categories } = await Category.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Country,
          as: 'country'
        },
        {
          model: Document,
          as: 'coverImage'
        },
        {
          model: ActiveStatus,
          as: 'status'
        }
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    // Get article counts for each category
    const { Article } = require('../models');
    const categoryIds = categories.map(cat => cat.id);
    
    const articleCounts = await Article.findAll({
      attributes: [
        'category_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      where: {
        category_id: { [Op.in]: categoryIds },
        status_id: { [Op.ne]: 2 } // Exclude deleted articles
      },
      group: ['category_id'],
      raw: true
    });

    // Create a map of category_id to article count
    const articleCountMap = {};
    articleCounts.forEach(item => {
      articleCountMap[item.category_id] = parseInt(item.count) || 0;
    });

    res.status(200).json({
      success: true,
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image_url: category.coverImage ? category.coverImage.url : null,
        coverImage: category.coverImage,
        priority: category.priority,
        status: category.status ? category.status.name : 'active',
        created_on: category.created_on,
        last_updated_on: category.last_updated_on,
        articleCount: articleCountMap[category.id] || 0,
      })),
      totalCount: count,
      pagination: {
        page: parseInt(page),
        size: limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories for dropdown (no pagination)
exports.getAllCategoriesForDropdown = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { status_id: { [Op.ne]: 2 } }, // Exclude deleted categories
          { status_id: { [Op.is]: null } } // Include categories with NULL status (treat as active)
        ]
      },
      attributes: ['id', 'name', 'description', 'priority'],
      order: [['priority', 'ASC'], ['name', 'ASC']],
    });

    // Check for duplicate names and add ID suffix if needed
    const nameCount = {};
    categories.forEach(cat => {
      nameCount[cat.name] = (nameCount[cat.name] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: categories.map(category => {
        const hasMultiple = nameCount[category.name] > 1;
        const displayName = category.name || 'Unnamed Category';
        const label = hasMultiple ? `${displayName} (ID: ${category.id})` : displayName;
        
        return {
          id: category.id,
          name: category.name,
          value: category.id,
          label: label,
          description: category.description,
          priority: category.priority
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

// Search categories
exports.searchCategories = async (req, res, next) => {
  try {
    const { query, limit = 10 } = req.query;

    if (!query) {
      return next(new ErrorResponse('Query parameter is required', 400));
    }

    const categories = await Category.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { status_id: { [Op.ne]: 2 } }, // Exclude deleted categories
              { status_id: { [Op.is]: null } } // Include categories with NULL status (treat as active)
            ]
          },
          {
            [Op.or]: [
              { name: { [Op.like]: `%${query}%` } },
              { description: { [Op.like]: `%${query}%` } }
            ]
          }
        ]
      },
      include: [
        {
          model: Country,
          as: 'country'
        },
        {
          model: Document,
          as: 'coverImage'
        }
      ],
      order: [['priority', 'ASC']],
      limit: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: {
        query,
        results: categories.map(category => ({
          id: category.id.toString(),
          title: category.name,
          description: category.description,
          link: `/categories/${category.id}`,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Country,
          as: 'country'
        },
        {
          model: Document,
          as: 'coverImage'
        },
        {
          model: ActiveStatus,
          as: 'status'
        }
      ]
    });

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Create new category
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, priority, countryId, iconUrl } = req.body;
    let coverImageId = null;

    // Handle file upload if cover image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      const uploadResult = await uploadToS3(req.file, 'categories', req.user ? req.user.id : 1);

      const document = await Document.create({
        name: uploadResult.file_name,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: null,
      });

      coverImageId = document.id;
    }

    const category = await Category.create({
      name,
      description,
      priority: priority || 0,
      country_id: countryId,
      cover_image_id: coverImageId,
      icon_url: iconUrl,
      status_id: 1, // Assuming 1 is active status
      created_on: new Date(),
      last_updated_on: new Date(),
    });

    // Fetch the created category with associations to include image URL
    const createdCategory = await Category.findByPk(category.id, {
      include: [
        {
          model: require('../models').Document,
          as: 'coverImage',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        id: createdCategory.id,
        name: createdCategory.name,
        description: createdCategory.description,
        priority: createdCategory.priority,
        image_url: createdCategory.coverImage ? createdCategory.coverImage.url : null,
        coverImageUrl: createdCategory.coverImage ? createdCategory.coverImage.url : null,
        coverImage: createdCategory.coverImage,
        created_on: createdCategory.created_on,
        last_updated_on: createdCategory.last_updated_on,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update category
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    const { name, description, priority, countryId, iconUrl, statusId } = req.body;
    let coverImageId = category.cover_image_id;

    // Handle file upload if new cover image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      const uploadResult = await uploadToS3(req.file, 'categories', req.user ? req.user.id : 1);

      const document = await Document.create({
        name: uploadResult.file_name,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: null,
      });

      coverImageId = document.id;
    }

    await category.update({
      name: name || category.name,
      description: description || category.description,
      priority: priority !== undefined ? priority : category.priority,
      country_id: countryId || category.country_id,
      cover_image_id: coverImageId,
      icon_url: iconUrl || category.icon_url,
      status_id: statusId || category.status_id,
      last_updated_on: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (soft delete - sets status_id to 2)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }

    // Check if already deleted
    if (category.status_id === 2) {
      return next(new ErrorResponse('Category already deleted', 400));
    }

    // Soft delete by setting status_id to 2 (deleted)
    await category.update({
      status_id: 2,
      last_updated_on: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {
        id: category.id,
        status_id: 2
      }
    });
  } catch (error) {
    next(error);
  }
};
