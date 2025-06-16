import { useAuthContext } from "@/contexts/auth-context"
import { updateRating } from "@/lib/services/storeService"
import { Review } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Star } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "./button"
import { DialogHeader } from "./dialog"

interface EditRatingModalProps {
  review: Review
  isOpen: boolean
  onClose: () => void
}

export const EditRatingModal: React.FC<EditRatingModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const { user } = useAuthContext()
  const [rating, setRating] = useState(review.rating)
  const [comment, setComment] = useState(review.comment || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const queryClient = useQueryClient()

  useEffect(() => {
    setRating(review.rating)
    setComment(review.comment || "")
  }, [review])

  const updateRatingMutation = useMutation({
    mutationFn: ({
      reviewId,
      rating,
      comment,
    }: {
      reviewId: number
      rating: number
      comment?: string
    }) => updateRating(reviewId, rating, comment),
    onSuccess: () => {
      toast.success("Rating updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["myReviews"] })
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      onClose()
    },
    onError: (error: any) => {
      toast.error(`Failed to update rating: ${error.message}`)
    },
  })

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }
    if (!user?.id) {
      toast.error("Please log in to update rating")
      return
    }
    updateRatingMutation.mutate({
      reviewId: Number(review.id),
      rating,
      comment: comment.trim() || undefined,
    })
  }

  const hasChanges =
    rating !== review.rating || comment !== (review.comment || "")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Rating for {review.store?.name}</DialogTitle>
          <DialogDescription>
            Update your rating and review for this store
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600">
              {rating === 0
                ? "Click to rate"
                : `Your rating: ${rating} star${rating > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="flex space-x-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={updateRatingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={
                updateRatingMutation.isPending || rating === 0 || !hasChanges
              }
            >
              {updateRatingMutation.isPending ? "Updating..." : "Update Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
