const { checkPermission } = require('../constants/roles');

/**
 * Middleware to check if user has required permission
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @returns {Function} Express middleware function
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.user.permissions || '';
      
      // Convert single permission to array
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Check if user has at least one of the required permissions
      const hasPermission = permissions.some(permission => 
        checkPermission(userPermissions, permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to perform this action',
          requiredPermissions: permissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Middleware to check if user can edit/delete their own resource
 * @param {string} resourceUserIdField - Field name in resource that contains user ID
 * @param {string} editOwnPermission - Permission for editing own resource
 * @param {string} editAnyPermission - Permission for editing any resource
 * @returns {Function} Express middleware function
 */
const requireOwnershipOrPermission = (resourceUserIdField, editOwnPermission, editAnyPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.user.permissions || '';
      
      // Check if user has permission to edit any resource
      if (checkPermission(userPermissions, editAnyPermission)) {
        return next();
      }

      // Check if user has permission to edit own resource
      if (checkPermission(userPermissions, editOwnPermission)) {
        // Store the ownership check for route handler
        req.requireOwnershipCheck = {
          field: resourceUserIdField,
          userId: req.user.id
        };
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

/**
 * Middleware to check if user has admin portal access
 */
const requireAdminPortalAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const userPermissions = req.user.permissions || '';
  
  if (!checkPermission(userPermissions, 'ACCESS_ADMIN_PORTAL')) {
    return res.status(403).json({
      success: false,
      message: 'You do not have access to the admin portal'
    });
  }

  next();
};

/**
 * Helper function to verify ownership in route handler
 * @param {Object} resource - The resource object
 * @param {Object} req - Express request object
 * @returns {boolean} True if user owns resource or has permission
 */
const verifyOwnership = (resource, req) => {
  if (!req.requireOwnershipCheck) {
    return true; // No ownership check required
  }

  const { field, userId } = req.requireOwnershipCheck;
  const resourceUserId = resource[field];

  if (resourceUserId && resourceUserId.toString() !== userId.toString()) {
    return false;
  }

  return true;
};

module.exports = {
  requirePermission,
  requireOwnershipOrPermission,
  requireAdminPortalAccess,
  verifyOwnership
};
