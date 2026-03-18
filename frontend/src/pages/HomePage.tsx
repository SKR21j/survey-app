import { useState } from 'react';
import { Link } from 'react-router-dom';
import SurveyList from '../components/Survey/SurveyList';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t('welcome')} {import.meta.env.VITE_APP_NAME ?? 'Survey App'}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {user
            ? t('helloBrowse').replace('{name}', user.name)
            : t('browseAnonymous')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 sm:items-center">
        <label htmlFor="home-survey-search" className="sr-only">
          {t('searchSurveys')}
        </label>
        <input
          id="home-survey-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchActiveSurveys')}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {user && (
          <Link
            to="/surveys/create"
            className="inline-flex justify-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {t('createSurvey')}
          </Link>
        )}
      </div>

      <SurveyList activeOnly searchTerm={searchTerm} />
    </div>
  );
}
