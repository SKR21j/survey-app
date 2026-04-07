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

  if (responses.length === 0 && stats.every((s) => s.totalResponses === 0)) {
    return <p className="text-gray-400 dark:text-gray-500 text-sm">No responses yet.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Aggregate stats per question */}
      {stats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Answer Summary</h2>
          {stats.map((stat) => (
            <div key={stat.questionId} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{stat.questionText}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                {stat.totalResponses} response{stat.totalResponses !== 1 ? 's' : ''}
              </p>
              {stat.answers.length > 0 ? (
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
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">No answers yet.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Individual responses */}
      {responses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Individual Responses ({responses.length})
          </h2>
          {responses.map((response) => (
            <div key={response.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Submitted: {new Date(response.submittedAt).toLocaleString()}
                </p>
                {response.username && (
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {response.username}
                  </span>
                )}
              </div>
              {response.answers.length > 0 ? (
                <dl className="space-y-2">
                  {response.answers.map((answer) => (
                    <div key={answer.questionId} className="text-sm">
                      {answer.questionText && (
                        <dt className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{answer.questionText}</dt>
                      )}
                      <dd className="text-gray-800 dark:text-gray-200 font-medium">
                        {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">No answers recorded.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
