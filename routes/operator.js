const express = require('express');
const router = express.Router();
const operatorController = require('../controllers/operatorController');
const { authenticateToken, checkRole } = require('../middleware/auth');
const { body, query, param } = require('express-validator');

// Operator management routes
router.post('/', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('mobile_number').notEmpty().withMessage('Mobile number is required'),
    body('role_type_id').optional().isInt().withMessage('Role type ID must be an integer')
  ],
  operatorController.createOperator
);

router.get('/analytics', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  operatorController.getOperatorAnalytics
);

router.get('/', operatorController.getAllOperators); // Made public for testing

router.get('/:id', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [param('id').isInt().withMessage('Operator ID must be an integer')],
  operatorController.getOperatorById
);

router.get('/:id/activity-logs', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    param('id').isInt().withMessage('Operator ID must be an integer'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  operatorController.getOperatorActivityLogs
);

router.put('/:id', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    param('id').isInt().withMessage('Operator ID must be an integer'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('mobile_number').optional().notEmpty().withMessage('Mobile number cannot be empty')
  ],
  operatorController.updateOperator
);

router.delete('/:id', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [param('id').isInt().withMessage('Operator ID must be an integer')],
  operatorController.deleteOperator
);

router.put('/:id/role', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    param('id').isInt().withMessage('Operator ID must be an integer'),
    body('role_type_id').isInt().withMessage('Role type ID is required'),
    body('active_status_id').optional().isInt().withMessage('Active status ID must be an integer')
  ],
  operatorController.updateOperatorRole
);

// Operator OTP routes
router.post('/send-otp', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    body('operator_id').isInt().withMessage('Operator ID is required'),
    body('otp_type').isIn(['login', 'verification', 'password_reset']).withMessage('Invalid OTP type'),
    body('phone_number').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ],
  operatorController.sendOTP
);

router.post('/verify-otp', 
  authenticateToken, 
  checkRole(['ADMIN']), 
  [
    body('operator_id').isInt().withMessage('Operator ID is required'),
    body('otp_code').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('otp_type').isIn(['login', 'verification', 'password_reset']).withMessage('Invalid OTP type')
  ],
  operatorController.verifyOTP
);

module.exports = router;
