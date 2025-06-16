import React, { useState } from "react"
import { Review } from "@/lib/types"
import { StarRating } from "./StarRating"
import { Button } from "./button"
import { EditRatingModal } from "./EditRatingModal"
import { Edit } from "lucide-react"

export interface MyReviewsProps {
  reviews: Review[]
  isLoading: boolean
}

export const MyReviews: React.FC<MyReviewsProps> = ({ reviews, isLoading }) => {
  const [selectedReviewForEdit, setSelectedReviewForEdit] =
    useState<Review | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditReview = (review: Review) => {
    setSelectedReviewForEdit(review)
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedReviewForEdit(null)
  }

  if (isLoading) {
    return <p className="text-center py-6">Loading your reviews…</p>
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        No reviews found.
      </p>
    )
  }

  return (
    <>
      <div className="space-y-4 mt-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{review?.store?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Rating: {review.rating.toFixed(1)} / 5
                </p>
                <StarRating rating={review.rating} size={16} />
                {review.comment && <p className="mt-2">{review.comment}</p>}
                <p className="text-xs text-muted-foreground mt-2">
                  {review.updatedAt && review.updatedAt !== review.createdAt
                    ? `Updated: ${new Date(
                        review.updatedAt
                      ).toLocaleDateString()}`
                    : `Created: ${new Date(
                        review.createdAt
                      ).toLocaleDateString()}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditReview(review)}
                className="ml-4 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Rating Modal */}
      {selectedReviewForEdit && (
        <EditRatingModal
          review={selectedReviewForEdit}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}
    </>
  )
}
