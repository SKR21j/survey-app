import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Common/Loading';
import ResponseResults from '../components/Response/ResponseResults';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { surveyService } from '../services/surveyService';
import { Survey } from '../types/Survey';

export default function SurveyResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user } = useAuth();
  const { t } = useLanguage();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError(t('invalidSurveyId'));
      setLoading(false);
      return;
    }

    surveyService
      .getSurvey(Number(id))
      .then(setSurvey)
        .catch(() => setError(t('noSurveysFound')))
      .finally(() => setLoading(false));
      }, [id, t]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Loading message="Loading responses..." />
        
      </div>
    );
  }

  if (error || !survey) {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-red-500">{error || t('noSurveysFound')}</div>;
  }

  const canViewResponses = isAdmin || user?.id === survey.createdBy?.id;

  if (!canViewResponses) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-600 dark:text-gray-300">{t('onlyViewCreatedResponses')}</p>
        <Link
          to="/dashboard"
          className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
        >
          {t('backToDashboard')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{survey.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('responseOverview')}</p>
      </div>

      <ResponseResults surveyId={survey.id} />
    </div>
  );
}
