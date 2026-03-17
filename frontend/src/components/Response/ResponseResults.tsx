import { useEffect, useState } from 'react';
import { ResponseStats, SurveyResponse } from '../../types/Response';
import { responseService } from '../../services/responseService';
import Loading from '../Common/Loading';

interface ResponseResultsProps {
  surveyId: number;
}

export default function ResponseResults({ surveyId }: ResponseResultsProps) {
  const [stats, setStats] = useState<ResponseStats[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      responseService.getResponseStats(surveyId),
      responseService.getResponses(surveyId),
    ]).then(([statsResult, responsesResult]) => {
      if (!mounted) return;

      if (statsResult.status === 'fulfilled') {
        setStats(statsResult.value);
      }

      if (responsesResult.status === 'fulfilled') {
        setResponses(responsesResult.value);
      }

      if (statsResult.status === 'rejected' && responsesResult.status === 'rejected') {
        setError('Could not load responses.');
      }
    }).finally(() => {
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [surveyId]);

  if (loading) return <Loading />;

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>;
  }

  if (stats.length > 0) {
    return (
      <div className="space-y-6">
        {stats.map((stat) => (
          <div key={stat.questionId} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{stat.questionText}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              {stat.totalResponses} response{stat.totalResponses !== 1 ? 's' : ''}
            </p>
            <div className="space-y-2">
              {stat.answers.map((a) => {
                const pct =
                  stat.totalResponses > 0
                    ? Math.round((a.count / stat.totalResponses) * 100)
                    : 0;
                return (
                  <div key={a.value}>
                    <div className="flex justify-between text-sm text-gray-700 dark:text-gray-200 mb-1">
                      <span>{a.value}</span>
                      <span>{a.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (responses.length > 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">{responses.length} response(s) submitted.</p>
        {responses.map((response) => (
          <div key={response.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Submitted: {new Date(response.submittedAt).toLocaleString()}
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200 space-y-1">
              {response.answers.map((answer, index) => (
                <li key={`${response.id}-${index}`}>{Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-gray-400 dark:text-gray-500 text-sm">No responses yet.</p>;
}
