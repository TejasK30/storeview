"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { RatingCard } from "@/components/ui/RatingCard"
import { Rating } from "@/lib/types"
import { StarIcon } from "lucide-react"

interface RatingsListProps {
  data: {
    ratings: Rating[]
    averageRating: number
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  } | null
  isLoading: boolean
  error: unknown
  onPageChange: (page: number) => void
}

export const StoreRatingsList: React.FC<RatingsListProps> = ({
  data,
  isLoading,
  error,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-6">Loading...</CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="text-center py-6 text-red-500">
          Failed to load ratings.
        </CardContent>
      </Card>
    )
  }

  if (data.ratings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-6 text-muted-foreground">
          No ratings available yet.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Ratings</CardTitle>
        <CardDescription>View ratings given by users</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Average Rating Summary Card */}
        <Card className="mb-4">
          <CardContent className="flex items-center gap-2 p-4 text-yellow-500">
            <StarIcon className="w-5 h-5" />
            <span className="text-lg font-semibold">
              Average Rating: {data.averageRating.toFixed(1)}
            </span>
          </CardContent>
        </Card>

        {/* Rating Cards */}
        <div className="space-y-4 mb-4">
          {data.ratings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination pagination={data.pagination} onPageChange={onPageChange} />
      </CardContent>
    </Card>
  )
}
