import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Survey } from '../../types/Survey';
import { Answer } from '../../types/Response';
import { responseService } from '../../services/responseService';
import { ratingService } from '../../services/ratingService';
import { useLanguage } from '../../hooks/useLanguage';
import QuestionRenderer from './QuestionRenderer';
import RatingComponent from '../Rating/RatingComponent';

interface ResponseFormProps {
  survey: Survey;
}

function serializeAnswerValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join(', ') : value;
}

export default function ResponseForm({ survey }: ResponseFormProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');

  const handleAnswer = (questionId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const validate = (): boolean => {
    for (const q of survey.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || val === '') {
          setError(t('answerPrompt').replace('{question}', q.text));
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
        setError(t('failedSubmitResponse'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (ratingValue < 1 || ratingValue > 5) {
      setRatingError(t('selectStarRating'));
      return;
    }

    setRatingError('');
    setRatingSubmitting(true);
    try {
      await ratingService.rateSurvey({
        surveyId: survey.id,
        value: ratingValue,
        comment: ratingComment.trim() || undefined,
      });
      setRatingSubmitted(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const backendMessage = err.response?.data?.message;
        const backendError = err.response?.data?.error;
        if (backendMessage || backendError) {
          setRatingError(String(backendMessage ?? backendError));
        } else {
          setRatingError(t('failedSubmitRating'));
        }
      } else {
        setRatingError(t('failedSubmitRating'));
      }
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 space-y-5">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">{t('thankYou')}</h2>
        <p className="text-gray-500">{t('responseSubmittedSuccess')}</p>

        {!ratingSubmitted && (
          <div className="max-w-md mx-auto text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t('rateSurveyOptional')}
            </h3>
            <RatingComponent
              value={ratingValue}
              onChange={setRatingValue}
              showComment
              comment={ratingComment}
              onCommentChange={setRatingComment}
            />
            {ratingError && (
              <p className="text-sm text-red-600">{ratingError}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleRatingSubmit}
                disabled={ratingSubmitting}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {ratingSubmitting ? t('submittingRating') : t('submitRating')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {t('skip')}
              </button>
            </div>
          </div>
        )}

        {ratingSubmitted && (
          <p className="text-sm text-green-600">{t('thanksForRating')}</p>
        )}

        <button
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {t('backToSurveys')}
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
              value={answers[q.id] ?? (q.type === 'CHECKBOX' ? [] : q.type === 'SLIDER' ? (q.options[0]?.text ?? '0') : '')}
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
        {submitting ? t('submitting') : t('submitResponse')}
      </button>
    </form>
  );
}
