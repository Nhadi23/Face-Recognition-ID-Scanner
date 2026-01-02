# Deployment Guide - Coolify

This guide will help you deploy the Face Recognition ID Scanner application on Coolify using Docker Compose.

## Prerequisites

- Coolify instance running
- Domain configured: `facerecognition.nexawebs.com`
- Subdomain for API: `api.facerecognition.nexawebs.com`
- Git repository with this code pushed

## Architecture

The application consists of three services:

1. **PostgreSQL Database** - Stores user data, permissions, and attendance records
2. **Backend API** - Express.js server on port 3000
3. **Frontend** - React application served by Nginx

## Domain Configuration

- **Frontend**: `facerecognition.nexawebs.com`
- **Backend API**: `api.facerecognition.nexawebs.com`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_NAME=face_recognition
DB_PORT=5432
DB_CLIENT=pg

# JWT Secrets (IMPORTANT: Change these!)
JWT_SECRET=your_jwt_secret_key_here_change_this
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here_change_this

# Frontend API URL
VITE_API_URL=https://api.facerecognition.nexawebs.com

# Environment
ENVIRONMENT=production
```

### Generating Secure Secrets

Generate secure JWT secrets using:

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate JWT refresh secret
openssl rand -base64 32
```

## Deployment Steps in Coolify

### Option 1: Using Docker Compose (Recommended)

1. **Create a new project in Coolify**
   - Go to your Coolify dashboard
   - Click "New Project"
   - Select "Docker Compose" as the application type

2. **Configure Git repository**
   - Connect your Git repository
   - Select the branch to deploy (usually `main` or `master`)
   - Set the build path to root directory

3. **Set environment variables**
   - Add all environment variables from the `.env.example` file
   - Make sure to update the secrets with secure values

4. **Configure domains**
   - Add domain: `facerecognition.nexawebs.com` (for frontend)
   - Add domain: `api.facerecognition.nexawebs.com` (for backend)
   - Enable SSL/TLS certificates (Let's Encrypt)

5. **Deploy**
   - Click "Deploy" to start the deployment
   - Coolify will build the images and start the containers

### Option 2: Using Coolify's Manual Configuration

If you prefer to configure each service separately:

1. **Database Service**
   - Create a new database service in Coolify
   - Select PostgreSQL
   - Set database name, user, and password
   - Note the connection details

2. **Backend Service**
   - Create a new application
   - Select Dockerfile build
   - Set path to `./backend`
   - Add environment variables from `.env.example`
   - Configure database connection to use the database service
   - Add domain: `api.facerecognition.nexawebs.com`

3. **Frontend Service**
   - Create a new application
   - Select Dockerfile build
   - Set path to `./frontend`
   - Add build argument: `VITE_API_URL=https://api.facerecognition.nexawebs.com`
   - Add domain: `facerecognition.nexawebs.com`

## Post-Deployment Setup

After successful deployment:

1. **Run database migrations and seeds**
   - The migrations run automatically on container start
   - The initial seed creates an admin user:
     - NIM: `admin01`
     - Password: `admin123`

2. **Access the application**
   - Frontend: `https://facerecognition.nexawebs.com`
   - API Documentation: `https://api.facerecognition.nexawebs.com/api-docs`

3. **Change default admin password**
   - Log in with the default admin credentials
   - Change the password immediately

4. **Test the application**
   - Test user login
   - Test permission creation
   - Test attendance logging
   - Verify face recognition integration (if applicable)

## Troubleshooting

### Database Connection Issues

If the backend can't connect to the database:

1. Check database service is running
2. Verify environment variables match database credentials
3. Check database service health logs
4. Ensure both services are on the same Docker network

### Frontend Can't Reach Backend

If the frontend can't connect to the API:

1. Verify `VITE_API_URL` is set correctly
2. Check backend service is running
3. Ensure backend domain DNS is configured correctly
4. Check browser console for CORS errors

### SSL/TLS Certificate Issues

If SSL certificates aren't working:

1. Ensure domain DNS points to your Coolify server
2. Check Coolify's Let's Encrypt configuration
3. Verify port 80 and 443 are accessible
4. Check Coolify logs for certificate errors

### Container Health Checks

Monitor container health:

```bash
# Check container status
docker ps

# View logs
docker logs face-recognition-backend
docker logs face-recognition-frontend
docker logs face-recognition-db

# Access database
docker exec -it face-recognition-db psql -U postgres -d face_recognition
```

## Backup and Recovery

### Database Backup

```bash
# Backup database
docker exec face-recognition-db pg_dump -U postgres face_recognition > backup.sql

# Restore database
docker exec -i face-recognition-db psql -U postgres face_recognition < backup.sql
```

### Volume Backup

The PostgreSQL data is stored in a Docker volume named `postgres_data`. Ensure this volume is backed up regularly.

## Security Considerations

1. **Change all default passwords and secrets**
2. **Enable firewall rules** to restrict access
3. **Use strong passwords** for database and JWT secrets
4. **Enable SSL/TLS** for all domains
5. **Regular updates** - Keep images updated
6. **Monitor logs** for suspicious activity
7. **Implement rate limiting** on the API
8. **Use environment variables** for sensitive data (never commit to git)

## Scaling

### Horizontal Scaling

For high-traffic scenarios:

1. **Backend**: Deploy multiple backend instances behind a load balancer
2. **Database**: Consider managed PostgreSQL service (e.g., AWS RDS)
3. **Frontend**: Use CDN for static assets

### Resource Limits

Add resource limits to `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Monitoring

### Application Monitoring

1. Enable Coolify's built-in monitoring
2. Set up alerts for container failures
3. Monitor database performance
4. Track API response times

### Logs

Access logs through:
- Coolify dashboard
- Docker CLI: `docker logs <container_name>`
- Log aggregation service (e.g., Loki, ELK stack)

## Support

For issues or questions:
- Check Coolify documentation: https://coolify.io/docs
- Review application logs
- Check database connection and migration status
