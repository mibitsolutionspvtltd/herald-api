/**
 * Secrets Management
 * Handles secure loading of sensitive configuration
 */

const crypto = require('crypto');

/**
 * Generate a strong JWT secret
 * @returns {string} 64-character hex string
 */
function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Validate JWT secret strength
 * @param {string} secret 
 * @returns {boolean}
 */
function validateJWTSecret(secret) {
  return secret && secret.length >= 64;
}

/**
 * Get JWT secret with validation
 * @returns {string}
 */
function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  if (!validateJWTSecret(secret)) {
    console.warn('⚠️  WARNING: JWT_SECRET is weak (should be 64+ characters)');
    console.warn('⚠️  Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  }
  
  return secret;
}

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const required = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'S3_BUCKET_NAME',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('❌ Please check your .env file');
    return false;
  }
  
  return true;
}

/**
 * Mask sensitive data for logging
 * @param {string} value 
 * @returns {string}
 */
function maskSecret(value) {
  if (!value || value.length < 8) return '***';
  return value.substring(0, 4) + '***' + value.substring(value.length - 4);
}

module.exports = {
  generateJWTSecret,
  validateJWTSecret,
  getJWTSecret,
  validateEnvironment,
  maskSecret,
};
