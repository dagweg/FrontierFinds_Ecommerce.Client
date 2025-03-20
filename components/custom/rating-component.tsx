import { StarIcon } from "lucide-react";
import { useState } from "react";

// Define props interface
interface RatingComponentProps {
  className?: string;
  onRatingChange?: (rating: number) => void;
}

const RatingComponent: React.FC<RatingComponentProps> = ({
  className,
  onRatingChange,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <label
          key={value}
          className="cursor-pointer"
          title={`${value} star${value !== 1 ? "s" : ""}`}
          onMouseEnter={() => setHoverRating(value)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <input
            type="radio"
            name="rating"
            value={value}
            className="sr-only"
            onChange={() => handleRatingClick(value)}
          />
          <StarIcon
            className={`h-6 w-6 transition-colors duration-200 ${
              value <= (hoverRating || rating)
                ? "fill-black "
                : "fill-gray-300 text-gray-300"
            }`}
          />
        </label>
      ))}
    </div>
  );
};

export default RatingComponent;
