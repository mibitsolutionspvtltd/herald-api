const { Contacts } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { v4: uuidv4 } = require('uuid');

// Submit contact form
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return next(new ErrorResponse('Name, email, and message are required', 400));
    }

    const contact = await Contacts.create({
      id: uuidv4(),
      name,
      email,
      phone: phone || null,
      subject: 'General Inquiry',
      message,
      category: 'general',
      status: 'pending',
      priority: 'normal',
      source: 'website',
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contact.id,
        status: contact.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all contacts (admin)
exports.getAllContacts = async (req, res, next) => {
  try {
    const { page = 1, size = 10, sortBy = 'created_at', sortOrder = 'DESC', status, priority } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    if (priority) {
      whereClause.priority = priority;
    }

    const contacts = await Contacts.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: contacts.rows,
      pagination: {
        total: contacts.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(contacts.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get contact by ID
exports.getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.findByPk(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact not found', 404));
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Update contact status
exports.updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contacts.findByPk(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact not found', 404));
    }

    const { status, priority, notes, assignedTo } = req.body;

    // Validate status if provided
    const validStatuses = ['pending', 'in_progress', 'resolved', 'spam'];
    if (status && !validStatuses.includes(status)) {
      return next(new ErrorResponse(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }

    // Validate priority if provided
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return next(new ErrorResponse(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`, 400));
    }

    await contact.update({
      status: status || contact.status,
      priority: priority || contact.priority,
      notes: notes || contact.notes,
      assigned_to: assignedTo || contact.assigned_to,
      updated_at: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Delete contact (soft delete)
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contacts.findByPk(req.params.id);

    if (!contact) {
      return next(new ErrorResponse('Contact not found', 404));
    }

    // Check if already marked as spam (soft deleted)
    if (contact.status === 'spam') {
      // Already deleted - return success instead of error
      return res.status(200).json({
        success: true,
        message: 'Contact already deleted',
      });
    }

    // Soft delete by setting status to 'spam' (closest to deleted)
    await contact.update({
      status: 'spam',
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get contact statistics
exports.getContactStats = async (req, res, next) => {
  try {
    const totalContacts = await Contacts.count();
    const pendingContacts = await Contacts.count({ where: { status: 'pending' } });
    const resolvedContacts = await Contacts.count({ where: { status: 'resolved' } });
    const inProgressContacts = await Contacts.count({ where: { status: 'in_progress' } });

    res.status(200).json({
      success: true,
      data: {
        total: totalContacts,
        pending: pendingContacts,
        resolved: resolvedContacts,
        inProgress: inProgressContacts,
      },
    });
  } catch (error) {
    next(error);
  }
};
