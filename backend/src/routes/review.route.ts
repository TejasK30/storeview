import { Router } from "express"
import { authenticate, authorizeRole } from "../middlewares/auth"
import ReviewController from "../controllers/review.controller";

const router = Router()

const reviewController = new ReviewController();

// get ratings for a specific store
router.get("/store/:storeId", authenticate, reviewController.getRatingsByStoreId)

// get reviews by user ID
router.get("/user/:userId", authenticate, reviewController.getRatingsByUserId)

// submit a new rating
router.post("/", authenticate, reviewController.createRating)

// update an existing rating
router.put("/", authenticate, reviewController.updateRating)

export default router
