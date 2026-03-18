import { authenticate } from "../middlewares/auth"
import AuthController from "../controllers/auth.controller"
import { Router } from "express"

const router = Router()
const authController = new AuthController()

// register user
router.post("/register", authController.registerUser)

// login user
router.post("/login", authController.loginUser)

// get user profile
router.get("/profile", authenticate, authController.getProfile)

// logout user
router.get("/logout", authenticate, authController.logout)

// update user profile
router.put("/profile", authenticate, authController.updateUser)

export default router
