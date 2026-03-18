import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loading from '../components/Common/Loading';
import ResponseResults from '../components/Response/ResponseResults';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { responseService } from '../services/responseService';
import { surveyService } from '../services/surveyService';
import { SurveyResponse } from '../types/Response';
import { Survey } from '../types/Survey';
import { exportToCSV, exportToJSON } from '../utils/exportData';

export default function SurveyResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user } = useAuth();
  const { t } = useLanguage();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError(t('invalidSurveyId'));
      setLoading(false);
      return;
    }

    Promise.all([surveyService.getSurvey(Number(id)), responseService.getResponses(Number(id))])
      .then(([loadedSurvey, loadedResponses]) => {
        setSurvey(loadedSurvey);
        setResponses(loadedResponses);
      })
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{survey.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('responseOverview')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportToCSV(survey, responses)}
            disabled={responses.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {t('exportCsv')}
          </button>
          <button
            type="button"
            onClick={() => exportToJSON(survey, responses)}
            disabled={responses.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {t('exportJson')}
          </button>
        </div>
      </div>

      {responses.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500">{t('noResponsesToExport')}</p>
      )}

      <ResponseResults surveyId={survey.id} />
    </div>
  );
}
