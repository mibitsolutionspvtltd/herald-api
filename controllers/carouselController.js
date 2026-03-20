const { CarouselItems, ActiveStatus, Document } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// Get carousel items
exports.getCarouselItems = async (req, res, next) => {
  try {
    const carouselItems = await CarouselItems.findAll({
      where: { 
        status_id: { [Op.ne]: 2 } // Exclude deleted items
      },
      include: [
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'coverImage',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ],
      order: [['display_order', 'ASC']],
    });

    // Format response for frontend carousel component
    const formattedItems = carouselItems.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      imageUrl: item.coverImage ? item.coverImage.url : null,
      linkUrl: item.link_url,
      displayOrder: item.display_order,
      tag: item.tag || 'Featured',
    }));

    res.status(200).json({
      success: true,
      items: formattedItems, // Frontend expects 'items' array
      data: carouselItems, // Keep for backward compatibility
    });
  } catch (error) {
    next(error);
  }
};

// Get all carousel items (admin)
exports.getAllCarouselItems = async (req, res, next) => {
  try {
    const { page = 1, size = 10, sortBy = 'display_order', sortOrder = 'ASC' } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    const carouselItems = await CarouselItems.findAndCountAll({
      where: {
        status_id: { [Op.ne]: 2 } // Exclude deleted items
      },
      include: [
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'coverImage',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: carouselItems.rows.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        button_text: item.button_text,
        button_url: item.button_url,
        link_url: item.link_url,
        display_order: item.display_order,
        priority: item.priority,
        tag: item.tag,
        image_url: item.coverImage ? item.coverImage.url : null,
        coverImageUrl: item.coverImage ? item.coverImage.url : null,
        coverImage: item.coverImage,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
      pagination: {
        total: carouselItems.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(carouselItems.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get carousel item by ID
exports.getCarouselItemById = async (req, res, next) => {
  try {
    const carouselItem = await CarouselItems.findByPk(req.params.id, {
      include: [
        {
          model: ActiveStatus,
          as: 'status'
        },
        {
          model: Document,
          as: 'coverImage',
          attributes: ['id', 'name', 'url', 'uid']
        }
      ]
    });

    if (!carouselItem) {
      return next(new ErrorResponse('Carousel item not found', 404));
    }

    res.status(200).json({
      success: true,
      data: carouselItem,
    });
  } catch (error) {
    next(error);
  }
};

// Create new carousel item
exports.createCarouselItem = async (req, res, next) => {
  try {
    const { title, subtitle, description, buttonText, buttonUrl, priority, displayOrder, linkUrl, tag } = req.body;
    let coverImageId = null;

    console.log('📝 Creating carousel item...');
    console.log('Request body:', { title, subtitle, description, buttonText, buttonUrl });
    console.log('Has file:', !!req.file);

    // Handle file upload if cover image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      console.log('📤 Uploading to S3...');
      const uploadResult = await uploadToS3(req.file, 'carousel', req.user ? req.user.id : 1);
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

      coverImageId = document.id;
      console.log('✅ Document created with ID:', coverImageId);
    }

    const carouselItem = await CarouselItems.create({
      title,
      subtitle,
      description,
      button_text: buttonText,
      button_url: buttonUrl,
      priority: priority || 0,
      display_order: displayOrder || 0,
      link_url: linkUrl,
      tag: tag || 'general',
      status_id: 1,
      cover_image_id: coverImageId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log('✅ Carousel item created with ID:', carouselItem.id);

    // Fetch with associations
    const created = await CarouselItems.findByPk(carouselItem.id, {
      include: [{
        model: Document,
        as: 'coverImage',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        id: created.id,
        title: created.title,
        subtitle: created.subtitle,
        description: created.description,
        button_text: created.button_text,
        button_url: created.button_url,
        link_url: created.link_url,
        display_order: created.display_order,
        priority: created.priority,
        tag: created.tag,
        image_url: created.coverImage ? created.coverImage.url : null,
        coverImageUrl: created.coverImage ? created.coverImage.url : null,
        coverImage: created.coverImage,
        created_at: created.created_at,
        updated_at: created.updated_at,
      },
    });
  } catch (error) {
    console.error('❌ Error creating carousel:', error.message);
    console.error('Error details:', error);
    next(error);
  }
};

// Update carousel item
exports.updateCarouselItem = async (req, res, next) => {
  try {
    const carouselItem = await CarouselItems.findByPk(req.params.id, {
      include: [{
        model: require('../models').Document,
        as: 'coverImage',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    if (!carouselItem) {
      return next(new ErrorResponse('Carousel item not found', 404));
    }

    const { title, subtitle, description, buttonText, buttonUrl, priority, displayOrder, linkUrl, tag, statusId } = req.body;
    let coverImageId = carouselItem.cover_image_id;

    console.log('📝 Updating carousel item ID:', req.params.id);
    console.log('Request body:', { title, subtitle, description, buttonText, buttonUrl });
    console.log('Has new file:', !!req.file);

    // Handle file upload if new cover image is provided
    if (req.file) {
      const { Document } = require('../models');
      const { uploadToS3 } = require('../config/s3');

      console.log('📤 Uploading new image to S3...');
      const uploadResult = await uploadToS3(req.file, 'carousel', req.user ? req.user.id : 1);
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

      coverImageId = document.id;
      console.log('✅ Document created with ID:', coverImageId);
    }

    await carouselItem.update({
      title: title || carouselItem.title,
      subtitle: subtitle || carouselItem.subtitle,
      description: description || carouselItem.description,
      button_text: buttonText || carouselItem.button_text,
      button_url: buttonUrl || carouselItem.button_url,
      priority: priority !== undefined ? priority : carouselItem.priority,
      display_order: displayOrder !== undefined ? displayOrder : carouselItem.display_order,
      link_url: linkUrl || carouselItem.link_url,
      tag: tag || carouselItem.tag,
      status_id: statusId || carouselItem.status_id,
      cover_image_id: coverImageId,
      updated_at: new Date(),
    });

    console.log('✅ Carousel item updated');

    // Fetch updated item with associations
    const updated = await CarouselItems.findByPk(carouselItem.id, {
      include: [{
        model: Document,
        as: 'coverImage',
        attributes: ['id', 'name', 'url', 'uid']
      }]
    });

    res.status(200).json({
      success: true,
      data: updated || carouselItem,
    });
  } catch (error) {
    console.error('❌ Error updating carousel:', error.message);
    console.error('Error details:', error);
    next(error);
  }
};

// Delete carousel item (soft delete)
exports.deleteCarouselItem = async (req, res, next) => {
  try {
    const carouselItem = await CarouselItems.findByPk(req.params.id);

    if (!carouselItem) {
      return next(new ErrorResponse('Carousel item not found', 404));
    }

    // Check if already deleted
    if (carouselItem.status_id === 2) {
      return next(new ErrorResponse('Carousel item is already deleted', 400));
    }

    // Soft delete by setting status_id to 2 (deleted)
    await carouselItem.update({
      status_id: 2,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Carousel item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update display order (for drag-and-drop)
exports.updateDisplayOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return next(new ErrorResponse('Items array is required', 400));
    }

    console.log('📝 Updating display order for', items.length, 'items');

    // Update each item's display_order
    const updatePromises = items.map((item, index) => {
      return CarouselItems.update(
        { 
          display_order: index,
          updated_at: new Date()
        },
        { where: { id: item.id } }
      );
    });

    await Promise.all(updatePromises);

    console.log('✅ Display order updated successfully');

    res.status(200).json({
      success: true,
      message: 'Display order updated successfully',
    });
  } catch (error) {
    console.error('❌ Error updating display order:', error.message);
    next(error);
  }
};
