import { authenticate } from "../middlewares/auth"
import {
  getProfile,
  loginUser,
  registerUser,
  updateUser,
  logout,
} from "../controllers/auth.controller"
import { Router } from "express"

const router = Router()

// register user
router.post("/register", registerUser)

// login user
router.post("/login", loginUser)

// get user profile
router.get("/profile", authenticate, getProfile)

// logout user
router.get("/logout", logout)

// update user profile
router.put("/updateprofile", authenticate, updateUser)

export default router
