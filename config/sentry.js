/**
 * Sentry Error Tracking Configuration
 * Optional but recommended for production monitoring
 */

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const logger = require('./logger');

/**
 * Initialize Sentry if DSN is provided
 */
function initSentry(app) {
  const sentryDsn = process.env.SENTRY_DSN;
  
  if (!sentryDsn) {
    logger.info('Sentry DSN not configured - error tracking disabled');
    return false;
  }
  
  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'development',
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Profiling
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      integrations: [
        new ProfilingIntegration(),
      ],
      
      // Release tracking
      release: process.env.npm_package_version || '1.0.0',
      
      // Filter sensitive data
      beforeSend(event, hint) {
        // Remove sensitive headers
        if (event.request && event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
        
        // Remove sensitive data from extra
        if (event.extra) {
          delete event.extra.password;
          delete event.extra.token;
          delete event.extra.secret;
        }
        
        return event;
      },
    });
    
    // Add Sentry middleware to Express app
    if (app) {
      app.use(Sentry.Handlers.requestHandler());
      app.use(Sentry.Handlers.tracingHandler());
    }
    
    logger.info('✅ Sentry error tracking initialized');
    return true;
  } catch (error) {
    logger.error('Failed to initialize Sentry:', error);
    return false;
  }
}

/**
 * Add Sentry error handler middleware (must be added after routes)
 */
function addSentryErrorHandler(app) {
  if (process.env.SENTRY_DSN && app) {
    app.use(Sentry.Handlers.errorHandler());
  }
}

/**
 * Capture exception manually
 */
function captureException(error, context = {}) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
  logger.error('Exception captured:', { error, context });
}

/**
 * Capture message manually
 */
function captureMessage(message, level = 'info', context = {}) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    });
  }
  logger[level](message, context);
}

module.exports = {
  initSentry,
  addSentryErrorHandler,
  captureException,
  captureMessage,
  Sentry,
};
