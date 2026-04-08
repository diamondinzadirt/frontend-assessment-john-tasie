import { MAX_RATING } from '@/lib/constants';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingDisplay({
  rating,
  reviewCount = 0,
  size = 'md',
  showCount = true,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const clampedRating = Math.min(Math.max(rating, 0), MAX_RATING);
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(clampedRating));

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {stars.map((isFilled, i) => (
          <svg
            key={i}
            className={`${starSize[size]} ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        <span className="font-semibold text-gray-900">
          {clampedRating.toFixed(1)}
        </span>
        {showCount && reviewCount > 0 && (
          <span className="text-gray-600">({reviewCount})</span>
        )}
      </div>
    </div>
  );
}
