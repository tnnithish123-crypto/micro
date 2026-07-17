"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 22,
};

const gapMap = {
  sm: "gap-0.5",
  md: "gap-1",
  lg: "gap-1",
};

const textMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export default function StarRating({
  rating,
  reviews,
  size = "md",
}: StarRatingProps) {
  const starSize = sizeMap[size];
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center ${gapMap[size]}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const value = i + 1;
        const filled = rounded >= value;
        const halfFilled = !filled && rounded >= value - 0.5;

        return (
          <span key={i} className="relative">
            {halfFilled && (
              <span className="absolute inset-0 overflow-hidden w-[50%]">
                <Star
                  size={starSize}
                  className="text-yellow-400 fill-yellow-400"
                />
              </span>
            )}
            <Star
              size={starSize}
              className={
                filled
                  ? "text-yellow-400 fill-yellow-400"
                  : halfFilled
                  ? "text-gray-300"
                  : "text-gray-300"
              }
            />
          </span>
        );
      })}
      {reviews !== undefined && (
        <span className={`${textMap[size]} text-hp-gray-500 ml-1`}>
          ({reviews.toLocaleString()})
        </span>
      )}
    </div>
  );
}
