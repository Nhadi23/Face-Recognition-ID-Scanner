# Quick Reference - Deployment Commands

## Generate Secure Secrets

```bash
# JWT Secret
openssl rand -base64 32

# JWT Refresh Secret
openssl rand -base64 32

# Database Password
openssl rand -base64 16
```

## Docker Compose Commands

```bash
# Build and start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres

# Rebuild and restart
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

## Database Commands

```bash
# Access database
docker exec -it face-recognition-db psql -U postgres -d face_recognition

# Backup database
docker exec face-recognition-db pg_dump -U postgres face_recognition > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i face-recognition-db psql -U postgres face_recognition < backup_file.sql

# Run migrations manually
docker exec face-recognition-backend npx knex migrate:latest

# Run seeds manually
docker exec face-recognition-backend npx knex seed:run
```

## Container Commands

```bash
# List all containers
docker ps -a

# View container logs
docker logs face-recognition-backend
docker logs face-recognition-frontend
docker logs face-recognition-db

# Execute shell in container
docker exec -it face-recognition-backend sh
docker exec -it face-recognition-frontend sh
docker exec -it face-recognition-db sh

# Check container health
docker inspect face-recognition-backend | grep -A 5 Health
```

## Troubleshooting Commands

```bash
# Check port bindings
docker port face-recognition-backend
docker port face-recognition-frontend

# Check resource usage
docker stats

# View container details
docker inspect face-recognition-backend

# Check network connectivity
docker exec face-recognition-backend ping postgres
```

## URLs

- **Frontend**: https://facerecognition.nexawebs.com
- **Backend API**: https://api.facerecognition.nexawebs.com
- **API Documentation**: https://api.facerecognition.nexawebs.com/api-docs

## Environment Variables Template

```bash
DB_USER=postgres
DB_PASSWORD=<generated_password>
DB_NAME=face_recognition
DB_PORT=5432
DB_CLIENT=pg
JWT_SECRET=<generated_secret>
JWT_REFRESH_SECRET=<generated_secret>
FRONTEND_URL=https://facerecognition.nexawebs.com
VITE_API_URL=https://api.facerecognition.nexawebs.com
ENVIRONMENT=production
```

## Default Credentials

- **Admin NIM**: admin01
- **Admin Password**: admin123
  ⚠️ Change immediately after first login!

## Coolify Deployment Steps

1. Create new project → Docker Compose
2. Connect Git repository
3. Set build context to root
4. Add environment variables (see above)
5. Add domains:
   - facerecognition.nexawebs.com (frontend)
   - api.facerecognition.nexawebs.com (backend)
6. Enable SSL
7. Deploy!

## File Locations

- Docker Compose: `/docker-compose.yml`
- Backend Dockerfile: `/backend/Dockerfile`
- Frontend Dockerfile: `/frontend/Dockerfile`
- Nginx Config: `/frontend/nginx.conf`
- Environment Template: `/.env.example`

## Health Check URLs

```bash
# Backend health
curl https://api.facerecognition.nexawebs.com/api/

# Frontend health
curl https://facerecognition.nexawebs.com

# Database health (from inside container)
docker exec face-recognition-db pg_isready -U postgres
```
