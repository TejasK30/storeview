"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("../controllers/store.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// store overview for owner
router.get("/overview", auth_1.authenticate, store_controller_1.getStoreOverview);
// get ratings for a specific store
router.get("/:storeId/ratings", auth_1.authenticate, store_controller_1.getStoreRatings);
// get all stores with pagination, search, and sorting
router.get("/getstores", auth_1.authenticate, store_controller_1.getStores);
// get reviews by user ID
router.get("/reviews/user/:userId", auth_1.authenticate, store_controller_1.getUserReviewsController);
// submit a new rating
router.post("/reviews/submit", auth_1.authenticate, store_controller_1.submitRatingController);
// update an existing rating
router.put("/reviews/edit", auth_1.authenticate, store_controller_1.updateRating);
exports.default = router;
