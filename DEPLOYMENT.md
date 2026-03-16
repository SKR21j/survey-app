# Deployment Guide

## Prerequisites

- A Linux server (Ubuntu 22.04 LTS recommended)
- Docker and Docker Compose installed
- A domain name pointing to the server IP
- The following GitHub Secrets configured:
  - `DOCKER_USERNAME` — Docker Hub username
  - `DOCKER_PASSWORD` — Docker Hub password or access token
  - `SONAR_TOKEN` — SonarCloud token (optional)
  - `STAGING_SSH_KEY` / `PRODUCTION_SSH_KEY` — SSH private key for the server
  - `STAGING_HOST` / `PRODUCTION_HOST` — Server hostname or IP
  - `STAGING_USER` / `PRODUCTION_USER` — SSH login user
  - `DB_PASSWORD` — Database password
  - `JWT_SECRET` — JWT signing secret (minimum 32 characters)
  - `DB_PASSWORD_PROD` / `JWT_SECRET_PROD` — Production-specific values

## Initial Server Setup

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Create application directory
sudo mkdir -p /opt/survey-app /opt/backups
sudo chown $USER:$USER /opt/survey-app

# Clone configuration (or copy docker-compose.yml manually)
cd /opt/survey-app
curl -O https://raw.githubusercontent.com/SKR21j/survey-app/main/docker-compose.yml
```

## Environment Variables

Create `/opt/survey-app/.env` on the server:

```env
DB_PASSWORD=<strong-random-password>
JWT_SECRET=<minimum-32-char-random-string>
```

> **Security Note:** Never commit the `.env` file to version control.
> Generate strong secrets with: `openssl rand -hex 32`

## SSL/TLS Configuration

We use Nginx as a reverse proxy with Let's Encrypt certificates.

### Install Certbot

```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Nginx Configuration

Create `/etc/nginx/sites-available/survey-app`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API - proxies /api/* requests to backend
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/survey-app /etc/nginx/sites-enabled/
sudo certbot --nginx -d your-domain.com
sudo systemctl reload nginx
```

## Deploying

Deployments are triggered automatically via the **Deploy** GitHub Actions workflow when:
- A push to `main` triggers a staging deployment
- A manual `workflow_dispatch` with `environment=production` triggers a production deployment

To trigger a manual deployment:
```
GitHub → Actions → Deploy → Run workflow → Select environment
```

## Database Backups

Database backups are created automatically before each production deployment in `/opt/backups/`.

To restore from backup:
```bash
cat /opt/backups/survey_db_YYYYMMDD_HHMMSS.sql | \
  docker compose exec -T postgres psql -U surveyuser survey_db
```

## Monitoring and Logging

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Health checks
```bash
# Backend health
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:3000
```

### Application metrics

Spring Boot Actuator exposes metrics at `/actuator/metrics`. Consider integrating with Prometheus and Grafana for production monitoring.
