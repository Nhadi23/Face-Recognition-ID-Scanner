# Deployment Guide - Coolify with Database Service

This guide is for deploying with **PostgreSQL as a Coolify Database Service** (recommended for production).

## Why Use Coolify Database Service?

✅ **Automated Backups** - Scheduled backups with one-click restore
✅ **Better Management** - Built-in database management UI
✅ **Resource Optimization** - Dedicated resources for database
✅ **Easy Scaling** - Scale database independently
✅ **Better Security** - Isolated database environment
✅ **Migration Path** - Easy to migrate to external DB (AWS RDS, Supabase, etc.)

## Deployment Steps

### Step 1: Create Database in Coolify

1. **Create New Database**
   - Go to your Coolify dashboard
   - Click **"New Resource"** → **"Database"**
   - Select **"PostgreSQL"**
   - Name it: `face-recognition-db`

2. **Configure Database**
   - **Database Name**: `face_recognition`
   - **Username**: Coolify will generate this automatically
   - **Password**: Coolify will generate this automatically
   - **Port**: 5432 (default)

3. **Save Database**
   - Coolify will create the database service
   - Wait for it to be **"Running"** (green status)

4. **Get Connection Details**
   - Click on the database resource
   - Go to **"Environment Variables"** tab
   - You'll see:
     - `DB_HOST`
     - `DB_PORT`
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_DATABASE` or `DB_NAME`
   - Save these values for the next step

### Step 2: Create Docker Compose Application

1. **Create New Project**
   - Click **"New Project"** → **"Docker Compose"**
   - Name it: `face-recognition-scanner`

2. **Connect Git Repository**
   - Click **"New Resource"** → **"From Git"**
   - Select your Git provider
   - Choose your repository
   - Select branch: `main` (or your default branch)
   - **Build Type**: Docker Compose
   - **Compose File**: `docker-compose.yml` (root)

### Step 3: Configure Environment Variables

In your Docker Compose application, add these environment variables:

```env
# Database Configuration (from Step 1)
DB_HOST=your-actual-db-host-from-coolify
DB_PORT=5432
DB_USER=your-actual-db-user-from-coolify
DB_PASSWORD=your-actual-db-password-from-coolify
DB_NAME=face_recognition
DB_CLIENT=pg

# JWT Secrets (generate your own)
JWT_SECRET=your_generated_jwt_secret_here
JWT_REFRESH_SECRET=your_generated_jwt_refresh_secret_here

# Frontend Configuration
FRONTEND_URL=https://facerecognition.nexawebs.com
VITE_API_URL=https://api.facerecognition.nexawebs.com

# Environment
ENVIRONMENT=production
```

#### Generate Secure Secrets

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate JWT Refresh Secret
openssl rand -base64 32
```

### Step 4: Configure Domains

Add two domains to your application:

**Frontend Domain:**
- Domain: `facerecognition.nexawebs.com`
- Service: `frontend`
- Enable SSL: ✅ (Let's Encrypt)

**Backend API Domain:**
- Domain: `api.facerecognition.nexawebs.com`
- Service: `backend`
- Enable SSL: ✅ (Let's Encrypt)

### Step 5: Run Database Migrations & Seeds

After the database is created but **before** deploying the application:

**Option A: Via Coolify Terminal**
1. Go to your database resource in Coolify
2. Click **"Terminal"** tab
3. You can connect to the database and check tables

**Option B: Via One-time Script Container**
1. Deploy the application first (without running migrations)
2. In Coolify, go to your backend service
3. Click **"Terminal"**
4. Run migrations:
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

**Option C: Manual Connection (Recommended for First Time)**
1. Get database connection string from Coolify
2. Use a PostgreSQL client (DBeaver, pgAdmin, or psql)
3. Connect using the credentials from Step 1
4. Run migrations manually:
   ```bash
   # From your local machine with migration files
   cd backend
   npx knex migrate:latest --env production
   npx knex seed:run --env production
   ```

### Step 6: Deploy Application

1. **Deploy**
   - Click **"Deploy"** button
   - Wait for build to complete (~3-5 minutes)
   - Coolify will:
     - Build frontend and backend images
     - Start backend service
     - Start frontend service

2. **Verify Deployment**
   - Frontend: https://facerecognition.nexawebs.com
   - Backend: https://api.facerecognition.nexawebs.com/api/
   - API Docs: https://api.facerecognition.nexawebs.com/api-docs

### Step 7: Initial Login

⚠️ **IMPORTANT**: Change default admin password immediately!

**Default Admin Credentials:**
- NIM: `admin01`
- Password: `admin123`

## Managing the Database

### Access Database Management

In Coolify:
1. Go to your database resource
2. Click **"Terminal"** to access PostgreSQL CLI
3. Or use **"Environment Variables"** to get connection string for external tools

### Backup Database

**Automatic Backups:**
- Go to Database Resource → **"Backups"** tab
- Enable automatic backups
- Set schedule (recommended: daily)
- Set retention period (recommended: 7-30 days)

**Manual Backup:**
1. Go to Database Resource → **"Backups"** tab
2. Click **"Create Backup"**
3. Wait for backup to complete
4. Download if needed

### Restore Database

1. Go to Database Resource → **"Backups"** tab
2. Select the backup you want to restore
3. Click **"Restore"**
4. Confirm the restore operation
5. Wait for restoration to complete

### Reset Database

⚠️ **WARNING**: This will delete all data!

1. Go to Database Resource → **"Settings"** tab
2. Click **"Reset Database"**
3. Confirm the action
4. After reset, re-run migrations and seeds:
   ```bash
   npx knex migrate:latest
   npx knex seed:run
   ```

## Architecture with Coolify Database Service

```
┌─────────────────────────────────────────┐
│   Coolify Application (Docker Compose)  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Frontend (Nginx + React)          │  │
│  │ facerecognition.nexawebs.com      │  │
│  └───────────┬───────────────────────┘  │
│              │                           │
│  ┌───────────▼───────────────────────┐  │
│  │ Backend (Express.js)              │  │
│  │ api.facerecognition.nexawebs.com  │  │
│  └───────────┬───────────────────────┘  │
└──────────────┼───────────────────────────┘
               │
               │ External Connection
               │ (via Coolify network)
               ▼
┌─────────────────────────────────────────┐
│     Coolify Database Service            │
│         PostgreSQL 15                    │
│    (Managed by Coolify)                 │
└─────────────────────────────────────────┘
```

## Environment Variable Reference

Copy the connection details from your Coolify database service:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `postgres.xxx.coolify.com` or internal IP |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database username | `postgres` or generated user |
| `DB_PASSWORD` | Database password | Generated secure password |
| `DB_NAME` | Database name | `face_recognition` |
| `DB_CLIENT` | Database client | `pg` |

## Troubleshooting

### Database Connection Issues

**Problem**: Backend can't connect to database

**Solutions**:
1. Verify database service is running (green status)
2. Check environment variables match database credentials
3. Ensure database is accessible from application container
4. Check Coolify firewall settings
5. Verify database has inbound rules from application

### Migration Issues

**Problem**: Migrations fail to run

**Solutions**:
1. Ensure database exists and is accessible
2. Check `knexfile.js` configuration
3. Verify database user has CREATE TABLE permissions
4. Run migrations manually via terminal:
   ```bash
   npx knex migrate:latest
   ```

### Application Not Starting

**Problem**: Backend or frontend won't start

**Solutions**:
1. Check logs in Coolify dashboard
2. Verify all environment variables are set
3. Ensure database is running and accessible
4. Check for port conflicts
5. Rebuild the application:
   - Click **"Deploy"** → **"Rebuild"**

## Security Best Practices

### Database Security
- ✅ Use strong passwords (Coolify generates these automatically)
- ✅ Enable SSL/TLS for database connections
- ✅ Regular backups (daily recommended)
- ✅ Limit database access to application only
- ✅ Monitor database logs

### Application Security
- ✅ Change default admin password immediately
- ✅ Use strong JWT secrets (32+ characters)
- ✅ Enable HTTPS for all domains
- ✅ Keep dependencies updated
- ✅ Review CORS settings
- ✅ Implement rate limiting on API

### Coolify Security
- ✅ Enable two-factor authentication
- ✅ Regular Coolify updates
- ✅ Monitor access logs
- ✅ Use SSH keys for Git access

## Monitoring and Maintenance

### Daily Checks
- [ ] Application is running (green status)
- [ ] Database is running (green status)
- [ ] Check error logs
- [ ] Verify backups are created

### Weekly Tasks
- [ ] Review security logs
- [ ] Check disk usage
- [ ] Test backup restoration
- [ ] Review performance metrics

### Monthly Tasks
- [ ] Update dependencies
- [ ] Review and rotate secrets if needed
- [ ] Security audit
- [ ] Performance optimization review

## Scaling Considerations

### When to Scale Up
- High CPU usage (>80%)
- High memory usage (>80%)
- Slow response times
- Database connection limits reached

### Scaling Options
1. **Vertical Scaling**: Increase resources in Coolify
2. **Horizontal Scaling**: Add more application instances
3. **Database Scaling**: Upgrade to managed database service (AWS RDS, Supabase)

## Cost Optimization

### Coolify Resources
- Start with minimum resources
- Monitor usage for 1-2 weeks
- Adjust based on actual usage
- Consider reserved instances for long-term deployments

### Database Resources
- Start with shared database
- Monitor query performance
- Scale up when needed
- Enable connection pooling

## Migration to External Database

If you need to migrate to an external database service (AWS RDS, Supabase, etc.):

1. **Create external database**
2. **Export data from Coolify database**
3. **Import to external database**
4. **Update environment variables**:
   - Change `DB_HOST`
   - Update `DB_PORT`, `DB_USER`, `DB_PASSWORD`
5. **Redeploy application**

## Support and Resources

- **Coolify Docs**: https://coolify.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Docker Docs**: https://docs.docker.com
- **Express.js Docs**: https://expressjs.com

---

**Next Steps**:
1. ✅ Create database in Coolify
2. ✅ Deploy application with Docker Compose
3. ✅ Run migrations and seeds
4. ✅ Test the application
5. ✅ Set up automated backups
6. ✅ Configure monitoring

**Estimated Setup Time**: 15-20 minutes
