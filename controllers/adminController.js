/**
 * Admin Controller
 * 
 * All admin users are managed through the Operator table with ADMIN role.
 * This controller provides admin-specific operations using the unified system.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  Operator, 
  BackOfficeUsers, 
  EntityOperatorRoleMapping, 
  RoleType 
} = require('../models');
const ErrorResponse = require('../utils/errorResponse');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_super_secret_jwt_key_admin_panel_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
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

// Admin Signup - Creates operator with ADMIN role
exports.adminSignup = async (req, res, next) => {
  const { firstName, middleName, lastName, email, password, two_factor_required = false } = req.body;

  try {
    // Validate required fields
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, email, and password are required'
      });
    }

    // Check if operator already exists
    const existingOperator = await Operator.findOne({ where: { email } });
    if (existingOperator) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create operator
    const operator = await Operator.create({
      first_name: firstName,
      middle_name: middleName || '',
      last_name: lastName || '',
      email,
      created_on: new Date(),
      last_updated_on: new Date(),
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

    const token = generateToken({ 
      id: operator.id,
      operatorId: operator.id, 
      email: operator.email,
      type: 'admin',
      role: 'ADMIN', 
      permissions: 'ALL' 
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        token,
        admin: {
          id: operator.id,
          operatorId: operator.id,
          email: operator.email,
          firstName: operator.first_name,
          lastName: operator.last_name,
          type: 'admin',
          source: 'operator'
        },
      },
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Admin Login - Redirects to unified login
exports.adminLogin = async (req, res) => {
  const authController = require('./authController');
  return authController.login(req, res);
};

// Get all admins (operators with ADMIN role)
exports.getAllAdmins = async (req, res, next) => {
  try {
    const adminRoleId = await getAdminRoleTypeId();
    if (!adminRoleId) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const operators = await Operator.findAll({
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
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required']
            }
          ]
        }
      ],
      order: [['created_on', 'DESC']],
    });

    const admins = operators.map(op => ({
      id: op.id,
      operatorId: op.id,
      firstName: op.first_name,
      middleName: op.middle_name,
      lastName: op.last_name,
      email: op.email,
      created_on: op.created_on,
      last_updated_on: op.last_updated_on,
      two_factor_required: op.roleMappings?.[0]?.backOfficeUser?.two_factor_required || false,
      type: 'admin',
      source: 'operator'
    }));

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
};

// Get admin by ID
exports.getAdminById = async (req, res, next) => {
  try {
    const adminRoleId = await getAdminRoleTypeId();
    
    const operator = await Operator.findByPk(req.params.id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: adminRoleId ? { 
            role_type_id: adminRoleId,
            active_status_id: 1
          } : { active_status_id: 1 },
          required: false,
          include: [
            {
              model: BackOfficeUsers,
              as: 'backOfficeUser',
              attributes: ['id', 'two_factor_required']
            }
          ]
        }
      ]
    });

    if (!operator) {
      return next(new ErrorResponse('Admin not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        id: operator.id,
        operatorId: operator.id,
        firstName: operator.first_name,
        middleName: operator.middle_name,
        lastName: operator.last_name,
        email: operator.email,
        created_on: operator.created_on,
        last_updated_on: operator.last_updated_on,
        two_factor_required: operator.roleMappings?.[0]?.backOfficeUser?.two_factor_required || false,
        type: 'admin',
        source: 'operator'
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update admin
exports.updateAdmin = async (req, res, next) => {
  try {
    const operator = await Operator.findByPk(req.params.id);

    if (!operator) {
      return next(new ErrorResponse('Admin not found', 404));
    }

    const { firstName, lastName, email } = req.body;

    await operator.update({
      first_name: firstName || operator.first_name,
      last_name: lastName || operator.last_name,
      email: email || operator.email,
      last_updated_on: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: {
        id: operator.id,
        operatorId: operator.id,
        firstName: operator.first_name,
        lastName: operator.last_name,
        email: operator.email,
        type: 'admin',
        source: 'operator'
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin (soft delete - deactivates role mapping, user won't appear in list)
exports.deleteAdmin = async (req, res, next) => {
  try {
    const operator = await Operator.findByPk(req.params.id, {
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          include: [{ model: BackOfficeUsers, as: 'backOfficeUser' }]
        }
      ]
    });

    if (!operator) {
      return next(new ErrorResponse('Admin not found', 404));
    }

    // Soft delete - deactivate role mappings (user won't appear in getAllUsers)
    await EntityOperatorRoleMapping.update(
      { 
        active_status_id: 2, // Inactive
        last_updated_on: new Date()
      },
      { where: { operator_id: req.params.id } }
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

    console.log(`Admin ${req.params.id} soft deleted - role mappings deactivated, account locked`);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
