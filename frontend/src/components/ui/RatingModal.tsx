import { useAuthContext } from "@/contexts/auth-context"
import { submitRating } from "@/lib/services/storeService"
import { Store } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./button"
import { DialogHeader } from "./dialog"

const RatingModal = ({
  store,
  isOpen,
  onClose,
}: {
  store: Store
  isOpen: boolean
  onClose: () => void
}) => {
  const { user } = useAuthContext()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const queryClient = useQueryClient()

  const submitRatingMutation = useMutation({
    mutationFn: ({ storeId, rating }: { storeId: number; rating: number }) =>
      submitRating(storeId, rating),
    onSuccess: () => {
      toast.success("Rating submitted successfully!")
      queryClient.invalidateQueries({ queryKey: ["stores"] })
      queryClient.invalidateQueries({ queryKey: ["myReviews"] })
      onClose()
      setRating(0)
    },
    onError: (error: any) => {
      toast.error(`${error.message}`)
    },
  })

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }
    if (!user?.id) {
      toast.error("Please log in to submit a rating")
      return
    }
    submitRatingMutation.mutate({
      storeId: store.id,
      rating,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {store.name}</DialogTitle>
          <DialogDescription>
            Share your experience by rating this store
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 py-4">
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
                : `You rated: ${rating} star${rating > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="flex space-x-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitRatingMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={submitRatingMutation.isPending || rating === 0}
            >
              {submitRatingMutation.isPending
                ? "Submitting..."
                : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RatingModal
