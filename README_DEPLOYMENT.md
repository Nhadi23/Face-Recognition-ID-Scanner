# Deployment Guide - Face Recognition ID Scanner

Complete deployment configuration for Coolify with domain **facerecognition.nexawebs.com**.

## Quick Start ⚡

Choose your deployment approach:

### Option 1: Coolify Database Service ⭐ **RECOMMENDED FOR PRODUCTION**

**Documentation**: [COOLIFY_WITH_DB_SERVICE.md](./COOLIFY_WITH_DB_SERVICE.md)

**Benefits**:
- ✅ Automated backups
- ✅ Better resource management
- ✅ Easy scaling
- ✅ Migration path to external DB (AWS RDS, Supabase)

**Setup Time**: ~10 minutes

---

### Option 2: Embedded Database in Docker Compose

**Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Use File**: `docker-compose-with-db.yml` and `backend/Dockerfile.with-db`

**Benefits**:
- ✅ Quick setup
- ✅ Self-contained
- ✅ Good for development/testing

**Setup Time**: ~5 minutes

---

## Decision Guide

| Use Case | Recommended Option |
|----------|-------------------|
| **Production Deployment** | Option 1 (Database Service) |
| **Development/Testing** | Option 2 (Embedded DB) |
| **Need Automated Backups** | Option 1 (Database Service) |
| **Quick Prototype** | Option 2 (Embedded DB) |
| **Plan to Scale** | Option 1 (Database Service) |
| **Single Server Deployment** | Option 2 (Embedded DB) |

---

## Configuration Files

### For Option 1 (Database Service) - Current Default:
- `docker-compose.yml` - Application only (no PostgreSQL)
- `backend/Dockerfile` - Backend without auto-migration
- `.env.example` - Environment variables template

### For Option 2 (Embedded Database):
- `docker-compose-with-db.yml` - Includes PostgreSQL service
- `backend/Dockerfile.with-db` - Backend with auto-migration
- `.env.example` - Same environment variables

---

## Environment Variables

Generate these values for your deployment:

```env
# Database Configuration
# For Option 1: Get from Coolify database service
# For Option 2: Set your own values
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=face_recognition
DB_CLIENT=pg

# JWT Secrets (generate new ones!)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Frontend Configuration
FRONTEND_URL=https://facerecognition.nexawebs.com
VITE_API_URL=https://api.facerecognition.nexawebs.com

# Environment
ENVIRONMENT=production
```

### Generate Secure Secrets:

```bash
# JWT Secret
openssl rand -base64 32

# JWT Refresh Secret
openssl rand -base64 32

# Database Password (for Option 2)
openssl rand -base64 16
```

---

## Deployment URLs

After deployment:

- **Frontend**: https://facerecognition.nexawebs.com
- **Backend API**: https://api.facerecognition.nexawebs.com
- **API Documentation**: https://api.facerecognition.nexawebs.com/api-docs

---

## Default Credentials

⚠️ **SECURITY WARNING**: Change immediately after first login!

**Admin Account**:
- NIM: `admin01`
- Password: `admin123`

---

## Architecture

### Option 1 (Database Service):
```
Frontend (facerecognition.nexawebs.com)
    ↓
Backend API (api.facerecognition.nexawebs.com)
    ↓
Coolify PostgreSQL Database Service
```

### Option 2 (Embedded Database):
```
Frontend (facerecognition.nexawebs.com)
    ↓
Backend API (api.facerecognition.nexawebs.com)
    ↓
PostgreSQL Container (in docker-compose)
```

---

## Quick Deployment Checklist

### Pre-Deployment:
- [ ] Choose deployment option (1 or 2)
- [ ] Domain DNS configured
- [ ] Generate secure JWT secrets
- [ ] Read relevant documentation

### For Option 1 (Database Service):
- [ ] Create PostgreSQL database in Coolify
- [ ] Get database connection details
- [ ] Create Docker Compose application
- [ ] Add environment variables
- [ ] Configure domains (frontend + API)
- [ ] Run database migrations
- [ ] Deploy application
- [ ] Test and verify

### For Option 2 (Embedded Database):
- [ ] Update docker-compose to use `docker-compose-with-db.yml`
- [ ] Update backend Dockerfile to use `Dockerfile.with-db`
- [ ] Add environment variables
- [ ] Configure domains (frontend + API)
- [ ] Deploy application
- [ ] Migrations run automatically
- [ ] Test and verify

### Post-Deployment:
- [ ] Access frontend
- [ ] Test backend API
- [ ] Login with default admin
- [ ] Change default password
- [ ] Configure backups (Option 1)
- [ ] Set up monitoring
- [ ] Test all features

---

## Documentation Files

| File | Purpose |
|------|---------|
| `COOLIFY_WITH_DB_SERVICE.md` | Complete guide for Option 1 (Database Service) |
| `DEPLOYMENT.md` | Complete guide for Option 2 (Embedded Database) |
| `COOLIFY_SETUP.md` | Quick start comparison |
| `DEPLOYMENT_SUMMARY.md` | Architecture and configuration details |
| `QUICK_REFERENCE.md` | Commands and troubleshooting |
| `README_DEPLOYMENT.md` | This file - overview |

---

## Architecture Overview

### Application Stack:

**Frontend**:
- React 19 with TypeScript
- Vite build system
- Nginx web server (production)
- Progressive Web App ready

**Backend**:
- Node.js 18 (Alpine Linux)
- Express.js 5
- PostgreSQL database
- Knex.js query builder
- JWT authentication
- Swagger API documentation

**Database**:
- PostgreSQL 15
- Automatic migrations
- Seed data (admin user)
- Managed service or container

### Features:

- ✅ User authentication (JWT)
- ✅ Role-based access control (Admin/Student)
- ✅ Permission management
- ✅ Attendance tracking
- ✅ Face recognition integration
- ✅ API documentation
- ✅ CORS configuration
- ✅ Production-ready Docker setup

---

## Security Considerations

### Before Production:

1. **Change All Defaults**:
   - [ ] Default admin password
   - [ ] JWT secrets
   - [ ] Database password (if Option 2)

2. **Enable SSL/TLS**:
   - [ ] Frontend HTTPS enabled
   - [ ] Backend HTTPS enabled
   - [ ] Valid SSL certificates

3. **CORS Configuration**:
   - [ ] Verify allowed origins
   - [ ] Check credential settings

4. **Database Security**:
   - [ ] Strong passwords
   - [ ] Regular backups
   - [ ] Access restrictions

5. **Application Security**:
   - [ ] Input validation
   - [ ] Rate limiting
   - [ ] Error handling
   - [ ] Logging

---

## Resource Requirements

### Minimum:
- CPU: 1 core
- RAM: 1 GB
- Storage: 5 GB

### Recommended:
- CPU: 2 cores
- RAM: 2 GB
- Storage: 10 GB

### With Database Service (Option 1):
- Database resources are managed separately
- Better resource isolation
- Easier to scale independently

---

## Troubleshooting

### Common Issues:

**Can't connect to database**:
- Check database is running
- Verify connection details
- Check firewall settings
- Review logs

**Frontend not loading**:
- Check build completed successfully
- Verify nginx configuration
- Check domain DNS
- Review browser console

**Backend API errors**:
- Check environment variables
- Verify database migrations ran
- Check CORS settings
- Review API logs

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for detailed troubleshooting commands.

---

## Backup Strategy

### Option 1 (Database Service):
- Automated backups via Coolify
- One-click restore
- Schedule: Daily recommended
- Retention: 7-30 days

### Option 2 (Embedded Database):
- Manual backup required
- Use PostgreSQL dump commands
- Schedule via cron or external tool
- Store backups externally

---

## Scaling Path

### When to Scale:
- High CPU usage (>80%)
- High memory usage (>80%)
- Slow response times
- Database connection limits

### Scaling Options:
1. **Vertical**: Increase resources
2. **Horizontal**: Add more instances
3. **Database**: Upgrade to managed service
4. **CDN**: For static assets

---

## Support

For detailed information:
- **Coolify**: https://coolify.io/docs
- **Docker**: https://docs.docker.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Express.js**: https://expressjs.com

---

## Quick Decision Tree

```
Is this for production?
├─ Yes → Use Option 1 (Database Service)
│         └─ Read: COOLIFY_WITH_DB_SERVICE.md
│
└─ No → Is this for development/testing?
          ├─ Yes → Use Option 2 (Embedded Database)
          │         └─ Read: DEPLOYMENT.md
          │
          └─ No → Need automated backups?
                    ├─ Yes → Option 1 (Database Service)
                    └─ No → Option 2 (Embedded Database)
```

---

## Summary

**For Production** (Recommended):
- Use **Option 1** (Coolify Database Service)
- Follow: [COOLIFY_WITH_DB_SERVICE.md](./COOLIFY_WITH_DB_SERVICE.md)
- Better backups, management, and scalability

**For Development/Testing**:
- Use **Option 2** (Embedded Database)
- Follow: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Quick setup, self-contained

---

**Version**: 1.0.0
**Last Updated**: 2026-01-02
**Domain**: facerecognition.nexawebs.com
