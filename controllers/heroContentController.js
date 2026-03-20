const { HeroContent, Category, Country, Document, ActiveStatus } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// Get hero content
exports.getHeroContent = async (req, res, next) => {
  try {
    const { 'x-api-country': countryId } = req.headers;

    const heroContent = await HeroContent.findAll({
      where: { 
        active_status_id: { [Op.ne]: 2 }, // Exclude deleted content
        ...(countryId && { country_id: countryId })
      },
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: Country,
          as: 'country'
        },
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'image',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: heroContent,
    });
  } catch (error) {
    next(error);
  }
};

// Get all hero content (admin)
exports.getAllHeroContent = async (req, res, next) => {
  try {
    let { page = 1, size = 10, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);
    
    // Fix for old frontend cache sending 'created_on' instead of 'created_at'
    if (sortBy === 'created_on') {
      sortBy = 'created_at';
    }

    const heroContent = await HeroContent.findAndCountAll({
      where: {
        active_status_id: { [Op.ne]: 2 } // Exclude deleted content
      },
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: Country,
          as: 'country'
        },
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'image',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: heroContent.rows.map(item => ({
        id: item.id,
        title: item.title,
        heading: item.heading,
        subtitle: item.subtitle,
        description: item.description,
        link: item.link,
        link_url: item.link_url,
        date: item.date,
        image_url: item.image ? item.image.url : null,
        coverImageUrl: item.image ? item.image.url : null,
        image: item.image,
        category: item.category,
        country: item.country,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
      pagination: {
        total: heroContent.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(heroContent.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get hero content by ID
exports.getHeroContentById = async (req, res, next) => {
  try {
    const heroContent = await HeroContent.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: Country,
          as: 'country'
        },
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'image',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ]
    });

    if (!heroContent) {
      return next(new ErrorResponse('Hero content not found', 404));
    }

    res.status(200).json({
      success: true,
      data: heroContent,
    });
  } catch (error) {
    next(error);
  }
};

// Create new hero content
exports.createHeroContent = async (req, res, next) => {
  try {
    const { title, heading, subtitle, description, linkUrl, categoryId, countryId, date } = req.body;
    let imageId = null;

    console.log('📝 Creating hero content...');
    console.log('Request body:', { title, heading, subtitle, description, linkUrl });
    console.log('Has file:', !!req.file);

    // Handle file upload if image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      console.log('📤 Uploading to S3...');
      const uploadResult = await uploadToS3(req.file, 'hero-content', req.user ? req.user.id : 1);
      console.log('✅ S3 upload successful');

      const document = await Document.create({
        name: uploadResult.file_name,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: null,
      });

      imageId = document.id;
      console.log('✅ Document created with ID:', imageId);
    }

    const heroData = {
      title: title || 'Default Title',
      heading: heading || title || 'Default Heading',
      subtitle: subtitle || '',
      description: description || '',
      link: linkUrl || '#',
      link_url: linkUrl || '#',
      category_id: categoryId || null,
      country_id: countryId || null,
      image_id: imageId,
      active_status_id: 1,
      date: date ? new Date(date) : new Date(),
    };

    console.log('Creating hero content with data:', heroData);

    const heroContent = await HeroContent.create(heroData);
    console.log('✅ Hero content created with ID:', heroContent.id);

    // Fetch with associations
    const created = await HeroContent.findByPk(heroContent.id, {
      include: [{
        model: require('../models').Document,
        as: 'image',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        title: created.title,
        heading: created.heading,
        subtitle: created.subtitle,
        description: created.description,
        link: created.link,
        link_url: created.link_url,
        date: created.date,
        image_url: created.image ? created.image.url : null,
        coverImageUrl: created.image ? created.image.url : null,
        image: created.image,
        created_at: created.created_at,
        updated_at: created.updated_at,
      },
    });
  } catch (error) {
    console.error('❌ Error creating hero content:', error.message);
    console.error('Error details:', error);
    next(error);
  }
};

// Update hero content
exports.updateHeroContent = async (req, res, next) => {
  try {
    const heroContent = await HeroContent.findByPk(req.params.id, {
      include: [{
        model: require('../models').Document,
        as: 'image',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    if (!heroContent) {
      return next(new ErrorResponse('Hero content not found', 404));
    }

    const { title, heading, subtitle, description, linkUrl, categoryId, countryId, date, activeStatusId } = req.body;
    let imageId = heroContent.image_id;

    console.log('📝 Updating hero content ID:', req.params.id);
    console.log('Request body:', { title, heading, subtitle, description, linkUrl });
    console.log('Has new file:', !!req.file);

    // Handle file upload if new image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      console.log('📤 Uploading new image to S3...');
      const uploadResult = await uploadToS3(req.file, 'hero-content', req.user ? req.user.id : 1);
      console.log('✅ S3 upload successful');

      const document = await Document.create({
        name: uploadResult.file_name,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: null,
      });

      imageId = document.id;
      console.log('✅ Document created with ID:', imageId);
    }

    await heroContent.update({
      title: title || heroContent.title,
      heading: heading || heroContent.heading,
      subtitle: subtitle || heroContent.subtitle,
      description: description || heroContent.description,
      link: linkUrl || heroContent.link,
      link_url: linkUrl || heroContent.link_url,
      category_id: categoryId || heroContent.category_id,
      country_id: countryId || heroContent.country_id,
      image_id: imageId,
      active_status_id: activeStatusId || heroContent.active_status_id,
      date: date ? new Date(date) : heroContent.date,
      updated_at: new Date(),
    });

    console.log('✅ Hero content updated');

    // Fetch updated item with associations
    const updated = await HeroContent.findByPk(heroContent.id, {
      include: [{
        model: require('../models').Document,
        as: 'image',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    res.status(200).json({
      success: true,
      data: updated || heroContent,
    });
  } catch (error) {
    console.error('❌ Error updating hero content:', error.message);
    console.error('Error details:', error);
    next(error);
  }
};

// Delete hero content (soft delete)
exports.deleteHeroContent = async (req, res, next) => {
  try {
    const heroContent = await HeroContent.findByPk(req.params.id);

    if (!heroContent) {
      return next(new ErrorResponse('Hero content not found', 404));
    }

    // Check if already deleted
    if (heroContent.active_status_id === 2) {
      return next(new ErrorResponse('Hero content is already deleted', 400));
    }

    // Soft delete by setting active_status_id to 2 (deleted)
    await heroContent.update({
      active_status_id: 2,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Hero content deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
