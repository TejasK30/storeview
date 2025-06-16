"use client"

import { StarRating } from "@/components/ui/StarRating"
import { Rating } from "@/lib/types"
import { Calendar, Mail, MapPin, User } from "lucide-react"

interface RatingCardProps {
  rating: Rating
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="text-yellow-500">
          <StarRating rating={rating.rating} size={18} />
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {new Date(rating.createdAt ?? "").toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-lg">{rating.userName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-md font-medium">{rating.userEmail}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-md font-medium">{rating.userAddress}</span>
        </div>
      </div>
    </div>
  )
}
