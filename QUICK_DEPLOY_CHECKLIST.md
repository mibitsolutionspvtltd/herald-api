# Quick Deployment Checklist ✅

## Before You Start

- [ ] Code is working locally
- [ ] All tests pass (if any)
- [ ] Environment variables documented in `.env.example`
- [ ] Database migrations ready

## Choose Your Platform

### Option 1: Render.com (Easiest)
- [ ] Create Render account
- [ ] Push code to GitHub
- [ ] Create MySQL database on Render
- [ ] Run migrations
- [ ] Create Web Service
- [ ] Add environment variables
- [ ] Deploy and test

**Time**: ~15 minutes  
**Guide**: `DEPLOY_RENDER.md`

### Option 2: Railway.app (Fastest)
- [ ] Create Railway account
- [ ] Push code to GitHub
- [ ] Deploy from GitHub
- [ ] Add MySQL database (auto-configured)
- [ ] Run migrations
- [ ] Add environment variables
- [ ] Generate domain and test

**Time**: ~5 minutes  
**Guide**: `DEPLOY_RAILWAY.md`

### Option 3: Fly.io (Most Powerful)
- [ ] Install Fly CLI
- [ ] Create Fly account
- [ ] Run `fly launch`
- [ ] Add MySQL database
- [ ] Set secrets
- [ ] Deploy with `fly deploy`

**Time**: ~10 minutes  
**Guide**: `FREE_DEPLOYMENT_GUIDE.md`

## After Deployment

- [ ] Test health endpoint: `/api/health`
- [ ] Test authentication: `/api/auth/login`
- [ ] Seed initial data
- [ ] Update frontend with API URL
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)

## Environment Variables Needed

```
NODE_ENV=production
PORT=3001
DB_HOST=<from-hosting-provider>
DB_USER=<from-hosting-provider>
DB_PASSWORD=<from-hosting-provider>
DB_NAME=student_herald
DB_PORT=3306
JWT_SECRET=<generate-random-64-char-string>
JWT_EXPIRE=7d
FRONTEND_URL=<your-frontend-url>
AWS_ACCESS_KEY_ID=<optional-for-s3>
AWS_SECRET_ACCESS_KEY=<optional-for-s3>
AWS_REGION=us-east-1
AWS_S3_BUCKET=<optional-for-s3>
```

## Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Test Deployment

```bash
# Health check
curl https://your-app-url.com/api/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"...","environment":"production"}
```

## Troubleshooting

### App won't start
1. Check logs in platform dashboard
2. Verify all environment variables are set
3. Ensure database is accessible
4. Check if migrations ran successfully

### Database connection failed
1. Verify database credentials
2. Check if database is in same region
3. Ensure database is running
4. Test connection from platform shell

### 502 Bad Gateway
1. Wait 2-3 minutes (app is starting)
2. Check if PORT is set correctly
3. Verify app is listening on correct port

## Need Help?

1. Check platform-specific guide
2. Review platform documentation
3. Check logs for error messages
4. Ask in platform community forums

## Recommended: Render.com

For first-time deployment, we recommend Render.com:
- ✅ Easiest to use
- ✅ Good documentation
- ✅ Free MySQL included
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificates

Follow `DEPLOY_RENDER.md` for complete guide.

---

**Ready to deploy? Pick a platform and follow the guide! 🚀**
