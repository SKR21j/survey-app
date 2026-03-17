# Survey App Backend

Spring Boot backend for the Survey Application.

## Tech Stack

- **Java 21**
- **Spring Boot 3.1.x**
- **Spring Security 6.x** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **Lombok** for boilerplate reduction
- **SpringDoc OpenAPI** (Swagger UI)

## Prerequisites

- JDK 21+
- Maven 3.8+
- PostgreSQL 14+

## Getting Started

### Configuration

Copy the environment variables or set them in `application.yml`:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/surveydb
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your_base64_encoded_secret
export JWT_EXPIRATION=86400000
```

### Run Locally

```bash
cd backend
mvn spring-boot:run
```

For development profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Build

```bash
mvn clean package
```

### Run Tests

```bash
mvn test
```

## API Documentation

Once the application is running, Swagger UI is available at:
- http://localhost:8080/swagger-ui.html
- http://localhost:8080/v3/api-docs

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login and get JWT |
| GET | `/api/surveys` | None | List active surveys |
| POST | `/api/surveys` | Admin | Create survey |
| GET | `/api/surveys/{id}` | None | Get survey by ID |
| PUT | `/api/surveys/{id}` | Admin | Update survey |
| DELETE | `/api/surveys/{id}` | Admin | Delete survey |
| POST | `/api/responses` | Auth | Submit response |
| GET | `/api/surveys/{id}/responses` | Admin | Get survey responses |
| POST | `/api/surveys/{id}/ratings` | Auth | Rate survey |
| GET | `/api/surveys/{id}/average-rating` | None | Get average rating |

## Docker

```bash
docker build -t survey-app-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/surveydb \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e JWT_SECRET=your_secret \
  survey-app-backend
```

## Project Structure

```
src/main/java/com/surveyapp/
├── controller/     # REST controllers
├── service/        # Business logic
├── model/          # JPA entities
├── repository/     # Spring Data repositories
├── security/       # JWT and Spring Security config
├── dto/            # Data Transfer Objects
├── exception/      # Custom exceptions and global handler
└── SurveyAppApplication.java
```
