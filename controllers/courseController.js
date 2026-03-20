const { Courses, Category, Universities, Country, ActiveStatus, Operator } = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all courses (public)
exports.getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, level, status = 'published', university } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      whereClause.category_id = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (university) {
      whereClause.university_id = university;
    }

    const courses = await Courses.findAndCountAll({
      where: whereClause,
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
        },
        {
          model: Universities,
          as: 'university',
          required: false,
          attributes: ['id', 'name', 'country', 'state', 'city']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: courses.rows,
      pagination: {
        total: courses.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(courses.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all courses (admin)
exports.getAllCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, level, status, university, withRelationships = 'true' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      whereClause.category_id = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (status) {
      whereClause.status = status;
    }

    if (university) {
      whereClause.university_id = university;
    }

    const includeOptions = [];

    if (withRelationships === 'true') {
      includeOptions.push(
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
              attributes: ['id', 'name', 'iso_code', 'currency_code']
            },
            {
              model: ActiveStatus,
              as: 'status',
              required: false,
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: Universities,
          as: 'university',
          required: false,
          attributes: ['id', 'name', 'country', 'state', 'city']
        },
        {
          model: Operator,
          as: 'creator',
          required: false,
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      );
    }

    const courses = await Courses.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      distinct: true
    });

    res.status(200).json({
      success: true,
      data: courses.rows,
      pagination: {
        total: courses.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(courses.count / limit)
      }
    });
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { withRelationships = 'true' } = req.query;

    const includeOptions = [];

    if (withRelationships === 'true') {
      includeOptions.push(
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
        },
        {
          model: Universities,
          as: 'university',
          required: false,
          attributes: ['id', 'name', 'country', 'state', 'city', 'students_capacity', 'numbers_of_faculty']
        },
        {
          model: Operator,
          as: 'creator',
          required: false,
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      );
    }

    const course = await Courses.findByPk(id, {
      include: includeOptions
    });

    if (!course) {
      return next(new ErrorResponse('Course not found', 404));
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// Create course
exports.createCourse = async (req, res, next) => {
  try {
    const {
      title, description, content, instructor, duration,
      level = 'beginner', price = 0, currency = 'USD',
      category_id, university_id, status = 'draft',
      is_featured = false, is_trending = false, is_popular = false
    } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Course title is required',
        error: 'Title field cannot be empty'
      });
    }

    // Validate level
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (level && !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course level',
        error: `Level must be one of: ${validLevels.join(', ')}`
      });
    }

    // Validate status
    const validStatuses = ['draft', 'published', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course status',
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid price',
        error: 'Price must be a positive number'
      });
    }

    // Validate category if provided
    if (category_id) {
      const categoryExists = await Category.findByPk(category_id);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category',
          error: `Category with ID ${category_id} does not exist`
        });
      }
    }

    // Validate university if provided
    if (university_id) {
      const universityExists = await Universities.findByPk(university_id);
      if (!universityExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid university',
          error: `University with ID ${university_id} does not exist`
        });
      }
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now()}`;

    // Handle image upload
    let thumbnail_url = null;
    let thumbnail_key = null;
    if (req.file) {
      try {
        const { uploadToS3 } = require('../config/s3');
        const uploadResult = await uploadToS3(req.file, 'courses', req.user ? req.user.id : 1);
        thumbnail_url = uploadResult.file_url;
        thumbnail_key = uploadResult.file_key;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload course image',
          error: uploadError.message
        });
      }
    }

    const course = await Courses.create({
      title: title.trim(),
      slug,
      description: description ? description.trim() : null,
      content: content || null,
      instructor: instructor ? instructor.trim() : null,
      duration: duration ? duration.trim() : null,
      level,
      price: parsedPrice,
      currency,
      thumbnail_url,
      thumbnail_key,
      category_id: category_id || null,
      university_id: university_id || null,
      status,
      is_featured: is_featured === true || is_featured === 'true',
      is_trending: is_trending === true || is_trending === 'true',
      is_popular: is_popular === true || is_popular === 'true',
      enrollment_count: 0,
      rating: 0.00
      // created_by intentionally omitted - foreign key constraint references admin_users table
      // which doesn't exist. Database admin needs to fix or remove this constraint.
    });

    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);

    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: validationErrors
      });
    }

    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry',
        error: 'A course with this information already exists'
      });
    }

    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference',
        error: 'Referenced category or university does not exist'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update course
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title, description, content, instructor, duration, level,
      price, currency, category_id, university_id, status,
      is_featured, is_trending, is_popular
    } = req.body;

    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (instructor !== undefined) updateData.instructor = instructor;
    if (duration !== undefined) updateData.duration = duration;
    if (level !== undefined) updateData.level = level;
    if (price !== undefined) updateData.price = parseFloat(price) || 0;
    if (currency !== undefined) updateData.currency = currency;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (university_id !== undefined) updateData.university_id = university_id;
    if (status !== undefined) updateData.status = status;
    if (is_featured !== undefined) updateData.is_featured = is_featured === true || is_featured === 'true';
    if (is_trending !== undefined) updateData.is_trending = is_trending === true || is_trending === 'true';
    if (is_popular !== undefined) updateData.is_popular = is_popular === true || is_popular === 'true';

    // Handle image upload
    if (req.file) {
      const { uploadToS3 } = require('../config/s3');
      const uploadResult = await uploadToS3(req.file, 'courses', req.user ? req.user.id : 1);
      updateData.thumbnail_url = uploadResult.file_url;
      updateData.thumbnail_key = uploadResult.file_key;
    }

    await course.update(updateData);

    res.status(200).json({ success: true, data: course, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Error updating course', error: error.message });
  }
};

// Delete course (soft delete by setting status to 'archived')
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Courses.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already deleted
    if (course.status === 'archived') {
      return res.status(400).json({ success: false, message: 'Course already deleted' });
    }

    // Soft delete by setting status to 'archived'
    await course.update({
      status: 'archived',
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: { id: course.id, status: 'archived' }
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

    let updateData = {};

    switch (action) {
      case 'activate':
        updateData.status = 'active';
        break;
      case 'deactivate':
        updateData.status = 'inactive';
        break;
      case 'delete':
        await Courses.update(
          {
            status_id: 2,
            updated_at: new Date()
          },
          { where: { id: { [Op.in]: ids }, status_id: { [Op.ne]: 2 } } }
        );
        return res.status(200).json({
          success: true,
          message: `${ids.length} courses deleted successfully`
        });
      default:
        return next(new ErrorResponse('Invalid action', 400));
    }

    if (Object.keys(updateData).length > 0) {
      updateData.last_updated_on = new Date();

      await Courses.update(updateData, {
        where: { id: { [Op.in]: ids } }
      });
    }

    res.status(200).json({
      success: true,
      message: `Bulk ${action} completed for ${ids.length} courses`
    });
  } catch (error) {
    next(error);
  }
};
