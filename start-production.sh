#!/bin/bash
# Production Startup Script
# This script ensures all production requirements are met before starting

echo "🚀 Starting Student Herald API in Production Mode..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production not found"
    echo "Run: node generate-production-env.js"
    exit 1
fi

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

# Check NODE_ENV
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to production"
    export NODE_ENV=production
fi

# Check database connection
echo "🔍 Checking database connection..."
node -e "require('./config/database').sequelize.authenticate().then(() => console.log('✅ Database connected')).catch(e => { console.error('❌ Database connection failed:', e.message); process.exit(1); })"

# Check required environment variables
echo "🔍 Checking environment variables..."
node check-production-readiness.js || {
    echo "⚠️  Production readiness check failed"
    echo "Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
}

# Start with PM2
echo "🚀 Starting server with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ Server started successfully!"
echo "📊 Monitor: pm2 monit"
echo "📝 Logs: pm2 logs student-herald-api"
