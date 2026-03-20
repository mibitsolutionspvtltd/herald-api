# Deploy to Railway.app - Quick Guide

## Why Railway?
- ✅ $5 free credit monthly (~500 hours)
- ✅ No sleep on inactivity
- ✅ Faster than Render
- ✅ Built-in MySQL
- ✅ Better developer experience

## Quick Deploy (5 Minutes)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Deploy to Railway"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Sign up**: https://railway.app
   - Use GitHub login

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Click "Deploy Now"

3. **Add MySQL Database**:
   - Click "New"
   - Select "Database"
   - Choose "Add MySQL"
   - Railway auto-creates and connects it

### Step 3: Configure Environment Variables

Railway auto-detects database variables. Add these manually:

1. Click on your service
2. Go to "Variables" tab
3. Add:

```
NODE_ENV=production
JWT_SECRET=<generate-random-string>
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.com
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=<your-bucket>
```

**Note**: Database variables (DB_HOST, DB_USER, etc.) are auto-configured by Railway!

### Step 4: Run Migrations

1. Click on MySQL database service
2. Go to "Connect" tab
3. Copy connection command
4. Run migrations locally:

```bash
# Run the new comprehensive migration (RECOMMENDED)
mysql -h <host> -u <user> -p<password> -P <port> <database> < migrations/COMPLETE_DATABASE_SCHEMA.sql

# This single file includes everything you need!
```

### Step 5: Generate Domain

1. Go to your service
2. Click "Settings"
3. Scroll to "Domains"
4. Click "Generate Domain"
5. Your API is live at: `https://your-app.up.railway.app`

### Step 6: Test

```bash
curl https://your-app.up.railway.app/api/health
```

## Advantages Over Render

| Feature | Railway | Render |
|---------|---------|--------|
| Sleep | ❌ Never | ✅ After 15min |
| Cold Start | Fast | Slow |
| Build Time | Faster | Slower |
| Database | Included | Separate setup |
| Free Credit | $5/month | 750 hours |
| Custom Domain | ✅ Free | ✅ Free |

## Cost Tracking

- View usage in dashboard
- $5 credit = ~500 hours
- Set up billing alerts
- Upgrade if needed ($5/month)

## Auto-Deploy

Push to GitHub = Auto-deploy:
```bash
git push origin main
```

## Monitoring

- Real-time logs in dashboard
- Metrics: CPU, Memory, Network
- Deployment history
- Rollback with one click

## Custom Domain

1. Go to "Settings" → "Domains"
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records
5. SSL auto-configured

## Railway CLI (Optional)

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Run commands
railway run npm run seed
```

## Troubleshooting

### Build Failed
- Check logs in dashboard
- Verify package.json scripts
- Ensure all dependencies listed

### Database Connection Error
- Railway auto-configures DB variables
- Check if MySQL service is running
- Verify migrations ran successfully

### Out of Credit
- Upgrade to Hobby plan ($5/month)
- Or use Render free tier

## Keep Costs Low

1. Use only what you need
2. Monitor usage dashboard
3. Delete unused services
4. Optimize database queries
5. Use caching where possible

---

**Your API is live on Railway! 🚂**

Next: Deploy frontend to Vercel or Netlify
