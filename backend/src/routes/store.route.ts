import { Router } from "express"
import {
  getStoreOverview,
  getStoreRatings,
  getStores,
  getUserReviewsController,
  submitRatingController,
  updateRating,
} from "../controllers/store.controller"
import { authenticate } from "../middlewares/auth"

const router = Router()

// store overview for owner
router.get("/overview", authenticate, getStoreOverview)

// get ratings for a specific store
router.get("/:storeId/ratings", authenticate, getStoreRatings)

// get all stores with pagination, search, and sorting
router.get("/getstores", authenticate, getStores)

// get reviews by user ID
router.get("/reviews/user/:userId", authenticate, getUserReviewsController)

// submit a new rating
router.post("/reviews/submit", authenticate, submitRatingController)

// update an existing rating
router.put("/reviews/edit", authenticate, updateRating)

export default router
