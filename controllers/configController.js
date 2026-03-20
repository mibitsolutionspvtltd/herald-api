const { ConfigOptionType, ConfigOption, NavigationMenu } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all configuration options grouped by type
 * @route   GET /api/admin/config/options
 * @access  Private
 */
exports.getAllOptions = async (req, res, next) => {
  try {
    const optionTypes = await ConfigOptionType.findAll({
      where: { is_active: true },
      include: [{
        model: ConfigOption,
        as: 'options',
        where: { is_active: true },
        required: false,
        attributes: ['id', 'value', 'label', 'variant', 'icon', 'display_order', 'metadata']
      }],
      order: [
        ['type_key', 'ASC'],
        [{ model: ConfigOption, as: 'options' }, 'display_order', 'ASC']
      ]
    });

    // Transform to frontend-friendly format
    const options = {};
    optionTypes.forEach(type => {
      options[type.type_key] = type.options.map(opt => ({
        value: opt.value,
        label: opt.label,
        variant: opt.variant,
        icon: opt.icon,
        ...(opt.metadata && { metadata: opt.metadata })
      }));
    });

    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Get all options error:', error);
    next(new ErrorResponse('Failed to fetch configuration options', 500));
  }
};

/**
 * @desc    Get options by type
 * @route   GET /api/admin/config/options/:typeKey
 * @access  Private
 */
exports.getOptionsByType = async (req, res, next) => {
  try {
    const { typeKey } = req.params;

    const optionType = await ConfigOptionType.findOne({
      where: { type_key: typeKey, is_active: true },
      include: [{
        model: ConfigOption,
        as: 'options',
        where: { is_active: true },
        required: false,
        attributes: ['id', 'value', 'label', 'variant', 'icon', 'display_order', 'metadata']
      }],
      order: [[{ model: ConfigOption, as: 'options' }, 'display_order', 'ASC']]
    });

    if (!optionType) {
      return next(new ErrorResponse(`Option type '${typeKey}' not found`, 404));
    }

    const options = optionType.options.map(opt => ({
      value: opt.value,
      label: opt.label,
      variant: opt.variant,
      icon: opt.icon,
      ...(opt.metadata && { metadata: opt.metadata })
    }));

    res.json({
      success: true,
      data: {
        type: typeKey,
        options
      }
    });
  } catch (error) {
    console.error('Get options by type error:', error);
    next(new ErrorResponse('Failed to fetch options', 500));
  }
};

/**
 * @desc    Get navigation menu
 * @route   GET /api/admin/config/navigation
 * @access  Private
 */
exports.getNavigation = async (req, res, next) => {
  try {
    const menuItems = await NavigationMenu.findAll({
      where: { is_active: true, parent_id: null },
      include: [{
        model: NavigationMenu,
        as: 'children',
        where: { is_active: true },
        required: false,
        attributes: ['id', 'name', 'path', 'icon', 'display_order', 'required_permissions', 'required_roles']
      }],
      attributes: ['id', 'name', 'path', 'icon', 'display_order', 'required_permissions', 'required_roles'],
      order: [
        ['display_order', 'ASC'],
        [{ model: NavigationMenu, as: 'children' }, 'display_order', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: {
        menu: menuItems
      }
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    next(new ErrorResponse('Failed to fetch navigation menu', 500));
  }
};

/**
 * @desc    Create new option type
 * @route   POST /api/admin/config/option-types
 * @access  Private (Admin only)
 */
exports.createOptionType = async (req, res, next) => {
  try {
    const { type_key, type_name, description } = req.body;

    const optionType = await ConfigOptionType.create({
      type_key,
      type_name,
      description,
      is_active: true
    });

    res.status(201).json({
      success: true,
      data: optionType
    });
  } catch (error) {
    console.error('Create option type error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new ErrorResponse('Option type with this key already exists', 400));
    }
    next(new ErrorResponse('Failed to create option type', 500));
  }
};

/**
 * @desc    Create new option
 * @route   POST /api/admin/config/options
 * @access  Private (Admin only)
 */
exports.createOption = async (req, res, next) => {
  try {
    const { option_type_id, value, label, variant, icon, display_order, metadata } = req.body;

    const option = await ConfigOption.create({
      option_type_id,
      value,
      label,
      variant: variant || 'default',
      icon,
      display_order: display_order || 0,
      metadata,
      is_active: true
    });

    res.status(201).json({
      success: true,
      data: option
    });
  } catch (error) {
    console.error('Create option error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next(new ErrorResponse('Option with this value already exists for this type', 400));
    }
    next(new ErrorResponse('Failed to create option', 500));
  }
};

/**
 * @desc    Update option
 * @route   PUT /api/admin/config/options/:id
 * @access  Private (Admin only)
 */
exports.updateOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label, variant, icon, display_order, is_active, metadata } = req.body;

    const option = await ConfigOption.findByPk(id);
    if (!option) {
      return next(new ErrorResponse('Option not found', 404));
    }

    await option.update({
      ...(label && { label }),
      ...(variant && { variant }),
      ...(icon !== undefined && { icon }),
      ...(display_order !== undefined && { display_order }),
      ...(is_active !== undefined && { is_active }),
      ...(metadata !== undefined && { metadata }),
      last_updated_on: new Date()
    });

    res.json({
      success: true,
      data: option
    });
  } catch (error) {
    console.error('Update option error:', error);
    next(new ErrorResponse('Failed to update option', 500));
  }
};

/**
 * @desc    Delete option
 * @route   DELETE /api/admin/config/options/:id
 * @access  Private (Admin only)
 */
exports.deleteOption = async (req, res, next) => {
  try {
    const { id } = req.params;

    const option = await ConfigOption.findByPk(id);
    if (!option) {
      return next(new ErrorResponse('Option not found', 404));
    }

    // Soft delete by setting is_active to false
    await option.update({ is_active: false });

    res.json({
      success: true,
      message: 'Option deleted successfully'
    });
  } catch (error) {
    console.error('Delete option error:', error);
    next(new ErrorResponse('Failed to delete option', 500));
  }
};

/**
 * @desc    Create navigation menu item
 * @route   POST /api/admin/config/navigation
 * @access  Private (Admin only)
 */
exports.createNavigationItem = async (req, res, next) => {
  try {
    const { parent_id, name, path, icon, display_order, required_permissions, required_roles, metadata } = req.body;

    const menuItem = await NavigationMenu.create({
      parent_id,
      name,
      path,
      icon,
      display_order: display_order || 0,
      required_permissions,
      required_roles,
      metadata,
      is_active: true
    });

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Create navigation item error:', error);
    next(new ErrorResponse('Failed to create navigation item', 500));
  }
};

/**
 * @desc    Update navigation menu item
 * @route   PUT /api/admin/config/navigation/:id
 * @access  Private (Admin only)
 */
exports.updateNavigationItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const menuItem = await NavigationMenu.findByPk(id);
    if (!menuItem) {
      return next(new ErrorResponse('Navigation item not found', 404));
    }

    await menuItem.update({
      ...updates,
      last_updated_on: new Date()
    });

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Update navigation item error:', error);
    next(new ErrorResponse('Failed to update navigation item', 500));
  }
};

/**
 * @desc    Delete navigation menu item
 * @route   DELETE /api/admin/config/navigation/:id
 * @access  Private (Admin only)
 */
exports.deleteNavigationItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menuItem = await NavigationMenu.findByPk(id);
    if (!menuItem) {
      return next(new ErrorResponse('Navigation item not found', 404));
    }

    // Soft delete
    await menuItem.update({ is_active: false });

    res.json({
      success: true,
      message: 'Navigation item deleted successfully'
    });
  } catch (error) {
    console.error('Delete navigation item error:', error);
    next(new ErrorResponse('Failed to delete navigation item', 500));
  }
};
