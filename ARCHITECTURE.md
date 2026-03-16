# Architecture

## High-Level System Design

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│              React + TypeScript (Vite)                  │
│                   Port 3000 / 80                        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST (JSON)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend API                          │
│            Spring Boot 3 (Java 17)                      │
│                    Port 8080                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Auth (JWT)  │  │  Survey API  │  │ Response API │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ JDBC
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL 15                          │
│                    Port 5432                            │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

```
users
├── id (UUID, PK)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── password_hash (VARCHAR)
├── role (ENUM: USER, ADMIN)
└── created_at (TIMESTAMP)

surveys
├── id (UUID, PK)
├── title (VARCHAR)
├── description (TEXT)
├── owner_id (UUID, FK → users.id)
├── is_active (BOOLEAN)
└── created_at (TIMESTAMP)

questions
├── id (UUID, PK)
├── survey_id (UUID, FK → surveys.id)
├── text (TEXT)
├── type (ENUM: TEXT, SINGLE_CHOICE, MULTIPLE_CHOICE, RATING)
└── order_index (INTEGER)

options
├── id (UUID, PK)
├── question_id (UUID, FK → questions.id)
└── text (VARCHAR)

responses
├── id (UUID, PK)
├── survey_id (UUID, FK → surveys.id)
├── respondent_id (UUID, FK → users.id, NULLABLE)
└── submitted_at (TIMESTAMP)

answers
├── id (UUID, PK)
├── response_id (UUID, FK → responses.id)
├── question_id (UUID, FK → questions.id)
└── value (TEXT)

ratings
├── id (UUID, PK)
├── survey_id (UUID, FK → surveys.id)
├── user_id (UUID, FK → users.id)
├── score (INTEGER, 1-5)
└── created_at (TIMESTAMP)
```

## API Flow

### Authentication
```
POST /api/auth/register  → Register new user
POST /api/auth/login     → Login and receive JWT token
```

### Surveys
```
GET    /api/surveys          → List all active surveys
POST   /api/surveys          → Create a new survey (auth required)
GET    /api/surveys/{id}     → Get survey details
PUT    /api/surveys/{id}     → Update survey (owner only)
DELETE /api/surveys/{id}     → Delete survey (owner only)
```

### Responses
```
POST /api/surveys/{id}/responses  → Submit a response
GET  /api/surveys/{id}/responses  → Get responses (owner only)
GET  /api/surveys/{id}/export     → Export results (CSV/JSON)
```

### Ratings
```
POST /api/surveys/{id}/ratings  → Rate a survey (auth required)
GET  /api/surveys/{id}/ratings  → Get average rating
```

## Deployment Architecture

```
GitHub Actions CI/CD
        │
        ├── Backend CI → Docker Hub (skr21j/survey-app-backend)
        ├── Frontend CI → Docker Hub (skr21j/survey-app-frontend)
        └── Deploy → Server

Server
├── Nginx (reverse proxy / SSL termination)
├── Docker Compose
│   ├── frontend container (port 80)
│   ├── backend container (port 8080)
│   └── postgres container (port 5432, internal only)
└── Volumes
    └── postgres_data (persistent DB storage)
```

## Security

- JWT tokens expire after 24 hours (configurable via `JWT_EXPIRATION`)
- Passwords are hashed using BCrypt
- SQL injection prevention via JPA/Hibernate parameterized queries
- CORS configured to allow only known origins
- HTTPS enforced in production via Nginx + Let's Encrypt
