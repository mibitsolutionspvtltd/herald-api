# Deploy to Render.com - Step by Step

## Prerequisites
- GitHub account
- Render.com account (free)
- Your code pushed to GitHub

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create a new repository (e.g., `student-herald-api`)
3. Don't initialize with README (we already have one)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/student-herald-api.git
git branch -M main
git push -u origin main
```

## Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

## Step 3: Create MySQL Database

### 3.1 Create Database
1. From Render Dashboard, click "New +"
2. Select "MySQL"
3. Configure:
   - **Name**: `student-herald-db`
   - **Database**: `student_herald`
   - **User**: `admin`
   - **Region**: Choose closest to you
   - **Plan**: Free

4. Click "Create Database"

### 3.2 Get Database Credentials
1. Wait for database to be ready (2-3 minutes)
2. Click on your database
3. Copy these values (you'll need them):
   - **Internal Database URL** (for Render services)
   - **External Database URL** (for local migrations)
   - Host, Port, Database, Username, Password

### 3.3 Run Migrations
From your local machine:
```bash
# Use the External Database URL
# Run the new comprehensive migration (RECOMMENDED)
mysql -h <host> -P <port> -u <user> -p<password> <database> < migrations/COMPLETE_DATABASE_SCHEMA.sql

# This single file includes everything:
# - All tables with proper relationships
# - Master/lookup tables with seed data
# - Indexes for performance
# - Views, triggers, and stored procedures
```

Or use a MySQL client like MySQL Workbench or DBeaver.

## Step 4: Create Web Service

### 4.1 Create Service
1. From Render Dashboard, click "New +"
2. Select "Web Service"
3. Click "Connect a repository"
4. Find and select your `student-herald-api` repository
5. Click "Connect"

### 4.2 Configure Service
Fill in these settings:

- **Name**: `student-herald-api`
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: (leave blank)
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 4.3 Add Environment Variables
Click "Advanced" and add these environment variables:

```
NODE_ENV=production
PORT=3001

# Database (from Step 3.2)
DB_HOST=<your-db-host>
DB_USER=admin
DB_PASSWORD=<your-db-password>
DB_NAME=student_herald
DB_PORT=3306

# JWT
JWT_SECRET=<generate-a-strong-random-string>
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://your-frontend-url.com

# AWS S3 (optional - for file uploads)
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=<your-bucket-name>
```

**Generate JWT_SECRET**:
```bash
# On your local machine
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Watch the logs for any errors

## Step 5: Verify Deployment

### 5.1 Check Health Endpoint
Your app will be at: `https://student-herald-api.onrender.com`

Test the health endpoint:
```bash
curl https://student-herald-api.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-20T...",
  "environment": "production"
}
```

### 5.2 Check Logs
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for:
   - ✅ "Database connection established successfully"
   - ✅ "Server started on port 3001"
   - ❌ Any error messages

## Step 6: Seed Initial Data

### Option A: Using Render Shell
1. Go to your service dashboard
2. Click "Shell" tab
3. Run:
```bash
npm run seed
```

### Option B: Using API Endpoint
Create an admin user via API call (if you have a seed endpoint).

## Step 7: Test Your API

### Test Authentication
```bash
curl -X POST https://student-herald-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-password"}'
```

### Test Other Endpoints
```bash
# Get articles
curl https://student-herald-api.onrender.com/api/articles

# Get universities
curl https://student-herald-api.onrender.com/api/universities
```

## Step 8: Update Frontend

Update your frontend to use the new API URL:
```javascript
const API_URL = 'https://student-herald-api.onrender.com/api';
```

## Troubleshooting

### Database Connection Failed
- ✅ Check DB credentials in environment variables
- ✅ Ensure database is in same region as web service
- ✅ Use Internal Database URL (not External)

### App Crashes on Start
- ✅ Check logs for error messages
- ✅ Verify all required environment variables are set
- ✅ Ensure migrations were run successfully

### 502 Bad Gateway
- ✅ App is still starting (wait 2-3 minutes)
- ✅ Check if app is listening on correct PORT
- ✅ Verify health check endpoint works

### App Sleeps After 15 Minutes
- ⚠️ This is normal on free tier
- ⚠️ First request after sleep takes 30-60 seconds
- 💡 Use a service like UptimeRobot to ping every 14 minutes

## Keep Your App Awake (Optional)

### Use UptimeRobot (Free)
1. Sign up at https://uptimerobot.com
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://student-herald-api.onrender.com/api/health`
   - Interval: 5 minutes
3. This keeps your app from sleeping

## Auto-Deploy on Git Push

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will:
1. Detect the push
2. Run build command
3. Deploy new version
4. Zero-downtime deployment

## Monitoring

### View Logs
```bash
# Real-time logs in Render dashboard
# Or use Render CLI
render logs -f
```

### Metrics
- Go to service dashboard
- View CPU, Memory, Request metrics
- Set up alerts for errors

## Cost

**Free Tier Includes:**
- ✅ 750 hours/month (enough for 1 service)
- ✅ 100GB bandwidth
- ✅ Free SSL certificate
- ✅ Auto-deploy from GitHub
- ✅ 1GB MySQL database

**Limitations:**
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Slower cold starts
- ⚠️ Shared resources

## Upgrade Options

If you need more:
- **Starter Plan**: $7/month (no sleep, more resources)
- **Standard Plan**: $25/month (dedicated resources)

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend (Vercel/Netlify)
3. ✅ Update CORS settings with frontend URL
4. ✅ Test all API endpoints
5. ✅ Set up monitoring
6. ✅ Configure custom domain (optional)

## Support

- 📚 Render Docs: https://render.com/docs
- 💬 Render Community: https://community.render.com
- 📧 Support: support@render.com

---

**Congratulations! Your API is now live! 🎉**
