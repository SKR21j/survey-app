import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Survey } from '../../types/Survey';
import { ResponseStats } from '../../types/Response';
import { surveyService } from '../../services/surveyService';
import { responseService } from '../../services/responseService';
import Loading from '../Common/Loading';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

export default function SurveyAnalytics() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [stats, setStats] = useState<ResponseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    Promise.all([surveyService.getSurvey(numId), responseService.getResponseStats(numId)])
      .then(([s, st]) => {
        setSurvey(s);
        setStats(st);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!survey) return <p className="text-gray-400">Survey not found.</p>;

  const barData = stats.map((s) => ({
    name: s.questionText.substring(0, 20) + (s.questionText.length > 20 ? '…' : ''),
    responses: s.totalResponses,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Analytics: {survey.title}</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Responses per Question</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="responses" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {stats.map((stat) => {
        if (stat.answers.length === 0) return null;
        const pieData = stat.answers.map((a) => ({ name: a.value, value: a.count }));
        return (
          <div key={stat.questionId} className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">{stat.questionText}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
