import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey, SurveyListParams, SurveyStatus } from '../../types/Survey';
import { surveyService } from '../../services/surveyService';
import SurveyCard from './SurveyCard';
import Loading from '../Common/Loading';
import { useAuth } from '../../hooks/useAuth';

const STATUSES: { value: SurveyStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'CLOSED', label: 'Closed' },
];

interface SurveyListProps {
  activeOnly?: boolean;
}

export default function SurveyList({ activeOnly = false }: SurveyListProps) {
  const { user } = useAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<SurveyStatus | ''>('');
  const [sort, setSort] = useState<'desc' | 'asc'>('desc');

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const params: SurveyListParams = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (sort) params.sort = sort;
      if (activeOnly) params.status = 'ACTIVE';

      const data = await surveyService.getSurveys(params);
      setSurveys(data);
    } catch {
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, sort, activeOnly]);

  return (
    <div className="space-y-4">
      {!activeOnly && (
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surveys..."
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SurveyStatus | '')}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          {user && (
            <Link
              to="/surveys/create"
              className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              + Create Survey
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : surveys.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">No surveys found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surveys.map((s) => (
            <SurveyCard key={s.id} survey={s} onDeleted={fetchSurveys} />
          ))}
        </div>
      )}
    </div>
  );
}
