import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { Answer } from '../../types/Response';
import { responseService } from '../../services/responseService';
import QuestionRenderer from './QuestionRenderer';

interface ResponseFormProps {
  survey: Survey;
}

function serializeAnswerValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join(', ') : value;
}

export default function ResponseForm({ survey }: ResponseFormProps) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const validate = (): boolean => {
    for (const q of survey.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
          setError(`Please answer: "${q.text}"`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    const submission: Answer[] = survey.questions
      .map((q) => ({ questionId: q.id, value: answers[q.id] ?? '' }))
      .filter((a) => a.value !== '' && !(Array.isArray(a.value) && a.value.length === 0))
      .map((a) => ({ ...a, value: serializeAnswerValue(a.value) }));

    setSubmitting(true);
    try {
      await responseService.submitResponse({ surveyId: survey.id, answers: submission });
      setSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(String(err.response.data.message));
      } else {
        setError('Failed to submit response. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Thank you!</h2>
        <p className="text-gray-500">Your response has been submitted successfully.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to surveys
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
        <p className="text-gray-500 mt-1">{survey.description}</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {survey.questions.map((q) => (
          <div key={q.id} className="bg-white rounded-lg border border-gray-200 p-5">
            <QuestionRenderer
              question={q}
              value={answers[q.id] ?? (q.type === 'CHECKBOX' ? [] : '')}
              onChange={(v) => handleAnswer(q.id, v)}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Response'}
      </button>
    </form>
  );
}
