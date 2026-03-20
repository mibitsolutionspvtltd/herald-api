# Free Deployment Options for Student Herald API

## Option 1: Render.com (RECOMMENDED)

### Features
- ✅ Free tier with 750 hours/month
- ✅ Auto-deploy from GitHub
- ✅ Free PostgreSQL/MySQL database
- ✅ SSL certificates included
- ✅ Easy environment variable management
- ⚠️ Sleeps after 15 minutes of inactivity

### Deployment Steps

1. **Create account**: https://render.com

2. **Push code to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `student-herald-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Instance Type: `Free`

4. **Add Environment Variables**:
   - Go to "Environment" tab
   - Add all variables from `.env.example`

5. **Create Database**:
   - Click "New +" → "MySQL"
   - Copy connection details to environment variables

---

## Option 2: Railway.app

### Features
- ✅ $5 free credit monthly
- ✅ Auto-deploy from GitHub
- ✅ Built-in MySQL database
- ✅ No sleep on inactivity
- ✅ Great developer experience

### Deployment Steps

1. **Create account**: https://railway.app

2. **Deploy from GitHub**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MySQL Database**:
   - Click "New" → "Database" → "Add MySQL"
   - Railway auto-configures connection

4. **Configure Service**:
   - Add environment variables
   - Railway auto-detects Node.js

---

## Option 3: Fly.io

### Features
- ✅ Free tier: 3 VMs, 3GB storage
- ✅ Global deployment
- ✅ No sleep on inactivity
- ✅ PostgreSQL included

### Deployment Steps

1. **Install Fly CLI**:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Mac/Linux
curl -L https://fly.io/install.sh | sh
```

2. **Login**:
```bash
fly auth login
```

3. **Launch app**:
```bash
fly launch
```

4. **Set secrets**:
```bash
fly secrets set JWT_SECRET=your_secret
fly secrets set DB_HOST=your_db_host
# ... add all environment variables
```

5. **Deploy**:
```bash
fly deploy
```

---

## Option 4: Cyclic.sh

### Features
- ✅ Completely free
- ✅ Auto-deploy from GitHub
- ✅ Built-in DynamoDB
- ⚠️ No MySQL (need external DB)

### Deployment Steps

1. **Create account**: https://cyclic.sh

2. **Connect GitHub**:
   - Click "Deploy"
   - Select repository
   - Auto-deploys on push

3. **Use external database**:
   - Use free MySQL from Render or PlanetScale

---

## Free Database Options

### PlanetScale (MySQL)
- ✅ 5GB storage free
- ✅ 1 billion row reads/month
- ✅ Serverless MySQL
- 🔗 https://planetscale.com

### Render PostgreSQL
- ✅ 1GB storage free
- ✅ Auto-backups
- ⚠️ Expires after 90 days
- 🔗 https://render.com

### Supabase (PostgreSQL)
- ✅ 500MB database
- ✅ Unlimited API requests
- ✅ Real-time subscriptions
- 🔗 https://supabase.com

### Neon (PostgreSQL)
- ✅ 3GB storage free
- ✅ Serverless Postgres
- ✅ Auto-scaling
- 🔗 https://neon.tech

---

## Recommended Setup

### Best Free Combination:
1. **Backend**: Render.com Web Service
2. **Database**: PlanetScale MySQL
3. **File Storage**: Cloudinary (free tier)

### Why This Combo?
- ✅ Completely free
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ Good performance
- ✅ Easy to manage

---

## Quick Start: Deploy to Render

I've created all necessary files. Follow these steps:

1. **Create GitHub repository and push code**

2. **Sign up at Render.com**

3. **Create MySQL database**:
   - New → MySQL
   - Copy connection URL

4. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repo
   - Use settings from `render.yaml`

5. **Add environment variables** (from Render dashboard)

6. **Deploy!** 🚀

Your API will be live at: `https://your-app-name.onrender.com`

---

## Cost Comparison

| Platform | Free Tier | Database | Sleep? | Best For |
|----------|-----------|----------|--------|----------|
| Render | 750h/month | Yes | Yes (15min) | Hobby projects |
| Railway | $5 credit | Yes | No | Active development |
| Fly.io | 3 VMs | Yes | No | Production-like |
| Cyclic | Unlimited | No | No | Serverless apps |

---

## Next Steps

1. Choose your platform
2. Follow the deployment guide
3. Test your deployed API
4. Update frontend with new API URL
5. Monitor logs and performance

Need help? Check platform-specific documentation or ask for assistance!
