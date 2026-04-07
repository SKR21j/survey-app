import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { surveyService } from '../../services/surveyService';
import Loading from '../Common/Loading';
import { useLanguage } from '../../hooks/useLanguage';

interface Stats {
  total: number;
  active: number;
  draft: number;
  closed: number;
  totalResponses: number;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    surveyService
      .getSurveys()
      .then(setSurveys)
      .catch(() => setSurveys([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const stats: Stats = {
    total: surveys.length,
    active: surveys.filter((s) => s.status === 'ACTIVE').length,
    draft: surveys.filter((s) => s.status === 'DRAFT').length,
    closed: surveys.filter((s) => s.status === 'CLOSED').length,
    totalResponses: surveys.reduce((acc, s) => acc + (s.responseCount ?? 0), 0),
  };

  const statCards = [
    { label: t('totalSurveys'), value: stats.total, color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
    { label: t('active'), value: stats.active, color: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    { label: t('draft'), value: stats.draft, color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
    { label: t('totalResponses'), value: stats.totalResponses, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  ];

  const getStatusLabel = (status: Survey['status']) => {
    if (status === 'ACTIVE') return t('active');
    if (status === 'DRAFT') return t('draft');
    return t('closed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard')}</h1>
        <Link
          to="/surveys/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
        >
          {t('createSurvey')}
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-lg p-4 ${card.color}`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t('recentSurveys')}</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {surveys.slice(0, 10).map((survey) => (
            <div key={survey.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{survey.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {survey.questions.length} {t('questions')} · {survey.responseCount ?? 0} {t('responses')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    survey.status === 'ACTIVE'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : survey.status === 'DRAFT'
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {getStatusLabel(survey.status)}
                </span>
                <Link
                  to={`/surveys/${survey.id}/edit`}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {t('edit')}
                </Link>
              </div>
            </div>
          ))}
          {surveys.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">{t('noSurveysYet')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
