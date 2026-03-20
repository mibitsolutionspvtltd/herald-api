const { Advertisement, AdvertisementType, AdvertisementFormat, ActiveStatus, Operator } = require('../models');
const { Op } = require('sequelize');
const { uploadToS3 } = require('../config/s3');

// Get all advertisements
exports.getAllAdvertisements = async (req, res) => {
  try {
    const { page = 1, size = 20, slot, type_id, isActive, status_id } = req.query;
    const offset = (page - 1) * size;

    const where = {};
    if (slot) where.slot = slot;
    if (type_id) where.type_id = type_id;
    if (isActive !== undefined) where.is_active = isActive === 'true';
    if (status_id) {
      where.status_id = status_id;
    } else {
      where.status_id = { [Op.ne]: 2 }; // Default: exclude deleted
    }

    const includeOptions = [];
    
    // Add includes only if models exist
    if (AdvertisementType) {
      includeOptions.push({
        model: AdvertisementType,
        as: 'advertisementType',
        required: false,
        attributes: ['id', 'name', 'description'],
      });
    }
    
    if (AdvertisementFormat) {
      includeOptions.push({
        model: AdvertisementFormat,
        as: 'advertisementFormat',
        required: false,
        attributes: ['id', 'name', 'width', 'height', 'description'],
      });
    }
    
    if (ActiveStatus) {
      includeOptions.push({
        model: ActiveStatus,
        as: 'status',
        required: false
      });
    }

    const { count, rows } = await Advertisement.findAndCountAll({
      where,
      include: includeOptions,
      limit: parseInt(size),
      offset,
      order: [['priority', 'DESC'], ['created_on', 'DESC']],
      distinct: true
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        size: parseInt(size),
        totalPages: Math.ceil(count / size),
      },
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch advertisements',
      error: error.message 
    });
  }
};

// Get advertisement by ID
exports.getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const includeOptions = [];
    
    if (AdvertisementType) {
      includeOptions.push({
        model: AdvertisementType,
        as: 'advertisementType',
        required: false,
        attributes: ['id', 'name', 'description'],
      });
    }
    
    if (AdvertisementFormat) {
      includeOptions.push({
        model: AdvertisementFormat,
        as: 'advertisementFormat',
        required: false,
        attributes: ['id', 'name', 'width', 'height', 'description'],
      });
    }
    
    if (ActiveStatus) {
      includeOptions.push({
        model: ActiveStatus,
        as: 'status',
        required: false
      });
    }
    
    if (Operator) {
      includeOptions.push({
        model: Operator,
        as: 'creator',
        required: false,
        attributes: ['id', 'first_name', 'last_name']
      });
    }
    
    const ad = await Advertisement.findByPk(id, {
      include: includeOptions
    });

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch advertisement',
      error: error.message 
    });
  }
};

// Get active ads for a specific slot
exports.getAdsBySlot = async (req, res) => {
  try {
    const { slot } = req.params;
    const { page, category } = req.query;
    const now = new Date();

    const where = {
      slot,
      status_id: 1, // Must be active
      [Op.or]: [
        { start_date: null },
        { start_date: { [Op.lte]: now } },
      ],
      [Op.or]: [
        { end_date: null },
        { end_date: { [Op.gte]: now } },
      ],
    };

    const ads = await Advertisement.findAll({
      where,
      order: [['priority', 'DESC']],
      limit: 5,
    });

    // Filter by page or category if specified
    let filteredAds = ads;
    if (page) {
      filteredAds = ads.filter(ad => {
        const targetPages = ad.target_pages || [];
        return targetPages.length === 0 || targetPages.includes(page);
      });
    }
    if (category) {
      filteredAds = filteredAds.filter(ad => {
        const targetCategories = ad.target_categories || [];
        return targetCategories.length === 0 || targetCategories.includes(parseInt(category));
      });
    }

    res.json({ success: true, data: filteredAds });
  } catch (error) {
    console.error('Error fetching ads by slot:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ads' });
  }
};

// Helper function to upload base64 image to S3
const uploadBase64ToS3 = async (base64String, userId) => {
  try {
    // Extract mime type and base64 data
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine file extension from mime type
    const ext = mimeType.split('/')[1] || 'jpg';
    const fileName = `ad-${Date.now()}.${ext}`;

    // Create a file object compatible with uploadToS3
    const fileObject = {
      buffer,
      mimetype: mimeType,
      originalname: fileName,
      size: buffer.length
    };

    // Upload to S3 in 'advertisements' folder
    const uploadResult = await uploadToS3(fileObject, 'advertisements', userId || 1);
    return uploadResult.file_url;
  } catch (error) {
    console.error('Error uploading base64 to S3:', error);
    throw error;
  }
};

// Create advertisement
exports.createAdvertisement = async (req, res) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.slot) {
      return res.status(400).json({
        success: false,
        message: 'Name and slot are required'
      });
    }

    // Handle base64 image if provided - upload to S3
    let imageUrl = body.imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      console.log('Base64 image detected, uploading to S3...');
      try {
        imageUrl = await uploadBase64ToS3(imageUrl, req.user?.id);
        console.log('Successfully uploaded to S3:', imageUrl);
      } catch (uploadError) {
        console.error('Failed to upload base64 image to S3:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }
    }

    const ad = await Advertisement.create({
      name: body.name,
      slot: body.slot,
      type_id: body.type_id || 1,
      format_id: body.format_id || 3,
      image_url: imageUrl || null,
      target_url: body.targetUrl || null,
      html_content: body.htmlContent || null,
      adsense_slot_id: body.adsenseSlotId || null,
      start_date: body.startDate || null,
      end_date: body.endDate || null,
      is_active: body.isActive !== false,
      priority: body.priority || 0,
      status_id: body.status_id || 1,
      target_pages: body.targetPages || [],
      target_categories: body.targetCategories || [],
      created_by: req.user?.id || null,
      created_on: new Date(),
      last_updated_on: new Date()
    });

    // Fetch the created ad with relationships
    const includeOptions = [];
    
    if (AdvertisementType) {
      includeOptions.push({
        model: AdvertisementType,
        as: 'advertisementType',
        required: false,
        attributes: ['id', 'name', 'description'],
      });
    }
    
    if (AdvertisementFormat) {
      includeOptions.push({
        model: AdvertisementFormat,
        as: 'advertisementFormat',
        required: false,
        attributes: ['id', 'name', 'width', 'height', 'description'],
      });
    }
    
    const createdAd = await Advertisement.findByPk(ad.id, {
      include: includeOptions
    });

    res.status(201).json({ success: true, data: createdAd, message: 'Advertisement created successfully' });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create advertisement',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update advertisement
exports.updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const ad = await Advertisement.findByPk(id);

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    // Handle base64 image if provided - upload to S3
    let imageUrl = body.imageUrl;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      console.log('Base64 image detected in update, uploading to S3...');
      try {
        imageUrl = await uploadBase64ToS3(imageUrl, req.user?.id);
        console.log('Successfully uploaded to S3:', imageUrl);
      } catch (uploadError) {
        console.error('Failed to upload base64 image to S3:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload image',
          error: uploadError.message
        });
      }
    }

    const updateData = {
      last_updated_on: new Date()
    };

    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slot !== undefined) updateData.slot = body.slot;
    if (body.type_id !== undefined) updateData.type_id = body.type_id;
    if (body.format_id !== undefined) updateData.format_id = body.format_id;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (body.targetUrl !== undefined) updateData.target_url = body.targetUrl;
    if (body.htmlContent !== undefined) updateData.html_content = body.htmlContent;
    if (body.adsenseSlotId !== undefined) updateData.adsense_slot_id = body.adsenseSlotId;
    if (body.startDate !== undefined) updateData.start_date = body.startDate;
    if (body.endDate !== undefined) updateData.end_date = body.endDate;
    if (body.isActive !== undefined) updateData.is_active = body.isActive;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.targetPages !== undefined) updateData.target_pages = body.targetPages;
    if (body.targetCategories !== undefined) updateData.target_categories = body.targetCategories;

    await ad.update(updateData);

    // Fetch updated ad with relationships
    const includeOptions = [];
    
    if (AdvertisementType) {
      includeOptions.push({
        model: AdvertisementType,
        as: 'advertisementType',
        required: false,
        attributes: ['id', 'name', 'description'],
      });
    }
    
    if (AdvertisementFormat) {
      includeOptions.push({
        model: AdvertisementFormat,
        as: 'advertisementFormat',
        required: false,
        attributes: ['id', 'name', 'width', 'height', 'description'],
      });
    }
    
    const updatedAd = await Advertisement.findByPk(id, {
      include: includeOptions
    });

    res.json({ success: true, data: updatedAd, message: 'Advertisement updated successfully' });
  } catch (error) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update advertisement',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete advertisement (soft delete)
exports.deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    // Soft delete
    await ad.update({ status_id: 2, is_active: false, deleted_at: new Date() });
    res.json({ success: true, message: 'Advertisement deleted successfully' });
  } catch (error) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ success: false, message: 'Failed to delete advertisement' });
  }
};

// Track ad impression
exports.trackImpression = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);

    if (ad) {
      await ad.increment('impressions');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking impression:', error);
    res.status(500).json({ success: false });
  }
};

// Track ad click
exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);

    if (ad) {
      await ad.increment('clicks');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ success: false });
  }
};

// Get ad statistics
exports.getAdStats = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findByPk(id);

    if (!ad) {
      return res.status(404).json({ success: false, message: 'Advertisement not found' });
    }

    const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        impressions: ad.impressions,
        clicks: ad.clicks,
        ctr: `${ctr}%`,
      },
    });
  } catch (error) {
    console.error('Error fetching ad stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ad statistics' });
  }
};

// Upload image endpoint - handles direct file upload
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload file to S3
    const uploadResult = await uploadToS3(req.file, 'advertisements', req.user?.id || 1);

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: uploadResult.file_url,
        fileName: uploadResult.file_name,
        fileSize: uploadResult.file_size,
        mimeType: uploadResult.mime_type
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};
