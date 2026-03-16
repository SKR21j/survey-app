import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Survey } from '../types/Survey';
import { surveyService } from '../services/surveyService';
import ResponseForm from '../components/Response/ResponseForm';
import Loading from '../components/Common/Loading';

export default function SurveyPage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    surveyService
      .getSurvey(Number(id))
      .then(setSurvey)
      .catch(() => setError('Survey not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-10"><Loading /></div>;

  if (error || !survey) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center text-red-500">
        {error || 'Survey not found.'}
      </div>
    );
  }

  if (survey.status !== 'ACTIVE') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center text-gray-500">
        This survey is not currently accepting responses.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <ResponseForm survey={survey} />
    </div>
  );
}
