# Quick Start Guide - Coolify Deployment

This is a quick reference guide for deploying the Face Recognition ID Scanner to Coolify.

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

VITE_API_URL=https://facerecognition.nexawebs.com/api
ENVIRONMENT=production
FRONTEND_URL=https://facerecognition.nexawebs.com
```

**Generate secure secrets with**:
```bash
openssl rand -base64 32
```

### 5. Configure Domains

Add domain in Coolify:

**Frontend:**
- Domain: `facerecognition.nexawebs.com`
- Service: `frontend`
- Enable SSL: ✅ (Let's Encrypt)

**Note**: The backend doesn't need a separate domain as it's accessed through `/api` path via frontend proxy.

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
2. **API Docs**: https://facerecognition.nexawebs.com/api/api-docs
3. **Admin Login**:
   - NIM: `admin01`
   - Password: `admin123`

⚠️ **IMPORTANT**: Change the default admin password immediately!

### 8. Seed Database (First Time Only)

After first deployment, run the database seeds:

```bash
# Get the backend container name
docker ps | grep backend

# Seed the database
docker exec <backend-container-name> npx knex seed:run
```

## Troubleshooting Quick Fixes

### Deployment fails
- Check environment variables are set correctly
- Verify database password matches in all places
- Check Coolify logs: Click on resource → Logs
- Ensure PostgreSQL healthcheck passes before backend starts

### Frontend shows connection error
- Verify `VITE_API_URL` is correct
- Check backend service is running
- Ensure backend can connect to database
- Check nginx proxy configuration

### Database connection failed
- Wait for database service to fully start (may take 1-2 minutes)
- Check database health status: `docker inspect <db-container> --format='{{.State.Health.Status}}'`
- Verify DB_HOST is set to `postgres` (service name)
- Check database logs in Coolify

### API returns 404 or 502
- Verify backend container is running
- Check backend can reach database: `docker exec <backend-container> ping postgres`
- Review nginx logs: `docker logs <frontend-container>`
- Ensure frontend's nginx.conf has `/api` proxy configuration

### Need to re-deploy?
- Click **"Deploy"** → **"Redeploy"**
- Or push a new commit to trigger automatic deployment

## Security Checklist

Before going to production:

- [ ] Generate and set secure JWT secrets (32+ characters)
- [ ] Set strong database password
- [ ] Enable SSL/TLS certificates (auto-enabled in Coolify)
- [ ] Change default admin password immediately
- [ ] Set up regular database backups
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerts
- [ ] Review CORS settings
- [ ] Test all endpoints

## Backup & Restore

### Backup Database

```bash
# Create backup
docker exec face-recognition-db pg_dump -U postgres face_recognition > backup_$(date +%Y%m%d).sql

# Copy backup to local machine
docker cp face-recognition-db:/var/lib/postgresql/data ./backup_folder
```

### Restore Database

```bash
# Restore from backup
docker exec -i face-recognition-db psql -U postgres face_recognition < backup_20250102.sql
```

### Automated Backups

Set up automated backups in Coolify or use a cron job:

```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * docker exec face-recognition-db pg_dump -U postgres face_recognition > /backups/face_recognition_$(date +\%Y\%m\%d).sql
```

## Monitoring

### Check Service Health

```bash
# Check all services are running
docker ps | grep face-recognition

# Check service health
docker inspect face-recognition-db --format='{{.State.Health.Status}}'

# View logs
docker logs face-recognition-backend --tail 50
docker logs face-recognition-frontend --tail 50
docker logs face-recognition-db --tail 50
```

### Resource Usage

```bash
# Check resource consumption
docker stats face-recognition-backend face-recognition-frontend face-recognition-db
```

## Architecture Overview

```
Internet (HTTPS)
    ↓
Traefik (Coolify) - SSL Termination
    ↓
Frontend Container (Nginx + React) :80
    ├─ /          → React App
    └─ /api       → Backend Container :3000
                     ↓
                  PostgreSQL :5432
```

**Key Points**:
- Frontend serves React app on `/`
- Frontend proxies `/api` requests to backend
- Backend connects to PostgreSQL
- Only frontend is exposed to internet via Traefik
- Backend and database are on internal network

## Environment Variables Reference

### Database Configuration
- `DB_USER` - PostgreSQL user (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (REQUIRED, change this!)
- `DB_NAME` - Database name (default: face_recognition)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_CLIENT` - Database client (pg)

### JWT Authentication
- `JWT_SECRET` - Secret for access tokens (REQUIRED, generate with openssl)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (REQUIRED, generate with openssl)

### Application Configuration
- `ENVIRONMENT` - Environment (production/development)
- `FRONTEND_URL` - Frontend URL for CORS (https://facerecognition.nexawebs.com)
- `VITE_API_URL` - Backend API URL for frontend (https://facerecognition.nexawebs.com/api)

## Resource Requirements

**Minimum Recommended**:
- RAM: 1-2 GB
- CPU: 1-2 cores
- Storage: 5-10 GB (for database)

**Per Service**:
- PostgreSQL: 512MB-1GB RAM, 0.5-1 CPU core
- Backend: 256MB-512MB RAM, 0.25-0.5 CPU core
- Frontend: 64MB-128MB RAM, 0.1 CPU core

## Next Steps

1. **Customize** the application for your needs
2. **Set up backups** for the database
3. **Configure monitoring** in Coolify
4. **Review API documentation** at `/api/api-docs`
5. **Test face recognition integration** (if applicable)
6. **Set up CI/CD** pipeline for automatic deployments

## Need Help?

- Check logs in Coolify dashboard
- Review this guide's troubleshooting section
- Check Coolify documentation: https://coolify.io/docs
- Verify DNS settings for your domain

---

**Estimated Deployment Time**: 5-10 minutes

**Resources Required**:
- RAM: 1-2 GB minimum
- CPU: 1-2 cores
- Storage: 5-10 GB for database
