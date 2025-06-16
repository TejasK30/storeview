import express from "express"
import {
  adminDashboardStats,
  getUsers,
  getStores,
  addStore,
  addUser,
} from "../controllers/admin.controller"
import { authenticate } from "../middlewares/auth"

const router = express.Router()

// get quick stats for the admin dashboard
router.get("/stats", authenticate, adminDashboardStats)

// get users
router.get("/users", authenticate, getUsers)

// get stores
router.get("/stores", authenticate, getStores)

// add user
router.post("/users", authenticate, addUser)

// add store
router.post("/stores", authenticate, addStore)

export default router
