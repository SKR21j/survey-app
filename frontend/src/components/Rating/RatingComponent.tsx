import { useState } from 'react';

interface RatingComponentProps {
  value: number;
  onChange: (value: number) => void;
  showComment?: boolean;
  comment?: string;
  onCommentChange?: (comment: string) => void;
  readonly?: boolean;
}

export default function RatingComponent({
  value,
  onChange,
  showComment = false,
  comment = '',
  onCommentChange,
  readonly = false,
}: RatingComponentProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`text-3xl transition-transform ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
          >
            <span
              className={
                star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'
              }
            >
              ★
            </span>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-500">{value} / 5</span>
        )}
      </div>

      {showComment && onCommentChange && (
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Leave a comment (optional)"
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      )}
    </div>
  );
}
