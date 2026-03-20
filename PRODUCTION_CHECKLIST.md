# Production Deployment Checklist

## Pre-Deployment

- [ ] All environment variables configured in `.env.production`
- [ ] Database credentials verified
- [ ] AWS S3 credentials configured
- [ ] JWT secret is strong and unique
- [ ] Frontend URL configured correctly
- [ ] Database migrations tested
- [ ] All dependencies installed (`npm install --production`)

## Database

- [ ] Production database created
- [ ] Run migration: `migrations/COMPLETE_DATABASE_SCHEMA.sql` (NEW - All-in-one)
- [ ] Verify tables created successfully
- [ ] Seed initial data with `npm run seed`
- [ ] Database backup strategy in place

## Security

- [ ] Rate limiting configured
- [ ] CORS origins restricted to production domains
- [ ] Helmet security headers enabled
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Database access restricted to application server
- [ ] Environment files not committed to git

## Server Configuration

- [ ] Node.js 16+ installed
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Nginx configured as reverse proxy (if applicable)
- [ ] Log rotation configured
- [ ] Server timezone set correctly
- [ ] Sufficient disk space for logs and uploads

## Monitoring

- [ ] Health check endpoint accessible: `/api/health`
- [ ] Error logging to `logs/error.log`
- [ ] PM2 monitoring active (`pm2 monit`)
- [ ] Database connection monitoring
- [ ] Disk space monitoring

## Testing

- [ ] Health check returns 200 OK
- [ ] Authentication endpoints working
- [ ] File upload to S3 working
- [ ] Database queries executing correctly
- [ ] All API endpoints responding

## Deployment Commands

### Using PM2
```bash
npm run prod:pm2
pm2 save
pm2 startup
```

### Using Docker
```bash
npm run prod:docker
```

### Using systemd
```bash
sudo systemctl start student-herald-api
sudo systemctl enable student-herald-api
```

## Post-Deployment

- [ ] Verify application is running
- [ ] Check logs for errors
- [ ] Test critical API endpoints
- [ ] Monitor resource usage (CPU, memory, disk)
- [ ] Set up automated backups
- [ ] Document any deployment-specific configurations

## Rollback Plan

1. Stop the application
2. Restore previous version
3. Restore database backup if needed
4. Restart application
5. Verify functionality

## Support

For issues, check:
- Application logs: `logs/combined.log` and `logs/error.log`
- PM2 logs: `pm2 logs student-herald-api`
- Database connectivity
- Environment variable configuration
