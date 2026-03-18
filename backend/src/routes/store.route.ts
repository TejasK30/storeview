import { Router } from "express"
import StoreController from "../controllers/store.controller"
import { authenticate, authorizeRole } from "../middlewares/auth"

const router = Router()

const storeController = new StoreController();

// store overview for owner
router.get("/overview", authenticate, authorizeRole("store_owner"),storeController.getStoreOverview)

// get all stores with pagination, search, and sorting
router.get("/", authenticate, storeController.getStores)

// add store
router.post("/", authenticate, authorizeRole("system_admin"), storeController.addStore)

export default router