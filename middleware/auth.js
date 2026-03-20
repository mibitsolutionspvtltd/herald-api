const jwt = require('jsonwebtoken');
const { Operator, EntityOperatorRoleMapping, RoleType, BackOfficeUsers } = require('../models');

// Authenticate token middleware with dynamic role support
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔐 Auth middleware called:', req.path, 'Has token:', !!token);

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_admin_panel_2024');

    console.log('✅ Token decoded:', JSON.stringify(decoded, null, 2));

    // Handle different token structures
    const operatorId = decoded.id || decoded.operatorId || decoded.userId;

    if (!operatorId) {
      console.log('❌ Invalid token - no operator ID found');
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Set user from token
    req.user = {
      id: operatorId,
      operatorId: operatorId,
      email: decoded.email,
      type: decoded.type || 'operator',
      role: decoded.role,
      roleId: decoded.roleId,
      roles: decoded.roles || [],
      permissions: decoded.permissions || '',
      backOfficeUserId: decoded.backOfficeUserId
    };

    console.log('✅ User authenticated:', req.user.id, 'Role:', req.user.role);
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check if user has specific role(s)
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin type users (operators with ADMIN role) bypass role checks
    if (req.user.type === 'admin') {
      return next();
    }

    // Convert to array if single role provided
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check primary role
    if (rolesArray.includes(req.user.role)) {
      return next();
    }

    // Check if user has any of the allowed roles in their roles array
    if (req.user.roles && req.user.roles.length > 0) {
      const hasRole = req.user.roles.some(role =>
        rolesArray.includes(role.code) || rolesArray.includes(role.name)
      );

      if (hasRole) {
        return next();
      }
    }

    // Check if user has ALL permission (super admin)
    const permissions = (req.user.permissions || '').split(',').map(p => p.trim());
    if (permissions.includes('ALL') || permissions.includes('*')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions',
      required: rolesArray,
      current: req.user.role
    });
  };
};

// Check if user has specific permission(s)
const checkPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = req.user.permissions || '';
    const permissionsArray = userPermissions.split(',').map(p => p.trim()).filter(p => p);

    console.log('🔍 Checking permissions:', {
      required: requiredPermissions,
      userPermissions: permissionsArray,
      userType: req.user.type,
      userRole: req.user.role
    });

    // Convert to array if single permission provided
    const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    // Check if user has wildcard/admin permissions
    if (permissionsArray.includes('*') ||
      permissionsArray.includes('ALL') ||
      permissionsArray.includes('ALL_PERMISSIONS') ||
      req.user.type === 'admin') { // Admin users have all permissions
      console.log('✅ Permission granted (admin/wildcard)');
      return next();
    }

    // Check if user has at least one of the required permissions
    const hasPermission = required.some(permission =>
      permissionsArray.includes(permission)
    );

    if (!hasPermission) {
      console.log('❌ Permission denied');
      return res.status(403).json({
        success: false,
        message: 'Permission denied',
        required: required,
        current: permissionsArray
      });
    }

    console.log('✅ Permission granted');
    next();
  };
};

// Check if user can access admin portal
const checkAdminPortalAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Admin users always have portal access
  if (req.user.type === 'admin') {
    return next();
  }

  // Check if user has ACCESS_ADMIN_PORTAL permission
  const permissions = (req.user.permissions || '').split(',').map(p => p.trim());

  if (permissions.includes('ACCESS_ADMIN_PORTAL') ||
    permissions.includes('*') ||
    permissions.includes('ALL') ||
    permissions.includes('ALL_PERMISSIONS')) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Admin portal access denied'
  });
};

// Check if user can edit own content
const checkOwnContent = (getContentCreatorId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Admin users can edit any content
      if (req.user.type === 'admin') {
        return next();
      }

      // Check if user has permission to edit any content
      const permissions = (req.user.permissions || '').split(',').map(p => p.trim());
      if (permissions.includes('EDIT_ANY_ARTICLE') ||
        permissions.includes('*') ||
        permissions.includes('ALL') ||
        permissions.includes('ALL_PERMISSIONS')) {
        return next();
      }

      // Get the content creator ID using the provided function
      const creatorId = await getContentCreatorId(req);

      if (creatorId === req.user.id || creatorId === req.user.operatorId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You can only edit your own content'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking content ownership',
        error: error.message
      });
    }
  };
};

// Check multiple permissions (user must have ALL of them)
const checkAllPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = req.user.permissions || '';
    const permissionsArray = userPermissions.split(',').map(p => p.trim()).filter(p => p);

    // Convert to array if single permission provided
    const required = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

    // Check if user has wildcard permission or is admin
    if (permissionsArray.includes('*') ||
      permissionsArray.includes('ALL') ||
      permissionsArray.includes('ALL_PERMISSIONS') ||
      req.user.type === 'admin') {
      return next();
    }

    // Check if user has ALL required permissions
    const hasAllPermissions = required.every(permission =>
      permissionsArray.includes(permission)
    );

    if (!hasAllPermissions) {
      const missing = required.filter(p => !permissionsArray.includes(p));
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: required,
        missing: missing,
        current: permissionsArray
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token, but sets user if valid token provided
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_admin_panel_2024');

    const operatorId = decoded.id || decoded.operatorId || decoded.userId;

    if (operatorId) {
      req.user = {
        id: operatorId,
        operatorId: operatorId,
        email: decoded.email,
        type: decoded.type || 'operator',
        role: decoded.role,
        roleId: decoded.roleId,
        roles: decoded.roles || [],
        permissions: decoded.permissions || '',
        backOfficeUserId: decoded.backOfficeUserId
      };
    }
  } catch (error) {
    // Invalid token, but continue without authentication
    console.log('Optional auth - invalid token:', error.message);
  }

  next();
};

module.exports = {
  authenticateToken,
  checkRole,
  checkPermission,
  checkAllPermissions,
  checkAdminPortalAccess,
  checkOwnContent,
  optionalAuth
};
