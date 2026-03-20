const ErrorResponse = require('../utils/errorResponse');

const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const apiSecret = req.headers['x-api-secret'];

  // In a real application, you would validate these against your database
  // For now, we'll use simple validation
  const validApiKey = process.env.API_KEY || 'your-api-key';
  const validApiSecret = process.env.API_SECRET || 'your-api-secret';

  if (!apiKey || !apiSecret) {
    return next(new ErrorResponse('API key and secret are required', 401));
  }

  if (apiKey !== validApiKey || apiSecret !== validApiSecret) {
    return next(new ErrorResponse('Invalid API credentials', 401));
  }

  next();
};

module.exports = validateApiKey;
