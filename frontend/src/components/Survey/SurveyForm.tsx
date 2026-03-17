import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { SurveyFormData, SurveyStatus } from '../../types/Survey';
import { QuestionType } from '../../types/Question';
import { surveyService } from '../../services/surveyService';
import Loading from '../Common/Loading';
import { useAuth } from '../../hooks/useAuth';

const QUESTION_TYPES: QuestionType[] = ['TEXT', 'MULTIPLE_CHOICE', 'RATING', 'CHECKBOX', 'SLIDER'];
const STATUSES: SurveyStatus[] = ['DRAFT', 'ACTIVE', 'CLOSED'];

export default function SurveyForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [serverError, setServerError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SurveyFormData>({
    defaultValues: {
      title: '',
      description: '',
      status: 'DRAFT',
      questions: [],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    if (isEdit && id) {
      surveyService
        .getSurvey(Number(id))
        .then((survey) => {
          const canEditSurvey = isAdmin || user?.id === survey.createdBy?.id;
          if (!canEditSurvey) {
            setServerError('You can only edit surveys that you created.');
            navigate('/dashboard');
            return;
          }

          reset({
            title: survey.title,
            description: survey.description,
            status: survey.status,
            questions: survey.questions.map((q) => ({
              text: q.text,
              type: q.type,
              required: q.required,
              options: q.options.map((o) => ({ text: o.text })),
            })),
          });
        })
        .catch(() => navigate('/dashboard'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, isAdmin, navigate, reset, user?.id]);

  const onSubmit = async (data: SurveyFormData) => {
    try {
      setServerError('');
      if (isEdit && id) {
        await surveyService.updateSurvey(Number(id), data);
      } else {
        await surveyService.createSurvey(data);
      }
      navigate('/dashboard');
    } catch {
      setServerError('Failed to save survey. Please try again.');
    }
  };

  if (loading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Survey' : 'Create Survey'}</h1>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Survey title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe your survey..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            {...register('status')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
          <button
            type="button"
            onClick={() => appendQuestion({ text: '', type: 'TEXT', required: false, options: [] })}
            className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-100 transition-colors"
          >
            + Add Question
          </button>
        </div>

        {questionFields.map((field, qi) => (
          <QuestionEditor
            key={field.id}
            index={qi}
            register={register}
            control={control}
            watch={watch}
            onRemove={() => removeQuestion(qi)}
          />
        ))}

        {questionFields.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            No questions yet. Click "+ Add Question" to start.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Survey'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Sub-component for a single question editor
import { Control, UseFormRegister, UseFormWatch, useFieldArray as useFA } from 'react-hook-form';

interface QuestionEditorProps {
  index: number;
  register: UseFormRegister<SurveyFormData>;
  control: Control<SurveyFormData>;
  watch: UseFormWatch<SurveyFormData>;
  onRemove: () => void;
}

function QuestionEditor({ index, register, control, watch, onRemove }: QuestionEditorProps) {
  const qType = watch(`questions.${index}.type`);
  const hasOptions = qType === 'MULTIPLE_CHOICE' || qType === 'CHECKBOX';

  const { fields: optionFields, append: appendOption, remove: removeOption, replace: replaceOptions } = useFA({
    control,
    name: `questions.${index}.options`,
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
        <input
          {...register(`questions.${index}.text`, { required: true })}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Question text"
        />
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
        >
          Remove
        </button>
      </div>

      <div className="flex items-center gap-4">
        <select
          {...register(`questions.${index}.type`)}
          onChange={(e) => {
            register(`questions.${index}.type`).onChange(e);
            if (e.target.value === 'SLIDER') {
              replaceOptions([{ text: '0' }, { text: '10' }, { text: '1' }]);
            }
          }}
          className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {QUESTION_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <input type="checkbox" {...register(`questions.${index}.required`)} className="rounded" />
          Required
        </label>
      </div>

      {hasOptions && (
        <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
          <p className="text-xs text-gray-500 font-medium">Options</p>
          {optionFields.map((opt, oi) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                {...register(`questions.${index}.options.${oi}.text`, { required: true })}
                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder={`Option ${oi + 1}`}
              />
              <button
                type="button"
                onClick={() => removeOption(oi)}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => appendOption({ text: '' })}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            + Add option
          </button>
        </div>
      )}

      {qType === 'SLIDER' && (
        <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
          <p className="text-xs text-gray-500 font-medium">Slider Range</p>
          <div className="flex gap-4">
            {(['Min', 'Max', 'Step'] as const).map((label, i) => (
              <div key={label} className="flex flex-col gap-1">
                <label className="text-xs text-gray-500">{label}</label>
                <input
                  type="number"
                  {...register(`questions.${index}.options.${i}.text`, { required: true })}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
