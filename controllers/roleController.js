const { RoleType, EntityOperatorRoleMapping, Operator } = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all roles
exports.getAllRoles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status !== undefined) {
      whereClause.is_enable = status === 'true';
    }

    const roles = await RoleType.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          attributes: ['id', 'operator_id', 'role_type_id'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
      distinct: true
    });

    // Add user count to each role
    const rolesWithCount = roles.rows.map(role => ({
      ...role.toJSON(),
      userCount: role.roleMappings ? role.roleMappings.length : 0
    }));

    res.status(200).json({
      success: true,
      data: rolesWithCount,
      pagination: {
        total: roles.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(roles.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get role by ID
exports.getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await RoleType.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          attributes: ['id', 'entity_id', 'entity_type', 'created_on'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'email'],
              required: false
            }
          ]
        }
      ]
    });

    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    const roleWithDetails = {
      ...role.toJSON(),
      userCount: role.roleMappings ? role.roleMappings.length : 0,
      permissions: role.default_permission ? role.default_permission.split(',') : []
    };

    res.status(200).json({
      success: true,
      data: roleWithDetails
    });
  } catch (error) {
    next(error);
  }
};

// Create role
exports.createRole = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      default_permission,
      is_enable = true,
      priority = 0
    } = req.body;

    // Check if role code already exists
    const existingRole = await RoleType.findOne({ where: { code } });
    if (existingRole) {
      return next(new ErrorResponse('Role with this code already exists', 400));
    }

    // Validate permissions format
    let permissionsString = '';
    if (default_permission) {
      if (Array.isArray(default_permission)) {
        permissionsString = default_permission.join(',');
      } else if (typeof default_permission === 'string') {
        permissionsString = default_permission;
      } else {
        return next(new ErrorResponse('Permissions must be an array or comma-separated string', 400));
      }
    }

    const role = await RoleType.create({
      name,
      code: code.toUpperCase(),
      description,
      default_permission: permissionsString,
      is_enable,
      priority,
      created_on: new Date(),
      last_updated_on: new Date()
    });

    res.status(201).json({
      success: true,
      data: {
        ...role.toJSON(),
        permissions: permissionsString ? permissionsString.split(',') : []
      },
      message: 'Role created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update role
exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const role = await RoleType.findByPk(id);
    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    // Check if code is being updated and doesn't conflict
    if (updateData.code && updateData.code !== role.code) {
      const existingRole = await RoleType.findOne({
        where: {
          code: updateData.code.toUpperCase(),
          id: { [Op.ne]: id }
        }
      });
      if (existingRole) {
        return next(new ErrorResponse('Role with this code already exists', 400));
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Handle permissions
    if (updateData.default_permission) {
      if (Array.isArray(updateData.default_permission)) {
        updateData.default_permission = updateData.default_permission.join(',');
      }
    }

    updateData.last_updated_on = new Date();
    await role.update(updateData);

    const updatedRole = await RoleType.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          attributes: ['id']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        ...updatedRole.toJSON(),
        userCount: updatedRole.roleMappings ? updatedRole.roleMappings.length : 0,
        permissions: updatedRole.default_permission ? updatedRole.default_permission.split(',') : []
      },
      message: 'Role updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete role
exports.deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await RoleType.findByPk(id);
    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    // Check if role is being used
    const usageCount = await EntityOperatorRoleMapping.count({ where: { role_type_id: id } });
    if (usageCount > 0) {
      return next(new ErrorResponse(`Cannot delete role. It is assigned to ${usageCount} user(s)`, 400));
    }

    // Check if already deleted
    if (role.status_id === 2) {
      return next(new ErrorResponse('Role is already deleted', 400));
    }

    // Soft delete by setting status_id to 2 (deleted)
    await role.update({
      status_id: 2,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all available permissions
exports.getAllPermissions = async (req, res, next) => {
  try {
    // Define all available permissions in the system
    const permissions = [
      // Article permissions
      'VIEW_ALL_ARTICLES',
      'CREATE_ARTICLE',
      'EDIT_ARTICLE',
      'DELETE_ARTICLE',
      'PUBLISH_ARTICLE',


      // Category permissions
      'VIEW_CATEGORY',
      'CREATE_CATEGORY',
      'EDIT_CATEGORY',
      'DELETE_CATEGORY',

      // Hero Content permissions
      'VIEW_ALL_HERO_CONTENT',
      'CREATE_HERO_CONTENT',
      'EDIT_HERO_CONTENT',
      'DELETE_HERO_CONTENT',

      // Carousel permissions
      'VIEW_ALL_CAROUSEL_ITEMS',
      'CREATE_CAROUSEL_ITEM',
      'EDIT_CAROUSEL_ITEM',
      'DELETE_CAROUSEL_ITEM',

      // Course permissions
      'VIEW_COURSE',
      'CREATE_COURSE',
      'EDIT_COURSE',
      'DELETE_COURSE',

      // University permissions
      'VIEW_UNIVERSITY',
      'CREATE_UNIVERSITY',
      'EDIT_UNIVERSITY',
      'DELETE_UNIVERSITY',

      // User management permissions
      'VIEW_USERS',
      'CREATE_USER',
      'EDIT_USER',
      'DELETE_USER',

      // System permissions
      'VIEW_ANALYTICS',
      'VIEW_REPORTS',
      'MANAGE_SETTINGS',
      'MANAGE_ROLES',
      'MANAGE_PERMISSIONS',
      'SYSTEM_ADMIN'
    ];

    const groupedPermissions = {
      'Content Management': [
        'VIEW_ALL_ARTICLES', 'CREATE_ARTICLE', 'EDIT_ARTICLE', 'DELETE_ARTICLE', 'PUBLISH_ARTICLE',
        'VIEW_CATEGORY', 'CREATE_CATEGORY', 'EDIT_CATEGORY', 'DELETE_CATEGORY'
      ],
      'Hero & Carousel': [
        'VIEW_ALL_HERO_CONTENT', 'CREATE_HERO_CONTENT', 'EDIT_HERO_CONTENT', 'DELETE_HERO_CONTENT',
        'VIEW_ALL_CAROUSEL_ITEMS', 'CREATE_CAROUSEL_ITEM', 'EDIT_CAROUSEL_ITEM', 'DELETE_CAROUSEL_ITEM'
      ],
      'Courses & Universities': [
        'VIEW_COURSE', 'CREATE_COURSE', 'EDIT_COURSE', 'DELETE_COURSE',
        'VIEW_UNIVERSITY', 'CREATE_UNIVERSITY', 'EDIT_UNIVERSITY', 'DELETE_UNIVERSITY'
      ],
      'User Management': [
        'VIEW_USERS', 'CREATE_USER', 'EDIT_USER', 'DELETE_USER'
      ],
      'System Administration': [
        'VIEW_ANALYTICS', 'VIEW_REPORTS', 'MANAGE_SETTINGS', 'MANAGE_ROLES', 'MANAGE_PERMISSIONS', 'SYSTEM_ADMIN'
      ]
    };

    res.status(200).json({
      success: true,
      data: {
        all: permissions,
        grouped: groupedPermissions
      }
    });
  } catch (error) {
    next(error);
  }
};

// Assign role to user
exports.assignRoleToUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { roleId, entityType = 'USER' } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Check if role exists
    const role = await RoleType.findByPk(roleId);
    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    // Check if mapping already exists
    const existingMapping = await EntityOperatorRoleMapping.findOne({
      where: {
        entity_id: userId,
        entity_type: entityType,
        role_type_id: roleId
      }
    });

    if (existingMapping) {
      return next(new ErrorResponse('User already has this role', 400));
    }

    // Create role mapping
    const roleMapping = await EntityOperatorRoleMapping.create({
      entity_id: userId,
      entity_type: entityType,
      role_type_id: roleId,
      created_on: new Date(),
      last_updated_on: new Date()
    });

    res.status(201).json({
      success: true,
      data: roleMapping,
      message: 'Role assigned to user successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Remove role from user
exports.removeRoleFromUser = async (req, res, next) => {
  try {
    const { userId, roleId } = req.params;

    const roleMapping = await EntityOperatorRoleMapping.findOne({
      where: {
        entity_id: userId,
        role_type_id: roleId
      }
    });

    if (!roleMapping) {
      return next(new ErrorResponse('Role mapping not found', 404));
    }

    // Check if already deleted
    if (roleMapping.status_id === 2) {
      return next(new ErrorResponse('Role mapping is already deleted', 400));
    }

    // Soft delete by setting status_id to 2 (deleted)
    await roleMapping.update({
      status_id: 2,
      updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Role mapping deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get role statistics
exports.getRoleStats = async (req, res, next) => {
  try {
    const [
      totalRoles,
      activeRoles,
      inactiveRoles,
      roleUsage
    ] = await Promise.all([
      RoleType.count(),
      RoleType.count({ where: { is_enable: true } }),
      RoleType.count({ where: { is_enable: false } }),
      RoleType.findAll({
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings',
            attributes: ['id']
          }
        ],
        attributes: [
          'id',
          'name',
          'code',
          [RoleType.sequelize.fn('COUNT', RoleType.sequelize.col('roleMappings.id')), 'userCount']
        ],
        group: ['RoleType.id'],
        order: [[RoleType.sequelize.fn('COUNT', RoleType.sequelize.col('roleMappings.id')), 'DESC']]
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRoles,
        activeRoles,
        inactiveRoles,
        roleUsage
      }
    });
  } catch (error) {
    next(error);
  }
};
