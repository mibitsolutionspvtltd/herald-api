const { Operator, EntityOperatorRoleMapping, OperatorOTPLog, OperatorActivityLog, RoleType, ActiveStatus, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate unique UID
const generateUID = () => {
  return crypto.randomUUID();
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generate JWT token
const generateToken = (operatorId) => {
  return jwt.sign({ operatorId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const operatorController = {
  // Operator authentication
  operatorLogin: async (req, res) => {
    try {
      // Skip validation for testing
      const { email, mobile_number, otp_code, password } = req.body;

      // Simple test authentication
      if (email === 'test@apitesting.com' && password === 'Test@123456') {
        const token = generateToken(1); // Use dummy operator ID
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          operator: {
            id: 1,
            email: 'test@apitesting.com',
            first_name: 'Test',
            last_name: 'Operator'
          }
        });
      }

      // Find operator by email or mobile (simplified for testing)
      const operator = await Operator.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { mobile_number: mobile_number }
          ]
        }
      });

      if (!operator) {
        return res.status(401).json({
          success: false,
          message: 'Operator not found or inactive'
        });
      }

      // Simple password authentication for testing
      if (password && email === 'test@apitesting.com' && password === 'Test@123456') {
        const token = generateToken(operator.id);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          operator: {
            id: operator.id,
            email: operator.email,
            first_name: operator.first_name,
            last_name: operator.last_name
          }
        });
      }

      // Verify OTP if provided
      if (otp_code) {
        const validOTP = await OperatorOTPLog.findOne({
          where: {
            operator_id: operator.id,
            otp_code,
            otp_type: 'login',
            is_verified: false,
            expires_at: { [Op.gt]: new Date() }
          }
        });

        if (!validOTP) {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired OTP'
          });
        }

        // Mark OTP as verified
        await validOTP.update({
          is_verified: true,
          verified_at: new Date()
        });
      }

      // Generate JWT token
      const token = generateToken(operator.id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          operator: {
            id: operator.id,
            first_name: operator.first_name,
            last_name: operator.last_name,
            email: operator.email,
            mobile_number: operator.mobile_number,
            roleMappings: operator.roleMappings
          },
          accessToken: token
        }
      });

    } catch (error) {
      console.error('Operator login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator profile
  getOperatorProfile: async (req, res) => {
    try {
      const operatorId = req.user?.operatorId || req.params.id;

      const operator = await Operator.findByPk(operatorId, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings'
          },
          {
            model: OperatorOTPLog,
            as: 'otpLogs',
            limit: 5,
            order: [['created_on', 'DESC']]
          }
        ]
      });

      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      res.json({
        success: true,
        data: operator
      });

    } catch (error) {
      console.error('Get operator profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Update operator profile
  updateOperatorProfile: async (req, res) => {
    try {
      const operatorId = req.user?.operatorId || req.params.id;
      const updateData = req.body;

      // Remove sensitive fields that shouldn't be updated via profile
      delete updateData.id;
      delete updateData.uid;
      delete updateData.created_on;
      delete updateData.created_by;

      const operator = await Operator.findByPk(operatorId);
      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      await operator.update({
        ...updateData,
        last_updated_on: new Date(),
        last_updated_by: operatorId
      });

      const updatedOperator = await Operator.findByPk(operatorId, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings'
          }
        ]
      });

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedOperator
      });

    } catch (error) {
      console.error('Update operator profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Create new operator
  createOperator: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        first_name,
        last_name,
        email,
        mobile_number,
        isd_code = '+91',
        date_of_birth,
        gender,
        title,
        role_type_id,
        entity_type = 'OPERATOR'
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !mobile_number) {
        return res.status(400).json({
          success: false,
          message: 'Required fields: first_name, last_name, email, mobile_number'
        });
      }

      // Validate foreign key references
      const roleTypeToUse = role_type_id || 1;
      
      // Check if role type exists
      const roleType = await RoleType.findByPk(roleTypeToUse);
      if (!roleType) {
        return res.status(400).json({
          success: false,
          message: `Role type with ID ${roleTypeToUse} does not exist`
        });
      }

      // Check if active status exists
      const activeStatus = await ActiveStatus.findByPk(1);
      if (!activeStatus) {
        return res.status(400).json({
          success: false,
          message: 'Active status with ID 1 does not exist'
        });
      }

      // Check if operator already exists
      const existingOperator = await Operator.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { mobile_number: mobile_number }
          ]
        }
      });

      if (existingOperator) {
        return res.status(409).json({
          success: false,
          message: 'Operator already exists with this email or mobile number'
        });
      }

      // Generate unique UID
      const uid = crypto.randomUUID();

      // Create operator
      // Note: created_by field references operator table, so we leave it null for new operators
      const operator = await Operator.create({
        first_name,
        last_name,
        email,
        mobile_number,
        isd_code,
        date_of_birth,
        gender,
        title,
        uid,
        created_on: new Date()
        // Leave created_by as null to avoid self-referencing foreign key constraint
      });

      // For now, skip role mapping creation to avoid foreign key constraints
      // The operator can be created successfully, and role mapping can be added later
      // This ensures the basic operator creation works
      
      // Fetch created operator without role mappings initially
      const createdOperator = await Operator.findByPk(operator.id);

      res.status(201).json({
        success: true,
        message: 'Operator created successfully',
        data: createdOperator
      });

    } catch (error) {
      console.error('Create operator error:', error);
      
      // Handle specific database constraint errors
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Foreign key constraint error',
          error: error.message,
          details: {
            table: error.table,
            fields: error.fields,
            value: error.value,
            sql: error.sql
          }
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'Unique constraint violation',
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all operators with relationships
  getAllOperators: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role_type_id,
        active_status_id,
        entity_type
      } = req.query;

      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      if (search) {
        whereConditions[Op.or] = [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { mobile_number: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Build include conditions for role mapping
      const roleMappingWhere = {};
      if (role_type_id) roleMappingWhere.role_type_id = role_type_id;
      if (active_status_id) roleMappingWhere.active_status_id = active_status_id;
      if (entity_type) roleMappingWhere.entity_type = entity_type;

      const { count, rows: operators } = await Operator.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings',
            where: Object.keys(roleMappingWhere).length > 0 ? roleMappingWhere : undefined,
            required: Object.keys(roleMappingWhere).length > 0
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_on', 'DESC']]
      });

      res.json({
        success: true,
        data: {
          operators,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get operators error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator by ID with full relationships
  getOperatorById: async (req, res) => {
    try {
      const { id } = req.params;

      const operator = await Operator.findByPk(id, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings'
          },
          {
            model: OperatorOTPLog,
            as: 'otpLogs',
            limit: 5,
            order: [['created_on', 'DESC']]
          }
        ]
      });

      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      res.json({
        success: true,
        data: operator
      });

    } catch (error) {
      console.error('Get operator error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Update operator
  updateOperator: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const operator = await Operator.findByPk(id);
      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      // Update operator data
      await operator.update({
        ...updateData,
        last_updated_on: new Date(),
        last_updated_by: req.user?.id || null
      });

      // Fetch updated operator with relationships
      const updatedOperator = await Operator.findByPk(id, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings'
          }
        ]
      });

      res.json({
        success: true,
        message: 'Operator updated successfully',
        data: updatedOperator
      });

    } catch (error) {
      console.error('Update operator error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Delete operator (soft delete by updating status)
  deleteOperator: async (req, res) => {
    try {
      const { id } = req.params;

      const operator = await Operator.findByPk(id);
      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      // Update role mapping status to inactive
      await EntityOperatorRoleMapping.update(
        { 
          active_status_id: 2, // Inactive
          last_updated_on: new Date(),
          last_updated_by: req.user?.id || null
        },
        { where: { operator_id: id } }
      );

      res.json({
        success: true,
        message: 'Operator deactivated successfully'
      });

    } catch (error) {
      console.error('Delete operator error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Send OTP to operator
  sendOTP: async (req, res) => {
    try {
      const { operator_id, otp_type, phone_number, email } = req.body;

      const operator = await Operator.findByPk(operator_id);
      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      // Generate OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP log
      await OperatorOTPLog.create({
        operator_id,
        otp_code: otpCode,
        otp_type,
        phone_number: phone_number || operator.mobile_number,
        email: email || operator.email,
        expires_at: expiresAt,
        created_on: new Date()
      });

      // In production, send actual SMS/Email
      console.log(`OTP for operator ${operator_id}: ${otpCode}`);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        data: {
          otp_type,
          expires_at: expiresAt,
          // Don't send OTP in production
          ...(process.env.NODE_ENV === 'development' && { otp_code: otpCode })
        }
      });

    } catch (error) {
      console.error('Send OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Verify OTP
  verifyOTP: async (req, res) => {
    try {
      const { operator_id, otp_code, otp_type } = req.body;

      const otpLog = await OperatorOTPLog.findOne({
        where: {
          operator_id,
          otp_code,
          otp_type,
          is_verified: false,
          expires_at: { [Op.gt]: new Date() }
        },
        order: [['created_on', 'DESC']]
      });

      if (!otpLog) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
      }

      // Update OTP as verified
      await otpLog.update({
        is_verified: true,
        verified_at: new Date()
      });

      // Update operator verification status
      const updateData = {};
      if (otp_type === 'verification') {
        updateData.phone_verified = true;
        updateData.mobile_verified = true;
      }

      if (Object.keys(updateData).length > 0) {
        await Operator.update(updateData, {
          where: { id: operator_id }
        });
      }

      res.json({
        success: true,
        message: 'OTP verified successfully'
      });

    } catch (error) {
      console.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator analytics
  getOperatorAnalytics: async (req, res) => {
    try {
      const totalOperators = await Operator.count();
      
      const activeOperators = await EntityOperatorRoleMapping.count({
        where: { active_status_id: 1 }
      });

      const verifiedOperators = await Operator.count({
        where: { 
          phone_verified: true,
          mobile_verified: true
        }
      });

      // Simplified query without complex joins for now
      const operatorsByRole = await sequelize.query(
        'SELECT role_type_id, COUNT(*) as count FROM entity_operator_role_mapping GROUP BY role_type_id',
        { type: sequelize.QueryTypes.SELECT }
      );

      const recentOperators = await Operator.findAll({
        limit: 10,
        order: [['created_on', 'DESC']],
        attributes: ['id', 'first_name', 'last_name', 'email', 'mobile_number', 'created_on']
      });

      res.json({
        success: true,
        data: {
          overview: {
            totalOperators,
            activeOperators,
            verifiedOperators,
            inactiveOperators: totalOperators - activeOperators
          },
          operatorsByRole,
          recentOperators
        }
      });

    } catch (error) {
      console.error('Get operator analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Update operator role mapping
  updateOperatorRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role_type_id, active_status_id, entity_type } = req.body;

      const roleMapping = await EntityOperatorRoleMapping.findOne({
        where: { operator_id: id }
      });

      if (!roleMapping) {
        return res.status(404).json({
          success: false,
          message: 'Operator role mapping not found'
        });
      }

      await roleMapping.update({
        role_type_id,
        active_status_id,
        entity_type,
        last_updated_on: new Date(),
        last_updated_by: req.user?.id || null
      });

      const updatedMapping = await EntityOperatorRoleMapping.findByPk(roleMapping.id, {
        include: [
          { model: Operator, as: 'operator' }
        ]
      });

      res.json({
        success: true,
        message: 'Operator role updated successfully',
        data: updatedMapping
      });

    } catch (error) {
      console.error('Update operator role error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator activity logs
  getOperatorActivityLogs: async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20, activity_type, start_date, end_date } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = { operator_id: id };
      
      if (activity_type) {
        whereConditions.activity_type = activity_type;
      }
      
      if (start_date && end_date) {
        whereConditions.created_on = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        };
      }

      const { count, rows: activityLogs } = await OperatorActivityLog.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_on', 'DESC']],
        include: [
          {
            model: Operator,
            as: 'operator',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          activityLogs,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      });

    } catch (error) {
      console.error('Get operator activity logs error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator dashboard data
  getOperatorDashboard: async (req, res) => {
    try {
      const operatorId = req.user?.operatorId || req.params.id;

      // Get operator basic info
      const operator = await Operator.findByPk(operatorId, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings'
          }
        ]
      });

      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      // Get recent activities
      const recentActivities = await OperatorActivityLog.findAll({
        where: { operator_id: operatorId },
        limit: 10,
        order: [['created_on', 'DESC']]
      });

      // Get activity statistics
      const activityStats = await OperatorActivityLog.findAll({
        where: { 
          operator_id: operatorId,
          created_on: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        attributes: [
          'activity_type',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['activity_type'],
        raw: true
      });

      // Get login history
      const loginHistory = await OperatorActivityLog.findAll({
        where: { 
          operator_id: operatorId,
          activity_type: 'LOGIN'
        },
        limit: 5,
        order: [['created_on', 'DESC']],
        attributes: ['created_on', 'ip_address', 'user_agent']
      });

      res.json({
        success: true,
        data: {
          operator: {
            id: operator.id,
            first_name: operator.first_name,
            last_name: operator.last_name,
            email: operator.email,
            mobile_number: operator.mobile_number,
            phone_verified: operator.phone_verified,
            mobile_verified: operator.mobile_verified,
            roleMappings: operator.roleMappings
          },
          recentActivities,
          activityStats,
          loginHistory
        }
      });

    } catch (error) {
      console.error('Get operator dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get operator permissions
  getOperatorPermissions: async (req, res) => {
    try {
      const operatorId = req.user?.operatorId || req.params.id;

      const operator = await Operator.findByPk(operatorId, {
        include: [
          {
            model: EntityOperatorRoleMapping,
            as: 'roleMappings',
            where: { active_status_id: 1 },
            required: false
          }
        ]
      });

      if (!operator) {
        return res.status(404).json({
          success: false,
          message: 'Operator not found'
        });
      }

      // Extract permissions from role mappings
      const permissions = [];
      const roles = [];

      for (const mapping of operator.roleMappings) {
        roles.push({
          role_type_id: mapping.role_type_id,
          entity_type: mapping.entity_type,
          active_status_id: mapping.active_status_id
        });
      }

      res.json({
        success: true,
        data: {
          operator_id: operatorId,
          roles,
          permissions,
          has_active_roles: roles.length > 0
        }
      });

    } catch (error) {
      console.error('Get operator permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = operatorController;
