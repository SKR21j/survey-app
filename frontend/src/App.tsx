import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import Header from './components/Common/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SurveyPage from './pages/SurveyPage';
import SurveyResponsesPage from './pages/SurveyResponsesPage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SurveyForm from './components/Survey/SurveyForm';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800 transition-colors">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/surveys/:id"
                    element={
                      <ProtectedRoute>
                        <SurveyPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/surveys/:id/responses"
                    element={
                      <ProtectedRoute>
                        <SurveyResponsesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/surveys/create"
                    element={
                      <ProtectedRoute>
                        <SurveyForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/surveys/:id/edit"
                    element={
                      <ProtectedRoute>
                        <SurveyForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
