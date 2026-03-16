import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { SurveyResponse } from '../../types/Response';
import { surveyService } from '../../services/surveyService';
import { responseService } from '../../services/responseService';
import { exportToCSV, exportToJSON } from '../../utils/exportData';
import Loading from '../Common/Loading';

export default function ExportData() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    Promise.all([surveyService.getSurvey(numId), responseService.getResponses(numId)])
      .then(([s, r]) => {
        setSurvey(s);
        setResponses(r);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!survey) return <p className="text-gray-400">Survey not found.</p>;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Export Data</h1>
      <p className="text-gray-500">
        Survey: <span className="font-medium">{survey.title}</span>
      </p>
      <p className="text-sm text-gray-400">{responses.length} response(s) available</p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">CSV Export</p>
            <p className="text-sm text-gray-500">Spreadsheet-compatible format</p>
          </div>
          <button
            onClick={() => exportToCSV(survey, responses)}
            disabled={responses.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Download CSV
          </button>
        </div>

        <hr className="border-gray-100" />

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">JSON Export</p>
            <p className="text-sm text-gray-500">Machine-readable format</p>
          </div>
          <button
            onClick={() => exportToJSON(survey, responses)}
            disabled={responses.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Download JSON
          </button>
        </div>
      </div>

      {responses.length === 0 && (
        <p className="text-center text-gray-400 text-sm">No responses to export yet.</p>
      )}
    </div>
  );
}
