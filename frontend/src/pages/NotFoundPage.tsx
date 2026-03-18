import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-8xl font-bold text-indigo-200">404</div>
      <h1 className="text-3xl font-bold text-gray-900">{t('pageNotFound')}</h1>
      <p className="text-gray-500 max-w-md">
        {t('pageMissing')}
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-indigo-700 transition-colors"
      >
        {t('goHome')}
      </Link>
    </div>
  );
}
