import express from "express"
import UserController from "../controllers/user.controller"
import { authenticate, authorizeRole } from "../middlewares/auth"

const router = express.Router()

const userController = new UserController()

// get users
router.get("/", authenticate, authorizeRole("system_admin"), userController.getUsers)

// add user
router.post("/", authenticate, authorizeRole("system_admin"), userController.addUser)

export default router
