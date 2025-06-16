"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StarRating } from "@/components/ui/StarRating"
import { Rating } from "@/lib/types"
import { Calendar, User } from "lucide-react"

interface StoreOverviewProps {
  summary:
    | {
        totalRatings: number
        averageRating: number
        recentRatings: Rating[]
      }
    | undefined
  isLoading: boolean
  error: unknown
  userName?: string
}

export const StoreOverview: React.FC<StoreOverviewProps> = ({
  summary,
  isLoading,
  error,
  userName,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Welcome{userName ? `, ${userName}` : ""}!
        </CardTitle>
        <CardDescription>
          Here's a quick overview of your store's performance.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground">Loading summary...</p>
        ) : error || !summary ? (
          <p className="text-red-500">Failed to load store summary.</p>
        ) : (
          <>
            {/* Overview Stats */}
            <Card>
              <CardContent>
                <p className="text-sm text-muted-foreground">Total Ratings</p>
                <p className="text-xl font-semibold">{summary.totalRatings}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <p className="text-xl font-semibold">
                  {summary.averageRating.toFixed(1)}
                </p>
              </CardContent>
            </Card>

            {/* Recent Ratings */}
            <div>
              <p className="font-semibold mb-2">Recent Ratings</p>
              {summary.recentRatings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent ratings available.
                </p>
              ) : (
                <div className="space-y-4">
                  {summary.recentRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="border rounded-xl p-3 flex items-start justify-between gap-4 bg-white shadow-sm"
                    >
                      <div className="flex-1 space-y-1 text-sm">
                        <div className="flex items-center gap-1 font-medium">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {rating.userName}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            rating.createdAt ?? ""
                          ).toLocaleDateString()}
                        </div>
                      </div>
                      <StarRating rating={rating.rating} size={16} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
