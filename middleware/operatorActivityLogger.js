const { OperatorActivityLog } = require('../models');

// Middleware to log operator activities
const logOperatorActivity = (activityType, description = null) => {
  return async (req, res, next) => {
    // Store original res.json to capture response
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log the activity after response is sent
      setImmediate(async () => {
        try {
          const operatorId = req.user?.operatorId || req.user?.id;
          
          if (operatorId) {
            await OperatorActivityLog.create({
              operator_id: operatorId,
              activity_type: activityType,
              activity_description: description || `${activityType.toLowerCase().replace('_', ' ')} action`,
              ip_address: req.ip || req.connection.remoteAddress,
              user_agent: req.get('User-Agent'),
              request_method: req.method,
              request_url: req.originalUrl,
              response_status: res.statusCode,
              session_id: req.sessionID,
              metadata: {
                body: req.body,
                params: req.params,
                query: req.query,
                timestamp: new Date().toISOString()
              },
              created_on: new Date()
            });
          }
        } catch (error) {
          console.error('Error logging operator activity:', error);
        }
      });
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Helper function to log specific activities
const logActivity = async (operatorId, activityType, description, metadata = {}) => {
  try {
    await OperatorActivityLog.create({
      operator_id: operatorId,
      activity_type: activityType,
      activity_description: description,
      metadata,
      created_on: new Date()
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = {
  logOperatorActivity,
  logActivity
};
