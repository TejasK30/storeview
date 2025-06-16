"use client"

import { StarIcon } from "lucide-react"
import React from "react"

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: number
  className?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  className = "",
}) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center gap-[2px] text-yellow-500 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon
          key={`full-${i}`}
          className="fill-yellow-500 stroke-yellow-500"
          style={{ width: size, height: size }}
        />
      ))}

      {hasHalfStar && (
        <StarIcon
          className="fill-yellow-500 stroke-yellow-500 rotate-180 scale-x-50"
          style={{ width: size, height: size }}
        />
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon
          key={`empty-${i}`}
          className="stroke-yellow-500"
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  )
}
