/**
 * AWS Secrets Manager Helper
 * Use this in production instead of .env file
 */

const AWS = require('aws-sdk');
const logger = require('./logger');

// Initialize Secrets Manager client
const secretsManager = new AWS.SecretsManager({
  region: process.env.AWS_REGION || 'ap-south-1'
});

/**
 * Get secret from AWS Secrets Manager
 * @param {string} secretName - Name of the secret
 * @returns {Promise<object>} - Secret value as JSON object
 */
async function getSecret(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ 
      SecretId: secretName 
    }).promise();
    
    if ('SecretString' in data) {
      return JSON.parse(data.SecretString);
    } else {
      const buff = Buffer.from(data.SecretBinary, 'base64');
      return JSON.parse(buff.toString('ascii'));
    }
  } catch (error) {
    logger.error(`Failed to retrieve secret ${secretName}:`, error);
    throw error;
  }
}

/**
 * Load secrets into environment variables
 * @param {string} secretName - Name of the secret containing all credentials
 */
async function loadSecretsToEnv(secretName) {
  try {
    const secrets = await getSecret(secretName);
    
    // Load secrets into process.env
    Object.keys(secrets).forEach(key => {
      if (!process.env[key]) {
        process.env[key] = secrets[key];
      }
    });
    
    logger.info('✅ Secrets loaded from AWS Secrets Manager');
    return true;
  } catch (error) {
    logger.error('Failed to load secrets:', error);
    return false;
  }
}

/**
 * Use this in production startup:
 * 
 * if (process.env.NODE_ENV === 'production') {
 *   await loadSecretsToEnv('student-herald/production');
 * }
 */

module.exports = {
  getSecret,
  loadSecretsToEnv,
};
