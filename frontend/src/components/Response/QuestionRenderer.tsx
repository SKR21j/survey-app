import { Question } from '../../types/Question';
import RatingComponent from '../Rating/RatingComponent';

interface QuestionRendererProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
}

export default function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  const { type, options, text, required } = question;

  const handleCheckbox = (optionText: string, checked: boolean) => {
    const current = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...current, optionText]);
    } else {
      onChange(current.filter((v) => v !== optionText));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-800">
        {text}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'TEXT' && (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your answer..."
        />
      )}

      {type === 'MULTIPLE_CHOICE' && (
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name={`q-${question.id}`}
                value={opt.text}
                checked={value === opt.text}
                onChange={() => onChange(opt.text)}
                className="text-indigo-600"
              />
              {opt.text}
            </label>
          ))}
        </div>
      )}

      {type === 'CHECKBOX' && (
        <div className="space-y-2">
          {options.map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(opt.text)}
                onChange={(e) => handleCheckbox(opt.text, e.target.checked)}
                className="rounded text-indigo-600"
              />
              {opt.text}
            </label>
          ))}
        </div>
      )}

      {type === 'RATING' && (
        <RatingComponent
          value={typeof value === 'string' ? Number(value) : 0}
          onChange={(v) => onChange(String(v))}
        />
      )}

      {type === 'SLIDER' && (() => {
        const min = Number(options[0]?.text ?? 0);
        const max = Number(options[1]?.text ?? 10);
        const step = Number(options[2]?.text ?? 1);
        const current = typeof value === 'string' && value !== '' ? Number(value) : min;
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={current}
              onChange={(e) => onChange(e.target.value)}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{min}</span>
              <span className="font-semibold text-indigo-600">{current}</span>
              <span>{max}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
