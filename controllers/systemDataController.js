const { 
  RoleType, 
  Permission,
  RolePermissions,
  DeviceDetails,
  DeviceRegistration,
  Operator,
  ActiveStatus,
  EntityOperatorRoleMapping,
  BackOfficeUsers,
  RoleNesting
} = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get all active statuses
exports.getActiveStatuses = async (req, res, next) => {
  try {
    const activeStatuses = await ActiveStatus.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: activeStatuses
    });
  } catch (error) {
    next(error);
  }
};

// ROLE MANAGEMENT

// Get all roles
exports.getAllRoles = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      isEnabled,
      sortBy = 'name',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (isEnabled !== undefined) {
      whereClause.is_enable = isEnabled === 'true';
    }

    const { count, rows: roles } = await RoleType.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'code', 'category'],
          through: { attributes: ['is_granted'] }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      data: {
        roles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRoles: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get role by ID with permissions
exports.getRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const role = await RoleType.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'code', 'description', 'category'],
          through: { attributes: ['is_granted'] }
        },
        {
          model: User,
          as: 'users',
          attributes: ['id', 'firstName', 'lastName', 'email', 'status'],
          limit: 10
        }
      ]
    });

    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// Create new role
exports.createRole = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      defaultPermissions = [],
      isEnabled = true,
      appAllowed = true,
      adminPortalAccess = true,
      twoFactorRequired = false
    } = req.body;

    // Check if role already exists
    const existingRole = await RoleType.findOne({ 
      where: { 
        [Op.or]: [
          { code: code },
          { name: name }
        ]
      }
    });

    if (existingRole) {
      return next(new ErrorResponse('Role with this name or code already exists', 400));
    }

    const role = await RoleType.create({
      name,
      code,
      description,
      default_permission: defaultPermissions.join(','),
      is_enable: isEnabled,
      app_allowed: appAllowed,
      admin_portal_access: adminPortalAccess,
      two_factor_required: twoFactorRequired
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    next(error);
  }
};

// Update role
exports.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      code,
      description,
      defaultPermissions,
      isEnabled,
      appAllowed,
      adminPortalAccess,
      twoFactorRequired
    } = req.body;

    const role = await RoleType.findByPk(id);
    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    await role.update({
      name: name || role.name,
      code: code || role.code,
      description: description || role.description,
      default_permission: defaultPermissions ? defaultPermissions.join(',') : role.default_permission,
      is_enable: isEnabled !== undefined ? isEnabled : role.is_enable,
      app_allowed: appAllowed !== undefined ? appAllowed : role.app_allowed,
      admin_portal_access: adminPortalAccess !== undefined ? adminPortalAccess : role.admin_portal_access,
      two_factor_required: twoFactorRequired !== undefined ? twoFactorRequired : role.two_factor_required
    });

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: role
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

    // Check if role is being used by any operators
    const operatorsCount = await EntityOperatorRoleMapping.count({ where: { role_type_id: id, active_status_id: 1 } });
    if (operatorsCount > 0) {
      return next(new ErrorResponse('Cannot delete role that is assigned to operators', 400));
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

// PERMISSION MANAGEMENT

// Get all permissions
exports.getAllPermissions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      search,
      category,
      isActive,
      sortBy = 'category',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (isActive !== undefined) {
      whereClause.is_active = isActive === 'true';
    }

    const { count, rows: permissions } = await Permission.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: RoleType,
          as: 'roles',
          attributes: ['id', 'name', 'code'],
          through: { attributes: ['is_granted'] }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, permission) => {
      const category = permission.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        permissions,
        groupedPermissions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalPermissions: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new permission
exports.createPermission = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      category,
      isActive = true
    } = req.body;

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ 
      where: { 
        [Op.or]: [
          { code: code },
          { name: name }
        ]
      }
    });

    if (existingPermission) {
      return next(new ErrorResponse('Permission with this name or code already exists', 400));
    }

    const permission = await Permission.create({
      name,
      code,
      description,
      category,
      is_active: isActive
    });

    res.status(201).json({
      success: true,
      message: 'Permission created successfully',
      data: permission
    });
  } catch (error) {
    next(error);
  }
};

// Assign permissions to role
exports.assignPermissionsToRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { permissionIds, isGranted = true } = req.body;

    const role = await RoleType.findByPk(roleId);
    if (!role) {
      return next(new ErrorResponse('Role not found', 404));
    }

    // Verify all permissions exist
    const permissions = await Permission.findAll({
      where: { id: { [Op.in]: permissionIds } }
    });

    if (permissions.length !== permissionIds.length) {
      return next(new ErrorResponse('One or more permissions not found', 404));
    }

    // Create or update role-permission mappings
    const rolePermissions = permissionIds.map(permissionId => ({
      role_type_id: roleId,
      permission_id: permissionId,
      is_granted: isGranted
    }));

    await RolePermissions.bulkCreate(rolePermissions, {
      updateOnDuplicate: ['is_granted', 'updated_at']
    });

    // Fetch updated role with permissions
    const updatedRole = await RoleType.findByPk(roleId, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['id', 'name', 'code', 'category'],
          through: { attributes: ['is_granted'] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Permissions assigned to role successfully',
      data: updatedRole
    });
  } catch (error) {
    next(error);
  }
};

// DEVICE TRACKING

// Get all device registrations
exports.getAllDeviceRegistrations = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      userId,
      platform,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { device_id: { [Op.like]: `%${search}%` } },
        { device_name: { [Op.like]: `%${search}%` } }
      ];
    }

    if (userId) {
      whereClause.user_id = userId;
    }

    if (platform) {
      whereClause.platform = platform;
    }

    const { count, rows: devices } = await DeviceRegistration.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: DeviceDetails,
          as: 'deviceDetails',
          attributes: ['id', 'device_type', 'os_version', 'app_version']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      data: {
        devices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalDevices: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get device statistics
exports.getDeviceStats = async (req, res, next) => {
  try {
    const totalDevices = await DeviceRegistration.count();
    const activeDevices = await DeviceRegistration.count({ 
      where: { is_active: true } 
    });

    // Devices by platform
    const devicesByPlatform = await DeviceRegistration.findAll({
      attributes: [
        'platform',
        [DeviceRegistration.sequelize.fn('COUNT', DeviceRegistration.sequelize.col('id')), 'count']
      ],
      group: ['platform'],
      raw: true
    });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await DeviceRegistration.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalDevices,
        activeDevices,
        devicesByPlatform,
        recentRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};

// ENTITY OPERATOR ROLE MAPPING

// Get all role mappings
exports.getAllRoleMappings = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      entityType,
      roleTypeId,
      sortBy = 'created_on',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (entityType) {
      whereClause.entity_type = entityType;
    }

    if (roleTypeId) {
      whereClause.role_type_id = roleTypeId;
    }

    const { count, rows: mappings } = await EntityOperatorRoleMapping.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: RoleType,
          as: 'roleType',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Operator,
          as: 'operator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.status(200).json({
      success: true,
      data: {
        mappings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalMappings: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create role mapping
exports.createRoleMapping = async (req, res, next) => {
  try {
    const {
      entityId,
      entityType,
      roleTypeId,
      operatorId,
      isActive = true
    } = req.body;

    // Verify role type exists
    const roleType = await RoleType.findByPk(roleTypeId);
    if (!roleType) {
      return next(new ErrorResponse('Role type not found', 404));
    }

    // Verify operator exists
    const operator = await Operator.findByPk(operatorId);
    if (!operator) {
      return next(new ErrorResponse('Operator not found', 404));
    }

    const mapping = await EntityOperatorRoleMapping.create({
      entity_id: entityId,
      entity_type: entityType,
      role_type_id: roleTypeId,
      operator_id: operatorId,
      active_status_id: isActive ? 1 : 2,
      created_on: new Date()
    });

    const newMapping = await EntityOperatorRoleMapping.findByPk(mapping.id, {
      include: [
        {
          model: RoleType,
          as: 'roleType',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Operator,
          as: 'operator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Role mapping created successfully',
      data: newMapping
    });
  } catch (error) {
    next(error);
  }
};

// Initialize default roles and permissions
exports.initializeDefaultRolesAndPermissions = async (req, res, next) => {
  try {
    // Default roles with their permissions
    const defaultRoles = [
      {
        name: 'Admin',
        code: 'ADMIN',
        description: 'Full system access with all permissions',
        permissions: [
          'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER',
          'CREATE_ARTICLE', 'VIEW_ARTICLE', 'EDIT_ANY_ARTICLE', 'DELETE_ARTICLE', 
          'PUBLISH_ARTICLE', 'APPROVE_ARTICLE', 'REJECT_ARTICLE',
          'CREATE_CATEGORY', 'EDIT_CATEGORY', 'DELETE_CATEGORY',
          'MANAGE_HERO_CONTENT', 'MANAGE_DOCUMENTS',
          'MANAGE_ROLES', 'MANAGE_PERMISSIONS', 'VIEW_ANALYTICS', 'SYSTEM_SETTINGS'
        ],
        admin_portal_access: true
      },
      {
        name: 'Viewer',
        code: 'VIEWER',
        description: 'Read-only access for web users',
        permissions: ['VIEW_ARTICLE'],
        admin_portal_access: false
      },
      {
        name: 'Content Writer',
        code: 'CONTENT_WRITER',
        description: 'Can create and edit own articles',
        permissions: ['CREATE_ARTICLE', 'VIEW_ARTICLE', 'EDIT_OWN_ARTICLE'],
        admin_portal_access: true
      },
      {
        name: 'Editor',
        code: 'EDITOR',
        description: 'Can approve/reject articles but not edit them',
        permissions: ['VIEW_ARTICLE', 'APPROVE_ARTICLE', 'REJECT_ARTICLE'],
        admin_portal_access: true
      },
      {
        name: 'Content Manager',
        code: 'CONTENT_MANAGER',
        description: 'Full content management except user creation',
        permissions: [
          'VIEW_USER', 'EDIT_USER',
          'CREATE_ARTICLE', 'VIEW_ARTICLE', 'EDIT_ANY_ARTICLE', 'DELETE_ARTICLE',
          'PUBLISH_ARTICLE', 'APPROVE_ARTICLE', 'REJECT_ARTICLE',
          'CREATE_CATEGORY', 'EDIT_CATEGORY', 'DELETE_CATEGORY',
          'MANAGE_HERO_CONTENT', 'MANAGE_DOCUMENTS', 'VIEW_ANALYTICS'
        ],
        admin_portal_access: true
      }
    ];

    // Create or update roles
    for (const roleData of defaultRoles) {
      const [role] = await RoleType.findOrCreate({
        where: { code: roleData.code },
        defaults: {
          name: roleData.name,
          code: roleData.code,
          description: roleData.description,
          default_permission: roleData.permissions.join(','),
          is_enable: true,
          app_allowed: true,
          admin_portal_access: roleData.admin_portal_access,
          two_factor_required: false
        }
      });

      // Update if exists
      if (role) {
        await role.update({
          default_permission: roleData.permissions.join(','),
          admin_portal_access: roleData.admin_portal_access
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Default roles and permissions initialized successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get system statistics
exports.getSystemStats = async (req, res, next) => {
  try {
    const totalRoles = await RoleType.count();
    const activeRoles = await RoleType.count({ where: { is_enable: true } });
    
    const totalPermissions = await Permission.count();
    const activePermissions = await Permission.count({ where: { is_active: true } });
    
    const totalRoleMappings = await EntityOperatorRoleMapping.count();
    const activeRoleMappings = await EntityOperatorRoleMapping.count({ 
      where: { active_status_id: 1 } 
    });

    // Operators by role
    const operatorsByRole = await EntityOperatorRoleMapping.findAll({
      where: { active_status_id: 1 },
      attributes: ['role_type_id'],
      include: [
        {
          model: RoleType,
          as: 'roleType',
          attributes: ['name', 'code']
        }
      ],
      group: ['role_type_id', 'roleType.id'],
      raw: false
    });

    const roleDistribution = {};
    operatorsByRole.forEach(mapping => {
      const roleName = user.roleType?.name || 'Unknown';
      roleDistribution[roleName] = (roleDistribution[roleName] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        totalRoles,
        activeRoles,
        totalPermissions,
        activePermissions,
        totalRoleMappings,
        activeRoleMappings,
        roleDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};
