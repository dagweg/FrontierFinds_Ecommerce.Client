import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import React from "react";

function RatingDisplay({
  rating,
  starSize = 20,
}: {
  rating: number;
  starSize?: number;
}) {
  return (
    <div className="inline-flex gap-1">
      {Array.from({
        length: Math.floor(rating),
      }).map((_, i) => (
        <IconStarFilled key={i} size={starSize} />
      ))}
      {rating % 1 >= 0.5 && <IconStarHalfFilled size={starSize} />}
      {Array.from({
        length: Math.floor(5 - rating),
      }).map((_, i) => (
        <IconStar key={i} size={starSize} />
      ))}
    </div>
  );
}

export default RatingDisplay;
