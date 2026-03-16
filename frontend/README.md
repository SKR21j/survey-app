# Survey App — Frontend

React 18 + TypeScript frontend for the Survey application.

## Tech Stack

- **React 18** with TypeScript
- **Vite** — fast build tooling
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Tailwind CSS** — utility-first styling
- **Recharts** — analytics charts
- **React Hook Form** — form handling and validation

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:3000.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |
| `VITE_APP_NAME` | Application name | `Survey App` |

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Auth/         # Login, Register
│   ├── Survey/       # SurveyList, SurveyForm, SurveyCard, SurveyDetail
│   ├── Response/     # ResponseForm, QuestionRenderer, ResponseResults
│   ├── Admin/        # AdminDashboard, SurveyAnalytics, ExportData
│   ├── Common/       # Header, Sidebar, Footer, Loading
│   └── Rating/       # RatingComponent
├── pages/            # Route-level page components
├── services/         # API service layer (Axios)
├── types/            # TypeScript interfaces
├── context/          # AuthContext + ProtectedRoute
├── hooks/            # useAuth hook
├── utils/            # auth helpers, validators, export utilities
└── styles/           # Global CSS
```

## Docker

```bash
# Build production image
docker build -t survey-app-frontend .

# Run container
docker run -p 80:80 survey-app-frontend
```
