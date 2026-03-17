import SurveyList from '../components/Survey/SurveyList';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to {import.meta.env.VITE_APP_NAME ?? 'Survey App'}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {user
            ? `Hello, ${user.name}! Browse and fill out surveys below.`
            : 'Browse available surveys and share your opinions.'}
        </p>
      </div>

      <SurveyList activeOnly />
    </div>
  );
}
