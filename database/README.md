# Database – Survey App

This directory contains the PostgreSQL schema, Flyway migration scripts, and supporting documentation for the Survey App.

## Directory Structure

```
database/
├── migrations/
│   ├── V1__Initial_Schema.sql        # Enable pgcrypto extension
│   ├── V2__Create_Users_Table.sql    # users table + indexes
│   ├── V3__Create_Surveys_Tables.sql # surveys, questions, question_options
│   ├── V4__Create_Responses_Tables.sql # responses, answers
│   ├── V5__Create_Ratings_Table.sql  # ratings table
│   └── V6__Insert_Test_Data.sql      # seed data for development
├── schema.sql                        # Full schema in a single file
├── schema-diagram.md                 # ER diagram (ASCII)
└── README.md                         # This file
```

## Tables

| Table             | Description                                      |
|-------------------|--------------------------------------------------|
| `users`           | Registered users with role-based access          |
| `surveys`         | Surveys created by users                         |
| `questions`       | Questions belonging to a survey                  |
| `question_options`| Options for MULTIPLE_CHOICE questions            |
| `responses`       | A user's submission of answers to a survey       |
| `answers`         | Individual answers within a response             |
| `ratings`         | Overall star ratings given to published surveys  |

## Migrations

Migrations follow the [Flyway](https://flywaydb.org/) naming convention:

```
V{version}__{description}.sql
```

Run all migrations in order (V1 → V6). The Spring Boot backend uses Flyway to apply them automatically on startup.

## Quick Start (Docker)

Start the database and pgAdmin with Docker Compose from the project root:

```bash
docker-compose up -d
```

| Service    | URL                        | Default credentials               |
|------------|----------------------------|-----------------------------------|
| PostgreSQL | `localhost:5432`           | See `.env`                        |
| pgAdmin 4  | http://localhost:5050      | admin@survey-app.com / pgadmin123 |

## Manual Setup

If you prefer to run PostgreSQL locally without Docker:

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE surveyapp;"

# Apply the schema
psql -U postgres -d surveyapp -f database/schema.sql

# (Optional) Load test data
psql -U postgres -d surveyapp -f database/migrations/V6__Insert_Test_Data.sql
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=surveyapp
DB_USERNAME=surveyapp_user
DB_PASSWORD=surveyapp_pass
```

## Test Users (seeded by V6)

| Username   | Email                   | Password    | Role  |
|------------|-------------------------|-------------|-------|
| admin      | admin@survey-app.com    | password123 | ADMIN |
| john_doe   | john@example.com        | password123 | USER  |
| jane_smith | jane@example.com        | password123 | USER  |
