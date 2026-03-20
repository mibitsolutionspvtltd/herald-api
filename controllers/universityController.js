const { Universities, Courses, Category, Country, ActiveStatus } = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all universities (public)
exports.getUniversities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, location, country, category } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      // Exclude soft-deleted universities (those with [DELETED] prefix)
      name: { [Op.notLike]: '[DELETED]%' }
    };
    const courseWhere = {};
    const categoryWhere = {};

    if (search) {
      whereClause[Op.and] = [
        { name: { [Op.notLike]: '[DELETED]%' } },
        {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ]
        }
      ];
    }

    if (location) {
      if (!whereClause[Op.and]) {
        whereClause[Op.and] = [{ name: { [Op.notLike]: '[DELETED]%' } }];
      }
      whereClause[Op.and].push({
        [Op.or]: [
          { country: { [Op.like]: `%${location}%` } },
          { state: { [Op.like]: `%${location}%` } },
          { city: { [Op.like]: `%${location}%` } }
        ]
      });
    }

    if (country) {
      whereClause.country = { [Op.like]: `%${country}%` };
    }

    if (category) {
      courseWhere.category_id = category;
    }

    const universities = await Universities.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Courses,
          as: 'courses',
          where: Object.keys(courseWhere).length > 0 ? courseWhere : undefined,
          required: false,
          attributes: ['id', 'title', 'slug', 'price', 'currency', 'level', 'rating', 'enrollment_count', 'is_featured', 'is_trending', 'thumbnail_url'],
          include: [
            {
              model: Category,
              as: 'category',
              where: Object.keys(categoryWhere).length > 0 ? categoryWhere : undefined,
              required: false,
              attributes: ['id', 'name', 'description', 'icon_url'],
              include: [
                {
                  model: Country,
                  as: 'country',
                  required: false,
                  attributes: ['id', 'name', 'iso_code', 'currency_code', 'currency_symbol']
                },
                {
                  model: ActiveStatus,
                  as: 'status',
                  required: false,
                  attributes: ['id', 'name']
                }
              ]
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: universities.rows,
      pagination: {
        total: universities.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(universities.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all universities (admin)
exports.getAllUniversities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, country, withCourses } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      // Exclude soft-deleted universities (those with [DELETED] prefix)
      name: { [Op.notLike]: '[DELETED]%' }
    };

    if (search) {
      whereClause[Op.and] = [
        { name: { [Op.notLike]: '[DELETED]%' } },
        {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { country: { [Op.like]: `%${search}%` } },
            { state: { [Op.like]: `%${search}%` } },
            { city: { [Op.like]: `%${search}%` } }
          ]
        }
      ];
    }

    if (country) {
      whereClause.country = { [Op.like]: `%${country}%` };
    }

    const includeOptions = [];
    
    if (withCourses === 'true') {
      includeOptions.push({
        model: Courses,
        as: 'courses',
        required: false,
        attributes: ['id', 'title', 'slug', 'status', 'category_id'],
        include: [
          {
            model: Category,
            as: 'category',
            required: false,
            attributes: ['id', 'name']
          }
        ]
      });
    }

    const universities = await Universities.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: universities.rows,
      pagination: {
        total: universities.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(universities.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get university by ID
exports.getUniversityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { includeCourses = 'true' } = req.query;

    const includeOptions = [];

    if (includeCourses === 'true') {
      includeOptions.push({
        model: Courses,
        as: 'courses',
        required: false,
        attributes: ['id', 'title', 'slug', 'description', 'price', 'currency', 'level', 'rating', 'enrollment_count', 'status', 'thumbnail_url', 'instructor', 'duration'],
        include: [
          {
            model: Category,
            as: 'category',
            required: false,
            attributes: ['id', 'name', 'description', 'icon_url'],
            include: [
              {
                model: Country,
                as: 'country',
                required: false,
                attributes: ['id', 'name', 'iso_code', 'currency_code', 'currency_symbol']
              },
              {
                model: ActiveStatus,
                as: 'status',
                required: false,
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
    }

    const university = await Universities.findByPk(id, {
      include: includeOptions
    });

    if (!university) {
      return next(new ErrorResponse('University not found', 404));
    }

    res.status(200).json({
      success: true,
      data: university
    });
  } catch (error) {
    next(error);
  }
};

// Create university
exports.createUniversity = async (req, res, next) => {
  try {
    const {
      name, description, established_on, students_capacity,
      numbers_of_faculty, country, state, city, zip_code
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ success: false, message: 'University name is required' });
    }

    const university = await Universities.create({
      name,
      description,
      established_on: established_on || null,
      students_capacity: students_capacity || null,
      numbers_of_faculty: numbers_of_faculty || null,
      country,
      state,
      city,
      zip_code: zip_code || null
    });

    res.status(201).json({ success: true, data: university, message: 'University created successfully' });
  } catch (error) {
    next(error);
  }
};

// Update university
exports.updateUniversity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const university = await Universities.findByPk(id);
    if (!university) {
      return next(new ErrorResponse('University not found', 404));
    }

    // Only update fields that exist in the database
    const updateData = {};
    const allowedFields = ['name', 'description', 'established_on', 'students_capacity', 
                          'numbers_of_faculty', 'country', 'state', 'city', 'zip_code'];
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    await university.update(updateData);

    res.status(200).json({ success: true, data: university, message: 'University updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete university (soft delete)
exports.deleteUniversity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const university = await Universities.findByPk(id);
    if (!university) {
      return next(new ErrorResponse('University not found', 404));
    }

    // Soft delete: Mark as deleted by prefixing name with [DELETED]
    // Since universities table has no status_id field and we don't have ALTER permissions
    if (university.name.startsWith('[DELETED]')) {
      return next(new ErrorResponse('University already deleted', 400));
    }

    await university.update({
      name: `[DELETED] ${university.name}`,
      description: `[DELETED] ${university.description}`
    });

    res.status(200).json({
      success: true,
      message: 'University deleted successfully',
      data: { id: parseInt(id) }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk actions
exports.bulkAction = async (req, res, next) => {
  try {
    const { action, ids } = req.body;

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorResponse('Action and IDs are required', 400));
    }

    switch (action) {
      case 'delete':
        // Soft delete: Mark as deleted by prefixing name with [DELETED]
        // Since universities table has no status_id field and we don't have ALTER/DELETE permissions
        const universities = await Universities.findAll({
          where: { id: { [Op.in]: ids } }
        });

        for (const university of universities) {
          if (!university.name.startsWith('[DELETED]')) {
            await university.update({
              name: `[DELETED] ${university.name}`,
              description: `[DELETED] ${university.description}`
            });
          }
        }

        return res.status(200).json({
          success: true,
          message: `${ids.length} universities deleted successfully`
        });
      default:
        return next(new ErrorResponse('Invalid action. Only delete is supported.', 400));
    }
  } catch (error) {
    next(error);
  }
};
