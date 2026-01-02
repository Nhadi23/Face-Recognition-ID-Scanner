# Deployment Configuration Summary

**Application**: Face Recognition ID Scanner
**Domain**: facerecognition.nexawebs.com
**Deployment Platform**: Coolify with Docker Compose

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│            facerecognition.nexawebs.com          │
│              (Frontend - React + Nginx)          │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────────┐
│          api.facerecognition.nexawebs.com        │
│              (Backend - Express.js)              │
└──────────────────┬──────────────────────────────┘
                   │
                   │ Queries
                   ▼
┌─────────────────────────────────────────────────┐
│            PostgreSQL Database                   │
│         (face_recognition DB)                    │
└─────────────────────────────────────────────────┘
```

## Files Created for Deployment

### Root Directory
- `docker-compose.yml` - Main orchestration file
- `.env.example` - Environment variable template
- `.gitignore` - Git ignore rules
- `DEPLOYMENT.md` - Full deployment documentation
- `COOLIFY_SETUP.md` - Quick start guide
- `DEPLOYMENT_SUMMARY.md` - This file

### Backend
- `backend/Dockerfile` - Backend container image
- `backend/.dockerignore` - Build optimization
- `backend/server.js` - Updated with configurable CORS

### Frontend
- `frontend/Dockerfile` - Frontend container image (multi-stage)
- `frontend/nginx.conf` - Nginx configuration for production
- `frontend/.dockerignore` - Build optimization

## Environment Variables

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `secure_password_here` |
| `DB_NAME` | Database name | `face_recognition` |
| `DB_PORT` | Database port | `5432` |
| `DB_CLIENT` | Database client | `pg` |
| `JWT_SECRET` | JWT token secret | `random_32_char_string` |
| `JWT_REFRESH_SECRET` | JWT refresh secret | `random_32_char_string` |
| `FRONTEND_URL` | Frontend URL (CORS) | `https://facerecognition.nexawebs.com` |
| `VITE_API_URL` | Backend API URL | `https://api.facerecognition.nexawebs.com` |
| `ENVIRONMENT` | Environment | `production` |

## Service Configuration

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432 (internal)
- **Volume**: postgres_data (persistent storage)
- **Health Check**: Enabled

### Backend API
- **Port**: 3000 (internal)
- **Domain**: api.facerecognition.nexawebs.com
- **Dependencies**: PostgreSQL
- **Features**:
  - Auto-migration on startup
  - JWT authentication
  - Swagger API docs at `/api-docs`

### Frontend
- **Port**: 80 (internal)
- **Domain**: facerecognition.nexawebs.com
- **Server**: Nginx (Alpine)
- **Dependencies**: Backend
- **Features**:
  - Static file serving
  - SPA routing support
  - API proxy (optional)
  - Gzip compression
  - Asset caching

## Database Schema

Initial seed creates:
- **Admin User**: NIM `admin01`, Password `admin123` ⚠️ CHANGE THIS!
- Tables:
  - `users` - User accounts and profiles
  - `permissions` - Permission requests
  - `attendance` - Attendance logs
  - `refresh_tokens` - JWT refresh tokens
  - `token_blacklist` - Blacklisted tokens

## API Endpoints

Base URL: `https://api.facerecognition.nexawebs.com`

### User Management
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/:id` - Update user

### Permissions
- `POST /api/permission` - Create permission request
- `GET /api/permission` - Get all permissions
- `GET /api/permission/:id` - Get permission by ID
- `PUT /api/permission/:id` - Update permission
- `DELETE /api/permission/:id` - Delete permission

### Attendance
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `GET /api/attendance` - Get attendance history

### Gate/Face Recognition
- `POST /api/gate/verify` - Verify face recognition

### Documentation
- `GET /api-docs` - Interactive Swagger UI

## Default Credentials

⚠️ **SECURITY WARNING**: Change these immediately after first login!

**Admin Account**:
- NIM: `admin01`
- Password: `admin123`

## Deployment Checklist

### Pre-Deployment
- [ ] All code committed to Git
- [ ] Domain DNS configured (`facerecognition.nexawebs.com`)
- [ ] Subdomain DNS configured (`api.facerecognition.nexawebs.com`)
- [ ] Coolify instance running and accessible
- [ ] Generate secure JWT secrets

### Configuration
- [ ] Create `.env` file from `.env.example`
- [ ] Set strong database password
- [ ] Set secure JWT secrets
- [ ] Set correct frontend/backend URLs
- [ ] Verify all environment variables in Coolify

### Deployment
- [ ] Connect Git repository in Coolify
- [ ] Select Docker Compose deployment
- [ ] Add environment variables to Coolify
- [ ] Configure both domains (frontend & API)
- [ ] Enable SSL/TLS certificates
- [ ] Deploy application

### Post-Deployment
- [ ] Verify frontend loads correctly
- [ ] Verify API is accessible
- [ ] Test API documentation endpoint
- [ ] Log in with default admin account
- [ ] Change default admin password
- [ ] Test all features (login, permissions, attendance)
- [ ] Set up database backups
- [ ] Configure monitoring and alerts
- [ ] Review security settings

## Security Best Practices

1. **Strong Passwords**: Use minimum 32 character strings for JWT secrets
2. **SSL/TLS**: Always use HTTPS in production
3. **CORS**: Configure proper allowed origins
4. **Rate Limiting**: Implement API rate limiting
5. **Input Validation**: Validate all user inputs
6. **SQL Injection**: Use parameterized queries (Knex.js handles this)
7. **Authentication**: Never expose JWT secrets in client code
8. **Backups**: Regular database backups
9. **Monitoring**: Set up logging and monitoring
10. **Updates**: Keep dependencies updated

## Resource Requirements

**Minimum**:
- CPU: 1 core
- RAM: 1 GB
- Storage: 5 GB

**Recommended**:
- CPU: 2 cores
- RAM: 2 GB
- Storage: 10 GB

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check database is running
docker ps | grep postgres

# View logs
docker logs face-recognition-db

# Test connection
docker exec -it face-recognition-db psql -U postgres -d face_recognition
```

**Backend Not Starting**
```bash
# Check logs
docker logs face-recognition-backend

# Verify environment variables
docker exec face-recognition-backend env | grep DB_

# Check database migrations
docker exec face-recognition-backend npx knex migrate:status
```

**Frontend Not Loading**
```bash
# Check nginx logs
docker logs face-recognition-frontend

# Verify build
docker exec face-recognition-frontend ls -la /usr/share/nginx/html
```

### Useful Commands

```bash
# View all containers
docker ps -a

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# View logs for all services
docker-compose logs -f

# Execute command in container
docker exec -it <container_name> sh

# Database backup
docker exec face-recognition-db pg_dump -U postgres face_recognition > backup.sql

# Database restore
docker exec -i face-recognition-db psql -U postgres face_recognition < backup.sql
```

## Maintenance

### Regular Tasks

**Daily**:
- Check container health status
- Review error logs
- Monitor disk usage

**Weekly**:
- Review security logs
- Check for dependency updates
- Test backup restoration

**Monthly**:
- Update dependencies
- Review and rotate JWT secrets
- Performance optimization review
- Security audit

## Support Resources

- **Coolify Documentation**: https://coolify.io/docs
- **Docker Documentation**: https://docs.docker.com
- **PostgreSQL Documentation**: https://www.postgresql.org/docs
- **Express.js Documentation**: https://expressjs.com
- **React Documentation**: https://react.dev

## Next Steps

1. **Customization**: Modify the application for your specific needs
2. **Monitoring**: Set up comprehensive monitoring (Prometheus, Grafana)
3. **CI/CD**: Configure automated testing and deployment
4. **Scaling**: Plan for horizontal scaling if needed
5. **Documentation**: Create user documentation for your organization
6. **Training**: Train users on how to use the system

---

**Version**: 1.0.0
**Last Updated**: 2026-01-02
**Deployment Target**: Coolify
