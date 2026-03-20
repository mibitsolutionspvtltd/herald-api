const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { 
  Operator,
  BackOfficeUsers, 
  EntityOperatorRoleMapping, 
  RoleType
} = require('../models');

// Helper function to check if user has admin permissions
const hasAdminPermission = (user, permission) => {
  if (!user) return false;
  
  // Check if user has ALL permission (super admin)
  if (user.permissions === 'ALL' || 
      (Array.isArray(user.permissions) && user.permissions.includes('ALL')) ||
      (typeof user.permissions === 'string' && user.permissions.includes('ALL'))) {
    return true;
  }
  
  // Check specific permission
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  if (typeof user.permissions === 'string') {
    return user.permissions.split(',').map(p => p.trim()).includes(permission);
  }
  
  return false;
};

// Get ADMIN role type ID
const getAdminRoleTypeId = async () => {
  const adminRole = await RoleType.findOne({
    where: { 
      code: 'ADMIN',
      is_enable: true
    }
  });
  return adminRole ? adminRole.id : null;
};

// Create new admin user (creates operator with ADMIN role)
const createAdmin = async (req, res) => {
  try {
    const { first_name, middle_name, last_name, email, password, two_factor_required = false } = req.body;

    // Check permission
    if (!hasAdminPermission(req.user, 'CREATE_ADMIN') && !hasAdminPermission(req.user, 'ALL')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create admin users'
      });
    }

    if (!email || !password || !first_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and first name are required'
      });
    }

    // Check if operator already exists
    const existingOperator = await Operator.findOne({ where: { email } });
    if (existingOperator) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Get ADMIN role type
    const adminRoleId = await getAdminRoleTypeId();
    if (!adminRoleId) {
      return res.status(500).json({
        success: false,
        message: 'ADMIN role type not found in system'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create operator
    const operator = await Operator.create({
      email,
      first_name,
      middle_name: middle_name || '',
      last_name: last_name || '',
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: req.user?.operatorId || null
    });

    // Create back office user
    const backOfficeUser = await BackOfficeUsers.create({
      password: hashedPassword,
      two_factor_required,
      created_by: operator.id,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create role mapping with ADMIN role
    await EntityOperatorRoleMapping.create({
      operator_id: operator.id,
      role_type_id: adminRoleId,
      back_office_user_id: backOfficeUser.id,
      active_status_id: 1,
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: operator.id
    });

    return res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: operator.id,
        operatorId: operator.id,
        email: operator.email,
        firstName: operator.first_name,
        lastName: operator.last_name,
        source: 'operator',
        type: 'admin'
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete admin user (soft delete - deactivates role mapping, user won't appear in list)
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check permission
    if (!hasAdminPermission(req.user, 'DELETE_ADMIN') && !hasAdminPermission(req.user, 'ALL')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete admin users'
      });
    }

    // Prevent self-deletion
    if (req.user?.operatorId === parseInt(id) || req.user?.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const operator = await Operator.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          include: [{ model: BackOfficeUsers, as: 'backOfficeUser' }]
        }
      ]
    });

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate role mappings (user won't appear in getAllUsers)
    await EntityOperatorRoleMapping.update(
      { 
        active_status_id: 2, // Inactive
        last_updated_on: new Date(),
        last_updated_by: req.user?.operatorId || null
      },
      { where: { operator_id: id } }
    );

    // Also lock the back office user account to prevent login
    if (operator.roleMappings) {
      for (const mapping of operator.roleMappings) {
        if (mapping.backOfficeUser) {
          await mapping.backOfficeUser.update({
            account_locked: true,
            updated_at: new Date()
          });
        }
      }
    }

    console.log(`Admin user ${id} soft deleted - role mappings deactivated, account locked`);

    return res.json({
      success: true,
      message: 'Admin user deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all admin users (operators with ADMIN role)
const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    // Get ADMIN role type ID
    const adminRoleId = await getAdminRoleTypeId();
    if (!adminRoleId) {
      return res.json({
        success: true,
        data: [],
        pagination: { total: 0, page: 1, size: limit, totalPages: 0 }
      });
    }

    const operatorWhereClause = {};
    if (search) {
      operatorWhereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: operators } = await Operator.findAndCountAll({
      where: operatorWhereClause,
      attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'created_on'],
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { 
            role_type_id: adminRoleId,
            active_status_id: 1
          },
          required: true,
          include: [
            {
              model: RoleType,
              as: 'roleType',
              attributes: ['id', 'name', 'code']
            },
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required'],
              required: false
            }
          ]
        }
      ],
      order: [['created_on', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    const adminUsers = operators.map(operator => ({
      id: operator.id,
      operatorId: operator.id,
      firstName: operator.first_name,
      middleName: operator.middle_name,
      lastName: operator.last_name,
      email: operator.email,
      source: 'operator',
      type: 'admin',
      primaryRole: { id: adminRoleId, name: 'Admin', code: 'ADMIN' },
      roles: [{ id: adminRoleId, name: 'Admin', code: 'ADMIN' }],
      permissions: ['ALL'],
      twoFactorRequired: operator.roleMappings?.[0]?.backOfficeUser?.two_factor_required || false,
      created_on: operator.created_on
    }));

    res.json({
      success: true,
      data: adminUsers,
      pagination: {
        total: count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new user (operator with specified role)
const createUser = async (req, res) => {
  try {
    const { 
      first_name,
      middle_name,
      last_name, 
      email, 
      password,
      phone_number,
      role_type_id = 4,
      two_factor_required = false
    } = req.body;

    if (!email || !password || !first_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and first name are required'
      });
    }

    // Check if user already exists
    const existingOperator = await Operator.findOne({ where: { email } });
    if (existingOperator) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Verify role exists
    const roleType = await RoleType.findByPk(role_type_id);
    if (!roleType || !roleType.is_enable) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or disabled role type'
      });
    }

    // Check permission for admin creation
    if ((roleType.code === 'ADMIN' || roleType.code === 'SUPER_ADMIN') && 
        !hasAdminPermission(req.user, 'CREATE_ADMIN') && 
        !hasAdminPermission(req.user, 'ALL')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create admin users'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create operator
    const operator = await Operator.create({
      email,
      first_name,
      middle_name: middle_name || '',
      last_name: last_name || '',
      phone_number: phone_number || '',
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: req.user?.operatorId || null
    });

    // Create back office user
    const backOfficeUser = await BackOfficeUsers.create({
      password: hashedPassword,
      two_factor_required,
      created_by: operator.id,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create role mapping
    await EntityOperatorRoleMapping.create({
      operator_id: operator.id,
      role_type_id,
      back_office_user_id: backOfficeUser.id,
      active_status_id: 1,
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: operator.id
    });

    // Determine user type based on role
    const isAdmin = roleType.code === 'ADMIN' || roleType.code === 'SUPER_ADMIN';

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: operator.id,
        operatorId: operator.id,
        email: operator.email,
        firstName: operator.first_name,
        lastName: operator.last_name,
        role: roleType.name,
        source: 'operator',
        type: isAdmin ? 'admin' : 'operator'
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      first_name,
      middle_name,
      last_name, 
      email,
      phone_number,
      role_type_id,
      two_factor_required
    } = req.body;

    const operator = await Operator.findByPk(id);
    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update operator
    await operator.update({
      first_name: first_name || operator.first_name,
      middle_name: middle_name !== undefined ? middle_name : operator.middle_name,
      last_name: last_name || operator.last_name,
      email: email || operator.email,
      phone_number: phone_number !== undefined ? phone_number : operator.phone_number,
      last_updated_on: new Date(),
      last_updated_by: req.user?.operatorId || null
    });

    // Update role if provided
    if (role_type_id) {
      // Check permission for admin role assignment
      const roleType = await RoleType.findByPk(role_type_id);
      if (roleType && (roleType.code === 'ADMIN' || roleType.code === 'SUPER_ADMIN') && 
          !hasAdminPermission(req.user, 'CREATE_ADMIN') && 
          !hasAdminPermission(req.user, 'ALL')) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to assign admin role'
        });
      }

      const roleMapping = await EntityOperatorRoleMapping.findOne({
        where: { 
          operator_id: id,
          active_status_id: 1
        }
      });

      if (roleMapping) {
        await roleMapping.update({
          role_type_id,
          last_updated_on: new Date(),
          last_updated_by: req.user?.operatorId || null
        });
      }
    }

    // Update two-factor if provided
    if (two_factor_required !== undefined) {
      const roleMapping = await EntityOperatorRoleMapping.findOne({
        where: { operator_id: id },
        include: [{ model: BackOfficeUsers, as: 'backOfficeUser' }]
      });

      if (roleMapping?.backOfficeUser) {
        await roleMapping.backOfficeUser.update({
          two_factor_required,
          updated_at: new Date()
        });
      }
    }

    // Get updated user with role info
    const updatedOperator = await Operator.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { active_status_id: 1 },
          required: false,
          include: [
            { model: RoleType, as: 'roleType' }
          ]
        }
      ]
    });

    const roles = updatedOperator.roleMappings?.map(m => ({
      id: m.roleType?.id,
      name: m.roleType?.name,
      code: m.roleType?.code
    })) || [];

    const isAdmin = roles.some(r => r.code === 'ADMIN' || r.code === 'SUPER_ADMIN');

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: operator.id,
        operatorId: operator.id,
        email: operator.email,
        firstName: operator.first_name,
        lastName: operator.last_name,
        source: 'operator',
        type: isAdmin ? 'admin' : 'operator'
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete user (soft delete - deactivates role mapping, user won't appear in list)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user?.operatorId === parseInt(id) || req.user?.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const operator = await Operator.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          include: [
            { model: RoleType, as: 'roleType' },
            { model: BackOfficeUsers, as: 'backOfficeUser' }
          ]
        }
      ]
    });

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if deleting an admin user
    const isAdmin = operator.roleMappings?.some(m => 
      m.roleType?.code === 'ADMIN' || m.roleType?.code === 'SUPER_ADMIN'
    );

    if (isAdmin && !hasAdminPermission(req.user, 'DELETE_ADMIN') && !hasAdminPermission(req.user, 'ALL')) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete admin users'
      });
    }

    // Soft delete - deactivate role mappings (user won't appear in getAllUsers)
    await EntityOperatorRoleMapping.update(
      { 
        active_status_id: 2, // Inactive
        last_updated_on: new Date(),
        last_updated_by: req.user?.operatorId || null
      },
      { where: { operator_id: id } }
    );

    // Also lock the back office user account to prevent login
    if (operator.roleMappings) {
      for (const mapping of operator.roleMappings) {
        if (mapping.backOfficeUser) {
          await mapping.backOfficeUser.update({
            account_locked: true,
            updated_at: new Date()
          });
        }
      }
    }

    console.log(`User ${id} soft deleted - role mappings deactivated, account locked`);

    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Change user password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const roleMapping = await EntityOperatorRoleMapping.findOne({
      where: { operator_id: id },
      include: [{ model: BackOfficeUsers, as: 'backOfficeUser' }]
    });

    if (!roleMapping?.backOfficeUser) {
      return res.status(404).json({
        success: false,
        message: 'User credentials not found'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await roleMapping.backOfficeUser.update({
      password: hashedPassword,
      failed_login_attempts: 0,
      account_locked: false,
      last_password_change_at: new Date(),
      updated_at: new Date()
    });

    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const operator = await Operator.findByPk(id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { active_status_id: 1 },
          required: false,
          include: [
            {
              model: RoleType,
              as: 'roleType'
            },
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required', 'account_locked']
            }
          ]
        }
      ]
    });

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const roles = [];
    let backOfficeUser = null;
    let isAdmin = false;

    if (operator.roleMappings && operator.roleMappings.length > 0) {
      operator.roleMappings.forEach(mapping => {
        if (mapping.roleType) {
          roles.push({
            id: mapping.roleType.id,
            name: mapping.roleType.name,
            code: mapping.roleType.code
          });

          if (mapping.roleType.code === 'ADMIN' || mapping.roleType.code === 'SUPER_ADMIN') {
            isAdmin = true;
          }
        }
        if (mapping.backOfficeUser) {
          backOfficeUser = mapping.backOfficeUser;
        }
      });
    }

    return res.json({
      success: true,
      data: {
        id: operator.id,
        operatorId: operator.id,
        firstName: operator.first_name,
        middleName: operator.middle_name,
        lastName: operator.last_name,
        email: operator.email,
        phone: operator.phone_number || operator.mobile_number,
        source: 'operator',
        type: isAdmin ? 'admin' : 'operator',
        primaryRole: roles[0] || null,
        roles: roles,
        twoFactorRequired: backOfficeUser?.two_factor_required || false,
        accountLocked: backOfficeUser?.account_locked || false,
        created_on: operator.created_on
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createUser,
  createAdmin,
  updateUser,
  deleteUser,
  deleteAdmin,
  changePassword,
  getUserById,
  getAllAdmins
};
