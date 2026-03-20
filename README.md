# survey-app

A full-stack survey application with a React/TypeScript frontend, a Spring Boot backend, and a PostgreSQL database, all orchestrated with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (v2+)

## Quick Start

### 1. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set the required values:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret key for signing JWT tokens (Base64-encoded). Generate one with `openssl rand -base64 64` |

### 2. Run the application

```bash
docker-compose up -d
```

This starts three services:
- **postgres** — PostgreSQL 15 database on an internal network
- **backend** — Spring Boot API on port `8080`
- **frontend** — React app served by Nginx on port `3000`

### 3. Open the app

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Health check | http://localhost:8080/actuator/health |

### 4. Stop the application

```bash
docker-compose down
```

To also remove the database volume:

```bash
docker-compose down -v
```

## Build from source

If you prefer to build the Docker images locally instead of pulling them:

```bash
docker-compose up -d --build
```

## Development setup

### One-command local dev (Windows PowerShell)

From the project root, run:

```powershell
.\run-local-dev.ps1
```

This launches:
- PostgreSQL in Docker (container: `survey-postgres-local`)
- Backend (Spring Boot, dev profile) in a new PowerShell window
- Frontend (Vite) in a new PowerShell window

If you already run PostgreSQL locally and do not want Docker for DB:

```powershell
.\run-local-dev.ps1 -UseLocalPostgres
```

Default URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL if needed
npm install
npm run dev            # starts at http://localhost:3000
```

### Backend

Requires JDK 17+ and Maven 3.8+. A running PostgreSQL instance is also needed.

```bash
cd backend
export DB_URL=jdbc:postgresql://localhost:5432/surveydb_dev
export JWT_SECRET=$(openssl rand -base64 64)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Project structure

```
survey-app/
├── frontend/          # React 18 + TypeScript + Vite
├── backend/           # Spring Boot 3 + Spring Security + JPA
├── database/          # SQL schema and migrations
├── docker-compose.yml # Orchestration
└── .env.example       # Environment variable template
```
