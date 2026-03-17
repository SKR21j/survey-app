import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { useAuth } from '../../hooks/useAuth';
import { surveyService } from '../../services/surveyService';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  ACTIVE: 'bg-green-100 text-green-700',
  CLOSED: 'bg-red-100 text-red-700',
};

interface SurveyCardProps {
  survey: Survey;
  onDeleted?: () => void;
}

export default function SurveyCard({ survey, onDeleted }: SurveyCardProps) {
  const { isAdmin } = useAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    try {
      await surveyService.deleteSurvey(survey.id);
      onDeleted?.();
    } catch {
      setDeleteError('Failed to delete survey');
      setConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{survey.title}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[survey.status]}`}>
          {survey.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2">{survey.description}</p>

      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>📝 {survey.questions?.length ?? 0} questions</span>
        {survey.responseCount !== undefined && (
          <span>📊 {survey.responseCount} responses</span>
        )}
        {survey.averageRating !== undefined && (
          <span>⭐ {survey.averageRating.toFixed(1)}</span>
        )}
        <span>🗓 {survey.createdAt ? new Date(survey.createdAt).toLocaleDateString() : '-'}</span>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        {survey.status === 'ACTIVE' && (
          <Link
            to={`/surveys/${survey.id}`}
            className="flex-1 text-center bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Fill Survey
          </Link>
        )}
        {isAdmin && (
          <>
            <Link
              to={`/surveys/${survey.id}/edit`}
              className="flex-1 text-center border border-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </>
        )}
        {deleteError && (
          <p className="text-xs text-red-600 w-full">{deleteError}</p>
        )}
      </div>
    </div>
  );
}
