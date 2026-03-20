const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/database');
const { 
  Operator,
  BackOfficeUsers, 
  EntityOperatorRoleMapping, 
  RoleType,
  RoleNesting,
  RolePermissions,
  Permission,
  ActiveStatus
} = require('../models');
const { Op } = require('sequelize');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_super_secret_jwt_key_admin_panel_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Unified login - All users are now in Operator table with role-based access
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize inputs to prevent "Invalid character after @" errors
    if (email) {
      email = email.trim().toLowerCase();
    }
    if (password) {
      password = password.trim();
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    console.log('Login attempt for email:', email);

    // Find operator by email
    const operator = await Operator.findOne({
      where: { email },
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { active_status_id: 1 },
          required: false,
          include: [
            {
              model: RoleType,
              as: 'roleType',
              where: { is_enable: true }
            },
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              required: false
            }
          ]
        }
      ]
    });

    if (!operator) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Find back office user credentials
    let backOfficeUser = null;
    if (operator.roleMappings && operator.roleMappings.length > 0) {
      backOfficeUser = operator.roleMappings[0].backOfficeUser;
    }

    if (!backOfficeUser) {
      const roleMapping = await EntityOperatorRoleMapping.findOne({
        where: { 
          operator_id: operator.id,
          active_status_id: 1
        },
        include: [{ model: BackOfficeUsers, as: 'backOfficeUser' }]
      });
      
      if (roleMapping?.backOfficeUser) {
        backOfficeUser = roleMapping.backOfficeUser;
      }
    }

    if (!backOfficeUser) {
      return res.status(403).json({
        success: false,
        message: 'No back office user account found. Please contact administrator.'
      });
    }

    // Check if account is locked
    if (backOfficeUser.account_locked) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked. Please contact administrator.'
      });
    }

    // Verify password
    console.log('Verifying password for user:', operator.email);
    const isPasswordValid = await bcrypt.compare(password, backOfficeUser.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newAttempts = (backOfficeUser.failed_login_attempts || 0) + 1;
      await backOfficeUser.update({
        failed_login_attempts: newAttempts,
        account_locked: newAttempts >= 5
      });

      console.log('Login failed - invalid password. Attempts:', newAttempts);
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        attemptsRemaining: Math.max(0, 5 - newAttempts)
      });
    }

    // Reset failed login attempts and update last login
    await backOfficeUser.update({
      failed_login_attempts: 0,
      last_login_at: new Date()
    });

    // Get all active role mappings
    const roleMappings = await EntityOperatorRoleMapping.findAll({
      where: {
        operator_id: operator.id,
        active_status_id: 1
      },
      include: [{
        model: RoleType,
        as: 'roleType',
        where: { is_enable: true }
      }]
    });

    if (!roleMappings || roleMappings.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'No active roles assigned to this user'
      });
    }

    // Collect roles and permissions
    const roles = [];
    const permissionsSet = new Set();
    let isAdmin = false;
    
    for (const mapping of roleMappings) {
      const roleType = mapping.roleType;
      
      roles.push({
        id: roleType.id,
        name: roleType.name,
        code: roleType.code
      });

      // Check if user has ADMIN role
      if (roleType.code === 'ADMIN' || roleType.code === 'SUPER_ADMIN') {
        isAdmin = true;
      }

      if (roleType.default_permission) {
        const defaultPerms = roleType.default_permission.split(',').map(p => p.trim()).filter(p => p);
        defaultPerms.forEach(p => permissionsSet.add(p));
      }
    }

    const permissions = Array.from(permissionsSet);
    const primaryRole = roles[0] || { id: 4, name: 'Operator', code: 'OPERATOR' };

    // Determine user type based on role
    const userType = isAdmin ? 'admin' : 'operator';

    // Generate token
    const token = generateToken({
      id: operator.id,
      operatorId: operator.id,
      email: operator.email,
      type: userType,
      role: primaryRole.code,
      roleId: primaryRole.id,
      roles: roles,
      permissions: permissions.join(','),
      backOfficeUserId: backOfficeUser.id
    });

    console.log('Login successful for:', operator.email, 'Type:', userType, 'Role:', primaryRole.code);

    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      data: {
        user: {
          id: operator.id,
          operatorId: operator.id,
          email: operator.email,
          firstName: operator.first_name,
          middleName: operator.middle_name,
          lastName: operator.last_name,
          phone: operator.phone_number || operator.mobile_number,
          type: userType,
          source: 'operator',
          primaryRole: primaryRole,
          roles: roles,
          permissions: permissions,
          twoFactorRequired: backOfficeUser.two_factor_required || false
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Register new operator with role
const register = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      first_name,
      middle_name,
      last_name, 
      phone_number,
      role_type_id = 4, // Default role
      two_factor_required = false,
      created_by_operator_id
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
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

    // Verify role exists
    const roleType = await RoleType.findByPk(role_type_id);
    if (!roleType || !roleType.is_enable) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or disabled role type'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create operator
    const operator = await Operator.create({
      email,
      first_name: first_name || '',
      middle_name: middle_name || '',
      last_name: last_name || '',
      phone_number: phone_number || '',
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: created_by_operator_id || null
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

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: operator.id,
        operatorId: operator.id,
        email: operator.email,
        role: roleType.name,
        roleCode: roleType.code,
        type: isAdmin ? 'admin' : 'operator'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get operator profile with roles and permissions
const getProfile = async (req, res) => {
  try {
    const operatorId = req.user?.id || req.user?.operatorId;
    
    if (!operatorId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Get operator with role mappings
    const operator = await Operator.findByPk(operatorId, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { active_status_id: 1 },
          required: false,
          include: [
            {
              model: RoleType,
              as: 'roleType',
              where: { is_enable: true }
            },
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required', 'last_login_at'],
              required: false
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

    // Collect roles and permissions
    const roles = [];
    const permissionsSet = new Set();
    let isAdmin = false;

    if (operator.roleMappings) {
      for (const mapping of operator.roleMappings) {
        if (mapping.roleType) {
          roles.push({
            id: mapping.roleType.id,
            name: mapping.roleType.name,
            code: mapping.roleType.code
          });

          // Check if user has ADMIN role
          if (mapping.roleType.code === 'ADMIN' || mapping.roleType.code === 'SUPER_ADMIN') {
            isAdmin = true;
          }

          // Add default permissions from role
          if (mapping.roleType.default_permission) {
            const perms = mapping.roleType.default_permission.split(',').map(p => p.trim());
            perms.forEach(p => permissionsSet.add(p));
          }
        }
      }
    }

    const backOfficeUser = operator.roleMappings?.[0]?.backOfficeUser;
    const userType = isAdmin ? 'admin' : 'operator';

    res.json({
      success: true,
      data: {
        id: operator.id,
        operatorId: operator.id,
        email: operator.email,
        firstName: operator.first_name,
        middleName: operator.middle_name,
        lastName: operator.last_name,
        phone: operator.phone_number || operator.mobile_number,
        type: userType,
        source: 'operator',
        roles: roles,
        permissions: Array.from(permissionsSet),
        twoFactorRequired: backOfficeUser?.two_factor_required || false,
        lastLogin: backOfficeUser?.last_login_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Logout
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// Get all roles (admin only)
const getRoles = async (req, res) => {
  try {
    const roles = await RoleType.findAll({
      where: { is_enable: true },
      attributes: ['id', 'name', 'code', 'default_permission', 'is_enable', 'two_factor_required'],
      order: [['name', 'ASC']]
    });

    console.log('Fetched roles:', roles.length);
    
    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all permissions (admin only)
const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'code', 'description', 'category'],
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    // Group by category
    const grouped = permissions.reduce((acc, perm) => {
      const category = perm.category || 'OTHER';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        id: perm.id,
        name: perm.name,
        code: perm.code,
        description: perm.description
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: grouped
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all users (operators) with roles - unified system
// Only shows users with active role mappings (soft delete filtering)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '', role_type_id, type } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    // Build search clause for operators
    const operatorWhereClause = {};
    if (search) {
      operatorWhereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Role mapping filter - ALWAYS require active_status_id = 1 (active users only)
    const roleMappingWhere = { active_status_id: 1 };
    if (role_type_id) {
      roleMappingWhere.role_type_id = parseInt(role_type_id);
    }

    // Fetch operators with ACTIVE role mappings only
    // required: true ensures only operators with active role mappings are returned
    const { count, rows: operators } = await Operator.findAndCountAll({
      where: operatorWhereClause,
      attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'mobile_number', 'created_on'],
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: roleMappingWhere,
          required: true, // IMPORTANT: Only show users with active role mappings
          include: [
            {
              model: RoleType,
              as: 'roleType',
              attributes: ['id', 'name', 'code', 'default_permission'],
              required: false
            },
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required', 'account_locked', 'last_login_at'],
              required: false
            }
          ]
        }
      ],
      order: [['created_on', 'DESC']],
      limit: limit,
      offset: offset,
      distinct: true
    });

    // Map operators to user format
    let users = operators.map(operator => {
      const roles = [];
      const permissionsSet = new Set();
      let backOfficeUserId = null;
      let twoFactorRequired = false;
      let accountLocked = false;
      let lastLogin = null;
      let isAdmin = false;

      if (operator.roleMappings && operator.roleMappings.length > 0) {
        operator.roleMappings.forEach(mapping => {
          if (mapping.roleType) {
            roles.push({
              id: mapping.roleType.id,
              name: mapping.roleType.name,
              code: mapping.roleType.code
            });

            // Check if user has ADMIN role
            if (mapping.roleType.code === 'ADMIN' || mapping.roleType.code === 'SUPER_ADMIN') {
              isAdmin = true;
            }

            if (mapping.roleType.default_permission) {
              const perms = mapping.roleType.default_permission.split(',').map(p => p.trim());
              perms.forEach(p => permissionsSet.add(p));
            }
          }

          if (mapping.backOfficeUser) {
            backOfficeUserId = mapping.backOfficeUser.id;
            twoFactorRequired = mapping.backOfficeUser.two_factor_required || false;
            accountLocked = mapping.backOfficeUser.account_locked || false;
            lastLogin = mapping.backOfficeUser.last_login_at;
          }
        });
      }

      const userType = isAdmin ? 'admin' : 'operator';

      return {
        id: operator.id,
        operatorId: operator.id,
        firstName: operator.first_name,
        middleName: operator.middle_name,
        lastName: operator.last_name,
        email: operator.email,
        phone: operator.phone_number || operator.mobile_number,
        source: 'operator',
        type: userType,
        primaryRole: roles[0] || null,
        roles: roles,
        permissions: Array.from(permissionsSet),
        backOfficeUserId: backOfficeUserId,
        twoFactorRequired: twoFactorRequired,
        accountLocked: accountLocked,
        lastLogin: lastLogin,
        created_on: operator.created_on
      };
    });

    // Filter by type if specified
    if (type) {
      users = users.filter(u => u.type === type);
    }

    res.json({
      success: true,
      data: users,
      pagination: {
        total: type ? users.length : count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil((type ? users.length : count) / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  logout,
  getRoles,
  getPermissions,
  getAllUsers
};
