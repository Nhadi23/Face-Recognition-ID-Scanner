# Quick Start Guide - Coolify Deployment

Choose your deployment approach:

## Option 1: Coolify Database Service ⭐ RECOMMENDED

**Best for**: Production, better backups, easier management

**Documentation**: See [COOLIFY_WITH_DB_SERVICE.md](./COOLIFY_WITH_DB_SERVICE.md)

**Quick Steps**:
1. Create PostgreSQL database in Coolify (2 min)
2. Get database connection details (1 min)
3. Deploy Docker Compose application (5 min)
4. Run migrations & seeds (2 min)

**Total Time**: ~10 minutes

**Advantages**:
- ✅ Automated backups
- ✅ Better resource management
- ✅ Easy to scale
- ✅ Migration path to external DB

---

## Option 2: Docker Compose with Embedded Database

**Best for**: Development, testing, quick prototypes

**Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Steps**:
1. Deploy Docker Compose with PostgreSQL (5 min)
2. Migrations run automatically
3. Access the application

**Total Time**: ~5 minutes

**Advantages**:
- ✅ Quick setup
- ✅ Self-contained
- ✅ Everything in one compose file
- ✅ Good for development

---

## Which Should You Choose?

### Choose Option 1 (Database Service) if:
- ✅ This is a production deployment
- ✅ You need automated backups
- ✅ You want better resource management
- ✅ You might migrate to cloud database later
- ✅ You want separate database and app scaling

### Choose Option 2 (Embedded DB) if:
- ✅ This is for development/testing
- ✅ You want the simplest setup
- ✅ You're deploying to a single server
- ✅ You don't need automated backups yet

---

## Quick Comparison

| Feature | Option 1: DB Service | Option 2: Embedded DB |
|---------|---------------------|----------------------|
| Setup Time | 10 minutes | 5 minutes |
| Backups | Automated | Manual |
| Management | Built-in UI | Manual commands |
| Scaling | Independent | Coupled |
| Migration Path | Easy | Requires export |
| Best For | Production | Development |
| Resource Usage | Optimized | Shared |

---

## Next Steps

### For Option 1 (Recommended):
1. Read [COOLIFY_WITH_DB_SERVICE.md](./COOLIFY_WITH_DB_SERVICE.md)
2. Create database in Coolify
3. Deploy application

### For Option 2:
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Deploy with Docker Compose
3. Access application

---

## Configuration Files

All deployment configurations are ready:
- `docker-compose.yml` - Main orchestration (Option 2)
- `backend/Dockerfile` - Backend container
- `frontend/Dockerfile` - Frontend container
- `.env.example` - Environment variable template

For Option 1, the `docker-compose.yml` is already configured to work with external database connection.

---

## Environment Variables

Both options require these environment variables:

```env
# Database (get from Coolify database service or set your own)
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=face_recognition
DB_CLIENT=pg

# JWT Secrets (generate your own)
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Frontend
FRONTEND_URL=https://facerecognition.nexawebs.com
VITE_API_URL=https://api.facerecognition.nexawebs.com

# Environment
ENVIRONMENT=production
```

---

## Generate Secure Secrets

```bash
# JWT Secret
openssl rand -base64 32

# JWT Refresh Secret
openssl rand -base64 32
```

---

**Recommendation**: Start with **Option 1 (Database Service)** for production deployments. It's more robust and easier to maintain long-term.
