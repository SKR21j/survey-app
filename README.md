# Survey App

A full-stack survey management application built with React, TypeScript, Spring Boot, and PostgreSQL.

## Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS |
| Backend    | Spring Boot 3, Java 17, JWT Auth         |
| Database   | PostgreSQL 15                            |
| Container  | Docker, Docker Compose                   |
| CI/CD      | GitHub Actions                           |

## Features

- User registration and JWT-based authentication
- Create, edit, and delete surveys with multiple question types
- Collect and view survey responses
- Export results to CSV or JSON
- Admin dashboard with usage statistics
- Rating system for surveys

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Java 17+ (for local backend development)
- Node.js 20+ (for local frontend development)

## Running Locally with Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SKR21j/survey-app.git
   cd survey-app
   ```

2. **Copy the example environment file and set values:**
   ```bash
   cp .env.example .env
   # Edit .env and set DB_PASSWORD and JWT_SECRET
   ```

3. **Start all services:**
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

4. **Access the application:**
   | Service  | URL                          |
   |----------|------------------------------|
   | Frontend | http://localhost:3000        |
   | Backend  | http://localhost:8080        |
   | API Docs | http://localhost:8080/swagger-ui.html |
   | pgAdmin  | http://localhost:5050        |

## Local Development (without Docker)

### Backend
```bash
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

Swagger UI is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Running Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm run test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the development workflow and PR guidelines.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup instructions.

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for system design and database schema documentation.

## License

This project is licensed under the MIT License.