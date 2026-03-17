import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import SurveyPage from './pages/SurveyPage';
import NotFoundPage from './pages/NotFoundPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import SurveyForm from './components/Survey/SurveyForm';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/surveys/:id" element={<SurveyPage />} />
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
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
