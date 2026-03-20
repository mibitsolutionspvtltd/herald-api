# Student Herald API - Backend

Professional Admin Panel Backend for Student Herald platform.

## 🚀 Quick Deploy (FREE)

**Want to deploy immediately?** → Open **`START_HERE.md`**

Your app is 100% ready to deploy to free hosting platforms like Render.com, Railway.app, or Fly.io.

```bash
# Check if ready to deploy
npm run prepare-deploy

# Then follow START_HERE.md
```

## Features

- RESTful API with Express.js
- MySQL database with Sequelize ORM
- JWT authentication & authorization
- Role-based access control
- File upload with AWS S3 integration
- Comprehensive logging with Winston
- Rate limiting & security headers
- Docker support
- PM2 process management

## Prerequisites

- Node.js 16+ 
- MySQL 8.0+
- AWS account (for S3 storage)

## Installation

```bash
npm install
```

## Configuration

1. Copy environment example file:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
   - Database credentials
   - JWT secret
   - AWS credentials
   - Frontend URL

## Database Setup

Run the main migration file:
```bash
mysql -u your_user -p your_database < migrations/COMPLETE_PRODUCTION_MIGRATION.sql
```

Then seed initial data:
```bash
npm run seed
```

## Running the Application

### Development
```bash
npm run dev
```

### Production

Using Node:
```bash
npm run prod
```

Using PM2:
```bash
npm run prod:pm2
```

Using Docker:
```bash
npm run prod:docker
```

## API Endpoints

- `/api/health` - Health check
- `/api/auth` - Authentication
- `/api/articles` - Article management
- `/api/universities` - University management
- `/api/courses` - Course management
- `/api/advertisements` - Advertisement management
- `/api/users` - User management
- `/api/reports` - Analytics & reports

Full API documentation available in `API_ENDPOINTS_REFERENCE.md`

## Project Structure

```
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── scripts/         # Database scripts
├── utils/           # Utility functions
├── migrations/      # Database migrations
└── server.js        # Application entry point
```

## Security

- Helmet.js for security headers
- Rate limiting on API endpoints
- JWT token authentication
- Input validation with express-validator
- SQL injection protection via Sequelize ORM

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

View logs:
```bash
npm run logs        # Combined logs
npm run logs:error  # Error logs only
```

## Deployment

### Free Hosting Options

This application can be deployed to several free platforms:

1. **Render.com** (Recommended for beginners)
   - See `DEPLOY_RENDER.md` for detailed guide
   - Free tier: 750 hours/month
   - Includes free MySQL database

2. **Railway.app** (Recommended for better performance)
   - See `DEPLOY_RAILWAY.md` for quick guide
   - $5 free credit monthly
   - No sleep on inactivity

3. **Fly.io** (For production-like setup)
   - See `FREE_DEPLOYMENT_GUIDE.md`
   - Free tier: 3 VMs
   - Global deployment

### Quick Deploy to Render

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Deploy to Render"
git push origin main

# 2. Go to render.com and create account
# 3. Create MySQL database
# 4. Create Web Service from GitHub
# 5. Add environment variables
# 6. Deploy!
```

See `DEPLOY_RENDER.md` for complete step-by-step instructions.

## Documentation

- `README.md` - This file
- `FREE_DEPLOYMENT_GUIDE.md` - All free hosting options
- `DEPLOY_RENDER.md` - Render.com deployment guide
- `DEPLOY_RAILWAY.md` - Railway.app deployment guide
- `PRODUCTION_CHECKLIST.md` - Pre-deployment checklist
- `API_ENDPOINTS_REFERENCE.md` - API documentation
- `CLEANUP_SUMMARY.md` - Codebase cleanup details

## License

MIT
