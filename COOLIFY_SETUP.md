# Quick Start Guide - Coolify Deployment

This is a quick reference guide for deploying to Coolify.

## Step-by-Step Instructions

### 1. Prepare Your Repository

```bash
# Add all deployment files
git add .
git commit -m "Add Docker deployment configuration for Coolify"
git push
```

### 2. Create Project in Coolify

1. Log in to your Coolify instance
2. Click **"New Project"**
3. Select **"Docker Compose"**
4. Name it: `face-recognition-scanner`

### 3. Connect Git Repository

1. Click **"New Resource"** → **"From Git"**
2. Select your Git provider (GitHub, GitLab, etc.)
3. Choose the repository
4. Select branch: `main` (or your default branch)
5. **Build Type**: Docker Compose
6. **Compose File**: `docker-compose.yml` (root)

### 4. Configure Environment Variables

In Coolify, add these environment variables:

```env
DB_USER=postgres
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
DB_NAME=face_recognition
DB_PORT=5432
DB_CLIENT=pg

JWT_SECRET=CHANGE_THIS_SECURE_JWT_SECRET
JWT_REFRESH_SECRET=CHANGE_THIS_SECURE_REFRESH_SECRET

FRONTEND_URL=https://facerecognition.nexawebs.com
VITE_API_URL=https://api.facerecognition.nexawebs.com
ENVIRONMENT=production
```

### 5. Configure Domains

Add two domains in Coolify:

**Frontend:**
- Domain: `facerecognition.nexawebs.com`
- Service: `frontend`
- Enable SSL: ✅

**Backend API:**
- Domain: `api.facerecognition.nexawebs.com`
- Service: `backend`
- Enable SSL: ✅

### 6. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (~3-5 minutes)
3. Coolify will:
   - Build Docker images
   - Start PostgreSQL database
   - Run database migrations
   - Start backend service
   - Build and start frontend

### 7. Verify Deployment

Once deployed:

1. **Frontend**: https://facerecognition.nexawebs.com
2. **API Docs**: https://api.facerecognition.nexawebs.com/api-docs
3. **Admin Login**:
   - NIM: `admin01`
   - Password: `admin123`

⚠️ **IMPORTANT**: Change the default admin password immediately!

## Troubleshooting Quick Fixes

### Deployment fails
- Check environment variables are set correctly
- Verify database password matches in all places
- Check Coolify logs: Click on resource → Logs

### Frontend shows connection error
- Verify `VITE_API_URL` is correct
- Check backend service is running
- Ensure backend domain DNS is configured

### Database connection failed
- Wait for database service to fully start (may take 1-2 minutes)
- Check database health status in Coolify
- Verify DB_HOST is set to `postgres` (service name)

### Need to re-deploy?
- Click **"Deploy"** → **"Redeploy"**
- Or push a new commit to trigger automatic deployment

## Security Checklist

Before going to production:

- [ ] Change all default passwords and secrets
- [ ] Enable SSL/TLS certificates
- [ ] Change default admin password
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerts
- [ ] Review CORS settings
- [ ] Test all endpoints

## Next Steps

1. **Customize** the application for your needs
2. **Set up backups** for the database
3. **Configure monitoring** in Coolify
4. **Review API documentation** at `/api-docs`
5. **Test face recognition integration** (if applicable)

## Need Help?

- Full documentation: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Coolify docs: https://coolify.io/docs
- Check logs in Coolify dashboard

---

**Estimated Deployment Time**: 5-10 minutes

**Resources Required**:
- RAM: 1-2 GB minimum
- CPU: 1-2 cores
- Storage: 5-10 GB for database
