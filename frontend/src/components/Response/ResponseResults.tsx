import { useEffect, useState } from 'react';
import { ResponseStats } from '../../types/Response';
import { responseService } from '../../services/responseService';
import Loading from '../Common/Loading';

interface ResponseResultsProps {
  surveyId: number;
}

export default function ResponseResults({ surveyId }: ResponseResultsProps) {
  const [stats, setStats] = useState<ResponseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    responseService
      .getResponseStats(surveyId)
      .then(setStats)
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, [surveyId]);

  if (loading) return <Loading />;
  if (stats.length === 0) return <p className="text-gray-400 text-sm">No responses yet.</p>;

  return (
    <div className="space-y-6">
      {stats.map((stat) => (
        <div key={stat.questionId} className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-3">{stat.questionText}</h3>
          <p className="text-xs text-gray-400 mb-3">
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
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>{a.value}</span>
                    <span>{a.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
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
