import express from "express"
import {
  adminDashboardStats,
} from "../controllers/admin.controller"
import { authenticate, authorizeRole } from "../middlewares/auth"

const router = express.Router()

// get quick stats for the admin dashboard
router.get(
  "/stats",
  authenticate,
  authorizeRole("system_admin"),
  adminDashboardStats,
)

export default router
