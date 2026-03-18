import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { surveyService } from '../../services/surveyService';
import Loading from '../Common/Loading';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export default function SurveyDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    surveyService
      .getSurvey(Number(id))
      .then(setSurvey)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loading />;
  if (!survey) return null;

  const canEditSurvey = isAdmin || user?.id === survey.createdBy?.id;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
          <p className="text-gray-500 mt-1">{survey.description}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            survey.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : survey.status === 'DRAFT'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {survey.status}
        </span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">{t('questions')} ({survey.questions.length})</h2>
        <ol className="list-decimal list-inside space-y-2">
          {survey.questions.map((q) => (
            <li key={q.id} className="text-sm text-gray-700">
              {q.text}
              <span className="ml-2 text-xs text-gray-400">({q.type})</span>
              {q.required && <span className="ml-1 text-red-500 text-xs">*</span>}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-3">
        {survey.status === 'ACTIVE' && (user?.role === 'USER' || isAdmin) && (
          <Link
            to={`/surveys/${survey.id}`}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t('fillThisSurvey')}
          </Link>
        )}
        {canEditSurvey && (
          <Link
            to={`/surveys/${survey.id}/edit`}
            className="border border-gray-300 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t('edit')}
          </Link>
        )}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 px-5 py-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
}
