# Contributing to Survey App

Thank you for considering contributing to Survey App!

## Git Workflow

We follow the **GitHub Flow** branching strategy:

1. Fork the repository (external contributors) or create a branch (collaborators)
2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes with focused commits
4. Push your branch and open a Pull Request against `main`
5. Address review feedback
6. Merge after approval

### Branch Naming

| Type       | Pattern                      | Example                        |
|------------|------------------------------|--------------------------------|
| Feature    | `feature/<short-description>`| `feature/export-csv`           |
| Bug fix    | `fix/<short-description>`    | `fix/login-redirect`           |
| Refactor   | `refactor/<description>`     | `refactor/survey-service`      |
| Docs       | `docs/<description>`         | `docs/api-reference`           |
| Chore      | `chore/<description>`        | `chore/update-dependencies`    |

## Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type     | Description                                      |
|----------|--------------------------------------------------|
| feat     | A new feature                                    |
| fix      | A bug fix                                        |
| docs     | Documentation changes                            |
| style    | Code formatting (no logic change)                |
| refactor | Code refactoring (no feature/bug change)         |
| test     | Adding or updating tests                         |
| chore    | Build process or dependency updates              |
| ci       | Changes to CI/CD configuration                   |

### Examples

```
feat(auth): add JWT refresh token support

fix(survey): prevent duplicate responses from the same user

docs(readme): add Docker setup instructions

chore(deps): update Spring Boot to 3.2.0
```

## PR Guidelines

- Keep PRs focused on a single feature or fix
- Fill in the PR template completely
- Ensure all CI checks pass before requesting review
- Request at least one reviewer
- Squash commits before merging (or use the GitHub squash-and-merge button)

## Code Style Standards

### Backend (Java)

- Follow [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- Use 4-space indentation
- Maximum line length: 120 characters
- All public methods must have Javadoc comments
- Write unit tests for all service-layer methods
- Integration tests for all API endpoints

### Frontend (TypeScript / React)

- Follow the project's ESLint and Prettier configuration
- Use 2-space indentation
- Use functional components with React hooks
- Prefer named exports over default exports
- Write unit tests with Vitest for all utility functions and hooks
- Use Tailwind CSS utility classes; avoid inline styles

## Running the Development Environment

```bash
# Clone and setup
git clone https://github.com/SKR21j/survey-app.git
cd survey-app
cp .env.example .env

# Start all services
docker compose -f docker-compose.dev.yml up --build
```

## Running Tests Before Submitting a PR

```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm run lint && npm run type-check && npm run test
```
