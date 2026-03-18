import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function Header() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 dark:bg-gray-900 text-white shadow-md transition-colors border-b border-indigo-500 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold tracking-tight">
            {import.meta.env.VITE_APP_NAME ?? 'Survey App'}
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="hover:text-indigo-200 dark:hover:text-gray-300 transition-colors">
              Home
            </Link>
            <a href="/contacts.html" className="hover:text-indigo-200 dark:hover:text-gray-300 transition-colors">
              Contact
            </a>
            {user && (
              <Link to="/dashboard" className="hover:text-indigo-200 dark:hover:text-gray-300 transition-colors">
                Dashboard
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="px-3 py-1 text-sm rounded-md border border-white/40 hover:bg-white/10 transition-colors"
              type="button"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-indigo-200 dark:text-gray-300">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 dark:bg-gray-100 dark:text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50 dark:hover:bg-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 dark:bg-gray-100 dark:text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50 dark:hover:bg-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border border-white text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 dark:hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
